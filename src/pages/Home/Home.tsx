import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { fetchNewReleases } from '../../redux/thunks/booksThunks'
import BooksGrid from '../../components/BooksGrid/BooksGrid'
import Loader from '../../components/Loader/Loader'
import ErrorState from '../../components/ErrorState/ErrorState'
import s from './Home.module.css'
import { api } from '../../api/axiosInstance'   // ⬅ добавили

export default function Home() {
  const dispatch = useAppDispatch()
  const { items, status, error } = useAppSelector(st => st.newReleases)
  const [visible, setVisible] = useState(8)

  // сюда будем складывать авторов: { [isbn13]: "Имя Автора, ..." }
  const [authorsMap, setAuthorsMap] = useState<Record<string, string>>({})

  useEffect(() => { dispatch(fetchNewReleases()) }, [dispatch])

  // как только пришли книги/увеличили "показать ещё", дотягиваем авторов
  useEffect(() => {
  if (status !== 'succeeded' || items.length === 0) return

  // только видимые карточки и те, по которым авторов ещё нет
  const ids = items.slice(0, visible)
    .map(b => b.isbn13)
    .filter(id => !authorsMap[id])

  if (ids.length === 0) return

  let cancelled = false
  ;(async () => {
    const results = await Promise.allSettled(ids.map(id => api.get(`/books/${id}`)))
    if (cancelled) return

    const patch: Record<string, string> = {}
    for (const r of results) {
      if (r.status === 'fulfilled') {
        const d = r.value.data as { isbn13: string; authors?: string }
        if (d.isbn13 && d.authors?.trim()) patch[d.isbn13] = d.authors.trim()
      }
    }
    if (Object.keys(patch).length) {
      setAuthorsMap(prev => ({ ...prev, ...patch }))
    }
  })()

  return () => { cancelled = true }
}, [status, items, visible])   // ← без authorsMap здесь

  return (
    <section className={s.booksGrid}>
      <div className="container">
        <div className={s.head}><h2>Best Seller</h2></div>

        {status === 'loading' && <Loader />}
        {status === 'failed' && <ErrorState message={error || 'Error'} />}

        {status === 'succeeded' && (
          <>
            <BooksGrid
              books={items.slice(0, visible)}
              authors={authorsMap}            // ⬅ пробрасываем авторов
            />
            {visible < items.length && (
              <div className={s.loadMore}>
                <button onClick={() => setVisible(v => Math.min(v + 8, items.length))}>
                  Load more
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
