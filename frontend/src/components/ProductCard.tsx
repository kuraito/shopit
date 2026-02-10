import { useState } from 'react'

interface ProductCardProps {
  id: number
  title: string
  description: string
  prices: number[]        // I prezzi sono un array di numeri, presi dal backend
  descriptions: string[]  // Le descrizioni sono un array di stringhe, presi dal backend
  images: string[]        // Le immagini sono un array di stringhe che rappresentano i percorsi delle immagini, presi dal backend
  onBuy: (id: number, price: number) => void
}

/* Card prodotto */
export default function ProductCard({
  id,
  title,
  description,
  prices,
  descriptions,
  images, // Le immagini sono un array di stringhe che rappresentano i percorsi delle immagini, presi dal backend
  onBuy,
}: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0) // All'inizio mostra la prima immagine dell'array
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null)

  // URL base del backend
  const BACKEND_URL = 'http://localhost:4000/'

  // Immagine attuale con URL completo presa dal backend
  const currentImage = `${BACKEND_URL}${images[currentImageIndex]}`

  // Vai alla prossima immagine
  const nextImage = () => {
    setCurrentImageIndex((currentImageIndex + 1) % images.length) 
    //incrementa l'indice e torna a 0 se supera la lunghezza dell'array
  }

  // Vai all'immagine precedente
  const prevImage = () => {
    setCurrentImageIndex((currentImageIndex - 1 + images.length) % images.length) 
    //decrementa l'indice e torna all'ultima immagine se è minore di 0
  }

  // Gestisci acquisto
  const handleBuy = () => {
    if (selectedPrice === null) {
      alert('Seleziona un prezzo')
      return
    }
    onBuy(id, selectedPrice) //chiama la funzione onBuy e passa l'id del prodotto e il prezzo selezionato
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      
      {/* Immagine con frecce e effetto slide */}
      <div className="relative w-full bg-gray-200 overflow-hidden" style={{ aspectRatio: '4/3' }}>
        
        {/* Immagine con transizione, prende currentImage dallo state che cambia con le frecce*/}
        <img
          key={currentImageIndex}
          src={currentImage}
          alt={title}
          className="w-full h-full object-cover animate-slideIn"
        />
        
        {/* Freccia sinistra, BOTTONE AL CLICK CAMBIA IMMAGINE */}
        <button
          onClick={prevImage}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded hover:bg-opacity-70 z-10"
        >
          &#10094;
        </button>

        {/* Freccia destra, BOTTONE AL CLICK CAMBIA IMMAGINE */}
        <button
          onClick={nextImage}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded hover:bg-opacity-70 z-10"
        >
          &#10095;
        </button>

      </div>

      {/* Contenuto */}
      <div className="p-4">
        
        {/* Titolo */}
        <h2 className="text-lg font-semibold text-gray-800 mb-2">{title}</h2>

        {/* Descrizione */}
        <p className="text-gray-600 text-sm mb-4">{description}</p>

        {/* Prezzi */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-800 mb-2">Seleziona taglio:</label>
          <select
            value={selectedPrice ?? ''}
            onChange={(e) => setSelectedPrice(e.target.value ? parseFloat(e.target.value) : null)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white cursor-pointer">

            <option value="">-- Scegli un'opzione --</option> {/* Opzione vuota per default */}
            {prices.map((price, index) => (   // Per ogni prezzo creo un'opzione, prendo il prezzo e la descrizione corrispondente
              <option key={index} value={price}> 
                €{price.toFixed(2)} - {descriptions[index]} {/* Mostra il prezzo formattato e la descrizione */}
              </option>
            ))}
          </select>
        </div>

        {/* Prezzo selezionato */}
        {selectedPrice !== null && (
          <div className="mb-4 p-2 bg-blue-100 rounded-lg">
            <p className="text-blue-600 font-semibold text-center">
              Prezzo: €{selectedPrice.toFixed(2)}
            </p>
          </div>
        )}

        {/* Bottone acquista */}
        <button
          onClick={handleBuy}
          className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
          disabled={selectedPrice === null}
        >
          Acquista
        </button>

      </div>

    </div>
  )
}