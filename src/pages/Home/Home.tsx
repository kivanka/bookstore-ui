// src/pages/Home/Home.tsx
import { useEffect, useMemo, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { fetchNewReleases } from '../../redux/thunks/booksThunks'
import BooksGrid from '../../components/BooksGrid/BooksGrid'
import Loader from '../../components/Loader/Loader'
import ErrorState from '../../components/ErrorState/ErrorState'
import s from './Home.module.css'
import { api } from '../../api/axiosInstance'

export default function Home() {
  const dispatch = useAppDispatch()
  const { items, status, error } = useAppSelector(st => st.newReleases)

  const [visible, setVisible] = useState(8)
  const [authorsMap, setAuthorsMap] = useState<Record<string, string>>({})

  // грузим список новинок
  useEffect(() => {
    if (status === 'idle') dispatch(fetchNewReleases())
  }, [dispatch, status])

  // дотягиваем авторов для видимых карточек
  useEffect(() => {
    if (status !== 'succeeded' || items.length === 0) return

    const ids = items
      .slice(0, visible)
      .map(b => b.isbn13)
      .filter(id => !authorsMap[id])

    if (ids.length === 0) return

    let cancelled = false
    ;(async () => {
      const results = await Promise.allSettled(
        ids.map(async (id) => {
          const res = await api.get(`/books/${id}`)
          // поддерживаем оба случая: с интерсептором и без
          const data: any = (res as any)?.data ?? res
          const authors = String(data?.authors ?? '').trim()
          return { id, authors }
        })
      )
      if (cancelled) return

      const patch: Record<string, string> = {}
      for (const r of results) {
        if (r.status === 'fulfilled' && r.value.authors) {
          patch[r.value.id] = r.value.authors
        }
      }
      if (Object.keys(patch).length > 0) {
        setAuthorsMap(prev => ({ ...prev, ...patch }))
      }
    })()

    return () => { cancelled = true }
  }, [status, items, visible]) // намеренно без authorsMap

  const visibleItems = useMemo(() => items.slice(0, visible), [items, visible])

  return (
    <section className={s.booksGrid}>
      <div className="container">
        <div className={s.head}><h2>Best Seller</h2></div>

        {status === 'loading' && <Loader />}

        {status === 'failed' && (
          <div>
            <ErrorState message={error || 'Network error'} />
            <div className={s.retry}>
              <button onClick={() => dispatch(fetchNewReleases())}>Try again</button>
            </div>
          </div>
        )}

        {status === 'succeeded' && (
          <>
            <BooksGrid books={visibleItems} authors={authorsMap} />
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
