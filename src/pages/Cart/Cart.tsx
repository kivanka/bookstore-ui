import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import BooksGrid from '../../components/BooksGrid/BooksGrid'
import { clearCart } from '../../redux/slices/cartSlice'
import s from './Cart.module.css'

export default function Cart() {
  const dispatch = useAppDispatch()
  const items = useAppSelector(st => st.cart.items)

  const onClear = () => {
    if (!items.length) return
    // подтверждение по желанию — убери, если не нужно
    if (window.confirm('Clear all items from cart?')) {
      dispatch(clearCart())
    }
  }

  return (
    <section className={s.cart}>
      <div className="container">
        <div className={s.head}>
          <h2>Cart</h2>
          <button className={s.clear} onClick={onClear} disabled={!items.length}>
            Clear all
          </button>
        </div>

        {!items.length ? (
          <div className={s.empty}>
            <p>Your cart is empty.</p>
            <Link to="/" className={s.backLink}>Go shopping</Link>
          </div>
        ) : (
          <BooksGrid books={items} />
        )}
      </div>
    </section>
  )
}
