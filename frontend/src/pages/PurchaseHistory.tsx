import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/endPointApi'

// Tipo di acquisto, che è quello che il backend ritorna quando chiediamo gli acquisti dell'utente
interface Purchase {
  id: number
  product_id: number
  product_name: string
  description: string
  price_snapshot: number
  created_at: string
}

// Pagina cronologia acquisti
export default function PurchaseHistory() {
  const [purchases, setPurchases] = useState<Purchase[]>([]) // Purchases è un array di oggetti di tipo Purchase
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  // Carica gli acquisti dal backend
  useEffect(() => {
    const loadPurchases = async () => {
      try {
        const response = await api.get<Purchase[]>('/dashboard/purchases') // Chiamata all'API per ottenere gli acquisti dell'utente
        setPurchases(response.data)
      } catch (err) {
        console.error('Errore caricamento acquisti:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadPurchases()
  }, [])

  // Se sta caricando
  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen"><p>Caricamento...</p></div>
  }

  return (
    <div className="min-h-screen bg-blue-500 p-8">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Cronologia Acquisti</h1>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Indietro
        </button>
      </div>

      {/* Tabella acquisti */}
      {purchases.length === 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <p className="text-gray-600 text-lg">Nessun acquisto effettuato</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="w-full">
            
            {/* Header tabella */}
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-gray-800">Prodotto</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-800">Descrizione</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-800">Prezzo</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-800">Data</th>
             </tr>
            </thead>

            {/* Body tabella */}
            <tbody>
              {purchases.map((purchase) => (
                <tr key={purchase.id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-800 font-semibold">{purchase.product_name}</td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{purchase.description}</td>
                    <td className="px-6 py-4 text-blue-600 font-semibold">€{parseFloat(purchase.price_snapshot.toString()).toFixed(2)}</td>
                    <td className="px-6 py-4 text-gray-800">{new Date(purchase.created_at).toLocaleDateString('it-IT')}</td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}

    </div>
  )
}