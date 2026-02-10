import { useState } from "react"

// Definisce quali dati il componente riceve dall'esterno
interface AuthFormProps {
  title: string                                          
  funzFromPagina: (username: string, password: string) => void // Funzione chiamata quando l'utente invia il form
  isLoading: boolean                                            // Se è True, mostra "Caricamento" e disabilita il pulsante
  error?: string                                         
  successMessage?: string                                
  linkText: string                                       
  linkHref: string                                       
}

// Componente React che mostra un form di autenticazione
export default function AuthForm({
  title,
  funzFromPagina, // Funzione passata dalle props in caso di login è handleLogin, in caso di registrazione è handleRegister AVVIA LA FUNZIONE CHE CHIAMA L API
  isLoading,
  error,
  successMessage,
  linkText,
  linkHref,
}: AuthFormProps) { // Prende le props e le struttura in un interfaccia definita sopra

  const [username, setUsername] = useState('')   
  const [password, setPassword] = useState('')  

  // Funzione eseguita quando l'utente clicca "Invia"
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()                              // Blocca il refresh della pagina
    funzFromPagina(username, password)              // Richiama la funzione della pagina che farà la chiamata API, passata tramite props
  }

  return (
    <div className="auth-container">

      {/* Titolo */}
      <h1 className="auth-title">{title}</h1>

      {/* Messaggio di errore: mostra solo se error esiste */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Messaggio di successo: mostra solo se successMessage esiste */}
      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      {/* Form COLLEGA L ONSUBMIT QUINDI IL BOTTONE SUBMIT DEL FORM ALLA FUNZIONE HANDLESUBMIT*/}
      <form onSubmit={handleSubmit}>

        {/* Input Username */}
        <div className="form-group">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-input"
            value={username}                              /* Il valore dell'input è sempre = username */
            onChange={(campoInsInputUser) => setUsername(campoInsInputUser.target.value)} /* Quando l'utente scrive, aggiorna username, prende l evento generato dal browser sul onChange*/
          />
        </div>

        {/* Input Password */}
        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-input"
            value={password}                              /* Il valore dell'input è sempre = password */
            onChange={(campoInsInputPw) => setPassword(campoInsInputPw.target.value)} /* Quando l'utente scrive, aggiorna password, prende l evento generato dal browser sul onChange*/
          />
        </div>

        {/* Pulsante submit */}
        <button
          type="submit"
          className="submit-btn"
          disabled={isLoading}                           /* Se isLoading è true, il pulsante è disabilitato (non cliccabile) */
        >
          {isLoading ? 'Caricamento...' : 'Invia'}       {/* Se isLoading è true mostra "Caricamento...", altrimenti "Invia" */}
        </button>

      </form>

      {/* Link a login/register */}
      <div className="auth-link">
        <a href={linkHref}>{linkText}</a>
      </div>

    </div>
  )
}