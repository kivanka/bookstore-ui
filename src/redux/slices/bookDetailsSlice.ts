// src/redux/slices/bookDetailsSlice.ts
import { createSlice } from '@reduxjs/toolkit'
import type { BookDetail } from '../../types/book'
import { fetchBookByIsbn } from '../thunks/booksThunks'

type Status = 'idle' | 'loading' | 'succeeded' | 'failed'

interface BookDetailsState {
  item: BookDetail | null
  status: Status
  error: string | null
}

const initialState: BookDetailsState = {
  item: null,
  status: 'idle',
  error: null,
}

const bookDetailsSlice = createSlice({
  name: 'bookDetails',
  initialState,
  reducers: {
    clearBookDetails(state) {
      state.item = null
      state.status = 'idle'
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookByIsbn.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchBookByIsbn.fulfilled, (state, { payload }) => {
        state.status = 'succeeded'
        state.item = payload
      })
      .addCase(fetchBookByIsbn.rejected, (state, { payload }) => {
        state.status = 'failed'
        state.error = (payload as string) || 'Error'
      })
  },
})

export const { clearBookDetails } = bookDetailsSlice.actions
export default bookDetailsSlice.reducer
