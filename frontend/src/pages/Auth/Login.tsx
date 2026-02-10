import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthForm from '../../components/AuthForm'
import { login } from '../../api/endPointApi'

// Pagina di login
export default function Login() {
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  // Gestisci il login
  const handleLogin = async (username: string, password: string) => {
    setError('')
    setIsLoading(true)
    try {
      const response = await login(username, password)  // Chiamata all'API per il login
      localStorage.setItem('token', response.token)     // Login ritorna anche il token, lo salvo nel localStorage
      navigate('/dashboard')                            // Reindirizzo alla dashboard dopo il login
    } catch (err: any) {
      setError(err.response?.data?.message || 'Errore nel login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthForm
      title="Login"
      funzFromPagina={handleLogin}
      isLoading={isLoading}
      error={error}
      linkText="Non hai un account? Registrati"
      linkHref="/register"
    />
  )
}