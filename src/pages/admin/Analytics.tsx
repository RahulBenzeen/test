'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../../components/ui/chart'
import { ArrowDown, ArrowUp, DollarSign,IndianRupeeIcon, ShoppingCart, Users, Activity, TrendingUp, Package, Repeat } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { Bar, BarChart, AreaChart } from "recharts"
// Mock data (replace with actual data from your backend)
const revenueData = [
  { name: 'Jan', total: 2500 },
  { name: 'Feb', total: 3000 },
  { name: 'Mar', total: 2800 },
  { name: 'Apr', total: 3300 },
  { name: 'May', total: 3900 },
  { name: 'Jun', total: 3500 },
]

const topProducts = [
  { name: 'Product A', sales: 1234 },
  { name: 'Product B', sales: 1000 },
  { name: 'Product C', sales: 890 },
  { name: 'Product D', sales: 765 },
  { name: 'Product E', sales: 650 },
]

const customerDemographics = [
  { name: '18-24', value: 20 },
  { name: '25-34', value: 35 },
  { name: '35-44', value: 25 },
  { name: '45-54', value: 15 },
  { name: '55+', value: 5 },
]

const orderStatusData = [
  { name: 'Completed', value: 60 },
  { name: 'Processing', value: 25 },
  { name: 'Cancelled', value: 15 },
]

const conversionRateData = [
  { date: '2023-01-01', rate: 2.5 },
  { date: '2023-02-01', rate: 2.8 },
  { date: '2023-03-01', rate: 3.1 },
  { date: '2023-04-01', rate: 3.3 },
  { date: '2023-05-01', rate: 3.5 },
  { date: '2023-06-01', rate: 3.8 },
]

const monthlySalesData = [
  { month: 'Jan', sales: 4000 },
  { month: 'Feb', sales: 4500 },
  { month: 'Mar', sales: 5000 },
  { month: 'Apr', sales: 5500 },
  { month: 'May', sales: 6000 },
  { month: 'Jun', sales: 6500 },
]

const customerRetentionData = [
  { month: 'Jan', rate: 65 },
  { month: 'Feb', rate: 68 },
  { month: 'Mar', rate: 70 },
  { month: 'Apr', rate: 72 },
  { month: 'May', rate: 75 },
  { month: 'Jun', rate: 78 },
]

