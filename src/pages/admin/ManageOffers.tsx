import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import BundleOfferForm from './components/BundleOfferForm';

import { motion } from '@/components/ui/motion';
import { Package, Gift, List } from 'lucide-react';
import GiftOfferForm from './components/GiftOffer';
import OfferList from './components/OfferList';

export default function OfferManagement() {
  return (
    <div className="container px-4 py-8 mx-auto max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Offer Management</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage special offers to boost your sales and customer engagement
          </p>
        </header>

        <Card className="overflow-hidden border-0 shadow-lg">
          <Tabs defaultValue="bundle" className="w-full">
            <TabsList className="grid w-full grid-cols-3 p-0 h-auto">
              <TabsTrigger 
                value="bundle" 
                className="py-4 rounded-none data-[state=active]:bg-background data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  <span>Bundle Offers</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="gift" 
                className="py-4 rounded-none data-[state=active]:bg-background data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                <div className="flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  <span>Gift Offers</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="list" 
                className="py-4 rounded-none data-[state=active]:bg-background data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                <div className="flex items-center gap-2">
                  <List className="h-5 w-5" />
                  <span>Manage Offers</span>
                </div>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bundle" className="p-0 m-0">
              <CardHeader className="bg-muted/50 pb-4 pt-6">
                <CardTitle className="text-xl">Bundle Offers</CardTitle>
                <CardDescription>
                  Create volume-based discounts when customers buy multiple products
                </CardDescription>
              </CardHeader>
              <BundleOfferForm />
            </TabsContent>

            <TabsContent value="gift" className="p-0 m-0">
              <CardHeader className="bg-muted/50 pb-4 pt-6">
                <CardTitle className="text-xl">Gift Offers</CardTitle>
                <CardDescription>
                  Reward customers with free products when they reach a spending threshold
                </CardDescription>
              </CardHeader>
              <GiftOfferForm />
            </TabsContent>

            <TabsContent value="list" className="p-0 m-0">
              <CardHeader className="bg-muted/50 pb-4 pt-6">
                <CardTitle className="text-xl">Manage Offers</CardTitle>
                <CardDescription>
                  View and manage your existing bundle and gift offers
                </CardDescription>
              </CardHeader>
              <div className="p-6">
                <OfferList />
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </motion.div>
    </div>
  );
}