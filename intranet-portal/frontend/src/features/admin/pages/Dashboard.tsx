import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { dashboardApi } from '../../../api/dashboardApi';
import type { DashboardStats } from '../../../types';
import { useAuthStore } from '../../../store/authStore';
import { Users, Building2, Shield, Loader2 } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

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

  // Transform birimUserCounts for chart
  const chartData = stats?.birimUserCounts.map(b => ({
    name: b.birimAdi.length > 12 ? b.birimAdi.substring(0, 12) + '...' : b.birimAdi,
    value: b.userCount
  })) ?? [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 flex flex-col gap-8 w-full max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
            <h1 className="text-text-primary dark:text-dark-text-primary text-3xl font-black leading-tight tracking-tight">
              Hoş Geldiniz{user?.ad ? `, ${user.ad}` : ''}!
            </h1>
            <p className="text-text-secondary dark:text-dark-text-secondary text-base font-normal">Sistem genelindeki kritik bilgilere buradan hızla erişebilirsiniz.</p>
        </div>
        <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-text-secondary dark:text-dark-text-secondary cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700">
                <span className="material-symbols-outlined">notifications</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              {user?.ad?.charAt(0) ?? 'A'}
            </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card dark:bg-dark-card border border-border-color dark:border-dark-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-text-secondary dark:text-dark-text-secondary text-base font-medium">Toplam Kullanıcı</p>
              <Users className="w-5 h-5 text-primary" />
            </div>
            <p className="text-text-primary dark:text-dark-text-primary text-4xl font-bold mt-2">
              {stats?.totalUsers.toLocaleString('tr-TR') ?? '-'}
            </p>
            <p className="text-xs text-text-secondary dark:text-dark-text-secondary mt-1">
              {stats?.activeUsers ?? 0} aktif
            </p>
        </div>
        <div className="bg-card dark:bg-dark-card border border-border-color dark:border-dark-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-text-secondary dark:text-dark-text-secondary text-base font-medium">Aktif Birim</p>
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <p className="text-text-primary dark:text-dark-text-primary text-4xl font-bold mt-2">
              {stats?.activeBirimler ?? '-'}
            </p>
            <p className="text-xs text-text-secondary dark:text-dark-text-secondary mt-1">
              {stats?.totalBirimler ?? 0} toplam
            </p>
        </div>
        <div className="bg-card dark:bg-dark-card border border-border-color dark:border-dark-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-text-secondary dark:text-dark-text-secondary text-base font-medium">Toplam Rol</p>
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <p className="text-text-primary dark:text-dark-text-primary text-4xl font-bold mt-2">
              {stats?.totalRoles ?? '-'}
            </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card dark:bg-dark-card border border-border-color dark:border-dark-border rounded-xl p-6 shadow-sm">
            <div className="flex flex-col gap-1 mb-6">
                <p className="text-text-primary dark:text-dark-text-primary text-lg font-bold">Birimlere Göre Kullanıcı Dağılımı</p>
                <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold text-text-primary dark:text-dark-text-primary">
                      {stats?.totalUsers.toLocaleString('tr-TR') ?? 0} Toplam
                    </p>
                </div>
            </div>
            <div className="h-64 w-full">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12, fontWeight: 600}} dy={10}/>
                          <Tooltip
                              cursor={{fill: 'transparent'}}
                              contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: '#1E293B', color: '#F8FAFC'}}
                              itemStyle={{color: '#F8FAFC'}}
                          />
                          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                              {chartData.map((_, index: number) => (
                                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#BFDBFE' : '#3B82F6'} />
                              ))}
                          </Bar>
                      </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-text-secondary">
                    Henüz veri bulunmuyor
                  </div>
                )}
            </div>
        </div>

        <div className="bg-card dark:bg-dark-card border border-border-color dark:border-dark-border rounded-xl p-6 shadow-sm flex flex-col gap-6">
            <h3 className="text-text-primary dark:text-dark-text-primary text-lg font-bold">Son Sistem Aktiviteleri</h3>
            <div className="flex flex-col gap-4 overflow-y-auto max-h-64">
                {stats?.recentActivities && stats.recentActivities.length > 0 ? (
                  stats.recentActivities.map((activity) => (
                    <div key={activity.id} className="flex gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0 text-primary">
                            <span className="material-symbols-outlined text-sm">{activity.iconName}</span>
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm text-text-primary dark:text-dark-text-primary truncate">
                              <b>{activity.userFullName ?? 'Sistem'}</b> - {activity.action}
                            </p>
                            <p className="text-xs text-text-secondary dark:text-dark-text-secondary mt-1">{activity.timeAgo}</p>
                        </div>
                    </div>
                  ))
                ) : (
                  <div className="text-text-secondary text-sm">Henüz aktivite bulunmuyor</div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};
