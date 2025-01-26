import { Component } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import AddProducts from './components/AddProducts'
import Signup from './components/Signup'
import Login from './components/Login'
import NotFound from './components/NotFound'
import Cart from './components/Cart'

export class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route exact path='/' element={<Home />} />
          <Route path='addproducts' element={<AddProducts />} />
          <Route path='signup' element={<Signup />} />
          <Route path='login' element={<Login />} />
          <Route path='/cart' element={<Cart />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    )
  }
}

export default App

