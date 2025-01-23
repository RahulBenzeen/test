import { Button } from "../../components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Label } from "../../components/ui/label"
import { ShippingAddress as Address } from "../../store/addressSlice"

interface ShippingAddressProps {
  addresses: Address[]
  selectedAddressId: string | null
  onSelectAddress: (addressId: string) => void
  onAddNewAddress: () => void
  onPlaceOrder: () => void
}

export default function ShippingAddress({
  addresses,
  selectedAddressId,
  onSelectAddress,
  onAddNewAddress,
  onPlaceOrder,
}: ShippingAddressProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Shipping Address</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={onAddNewAddress}
        >
          Add New
        </Button>
      </CardHeader>
      <CardContent>
        {addresses.length > 0 ? (
          <div className="space-y-4">
            <Label className="text-base">Select delivery address</Label>
            <div className="grid gap-4">
              {addresses.map((addr) => (
                <div
                  key={addr._id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedAddressId === addr._id
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border hover:border-primary/50 hover:shadow-sm'
                  }`}
                  onClick={() => onSelectAddress(addr._id || '')}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      id={addr._id}
                      name="address"
                      value={addr._id}
                      checked={selectedAddressId === addr._id}
                      onChange={() => onSelectAddress(addr._id || '')}
                      className="mt-1"
                    />
                    <Label htmlFor={addr._id} className="cursor-pointer space-y-1">
                      <span className="font-medium block">
                        {addr.address}
                      </span>
                      <span className="text-sm text-muted-foreground block">
                        {addr.city}, {addr?.state} {addr?.zipCode}
                      </span>
                      <span className="text-sm text-muted-foreground block">
                        Phone: {addr?.phone}
                      </span>
                    </Label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">No saved addresses found.</p>
            <Button
              variant="outline"
              onClick={onAddNewAddress}
            >
              Add New Address
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button
          className="w-full"
          size="lg"
          onClick={onPlaceOrder}
          disabled={!selectedAddressId}
        >
          Place Order
        </Button>
        <p className="text-sm text-muted-foreground text-center">
          By placing this order you agree to our Terms of Service and Privacy Policy
        </p>
      </CardFooter>
    </Card>
  )
}