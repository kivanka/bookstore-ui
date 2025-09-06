import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'
import SearchBar from '../SearchBar/SearchBar'
import s from './Header.module.css'

import logo from '../../assets/logo-stroke.png'
import heart from '../../assets/heart.png'
import cart from '../../assets/cart.png'

export default function Header(){
  const navigate = useNavigate()
  const loc = useLocation()
  const count = useAppSelector(st => st?.cart?.items?.reduce((a,b)=>a+b.qty,0) ?? 0)
  const defaultQuery = new URLSearchParams(loc.search).get('q') || ''

  return (
    <header className={s.header}>
      <div className="container">
        <div className={s.inner}>
          <Link to="/" className={s.logo}>
            <img src={logo} alt="" className={s.logoImg}/>
          </Link>

          <SearchBar
            initialQuery={defaultQuery}
            onSubmit={(q)=>navigate(`/search?q=${encodeURIComponent(q)}&page=1`)}
          />

          <div className={s.icons}>
            <button className={s.iconBtn} aria-label="Favorites"><img src={heart} alt=""/></button>
            <Link to="/cart" className={s.iconBtn} aria-label="Cart">
              <img src={cart} alt=""/>
              {count>0 && <span className={s.badge}>{count}</span>}
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
