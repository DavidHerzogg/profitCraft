import Navbar from '../components/navbar/Navbar'
import Footer from '../components/footer/Footer'
import { Outlet } from 'react-router-dom'

function MainLayout() {
  return (
    <>
      <Navbar />

      <div id="main-content">
        <Outlet />
      </div>

      <Footer />
    </>
  )
}

export default MainLayout