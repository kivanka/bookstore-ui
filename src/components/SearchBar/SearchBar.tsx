import { useEffect, useState } from 'react'
import s from './SearchBar.module.css'
import searchIcon from '../../assets/Search.png'

type Props = { initialQuery?: string; onSubmit: (q: string) => void }


export default function SearchBar({ initialQuery = '', onSubmit }: Props) {
  const [q, setQ] = useState(initialQuery)
  useEffect(()=>{ setQ(initialQuery) }, [initialQuery])

  return (
    <form className={s.search} onSubmit={(e)=>{ e.preventDefault(); onSubmit(q.trim()) }}>
      <span className={s.icon} aria-hidden="true">
        <img src={searchIcon} alt="" className={s.iconImg} />
      </span>
      <input
        placeholder="Search"
        value={q}
        onChange={(e)=>setQ(e.target.value)}
      />
    </form>
  )
}
