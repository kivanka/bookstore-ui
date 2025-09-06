import { createSlice } from '@reduxjs/toolkit'
import type { BookSummary } from '../../types/book'
import { fetchSearch } from '../thunks/booksThunks'

type Status = 'idle' | 'loading' | 'succeeded' | 'failed'

interface SearchState {
  query: string
  page: number
  total: number
  items: BookSummary[]
  status: Status
  error: string | null
}

const initialState: SearchState = {
  query: '',
  page: 1,
  total: 0,
  items: [],
  status: 'idle',
  error: null,
}

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {},
  extraReducers: (b) =>
    b
      .addCase(fetchSearch.pending, (s, a) => {
        s.status = 'loading'
        s.error = null
        s.query = a.meta.arg.query
        s.page = a.meta.arg.page
      })
      .addCase(fetchSearch.fulfilled, (s, { payload }) => {
        s.status = 'succeeded'
        s.items = payload.books
        s.total = payload.total
        s.page = payload.page
        s.query = payload.query
      })
      .addCase(fetchSearch.rejected, (s, a) => {
        s.status = 'failed'
        s.error = (a.payload as string) || 'Error'
        s.items = []
        s.total = 0
      }),
})

export default searchSlice.reducer
