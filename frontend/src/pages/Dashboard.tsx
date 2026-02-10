import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout, purchase } from '../api/endPointApi'
import api from '../api/endPointApi'
import ProductCard from '../components/ProductCard'

// Tipo di prodotto dal backend
interface Product {
  id: number
  name: string
  description: string
  amount: string[]
  images: string[]
  descr_dett: string[]
}

// Pagina dashboard 
export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  // Carica i prodotti dal backend
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await api.get<Product[]>('/dashboard/products') // Chiamata all'API per ottenere i prodotti
        setProducts(response.data) // Avrà tutti i dati formattati che poi passo alle card, perché nel backend li trasformo da stringa a array
      } catch (err) {
        console.error('Errore caricamento prodotti:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadProducts()
  }, []) // Questa funzione viene eseguita solo una volta quando il componente viene montato

  // Logout
  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Acquisto
  // Questa funzione viene chiamata solo quando l'utente clicca su Acquista in ProductCard riceve l'id del prodotto e il prezzo selezionato
  const handleBuy = async (productId: number, price: number) => {
    try {
      await purchase(productId, price) // Chiamata all'API per effettuare l'acquisto
      alert('Acquisto effettuato con successo!')
    } catch (err) {
      console.error('Errore acquisto:', err)
      alert('Errore durante l\'acquisto')
    }
  }

  // Se sta caricando
  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen"><p>Caricamento...</p></div>
  }

  return (
    <div className="min-h-screen bg-blue-500 p-8">
      
    {/* Header con titolo, cronologia e logout */}
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-white">Dashboard</h1>
      <div className="flex gap-4">
        <button
          onClick={() => navigate('/purchases')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        Cronologia
        </button>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
        Logout
        </button>
      </div>
    </div>

      {/* Griglia prodotti */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => ( // Products è un array di prodotti, creato dall hook useEffect salvandolo con useState
                                     // Per ogni prodotto creo una card, passo le props al componente ProductCard
          <ProductCard
            key={product.id}
            id={product.id}
            title={product.name}
            description={product.description}
            prices={product.amount.map(a => parseFloat(a))}
            descriptions={product.descr_dett}
            images={product.images}
            onBuy={handleBuy}
          />
        ))}
      </div>

    </div>
  )
}