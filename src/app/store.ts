import { configureStore } from '@reduxjs/toolkit'
import newReleases from '../redux/slices/newReleasesSlice'
import book from '../redux/slices/bookSlice'
import search from '../redux/slices/searchSlice'
import cart from '../redux/slices/cartSlice'

export const store = configureStore({
  reducer: { newReleases, book, search, cart },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
