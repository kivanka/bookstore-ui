import { createSlice } from '@reduxjs/toolkit'
import { fetchNewReleases } from '../thunks/booksThunks'
import { BookSummary } from '../../types/book'

type Status = 'idle'|'loading'|'succeeded'|'failed'
type State = { items: BookSummary[]; status: Status; error?: string }

const initialState: State = { items: [], status: 'idle' }

const slice = createSlice({
  name: 'newReleases',
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchNewReleases.pending, (s) => { s.status = 'loading'; s.error = undefined })
    b.addCase(fetchNewReleases.fulfilled, (s, a) => { s.status = 'succeeded'; s.items = a.payload })
    b.addCase(fetchNewReleases.rejected, (s, a) => { s.status = 'failed'; s.error = String(a.error.message) })
  }
})
export default slice.reducer
