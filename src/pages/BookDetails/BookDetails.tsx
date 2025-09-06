import { useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { fetchBookByIsbn } from '../../redux/thunks/booksThunks'
import { clearBookDetails } from '../../redux/slices/bookDetailsSlice'
import { addToCart } from '../../redux/slices/cartSlice'
import type { BookSummary } from '../../types/book'
import Loader from '../../components/Loader/Loader'
import ErrorState from '../../components/ErrorState/ErrorState'
import s from './BookDetails.module.css'

import backArrow from '../../assets/Arrow.png'
import heartIcon from '../../assets/heart.png'

export default function BookDetails() {
  const { isbn13 = '' } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { item, status, error } = useAppSelector(st => st.bookDetails)

  useEffect(() => {
    if (isbn13) dispatch(fetchBookByIsbn(isbn13))
    return () => { dispatch(clearBookDetails()) }
  }, [dispatch, isbn13])

  const summary: BookSummary | null = useMemo(() => {
    if (!item) return null
    return {
      title: item.title,
      subtitle: item.subtitle,
      isbn13: item.isbn13,
      price: item.price,
      image: item.image,
      url: item.url,
    }
  }, [item])

  const priceText = item
    ? `${String(item.price).replace(/^\$/, '').replace('.', ',')} $`
    : ''

  return (
    <section className={s.details}>
      <div className="container">

        <button className={s.back} onClick={() => navigate(-1)} aria-label="Back">
          <img src={backArrow} alt="" />
          <span>Book Details</span>
        </button>

        {status === 'loading' && <Loader />}

        {status === 'failed' && (
          <div className={s.errorWrap}>
            <ErrorState message={error || 'Error'} />
            <button className={s.try} onClick={() => isbn13 && dispatch(fetchBookByIsbn(isbn13))}>
              Try again
            </button>
          </div>
        )}

        {status === 'succeeded' && item && (
          <div className={s.cols}>
            <div className={s.coverCard}>
              <img src={item.image} alt={item.title} />
            </div>

            <div className={s.info}>
              <button className={s.fav} aria-label="Add to favorites">
                <img src={heartIcon} alt="" />
              </button>

              <h2 className={s.title}>{item.title}</h2>
              {item.authors && <div className={s.authors}>{item.authors}</div>}

              <div className={s.summary}>
                <div className={s.h}>Summary</div>
                <p className={s.desc}>{item.desc}</p>
              </div>

              <div className={s.cta}>
                <button
                  className={s.buyBtn}
                  onClick={() => summary && dispatch(addToCart(summary))}
                >
                  <span className={s.btnPrice}>{priceText}</span>
                  <span className={s.btnText}>Buy Now</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
