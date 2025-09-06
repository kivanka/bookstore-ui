import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { fetchSearch } from '../../redux/thunks/booksThunks'
import BooksGrid from '../../components/BooksGrid/BooksGrid'
import Loader from '../../components/Loader/Loader'
import ErrorState from '../../components/ErrorState/ErrorState'
import { api } from '../../api/axiosInstance'
import s from './Search.module.css'

export default function Search() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [sp] = useSearchParams()

  const q = (sp.get('q') ?? '').trim()
  const page = Number(sp.get('page') ?? 1)

  const { items, total, status, error } = useAppSelector(st => st.search)

  // мини-кеш авторов для карточек
  const [authorsMap, setAuthorsMap] = useState<Record<string, string>>({})

  // грузим результаты при изменении q/page
  useEffect(() => {
    if (!q) return
    dispatch(fetchSearch({ query: q, page }))
  }, [dispatch, q, page])

  // подтягиваем авторов для текущих карточек
  useEffect(() => {
    if (!items.length) return
    let cancelled = false
    const toLoad = items.filter(b => !authorsMap[b.isbn13])

    if (!toLoad.length) return
    ;(async () => {
      const res = await Promise.allSettled(
        toLoad.map(b =>
          api.get(`/books/${b.isbn13}`)
            .then(r => ({ id: b.isbn13, a: r.data?.authors as string }))
        )
      )
      if (cancelled) return
      const patch: Record<string, string> = {}
      res.forEach(r => { if (r.status === 'fulfilled' && r.value.a) patch[r.value.id] = r.value.a })
      if (Object.keys(patch).length) setAuthorsMap(prev => ({ ...prev, ...patch }))
    })()
    return () => { cancelled = true }
  }, [items, authorsMap])

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / 10)), [total])

  const goPage = (p: number) => {
    const next = Math.min(Math.max(p, 1), totalPages)
    navigate(`/search?q=${encodeURIComponent(q)}&page=${next}`)
  }

  return (
    <section className={s.page}>
      <div className="container">
        <div className={s.head}>
          <h2>Search</h2>
          {q && <span className={s.query} title={q}>“{q}”</span>}
          {status === 'succeeded' && <span className={s.count}>{total} books</span>}
        </div>

        {status === 'loading' && <Loader />}
        {status === 'failed' && <ErrorState message={error || 'Error'} />}

        {status === 'succeeded' && (
          <>
            {items.length === 0 ? (
              <div className={s.empty}>No results</div>
            ) : (
              <BooksGrid books={items} authors={authorsMap} />
            )}

            {totalPages > 1 && (
              <div className={s.paging}>
                <button className={s.pageBtn} disabled={page <= 1} onClick={()=>goPage(page - 1)}>Prev</button>
                <span className={s.pagerInfo}>
                  Page {page} / {totalPages}
                </span>
                <button className={s.pageBtn} disabled={page >= totalPages} onClick={()=>goPage(page + 1)}>Next</button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
