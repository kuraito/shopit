import axios from 'axios'

// BaseURL del backend 
const BASE_URL = 'http://localhost:4000'

// URL per il login
const LOGIN_URL = '/auth/login'

// URL per la registrazione
const REGISTER_URL = '/auth/register'

// URL per l'acquisto
const PURCHASE_URL = '/dashboard/purchase'

// Crea istanza axios con baseURL
const api = axios.create({
  baseURL: BASE_URL,
})

// Aggiunge il token a ogni richiesta
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Tipo di risposta dal backend
export interface AuthResponse {
  token: string
  user: {
    id: string
    username: string
  }
}

// Login: invia username e password
export const login = async (username: string, password: string): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(LOGIN_URL, { username, password })
  return response.data
}

// Register: crea nuovo utente
export const register = async (username: string, password: string): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(REGISTER_URL, { username, password })
  return response.data
}

// Purchase: acquista un prodotto
export const purchase = async (productId: number, price: number) => {
  const response = await api.post(PURCHASE_URL, {
    product_id: productId,
    price: price,
  })
  return response.data
}

// Logout: rimuove il token
export const logout = () => {
  localStorage.removeItem('token')
}

export default api