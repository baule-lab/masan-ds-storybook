import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

// UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@masan-group/shared-ui/card';
import { Badge } from '@masan-group/shared-ui/badge';
import { Button } from '@masan-group/shared-ui/button';
import { Progress } from '@masan-group/shared-ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@masan-group/shared-ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@masan-group/shared-ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@masan-group/shared-ui/select';
import { Switch } from '@masan-group/shared-ui/switch';
import { Label } from '@masan-group/shared-ui/label';
import { Separator } from '@masan-group/shared-ui/separator';
import { ScrollArea } from '@masan-group/shared-ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@masan-group/shared-ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@masan-group/shared-ui/accordion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@masan-group/shared-ui/tooltip';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@masan-group/shared-ui/breadcrumb';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@masan-group/shared-ui/dropdown-menu';
import { Checkbox } from '@masan-group/shared-ui/checkbox';
import { Input } from '@masan-group/shared-ui/input';

// Charts
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@masan-group/shared-ui/chart';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, Pie, PieChart, XAxis, YAxis, RadialBarChart, RadialBar, PolarGrid, Radar, RadarChart, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

// Timeline
import { Timeline, TimelineItem } from '@masan-group/shared-ui/timeline';

// DataTable
import { DataTable, useColumns } from '@masan-group/shared-ui/data-table';
import type { ColumnConfig } from '@masan-group/shared-ui/data-table';

// Icons
import {
  TrendingUp, TrendingDown, Users, DollarSign, Activity, ShoppingCart,
  Bell, Settings, MoreVertical, Download, RefreshCw, Calendar,
  Check, Clock, AlertCircle, Home, ChevronRight, Package,
  CreditCard, Zap, Target, BarChart3, PieChartIcon, ArrowUpRight,
  Filter, Search, Plus
} from 'lucide-react';

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: DashboardPage,
});

// Chart Data
const revenueData = [
  { month: 'Jan', revenue: 4000, orders: 240, profit: 1200 },
  { month: 'Feb', revenue: 3000, orders: 198, profit: 900 },
  { month: 'Mar', revenue: 5000, orders: 320, profit: 1500 },
  { month: 'Apr', revenue: 4500, orders: 278, profit: 1350 },
  { month: 'May', revenue: 6000, orders: 389, profit: 1800 },
  { month: 'Jun', revenue: 5500, orders: 349, profit: 1650 },
];

const trafficData = [
  { month: 'Jan', desktop: 186, mobile: 80 },
  { month: 'Feb', desktop: 305, mobile: 200 },
  { month: 'Mar', desktop: 237, mobile: 120 },
  { month: 'Apr', desktop: 173, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'Jun', desktop: 214, mobile: 140 },
];

const salesByCategory = [
  { category: 'Electronics', sales: 4500, fill: 'var(--color-electronics)' },
  { category: 'Clothing', sales: 3200, fill: 'var(--color-clothing)' },
  { category: 'Food', sales: 2800, fill: 'var(--color-food)' },
  { category: 'Books', sales: 1500, fill: 'var(--color-books)' },
];

const performanceData = [
  { metric: 'Sales', value: 85 },
  { metric: 'Marketing', value: 72 },
  { metric: 'Support', value: 90 },
  { metric: 'Development', value: 78 },
  { metric: 'Operations', value: 68 },
];

const radarData = [
  { subject: 'Sales', A: 120, B: 110, fullMark: 150 },
  { subject: 'Marketing', A: 98, B: 130, fullMark: 150 },
  { subject: 'Development', A: 86, B: 130, fullMark: 150 },
  { subject: 'Support', A: 99, B: 100, fullMark: 150 },
  { subject: 'Operations', A: 85, B: 90, fullMark: 150 },
  { subject: 'Finance', A: 65, B: 85, fullMark: 150 },
];

// Chart Configs
const revenueConfig = {
  revenue: { label: 'Revenue', color: 'var(--chart-1)' },
  orders: { label: 'Orders', color: 'var(--chart-2)' },
  profit: { label: 'Profit', color: 'var(--chart-3)' },
} satisfies ChartConfig;

const trafficConfig = {
  desktop: { label: 'Desktop', color: 'var(--chart-1)' },
  mobile: { label: 'Mobile', color: 'var(--chart-2)' },
} satisfies ChartConfig;

const categoryConfig = {
  sales: { label: 'Sales' },
  electronics: { label: 'Electronics', color: 'var(--chart-1)' },
  clothing: { label: 'Clothing', color: 'var(--chart-2)' },
  food: { label: 'Food', color: 'var(--chart-3)' },
  books: { label: 'Books', color: 'var(--chart-4)' },
} satisfies ChartConfig;

