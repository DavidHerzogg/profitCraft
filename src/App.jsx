import './reset.scss';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './layout/MainLayout'
import Dashboard from './pages/Dashboard/Dashboard'
import Journal from './pages/Journal/Journal'
import Analyse from './pages/Analyse/Analyse'
// import {News} from './pages/News/News'
import Profil from './pages/Profil/Profil'
import Shop from './pages/Shop/Shop';
import Payment from './pages/Payment/Payment'
import ProductDetail from './pages/ProductDetail/ProductDetail'
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";
import WelcomePage from "./pages/Welcome/WelcomePage";
import { useUser } from '@clerk/clerk-react';
import { Navigate } from "react-router-dom";

function AuthGate({ children }) {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) return <div className="lds-ripple"><div></div><div></div></div>;
  if (!isSignedIn) return <Navigate to="/welcome" />;

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Öffentliche Routen */}
        <Route path="/welcome" element={<WelcomePage />} />

        {/* Geschützte Routen */}
        <Route
          path="/"
          element={
            <AuthGate>
              <MainLayout />
            </AuthGate>
          }
        >
          <Route index element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="journal" element={<Journal />} />
          <Route path="analyse" element={<Analyse />} />
          <Route path="shop" element={<Shop />} />
          <Route path="profil" element={<Profil />} />
          <Route path="payment" element={<Payment />} />
          <Route path="product/:id" element={<ProductDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}


export default App
