
import './App.css'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { Navigate, Route, Routes, BrowserRouter } from 'react-router-dom'
import Login from '@/components/Login/Login';
import Register from '@/components/Register/Register'
import ProtectedRoute from '@/components/Route/ProtectedRoute'
import Home from '@/components/Home/Home'

const RootRedirect: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}>
        Loading...
      </div>
    );
  }

  return <Navigate to={isAuthenticated ? '/home' : 'login'} replace />;
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className='App'>
          <Routes>
            <Route path='/' element={<RootRedirect />}></Route>
            <Route path='/login' element={<Login />}></Route>
            <Route path='/register' element={<Register />}></Route>
            <Route
              path='/home'
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route path='*' element={<Navigate to='/' replace />} />
          </Routes>
        </div>
        
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