const radialConfig = {
  value: { label: 'Performance' },
  sales: { label: 'Sales', color: 'var(--chart-1)' },
  marketing: { label: 'Marketing', color: 'var(--chart-2)' },
  support: { label: 'Support', color: 'var(--chart-3)' },
  development: { label: 'Development', color: 'var(--chart-4)' },
  operations: { label: 'Operations', color: 'var(--chart-5)' },
} satisfies ChartConfig;

const radarConfig = {
  A: { label: 'Team A', color: 'var(--chart-1)' },
  B: { label: 'Team B', color: 'var(--chart-2)' },
} satisfies ChartConfig;

// Recent Sales Data
const recentSales = [
  { name: 'Nguyen Van A', email: 'nguyenvana@email.com', amount: '+$1,999.00', avatar: 'NV', status: 'completed' },
  { name: 'Tran Thi B', email: 'tranthib@email.com', amount: '+$39.00', avatar: 'TT', status: 'pending' },
  { name: 'Le Van C', email: 'levanc@email.com', amount: '+$299.00', avatar: 'LV', status: 'completed' },
  { name: 'Pham Thi D', email: 'phamthid@email.com', amount: '+$99.00', avatar: 'PT', status: 'failed' },
  { name: 'Hoang Van E', email: 'hoangvane@email.com', amount: '+$450.00', avatar: 'HV', status: 'completed' },
];

// Tasks Data
const tasks = [
  { id: '1', title: 'Review new orders', status: 'in-progress', priority: 'high', dueDate: '2026-04-13' },
  { id: '2', title: 'Update product inventory', status: 'todo', priority: 'medium', dueDate: '2026-04-14' },
  { id: '3', title: 'Prepare monthly report', status: 'done', priority: 'low', dueDate: '2026-04-12' },
  { id: '4', title: 'Contact suppliers', status: 'todo', priority: 'high', dueDate: '2026-04-15' },
];

// Notifications
const notifications = [
  { id: 1, title: 'New order received', description: 'Order #1234 from customer', time: '5 min ago', read: false },
  { id: 2, title: 'Payment confirmed', description: 'Payment for order #1230', time: '1 hour ago', read: false },
  { id: 3, title: 'Low stock alert', description: 'Product SKU-456 running low', time: '2 hours ago', read: true },
  { id: 4, title: 'New review posted', description: '5-star review on Product A', time: '3 hours ago', read: true },
];

// Orders Table Data
type Order = {
  id: string;
  customer: string;
  product: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  total: number;
  date: string;
};

const ordersData: Order[] = [
  { id: 'ORD-001', customer: 'Nguyen Van A', product: 'Laptop Pro', status: 'delivered', total: 1299, date: '2026-04-10' },
  { id: 'ORD-002', customer: 'Tran Thi B', product: 'Wireless Mouse', status: 'shipped', total: 49, date: '2026-04-11' },
  { id: 'ORD-003', customer: 'Le Van C', product: 'Keyboard RGB', status: 'processing', total: 129, date: '2026-04-11' },
  { id: 'ORD-004', customer: 'Pham Thi D', product: 'Monitor 27"', status: 'pending', total: 399, date: '2026-04-12' },
  { id: 'ORD-005', customer: 'Hoang Van E', product: 'USB Hub', status: 'delivered', total: 29, date: '2026-04-09' },
];

const orderColumns: ColumnConfig<Order>[] = [
  { accessorKey: 'id', title: 'Order ID', size: 100 },
  { accessorKey: 'customer', title: 'Customer', size: 150 },
  { accessorKey: 'product', title: 'Product', size: 150 },
  {
    accessorKey: 'status',
    title: 'Status',
    size: 120,
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const variant = status === 'delivered' ? 'success' : status === 'shipped' ? 'primary' : status === 'processing' ? 'warning' : 'secondary';
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    accessorKey: 'total',
    title: 'Total',
    size: 100,
    cell: ({ row }) => `$${row.getValue('total')}`,
  },
  { accessorKey: 'date', title: 'Date', size: 120 },
];

function DashboardPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const columns = useColumns<Order>(orderColumns);

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-6">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink className="flex items-center gap-1">
                <Home className="size-4" />
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="size-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-bold text-2xl tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Overview of your business performance.</p>
          </div>
          <div className="flex items-center gap-2">
            <Select defaultValue="7d">
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24 hours</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <RefreshCw className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Refresh data</TooltipContent>
            </Tooltip>

            <DropdownMenu>
              <DropdownMenuTrigger render={(props) => (
                <Button {...props} variant="ghost" size="icon">
                  <MoreVertical className="size-4" />
                </Button>
              )} />
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Download className="mr-2 size-4" /> Export Report
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 size-4" /> Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Alert */}
        <Alert>
          <AlertCircle className="size-4" />
          <AlertTitle>System Update</AlertTitle>
          <AlertDescription>
            A new version is available. Please refresh the page to get the latest features.
          </AlertDescription>
        </Alert>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="font-medium text-sm">Total Revenue</CardTitle>
              <DollarSign className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">$45,231.89</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingUp className="size-3 text-green-500" />
                <span className="text-green-500">+20.1%</span> from last month
              </div>
              <Progress value={75} className="mt-3" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="font-medium text-sm">Total Users</CardTitle>
              <Users className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">+2,350</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingUp className="size-3 text-green-500" />
                <span className="text-green-500">+180.1%</span> from last month
              </div>
              <Progress value={60} className="mt-3" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="font-medium text-sm">Active Sessions</CardTitle>
              <Activity className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">+12,234</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingDown className="size-3 text-red-500" />
                <span className="text-red-500">-4.5%</span> from last month
              </div>
              <Progress value={45} className="mt-3" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="font-medium text-sm">Total Orders</CardTitle>
              <ShoppingCart className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">+573</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingUp className="size-3 text-green-500" />
                <span className="text-green-500">+19%</span> from last month
              </div>
              <Progress value={85} className="mt-3" />
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-7">
              {/* Revenue Chart */}
              <Card className="lg:col-span-4">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Revenue Overview</CardTitle>
                    <CardDescription>Monthly revenue and orders for 2026</CardDescription>
                  </div>
                  <BarChart3 className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <ChartContainer config={revenueConfig} className="h-[300px] w-full">
                    <BarChart accessibilityLayer data={revenueData}>
                      <CartesianGrid vertical={false} />
                      <XAxis dataKey="month" tickLine={false} axisLine={false} />
                      <YAxis tickLine={false} axisLine={false} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <ChartLegend content={<ChartLegendContent />} />
                      <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="orders" fill="var(--color-orders)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Recent Sales & Notifications */}
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Recent Sales</CardTitle>
                  <CardDescription>You made 265 sales this month.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[280px]">
                    <div className="space-y-4">
                      {recentSales.map((sale) => (
                        <div key={sale.email} className="flex items-center gap-4">
                          <Avatar className="size-9">
                            <AvatarImage src={`https://avatar.vercel.sh/${sale.email}`} />
                            <AvatarFallback>{sale.avatar}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-1">
                            <p className="font-medium text-sm leading-none">{sale.name}</p>
                            <p className="text-muted-foreground text-xs">{sale.email}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-sm">{sale.amount}</p>
                            <Badge
                              variant={sale.status === 'completed' ? 'success' : sale.status === 'pending' ? 'warning' : 'destructive'}
                              appearance="light"
                              className="mt-1"
                            >
                              {sale.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {/* Traffic Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Traffic Sources</CardTitle>
                  <CardDescription>Desktop vs Mobile traffic</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={trafficConfig} className="h-[250px] w-full">
                    <AreaChart accessibilityLayer data={trafficData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <ChartLegend content={<ChartLegendContent />} />
                      <Area type="natural" dataKey="desktop" stackId="a" stroke="var(--color-desktop)" fill="var(--color-desktop)" fillOpacity={0.4} />
                      <Area type="natural" dataKey="mobile" stackId="a" stroke="var(--color-mobile)" fill="var(--color-mobile)" fillOpacity={0.4} />
                    </AreaChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Tasks Card */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Tasks</CardTitle>
                    <CardDescription>Your pending tasks for today</CardDescription>
                  </div>
                  <Button size="sm" variant="ghost">
                    <Plus className="mr-1 size-4" /> Add Task
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {tasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between rounded-lg border p-3">
                        <div className="flex items-center gap-3">
                          <Checkbox checked={task.status === 'done'} />
                          <div>
                            <span className={`text-sm ${task.status === 'done' ? 'text-muted-foreground line-through' : ''}`}>
                              {task.title}
                            </span>
                            <p className="text-muted-foreground text-xs">{task.dueDate}</p>
                          </div>
                        </div>
                        <Badge
                          variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'warning' : 'success'}
                          appearance="light"
                        >
                          {task.priority}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <Separator className="my-4" />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">25%</span>
                  </div>
                  <Progress value={25} className="mt-2" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              {/* Pie Chart */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Sales by Category</CardTitle>
                    <CardDescription>Distribution of sales across categories</CardDescription>
                  </div>
                  <PieChartIcon className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <ChartContainer config={categoryConfig} className="mx-auto h-[300px] w-full">
                    <PieChart accessibilityLayer>
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Pie data={salesByCategory} dataKey="sales" nameKey="category" cx="50%" cy="50%" innerRadius={60} label />
                    </PieChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Line Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Trend</CardTitle>
                  <CardDescription>Revenue vs Profit over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={revenueConfig} className="h-[300px] w-full">
                    <LineChart accessibilityLayer data={revenueData} margin={{ left: 12, right: 12 }}>
                      <CartesianGrid vertical={false} />
                      <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                      <YAxis axisLine={false} tickLine={false} tickMargin={8} />
                      <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                      <ChartLegend content={<ChartLegendContent />} />
                      <Line dataKey="revenue" type="natural" stroke="var(--color-revenue)" strokeWidth={2} dot={{ r: 4 }} />
                      <Line dataKey="profit" type="natural" stroke="var(--color-profit)" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Radial Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Department Performance</CardTitle>
                  <CardDescription>Performance metrics by department</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={radialConfig} className="mx-auto h-[300px] w-full">
                    <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={performanceData.map((d, i) => ({ ...d, fill: `var(--chart-${i + 1})` }))}>
                      <ChartTooltip content={<ChartTooltipContent nameKey="metric" />} />
                      <RadialBar dataKey="value" background />
                    </RadialBarChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Radar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Team Comparison</CardTitle>
                  <CardDescription>Team A vs Team B performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={radarConfig} className="mx-auto h-[300px] w-full">
                    <RadarChart data={radarData}>
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis />
                      <Radar name="Team A" dataKey="A" stroke="var(--color-A)" fill="var(--color-A)" fillOpacity={0.5} />
                      <Radar name="Team B" dataKey="B" stroke="var(--color-B)" fill="var(--color-B)" fillOpacity={0.5} />
                      <ChartLegend content={<ChartLegendContent />} />
                    </RadarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Manage and track your orders</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                    <Input placeholder="Search orders..." className="w-[200px] pl-8" />
                  </div>
                  <Button size="sm" variant="default" appearance="outline">
                    <Filter className="mr-1 size-4" /> Filter
                  </Button>
                  <Button size="sm">
                    <Plus className="mr-1 size-4" /> New Order
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={ordersData}
                  columns={columns}
                  manualPagination={false}
                  manualFiltering={false}
                  defaultPageSize={5}
                  enableFullHeight={false}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-3">
              {/* Timeline */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Activity Timeline</CardTitle>
                  <CardDescription>Recent activities and events</CardDescription>
                </CardHeader>
                <CardContent>
                  <Timeline>
                    <TimelineItem
                      date="2026-04-12 10:30"
                      title="New Order Received"
                      description="Order #ORD-006 from customer Le Van F for $599.00"
                      icon={<ShoppingCart className="size-4" />}
                      status="completed"
                      iconColor="primary"
                    />
                    <TimelineItem
                      date="2026-04-12 09:15"
                      title="Payment Confirmed"
                      description="Payment of $299.00 confirmed for order #ORD-003"
                      icon={<CreditCard className="size-4" />}
                      status="completed"
                      iconColor="primary"
                    />
                    <TimelineItem
                      date="2026-04-12 08:00"
                      title="Order Shipped"
                      description="Order #ORD-002 shipped via Express Delivery"
                      icon={<Package className="size-4" />}
                      status="in-progress"
                      iconColor="secondary"
                    />
                    <TimelineItem
                      date="2026-04-11 16:45"
                      title="Stock Alert"
                      description="Product SKU-456 is running low on stock"
                      icon={<AlertCircle className="size-4" />}
                      status="pending"
                      iconColor="destructive"
                    />
                    <TimelineItem
                      date="2026-04-11 14:30"
                      title="New User Registered"
                      description="New customer registration from Ho Chi Minh City"
                      icon={<Users className="size-4" />}
                      status="completed"
                      iconColor="accent"
                    />
                  </Timeline>
                </CardContent>
              </Card>

              {/* Notifications & Settings */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="size-4" /> Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[200px]">
                      <div className="space-y-3">
                        {notifications.map((notif) => (
                          <div key={notif.id} className={`rounded-lg border p-3 ${!notif.read ? 'bg-muted/50' : ''}`}>
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-medium text-sm">{notif.title}</p>
                                <p className="text-muted-foreground text-xs">{notif.description}</p>
                              </div>
                              {!notif.read && <Badge variant="primary" className="size-2 rounded-full p-0" />}
                            </div>
                            <p className="mt-1 text-muted-foreground text-xs">{notif.time}</p>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notifications">Push Notifications</Label>
                      <Switch id="notifications" checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
                    </div>
                    <Separator />
                    <Accordion type="single" collapsible>
                      <AccordionItem value="theme">
                        <AccordionTrigger>Display Settings</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2 text-sm">
                            <p>Customize your dashboard appearance and layout preferences.</p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="export">
                        <AccordionTrigger>Export Options</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2 text-sm">
                            <p>Configure data export formats and scheduling.</p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" variant="default" appearance="outline">
                      <Settings className="mr-2 size-4" /> All Settings
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
}
