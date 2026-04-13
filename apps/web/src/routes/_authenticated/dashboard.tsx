import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import {
  Users,
  DollarSign,
  Activity,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Download,
  Filter,
} from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

// UI Components
import { Button } from '@masan-group/shared-ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
} from '@masan-group/shared-ui/card';
import { Badge } from '@masan-group/shared-ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@masan-group/shared-ui/avatar';
import { Progress } from '@masan-group/shared-ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@masan-group/shared-ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@masan-group/shared-ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@masan-group/shared-ui/dropdown-menu';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@masan-group/shared-ui/chart';
import { DataTable, useColumns } from '@masan-group/shared-ui/data-table';
import type { ColumnConfig } from '@masan-group/shared-ui/data-table';
import { TooltipProvider } from '@masan-group/shared-ui/tooltip';

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: DashboardPage,
});

// Chart data
const revenueData = [
  { month: 'Jan', revenue: 4000, expenses: 2400 },
  { month: 'Feb', revenue: 3000, expenses: 1398 },
  { month: 'Mar', revenue: 5000, expenses: 3800 },
  { month: 'Apr', revenue: 4780, expenses: 3908 },
  { month: 'May', revenue: 5890, expenses: 4800 },
  { month: 'Jun', revenue: 6390, expenses: 3800 },
];

const trafficData = [
  { day: 'Mon', visitors: 2400 },
  { day: 'Tue', visitors: 1398 },
  { day: 'Wed', visitors: 3800 },
  { day: 'Thu', visitors: 3908 },
  { day: 'Fri', visitors: 4800 },
  { day: 'Sat', visitors: 3800 },
  { day: 'Sun', visitors: 4300 },
];

const revenueConfig = {
  revenue: { label: 'Revenue', color: 'var(--chart-1)' },
  expenses: { label: 'Expenses', color: 'var(--chart-2)' },
} satisfies ChartConfig;

const trafficConfig = {
  visitors: { label: 'Visitors', color: 'var(--chart-3)' },
} satisfies ChartConfig;

// Recent orders data
type Order = {
  id: string;
  customer: string;
  email: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  amount: number;
  date: string;
};

const recentOrders: Order[] = [
  { id: 'ORD-001', customer: 'John Doe', email: 'john@example.com', status: 'completed', amount: 250.00, date: '2026-04-12' },
  { id: 'ORD-002', customer: 'Jane Smith', email: 'jane@example.com', status: 'processing', amount: 150.00, date: '2026-04-11' },
  { id: 'ORD-003', customer: 'Bob Johnson', email: 'bob@example.com', status: 'pending', amount: 350.00, date: '2026-04-11' },
  { id: 'ORD-004', customer: 'Alice Brown', email: 'alice@example.com', status: 'completed', amount: 450.00, date: '2026-04-10' },
  { id: 'ORD-005', customer: 'Charlie Wilson', email: 'charlie@example.com', status: 'cancelled', amount: 200.00, date: '2026-04-10' },
];

// Team activity data
const teamActivity = [
  { name: 'Sarah Connor', action: 'completed task', target: 'Design Review', time: '2 min ago', avatar: 'SC' },
  { name: 'Mike Ross', action: 'commented on', target: 'Sprint Planning', time: '15 min ago', avatar: 'MR' },
  { name: 'Rachel Green', action: 'uploaded', target: 'Q1 Report.pdf', time: '1 hour ago', avatar: 'RG' },
  { name: 'David Kim', action: 'assigned to', target: 'Bug Fix #234', time: '3 hours ago', avatar: 'DK' },
];

// Stats cards data
const statsCards = [
  { title: 'Total Users', value: '45,231', change: '+12.5%', trend: 'up', icon: Users },
  { title: 'Revenue', value: '$89,432', change: '+8.2%', trend: 'up', icon: DollarSign },
  { title: 'Active Sessions', value: '2,345', change: '-3.1%', trend: 'down', icon: Activity },
  { title: 'Conversion Rate', value: '3.24%', change: '+2.4%', trend: 'up', icon: TrendingUp },
];

