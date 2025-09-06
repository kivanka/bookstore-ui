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
    if (!items.length) return
    const subset = items.slice(0, visible)
    const toLoad = subset.filter(b => !authorsMap[b.isbn13])
    if (!toLoad.length) return

    let cancelled = false
    ;(async () => {
      const res = await Promise.allSettled(
        toLoad.map(b =>
          api.get(`/books/${b.isbn13}`)
             .then(r => ({ id: b.isbn13, a: r.data.authors as string }))
        )
      )
      if (cancelled) return
      const patch: Record<string, string> = {}
      res.forEach(r => { if (r.status === 'fulfilled') patch[r.value.id] = r.value.a })
      if (Object.keys(patch).length) setAuthorsMap(prev => ({ ...prev, ...patch }))
    })()

    return () => { cancelled = true }
  }, [items, visible, authorsMap])

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
