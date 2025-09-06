import { Link } from 'react-router-dom'
import type { BookSummary } from '../../types/book'
import { parsePrice, formatUSD } from '../../utils/price'
import s from './BookCard.module.css'

type Props = { book: BookSummary; author?: string }

export default function BookCard({ book, author }: Props) {
  const authorText = (author && author.trim()) || book.subtitle || '';
{authorText && <div className={s.author}>{authorText}</div>}

  return (
    <div className={s.card}>
      <Link to={`/booke/${book.isbn13}`} className={s.imgWrap}>
        <img src={book.image} alt={book.title} loading="lazy" />
      </Link>

      <Link to={`/booke/${book.isbn13}`} className={s.title}>
        {book.title}
      </Link>

      <div className={s.author}>{authorText}</div>

      <div className={s.row}>
        <div className={s.price}>{formatUSD(parsePrice(book.price))}</div>
      </div>
    </div>
  )
}
