// src/pages/NotFound.js
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-background">
      <h1 className="text-4xl font-bold text-primary">404</h1>
      <p className="text-xl text-muted-foreground mt-4">Oops! Page not found.</p>
      <Link to="/" className="mt-6 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark">
        Go Back Home
      </Link>
    </div>
  )
}
