import searchSuggest from '../redux/slices/searchSuggestSlice'
import { configureStore } from '@reduxjs/toolkit'
import newReleases from '../redux/slices/newReleasesSlice'
import book from '../redux/slices/bookSlice'
import search from '../redux/slices/searchSlice'
import cart from '../redux/slices/cartSlice'
import bookDetailsReducer from '../redux/slices/bookDetailsSlice' 

export const store = configureStore({
  reducer: {
    newReleases,
    book,
    search,
    cart,
    bookDetails: bookDetailsReducer,
    searchSuggest,
  },
  middleware: (getDefault) => getDefault({ thunk: true }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
