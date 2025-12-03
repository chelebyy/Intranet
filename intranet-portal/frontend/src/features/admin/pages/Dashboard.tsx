import React, { useEffect, useState } from 'react';
import { dashboardApi } from '../../../api/dashboardApi';
import type { DashboardStats } from '../../../types';
import { useAuthStore } from '../../../store/authStore';
import { Users, Building2, Shield, Activity, ArrowUpRight, Loader2 } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    type ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { selectedBirim } = useAuthStore();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await dashboardApi.getStats();
        setStats(data);
      } catch (err) {
        console.error('Dashboard stats error:', err);
        setError('İstatistikler yüklenirken hata oluştu');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Transform data for chart
  const chartData = stats?.birimUserCounts.map(b => ({
    name: b.birimAdi,
    count: b.userCount,
  })) ?? [];

  const chartConfig = {
    count: {
      label: "Kullanıcı Sayısı",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
      return (
          <div className="flex h-full items-center justify-center text-destructive">
              {error}
          </div>
      );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between space-y-2">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <p className="text-muted-foreground">
                    {selectedBirim 
                        ? `${selectedBirim.birimAdi} birimi yönetim paneli.`
                        : 'Sistem genelindeki kritik veriler ve istatistikler.'}
                </p>
            </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Toplam Kullanıcı</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats?.totalUsers.toLocaleString('tr-TR')}</div>
                    <p className="text-xs text-muted-foreground">
                        {stats?.activeUsers} aktif kullanıcı
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Aktif Birim</CardTitle>
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats?.activeBirimler}</div>
                    <p className="text-xs text-muted-foreground">
                        Toplam {stats?.totalBirimler} birim arasından
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Toplam Rol</CardTitle>
                    <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats?.totalRoles}</div>
                    <p className="text-xs text-muted-foreground">
                        Sistemde tanımlı rol sayısı
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sistem Aktivitesi</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-600 flex items-center gap-1">
                        %99.9 <ArrowUpRight className="h-4 w-4" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Tüm servisler çalışıyor
                    </p>
                </CardContent>
            </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Chart */}
            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>Kullanıcı Dağılımı</CardTitle>
                    <CardDescription>
                        Birimlere göre kullanıcı sayılarının dağılımı.
                    </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                    <ChartContainer config={chartConfig} className="min-h-[300px] max-h-[350px] w-full">
                        <BarChart accessibilityLayer data={chartData}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="name"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) => value.slice(0, 10)}
                            />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="count" fill="var(--color-count)" radius={4} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card className="col-span-3">
                <CardHeader>
                    <CardTitle>Son Aktiviteler</CardTitle>
                    <CardDescription>
                        Sistemde gerçekleşen son işlemler.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[350px] pr-4">
                        <div className="space-y-8">
                            {stats?.recentActivities?.map((activity) => (
                                <div key={activity.id} className="flex items-center">
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src="/avatars/01.png" alt="Avatar" />
                                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                                            {activity.userFullName?.[0] || 'S'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">{activity.userFullName || 'Sistem'}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {activity.action}
                                        </p>
                                    </div>
                                    <div className="ml-auto font-medium text-xs text-muted-foreground">
                                        {activity.timeAgo}
                                    </div>
                                </div>
                            ))}
                            {(!stats?.recentActivities || stats.recentActivities.length === 0) && (
                                <div className="text-center text-muted-foreground text-sm py-8">
                                    Henüz aktivite bulunmuyor.
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    </div>
  );
};