const recentOrders = [
  { id: '1234', customer: 'John Doe', total: 125.99, status: 'Completed' },
  { id: '1235', customer: 'Jane Smith', total: 89.99, status: 'Processing' },
  { id: '1236', customer: 'Bob Johnson', total: 199.99, status: 'Shipped' },
  { id: '1237', customer: 'Alice Brown', total: 149.99, status: 'Completed' },
  { id: '1238', customer: 'Charlie Wilson', total: 79.99, status: 'Processing' },
]

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('7d')

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <IndianRupeeIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 inline-flex items-center">
                <ArrowUp className="w-3 h-3 mr-1" />
                20.1%
              </span>{' '}
              from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2,350</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 inline-flex items-center">
                <ArrowUp className="w-3 h-3 mr-1" />
                180.1%
              </span>{' '}
              from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12,234</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 inline-flex items-center">
                <ArrowUp className="w-3 h-3 mr-1" />
                19%
              </span>{' '}
              from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 inline-flex items-center">
                <ArrowUp className="w-3 h-3 mr-1" />
                201
              </span>{' '}
              since last hour
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Revenue Over Time</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <ChartContainer
                  config={{
                    total: {
                      label: 'Total Revenue',
                      color: 'hsl(var(--chart-1))',
                    },
                  }}
                  className="h-[300px]"
                >
                  <AreaChart
                    data={revenueData}
                    index="name"
                    categories={['total']}
                    colors={['hsl(var(--chart-1))']}
                    valueFormatter={(number: number) =>
                      `$${Intl.NumberFormat('us').format(number).toString()}`
                    }
                    yAxisWidth={48}
                  />
                </ChartContainer>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
                <CardDescription>Top 5 best-selling products this month</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    sales: {
                      label: 'Sales',
                      color: 'hsl(var(--chart-2))',
                    },
                  }}
                  className="h-[300px]"
                >
                  <BarChart
                    data={topProducts}
                    index="name"
                    categories={['sales']}
                    colors={['hsl(var(--chart-2))']}
                    valueFormatter={(number: number) =>
                      Intl.NumberFormat('us').format(number).toString()
                    }
                    yAxisWidth={48}
                  />
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest 5 orders</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.id}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>${order.total.toFixed(2)}</TableCell>
                        <TableCell>{order.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
                <CardDescription>Current status of all orders</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    value: {
                      label: 'Orders',
                      color: 'hsl(var(--chart-3))',
                    },
                  }}
                  className="h-[300px]"
                >
                  <BarChart
                    data={orderStatusData}
                    index="name"
                    categories={['value']}
                    colors={['hsl(var(--chart-3))']}
                    valueFormatter={(number: number) =>
                      Intl.NumberFormat('us').format(number).toString()
                    }
                    yAxisWidth={48}
                  />
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Rate</CardTitle>
              <CardDescription>Percentage of visitors who made a purchase</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  rate: {
                    label: 'Conversion Rate',
                    color: 'hsl(var(--chart-4))',
                  },
                }}
                className="h-[300px]"
              >
                <AreaChart
                  data={conversionRateData}
                  index="date"
                  categories={['rate']}
                  colors={['hsl(var(--chart-4))']}
                  valueFormatter={(number: number) => `${number.toFixed(1)}%`}
                  yAxisWidth={40}
                />
              </ChartContainer>
            </CardContent>
          </Card>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Average Order Value</CardTitle>
                <CardDescription>Average amount spent per order</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$85.25</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500 inline-flex items-center">
                    <ArrowUp className="w-3 h-3 mr-1" />
                    5.2%
                  </span>{' '}
                  from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Cart Abandonment Rate</CardTitle>
                <CardDescription>Percentage of users who add items to cart but don't purchase</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">68.7%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-red-500 inline-flex items-center">
                    <ArrowUp className="w-3 h-3 mr-1" />
                    2.1%
                  </span>{' '}
                  from last month
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Sales Report</CardTitle>
              <CardDescription>Overview of sales performance by month</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  sales: {
                    label: 'Monthly Sales',
                    color: 'hsl(var(--chart-5))',
                  },
                }}
                className="h-[300px]"
              >
                <BarChart
                  data={monthlySalesData}
                  index="month"
                  categories={['sales']}
                  colors={['hsl(var(--chart-5))']}
                  valueFormatter={(number: number) =>
                    `$${Intl.NumberFormat('us').format(number).toString()}`
                  }
                  yAxisWidth={48}
                />
              </ChartContainer>
            </CardContent>
          </Card>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Categories</CardTitle>
                <CardDescription>Best performing product categories</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    value: {
                      label: 'Sales',
                      color: 'hsl(var(--chart-6))',
                    },
                  }}
                  className="h-[200px]"
                >
                  <BarChart
                    data={[
                      { category: 'Electronics', value: 35 },
                      { category: 'Clothing', value: 28 },
                      { category: 'Home & Garden', value: 22 },
                      { category: 'Books', value: 15 },
                    ]}
                    index="category"
                    categories={['value']}
                    colors={['hsl(var(--chart-6))']}
                    valueFormatter={(number: number) => `${number}%`}
                    yAxisWidth={48}
                  />
                </ChartContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Sales by Region</CardTitle>
                <CardDescription>Geographic distribution of sales</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    value: {
                      label: 'Sales',
                      color: 'hsl(var(--chart-7))',
                    },
                  }}
                  className="h-[200px]"
                >
                  <BarChart
                    data={[
                      { region: 'North America', value: 40 },
                      { region: 'Europe', value: 30 },
                      { region: 'Asia', value: 20 },
                      { region: 'Other', value: 10 },
                    ]}
                    index="region"
                    categories={['value']}
                    colors={['hsl(var(--chart-7))']}
                    valueFormatter={(number: number) => `${number}%`}
                    yAxisWidth={48}
                  />
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Retention Rate</CardTitle>
              <CardDescription>Percentage of customers who made repeat purchases</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  rate: {
                    label: 'Retention Rate',
                    color: 'hsl(var(--chart-8))',
                  },
                }}
                className="h-[300px]"
              >
                <AreaChart
                  data={customerRetentionData}
                  index="month"
                  categories={['rate']}
                  colors={['hsl(var(--chart-8))']}
                  valueFormatter={(number: number) => `${number.toFixed(1)}%`}
                  yAxisWidth={40}
                />
              </ChartContainer>
            </CardContent>
          </Card>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Customer Lifetime Value</CardTitle>
                <CardDescription>Average revenue generated per customer</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$543.21</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500 inline-flex items-center">
                    <ArrowUp className="w-3 h-3 mr-1" />
                    7.3%
                  </span>{' '}
                  from last quarter
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Net Promoter Score</CardTitle>
                <CardDescription>Measure of customer satisfaction and loyalty</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500 inline-flex items-center">
                    <ArrowUp className="w-3 h-3 mr-1" />
                    3 points
                  </span>{' '}
                  from last survey
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}