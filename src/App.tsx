import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header/Header'
import Home from './pages/Home/Home'
import BookDetails from './pages/BookDetails/BookDetails'
import Search from './pages/Search/Search'
import Cart from './pages/Cart/Cart'

export default function App(){
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/booke/:isbn13" element={<BookDetails/>}/>
          <Route path="/search" element={<Search/>}/>
          <Route path="/cart" element={<Cart/>}/>
        </Routes>
      </main>
    </BrowserRouter>
  )
}
