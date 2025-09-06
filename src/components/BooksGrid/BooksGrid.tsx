import type { BookSummary } from '../../types/book'
import BookCard from '../BookCard/BookCard'
import s from './BooksGrid.module.css'

type Props = { books: BookSummary[]; authors?: Record<string,string> }

export default function BooksGrid({ books, authors = {} }: Props) {
  return (
    <div className={s.grid}>
      {books.map(b => (
        <BookCard key={b.isbn13} book={b} author={authors[b.isbn13]} />
      ))}
    </div>
  )
}
