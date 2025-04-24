import { useState, useEffect } from 'react';
import { Trash2, Package, Gift, AlertCircle } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { Separator } from '../../../components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../components/ui/alert-dialog';
import { deleteBundleOffer, deleteGiftOffer, getAllBundleOffers, getAllGiftOffers } from '../../../api/offer';

interface BundleOffer {
  _id: string;
  minQty: number;
  maxQty?: number;
  discountType: string;
  discountValue: number;
  products: string[];
  createdAt: string;
}

interface GiftOffer {
  _id: string;
  name: string;
  minCartValue: number;
  maxCartValue?: number;
  giftCount: number;
  giftProducts: string[];
  createdAt: string;
}

export default function OfferList() {
  const [bundleOffers, setBundleOffers] = useState<BundleOffer[]>([]);
  const [giftOffers, setGiftOffers] = useState<GiftOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<{ id: string; type: 'bundle' | 'gift' } | null>(null);

  useEffect(() => {
    fetchOffers();
  }, []);
  
  const fetchOffers = async () => {
    try {
      setLoading(true);
      const [bundleRes, giftRes] = await Promise.all([
        getAllBundleOffers(),
        getAllGiftOffers()
      ]);
  
      setBundleOffers(bundleRes.data);
      setGiftOffers(giftRes.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load offers. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

    const handleDelete = async () => {
      if (!selectedOffer) return;
    
      try {
        if (selectedOffer.type === 'bundle') {
          await deleteBundleOffer(selectedOffer.id);
          setBundleOffers((prev) => prev.filter((offer) => offer._id !== selectedOffer.id));
        } else {
          await deleteGiftOffer(selectedOffer.id);
          setGiftOffers((prev) => prev.filter((offer) => offer._id !== selectedOffer.id));
        }
      } catch (err) {
        console.error(err);
        setError('Failed to delete offer. Please try again.');
      } finally {
        setDeleteDialogOpen(false);
        setSelectedOffer(null);
      }
    };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
          <Package className="h-5 w-5" />
          Bundle Offers
        </h3>
        <ScrollArea className="h-[300px]">
          <div className="space-y-4">
            {bundleOffers.length === 0 ? (
              <Card className="p-4 text-center text-muted-foreground">
                No bundle offers found
              </Card>
            ) : (
              bundleOffers.map((offer) => (
                <Card key={offer._id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">
                          {offer.minQty}{offer.maxQty ? `-${offer.maxQty}` : '+'} items
                        </Badge>
                        <Badge variant="secondary">
                          {offer.discountType === 'percent' 
                            ? `${offer.discountValue}% OFF`
                            : `₹${offer.discountValue} OFF`}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Applies to {offer.products.length} products
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Created on {new Date(offer.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                      onClick={() => {
                        setSelectedOffer({ id: offer._id, type: 'bundle' });
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
          <Gift className="h-5 w-5" />
          Gift Offers
        </h3>
        <ScrollArea className="h-[300px]">
          <div className="space-y-4">
            {giftOffers.length === 0 ? (
              <Card className="p-4 text-center text-muted-foreground">
                No gift offers found
              </Card>
            ) : (
              giftOffers.map((offer) => (
                <Card key={offer._id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium mb-2">{offer.name}</h4>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">
                          Min. ₹{offer.minCartValue}
                        </Badge>
                        <Badge variant="secondary">
                          {offer.giftCount} Free Gift{offer.giftCount > 1 ? 's' : ''}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {offer.giftProducts.length} products available as gifts
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Created on {new Date(offer.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                      onClick={() => {
                        setSelectedOffer({ id: offer._id, type: 'gift' });
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the offer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}