// Project progress data
const projects = [
  { name: 'Website Redesign', progress: 75, status: 'On Track' },
  { name: 'Mobile App', progress: 45, status: 'In Progress' },
  { name: 'API Integration', progress: 90, status: 'Almost Done' },
  { name: 'Database Migration', progress: 30, status: 'Delayed' },
];

function DashboardPage() {
  const [timeRange, setTimeRange] = useState('7d');

  const orderColumns: ColumnConfig<Order>[] = [
    { accessorKey: 'id', title: 'Order ID', size: 100 },
    { accessorKey: 'customer', title: 'Customer', size: 150 },
    {
      accessorKey: 'status',
      title: 'Status',
      size: 120,
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        const variant = status === 'completed' ? 'success' : status === 'cancelled' ? 'destructive' : status === 'processing' ? 'warning' : 'primary';
        return <Badge variant={variant} appearance="light">{status}</Badge>;
      },
    },
    {
      accessorKey: 'amount',
      title: 'Amount',
      size: 100,
      cell: ({ row }) => `$${(row.getValue('amount') as number).toFixed(2)}`,
    },
    { accessorKey: 'date', title: 'Date', size: 100 },
  ];

  const columns = useColumns<Order>(orderColumns);

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-bold text-2xl tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here&apos;s your overview.</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="default" appearance="outline" size="sm">
              <Filter className="mr-2 size-4" />
              Filter
            </Button>
            <Button variant="default" size="sm">
              <Download className="mr-2 size-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statsCards.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="font-medium text-muted-foreground text-sm">
                  {stat.title}
                </CardTitle>
                <stat.icon className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl">{stat.value}</div>
                <div className="flex items-center gap-1 text-xs">
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="size-3 text-success" />
                  ) : (
                    <ArrowDownRight className="size-3 text-destructive" />
                  )}
                  <span className={stat.trend === 'up' ? 'text-success' : 'text-destructive'}>
                    {stat.change}
                  </span>
                  <span className="text-muted-foreground">from last period</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid gap-4 lg:grid-cols-7">
          {/* Revenue Chart */}
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>Monthly revenue vs expenses</CardDescription>
              <CardAction>
                <DropdownMenu>
                  <DropdownMenuTrigger render={(props) => (
                    <Button {...props} variant="ghost" size="icon-sm">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  )} />
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Download Report</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardAction>
            </CardHeader>
            <CardContent>
              <ChartContainer config={revenueConfig} className="h-[300px] w-full">
                <BarChart accessibilityLayer data={revenueData}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" fill="var(--color-expenses)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Traffic Chart */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Website Traffic</CardTitle>
              <CardDescription>Daily visitors this week</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={trafficConfig} className="h-[300px] w-full">
                <LineChart accessibilityLayer data={trafficData}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    dataKey="visitors"
                    type="natural"
                    stroke="var(--color-visitors)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="orders" className="w-full">
          <TabsList>
            <TabsTrigger value="orders">Recent Orders</TabsTrigger>
            <TabsTrigger value="activity">Team Activity</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest customer orders and their status</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={recentOrders}
                  columns={columns}
                  manualPagination={false}
                  manualFiltering={false}
                  defaultPageSize={5}
                  enableFullHeight={false}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Team Activity</CardTitle>
                <CardDescription>Recent actions by your team members</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  {teamActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src="" />
                        <AvatarFallback>{activity.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-medium">{activity.name}</span>{' '}
                          <span className="text-muted-foreground">{activity.action}</span>{' '}
                          <span className="font-medium">{activity.target}</span>
                        </p>
                        <p className="text-muted-foreground text-xs">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Projects</CardTitle>
                <CardDescription>Track progress of ongoing projects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-6">
                  {projects.map((project) => (
                    <div key={project.name} className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{project.name}</span>
                        <Badge
                          variant={project.status === 'Delayed' ? 'destructive' : project.status === 'Almost Done' ? 'success' : 'primary'}
                          appearance="light"
                        >
                          {project.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={project.progress} className="flex-1" />
                        <span className="text-muted-foreground text-sm">{project.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
}
