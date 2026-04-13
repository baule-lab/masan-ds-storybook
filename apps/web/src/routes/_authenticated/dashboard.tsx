import { createFileRoute } from '@tanstack/react-router';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@masan-group/shared-ui/card';
import { Badge } from '@masan-group/shared-ui/badge';
import { Progress } from '@masan-group/shared-ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@masan-group/shared-ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@masan-group/shared-ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@masan-group/shared-ui/select';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@masan-group/shared-ui/chart';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, Pie, PieChart, XAxis, YAxis } from 'recharts';
import { TrendingUp, TrendingDown, Users, DollarSign, Activity, ShoppingCart } from 'lucide-react';

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: DashboardPage,
});

// Chart Data
const revenueData = [
  { month: 'Jan', revenue: 4000, orders: 240 },
  { month: 'Feb', revenue: 3000, orders: 198 },
  { month: 'Mar', revenue: 5000, orders: 320 },
  { month: 'Apr', revenue: 4500, orders: 278 },
  { month: 'May', revenue: 6000, orders: 389 },
  { month: 'Jun', revenue: 5500, orders: 349 },
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

const revenueConfig = {
  revenue: { label: 'Revenue', color: 'var(--chart-1)' },
  orders: { label: 'Orders', color: 'var(--chart-2)' },
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

const recentSales = [
  { name: 'Nguyen Van A', email: 'nguyenvana@email.com', amount: '+$1,999.00', avatar: 'NV' },
  { name: 'Tran Thi B', email: 'tranthib@email.com', amount: '+$39.00', avatar: 'TT' },
  { name: 'Le Van C', email: 'levanc@email.com', amount: '+$299.00', avatar: 'LV' },
  { name: 'Pham Thi D', email: 'phamthid@email.com', amount: '+$99.00', avatar: 'PT' },
  { name: 'Hoang Van E', email: 'hoangvane@email.com', amount: '+$450.00', avatar: 'HV' },
];

const tasks = [
  { title: 'Review new orders', status: 'in-progress', priority: 'high' },
  { title: 'Update product inventory', status: 'todo', priority: 'medium' },
  { title: 'Prepare monthly report', status: 'done', priority: 'low' },
  { title: 'Contact suppliers', status: 'todo', priority: 'high' },
];

function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-bold text-2xl tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your business performance.</p>
        </div>
        <Select defaultValue="7d">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Last 24 hours</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

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
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-7">
            {/* Revenue Chart */}
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Monthly revenue and orders for 2026</CardDescription>
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

            {/* Recent Sales */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
                <CardDescription>You made 265 sales this month.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentSales.map((sale) => (
                    <div key={sale.email} className="flex items-center gap-4">
                      <Avatar className="size-9">
                        <AvatarImage src={`https://avatar.vercel.sh/${sale.email}`} />
                        <AvatarFallback>{sale.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <p className="font-medium text-sm leading-none">{sale.name}</p>
                        <p className="text-muted-foreground text-sm">{sale.email}</p>
                      </div>
                      <div className="font-medium">{sale.amount}</div>
                    </div>
                  ))}
                </div>
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
                    <Area
                      type="natural"
                      dataKey="desktop"
                      stackId="a"
                      stroke="var(--color-desktop)"
                      fill="var(--color-desktop)"
                      fillOpacity={0.4}
                    />
                    <Area
                      type="natural"
                      dataKey="mobile"
                      stackId="a"
                      stroke="var(--color-mobile)"
                      fill="var(--color-mobile)"
                      fillOpacity={0.4}
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Tasks Card */}
            <Card>
              <CardHeader>
                <CardTitle>Tasks</CardTitle>
                <CardDescription>Your pending tasks for today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div key={task.title} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`size-2 rounded-full ${
                            task.status === 'done'
                              ? 'bg-green-500'
                              : task.status === 'in-progress'
                                ? 'bg-yellow-500'
                                : 'bg-gray-400'
                          }`}
                        />
                        <span
                          className={`text-sm ${task.status === 'done' ? 'text-muted-foreground line-through' : ''}`}
                        >
                          {task.title}
                        </span>
                      </div>
                      <Badge
                        variant={
                          task.priority === 'high'
                            ? 'destructive'
                            : task.priority === 'medium'
                              ? 'warning'
                              : 'success'
                        }
                        appearance="light"
                      >
                        {task.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">25%</span>
                  </div>
                  <Progress value={25} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Sales by Category Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
                <CardDescription>Distribution of sales across categories</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={categoryConfig} className="mx-auto h-[300px] w-full">
                  <PieChart accessibilityLayer>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Pie
                      data={salesByCategory}
                      dataKey="sales"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      label={({ category, sales }) => `${category}: $${sales}`}
                    />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Line Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Trend</CardTitle>
                <CardDescription>Revenue trend over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={revenueConfig} className="h-[300px] w-full">
                  <LineChart accessibilityLayer data={revenueData} margin={{ left: 12, right: 12 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                    <YAxis axisLine={false} tickLine={false} tickMargin={8} />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                    <Line
                      dataKey="revenue"
                      type="natural"
                      stroke="var(--color-revenue)"
                      strokeWidth={2}
                      dot={{ r: 4, fill: 'var(--color-revenue)' }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
