import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { fetchSuggestions, setOpen, setQuery, clear } from '../../redux/slices/searchSuggestSlice'
import type { BookSummary } from '../../types/book'
import { parsePrice, formatUSD } from '../../utils/price'
import s from './SearchBar.module.css'

type Props = {
  initialQuery?: string
}

export default function SearchBar({ initialQuery = '' }: Props) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { query, items, status, isOpen } = useAppSelector(st => st.searchSuggest)

  const [local, setLocal] = useState(initialQuery)
  const tRef = useRef<number | null>(null)
  const rootRef = useRef<HTMLFormElement | null>(null)

  // синхронизация начального значения
  useEffect(() => { setLocal(initialQuery) }, [initialQuery])

  // дебаунс и запрос
  useEffect(() => {
    dispatch(setQuery(local))
    if (tRef.current) window.clearTimeout(tRef.current)
    if (local.trim().length < 2) {
      dispatch(clear())
      dispatch(setOpen(false))
      return
    }
    tRef.current = window.setTimeout(() => {
      dispatch(fetchSuggestions(local))
      dispatch(setOpen(true))
    }, 300)
    return () => { if (tRef.current) window.clearTimeout(tRef.current) }
  }, [local, dispatch])

  // закрытие по клику вне / Escape
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) dispatch(setOpen(false))
    }
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') dispatch(setOpen(false)) }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onEsc)
    }
  }, [dispatch])

  const submit = () => {
    const q = local.trim()
    if (!q) return
    dispatch(setOpen(false))
    navigate(`/search?q=${encodeURIComponent(q)}`)
  }

  const goToBook = (b: BookSummary) => {
    dispatch(setOpen(false))
    navigate(`/booke/${b.isbn13}`)
  }

  return (
    <form
      ref={rootRef}
      className={s.search}
      onSubmit={(e) => { e.preventDefault(); submit() }}
      role="search"
    >
      <span className={s.icon} aria-hidden>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="7" stroke="#090937" strokeWidth="2"/>
          <path d="M20 20l-3.2-3.2" stroke="#090937" strokeWidth="2" />
        </svg>
      </span>
      <input
        placeholder="Search"
        value={local}
        onChange={(e)=>setLocal(e.target.value)}
        onFocus={()=>{ if (items.length) dispatch(setOpen(true)) }}
        aria-autocomplete="list"
        aria-expanded={isOpen}
      />

      {/* dropdown */}
      {isOpen && (
        <div className={s.dropdown}>
          {status === 'loading' && (
            <div className={s.loading}>
              <span className={s.dot}/><span className={s.dot}/><span className={s.dot}/>
            </div>
          )}

          {status !== 'loading' && items.length === 0 && (
            <div className={s.empty}>No matches</div>
          )}

          {items.map(b => (
            <button
              type="button"
              key={b.isbn13}
              className={s.item}
              onClick={()=>goToBook(b)}
            >
              <img src={b.image} alt="" loading="lazy" />
              <div className={s.meta}>
                <div className={s.title}>{b.title}</div>
                <div className={s.price}>{formatUSD(parsePrice(b.price))}</div>
              </div>
            </button>
          ))}

          <div className={s.footer}>
            <button type="submit" className={s.all}>
              Search “{query}”
            </button>
          </div>
        </div>
      )}
    </form>
  )
}
