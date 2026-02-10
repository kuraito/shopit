import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthForm from '../../components/AuthForm'
import { register } from '../../api/endPointApi'

export default function Register() {
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async (username: string, password: string) => {
    setError('')
    setIsLoading(true)

    try {
      const response = await register(username, password)
      
      // Salva il token
      localStorage.setItem('token', response.token)
      
      navigate('/dashboard')
    } catch (err: any) {
      console.error('Errore registrazione:', err)
      setError(err.response?.data?.error || 'Errore nella registrazione')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthForm
      title="Registrazione"
      funzFromPagina={handleRegister}
      isLoading={isLoading}
      error={error}
      linkText="Hai già un account? Accedi"
      linkHref="/login"
    />
  )
}