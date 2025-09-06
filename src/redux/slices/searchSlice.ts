import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { searchBooks } from '../thunks/booksThunks'
import { BookSummary, SearchResponse } from '../../types/book'

type Status = 'idle'|'loading'|'succeeded'|'failed'

type State = {
  query: string
  page: number
  total: number
  items: BookSummary[]
  status: Status
  error?: string
}
const initialState: State = { query: '', page: 1, total: 0, items: [], status: 'idle' }

const slice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload
      state.page = 1
    },
  },
  extraReducers: (b) => {
    b.addCase(searchBooks.pending, (s) => { s.status='loading'; s.error=undefined })
    b.addCase(searchBooks.fulfilled, (s, a: PayloadAction<SearchResponse>) => {
      s.status='succeeded'
      s.items = a.payload.books
      s.page = Number(a.payload.page)
      s.total = Number(a.payload.total)
    })
    b.addCase(searchBooks.rejected, (s, a) => { s.status='failed'; s.error=String(a.error.message) })
  }
})

export const { setQuery } = slice.actions
export default slice.reducer
