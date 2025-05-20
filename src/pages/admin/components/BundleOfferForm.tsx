import React, { useState } from 'react';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import RuleItem from './RuleItem';
import { useToast } from '../../../hooks/use-toast';
import { motion, AnimatePresence } from '@/components/ui/motion';
import OfferPreview from './OfferPreview';
import { useBundleOfferForm } from '../../../hooks/useBundleOffer';

export default function BundleOfferForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { bundleRules, addNewRule, updateRule, removeRule, validateAndSubmit } = useBundleOfferForm();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await validateAndSubmit();
      toast({
        title: "Success!",
        description: "Bundle offer has been saved successfully.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to save bundle offer",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="grid lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Discount Rules</h3>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addNewRule}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 transition-all hover:bg-primary hover:text-primary-foreground"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Rule</span>
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm text-muted-foreground">
                  <div className="col-span-2">Min Qty</div>
                  <div className="col-span-3">Discount Type</div>
                  <div className="col-span-2">Value</div>
                  <div className="col-span-2">Products</div>
                  <div className="col-span-1"></div>
                </div>

                <AnimatePresence initial={false}>
                  {bundleRules.map((rule, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <RuleItem
                        rule={rule}
                        index={index}
                        updateRule={updateRule}
                        removeRule={removeRule}
                        disabled={isSubmitting}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>

                {bundleRules.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-40 bg-muted/30 rounded-lg border border-dashed border-muted p-6">
                    <p className="text-muted-foreground">No rules created yet</p>
                    <Button
                      type="button"
                      variant="ghost"
                      className="mt-2"
                      onClick={addNewRule}
                      disabled={isSubmitting}
                    >
                      Add your first rule
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-2">
              <OfferPreview rules={bundleRules} />
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end gap-2 p-6 pt-0">
        <Button 
          variant="outline" 
          type="button" 
          disabled={isSubmitting}
          onClick={() => {
            // Reset form
            while (bundleRules.length > 0) {
              removeRule(0);
            }
            addNewRule();
          }}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving Bundle Offer...
            </>
          ) : (
            'Save Bundle Offer'
          )}
        </Button>
      </CardFooter>
    </form>
  );
}