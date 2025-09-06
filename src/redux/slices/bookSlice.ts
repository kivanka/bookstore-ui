import { createSlice } from '@reduxjs/toolkit'
import { fetchBookByIsbn } from '../thunks/booksThunks'
import { BookDetail } from '../../types/book'

type Status = 'idle'|'loading'|'succeeded'|'failed'
type State = { item: BookDetail | null; status: Status; error?: string }
const initialState: State = { item: null, status: 'idle' }

const slice = createSlice({
  name: 'book',
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchBookByIsbn.pending, (s)=>{ s.status='loading'; s.error=undefined })
    b.addCase(fetchBookByIsbn.fulfilled, (s,a)=>{ s.status='succeeded'; s.item=a.payload })
    b.addCase(fetchBookByIsbn.rejected, (s,a)=>{ s.status='failed'; s.error=String(a.error.message) })
  }
})
export default slice.reducer
