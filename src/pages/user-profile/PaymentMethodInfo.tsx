import { useState } from 'react'
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"

export function PaymentMethodsInfo() {
  const [isAdding, setIsAdding] = useState(false)
  const [newCard, setNewCard] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  })

  const handleSave = () => {
    // TODO: Implement save functionality
    setIsAdding(false)
    setNewCard({ cardNumber: '', cardHolder: '', expiryDate: '', cvv: '' })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
        <CardDescription>Manage your payment methods</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing payment methods would be listed here */}
        {isAdding && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                value={newCard.cardNumber}
                onChange={(e) => setNewCard({ ...newCard, cardNumber: e.target.value })}
                placeholder="1234 5678 9012 3456"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cardHolder">Card Holder Name</Label>
              <Input
                id="cardHolder"
                value={newCard.cardHolder}
                onChange={(e) => setNewCard({ ...newCard, cardHolder: e.target.value })}
                placeholder="John Doe"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  value={newCard.expiryDate}
                  onChange={(e) => setNewCard({ ...newCard, expiryDate: e.target.value })}
                  placeholder="MM/YY"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  value={newCard.cvv}
                  onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value })}
                  placeholder="123"
                  type="password"
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {isAdding ? (
          <Button onClick={handleSave}>Save Payment Method</Button>
        ) : (
          <Button onClick={() => setIsAdding(true)}>Add Payment Method</Button>
        )}
      </CardFooter>
    </Card>
  )
}