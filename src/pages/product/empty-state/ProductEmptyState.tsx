import React from 'react';
import { Package } from 'lucide-react';

const EmptyState = () => {
  return (
    <div className="text-center py-12">
      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">No Products Found</h3>
      <p className="text-muted-foreground">
        Try adjusting your search or filter criteria
      </p>
    </div>
  );
};

export default React.memo(EmptyState);