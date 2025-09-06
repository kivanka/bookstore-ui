export interface BookSummary {
  title: string
  subtitle: string
  isbn13: string
  price: string   
  image: string
  url: string
}
export interface BookDetail extends BookSummary {
  authors: string
  publisher: string
  pages: string
  year: string
  rating: string
  desc: string
  pdf?: Record<string, string>
}
export interface SearchResponse {
  error: string
  total: string
  page: string
  books: BookSummary[]
}
