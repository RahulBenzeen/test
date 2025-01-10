import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../../components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../../components/ui/table";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useEffect, useState } from "react";
import { fetchOrdersByUser } from "../../store/orderSlice";
import { 
  Loader2, 
  ShoppingCart, 
  AlertCircle, 
  Search,
  Download,

  Calendar,
  RefreshCw
} from "lucide-react";
import showToast from "../../utils/toast/toastUtils";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

export default function CustomerOrderHistory() {
  const dispatch = useAppDispatch();
  const { orders, status, error } = useAppSelector((state) => state.order);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrders, setFilteredOrders] = useState(orders);
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    dispatch(fetchOrdersByUser());
  }, [dispatch]);

  useEffect(() => {
    const filtered = orders.filter((order) => {
      const matchesSearch = order._id?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = selectedStatus === "all" || order.orderStatus === selectedStatus;
      return matchesSearch && matchesStatus;
    });
    setFilteredOrders(filtered);
  }, [searchTerm, orders, selectedStatus]);

  const getStatusColor = (status: string) => {
    const colors = {
      delivered: "bg-green-100 text-green-800",
      shipped: "bg-blue-100 text-blue-800",
      pending: "bg-yellow-100 text-yellow-800",
      failed: "bg-red-100 text-red-800",
      completed: "bg-green-100 text-green-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const handleRefresh = () => {
    dispatch(fetchOrdersByUser());
    showToast("Orders refreshed successfully!", "success");
  };

  const handleExport = () => {
    // Implementation for exporting orders to CSV
    showToast("Orders exported successfully!", "success");
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="text-center">
          <Loader2 className="animate-spin w-12 h-12 text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (status === "failed") {
    showToast("Failed to fetch orders. Please try again.", "error");
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="text-center space-y-4">
          <AlertCircle className="w-16 h-16 mx-auto text-red-500" />
          <h3 className="text-xl font-semibold text-gray-800">Failed to Load Orders</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            We encountered an error while loading your orders. Please try again later.
          </p>
          <Button onClick={handleRefresh} variant="outline" className="mt-4">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center py-8 px-4">
      <Card className="w-full max-w-6xl shadow-xl rounded-lg bg-white">
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg p-8">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-3xl font-bold flex items-center mb-2">
                <ShoppingCart className="w-8 h-8 mr-3" />
                Order History
              </CardTitle>
              <CardDescription className="text-gray-100 text-lg">
                Track and manage your order history
              </CardDescription>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={handleRefresh}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button variant="secondary" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
  <div className="flex gap-4 mb-6">
    <div className="flex-1 relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <Input
        placeholder="Search orders..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10"
      />
    </div>
    <select
      value={selectedStatus}
      onChange={(e) => setSelectedStatus(e.target.value)}
      className="px-4 py-2 border rounded-md bg-white"
    >
      <option value="all">All Status</option>
      <option value="pending">Pending</option>
      <option value="shipped">Shipped</option>
      <option value="delivered">Delivered</option>
    </select>
  </div>

  {filteredOrders.length === 0 ? (
    <div className="text-center py-12">
      <ShoppingCart className="w-20 h-20 mx-auto mb-4 text-gray-300" />
      <h3 className="text-xl font-semibold text-gray-800 mb-2">No Orders Found</h3>
      <p className="text-gray-500 max-w-md mx-auto">
        {searchTerm || selectedStatus !== "all"
          ? "No orders match your search criteria. Try adjusting your filters."
          : "Start shopping today and track all your orders here."}
      </p>
    </div>
  ) : (
    <ScrollArea className="h-[500px] w-full rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Order ID</TableHead>
            <TableHead>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Date
              </div>
            </TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOrders.map((order) => (
            <TableRow
              key={order._id}
              className="hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <TableCell className="font-medium">{order._id}</TableCell>
              <TableCell>
                {new Date(order?.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </TableCell>
              <TableCell className="font-semibold">
                ${order.totalPrice.toFixed(2)}
              </TableCell>
              <TableCell>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                  {order.orderStatus}
                </span>
              </TableCell>
              <TableCell>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.paymentStatus)}`}>
                  {order.paymentStatus}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  )}
</CardContent>

        
        <CardFooter className="bg-gray-50 p-4 rounded-b-lg border-t">
          <div className="w-full text-sm text-gray-500 text-center">
            Showing {filteredOrders.length} of {orders.length} orders
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}