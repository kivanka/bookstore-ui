export interface BookSummary {
  title: string
  subtitle: string
  isbn13: string
  price: string   
  image: string
  url: string
}
export type BookDetail = {
  title: string
  subtitle: string
  authors: string
  publisher: string
  language?: string         
  isbn10?: string           
  isbn13: string
  pages?: string
  year?: string
  rating?: string
  desc: string
  price: string
  image: string
  url: string
  pdf?: Record<string, string>
}

export interface SearchResponse {
  error: string
  total: string
  page: string
  books: BookSummary[]
}
