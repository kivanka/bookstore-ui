import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { BookSummary } from '../../types/book'
import { api } from '../../api/axiosInstance'

type Status = 'idle' | 'loading' | 'succeeded' | 'failed'

export const fetchSuggestions = createAsyncThunk<
  BookSummary[],
  string,
  { rejectValue: string }
>('searchSuggest/fetch', async (q, { rejectWithValue, signal }) => {
  try {
    if (!q || q.trim().length < 2) return []
    // отменяем предыдущие запросы
    const controller = new AbortController()
    signal.addEventListener('abort', () => controller.abort())
    const { data } = await api.get(`/search/${encodeURIComponent(q)}/1`, {
      signal: controller.signal,
      timeout: 10000,
    })
    // API возвращает { error,total, page, books: BookSummary[] }
    return Array.isArray(data?.books) ? data.books : []
  } catch (e: any) {
    return rejectWithValue(e?.message ?? 'Failed to load suggestions')
  }
})

interface SliceState {
  query: string
  items: BookSummary[]
  status: Status
  error: string | null
  isOpen: boolean
}

const initialState: SliceState = {
  query: '',
  items: [],
  status: 'idle',
  error: null,
  isOpen: false,
}

const searchSuggestSlice = createSlice({
  name: 'searchSuggest',
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload
    },
    setOpen(state, action: PayloadAction<boolean>) {
      state.isOpen = action.payload
    },
    clear(state) {
      state.items = []
      state.status = 'idle'
      state.error = null
    },
  },
  extraReducers: (b) =>
    b
      .addCase(fetchSuggestions.pending, (s) => {
        s.status = 'loading'
        s.error = null
      })
      .addCase(fetchSuggestions.fulfilled, (s, { payload }) => {
        s.status = 'succeeded'
        s.items = payload.slice(0, 8) // топ-8
      })
      .addCase(fetchSuggestions.rejected, (s, a) => {
        s.status = 'failed'
        s.error = a.payload || 'Error'
        s.items = []
      }),
})

export const { setQuery, setOpen, clear } = searchSuggestSlice.actions
export default searchSuggestSlice.reducer
