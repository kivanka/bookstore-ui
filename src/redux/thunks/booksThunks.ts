import { createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../api/axiosInstance'
import { BookDetail, BookSummary, SearchResponse } from '../../types/book'


export const fetchNewReleases = createAsyncThunk<BookSummary[]>(
  'books/new',
  async () => (await api.get<{ books: BookSummary[] }>('/new')).data.books
)

export const fetchBookByIsbn = createAsyncThunk<BookDetail, string>(
  'books/byIsbn',
  async (isbn13) => (await api.get<BookDetail>(`/books/${isbn13}`)).data
)


export const searchBooks = createAsyncThunk<SearchResponse, { q: string; page?: number }>(
  'books/search',
  async ({ q, page = 1 }) =>
    (await api.get<SearchResponse>(`/search/${encodeURIComponent(q)}/${page}`)).data
)

export const fetchSearch = createAsyncThunk<
  { books: BookSummary[]; total: number; page: number; query: string },
  { query: string; page: number },
  { rejectValue: string }
>('search/fetch', async ({ query, page }, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/search/${encodeURIComponent(query)}/${page}`)
    return {
      books: Array.isArray(data?.books) ? data.books : [],
      total: Number(data?.total ?? 0),
      page: Number(data?.page ?? page),
      query,
    }
  } catch (e: any) {
    return rejectWithValue(e?.message ?? 'Search request failed')
  }
})
