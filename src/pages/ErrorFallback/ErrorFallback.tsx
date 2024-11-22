import { AlertCircle } from 'lucide-react'
import { Button } from '../../components/ui/button'

export default function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <AlertCircle className="h-12 w-12 text-destructive mb-4" />
      <h1 className="text-2xl font-bold mb-2">Oops! Something went wrong.</h1>
      <p className="text-muted-foreground mb-4">{error.message}</p>
      <Button onClick={resetErrorBoundary}>Try again</Button>
    </div>
  )
}