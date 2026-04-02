import React, { useEffect, useMemo, useState } from 'react';
import { auditLogApi, type AuditLogItem } from '../../../api/auditLogApi';
import toast from 'react-hot-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart3, History, Loader2, RefreshCw, Shield, Users } from 'lucide-react';

export const Reports: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const result = await auditLogApi.getAll({ page: 1, pageSize: 100 });
      setLogs(result.items);
    } catch (error) {
      console.error('Reports load error:', error);
      toast.error('Rapor verileri yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const summary = useMemo(() => {
    const uniqueUsers = new Set(logs.map(log => log.userID).filter(Boolean));
    const uniqueBirims = new Set(logs.map(log => log.birimID).filter(Boolean));

    const actionCounts = logs.reduce<Record<string, number>>((acc, log) => {
      acc[log.action] = (acc[log.action] ?? 0) + 1;
      return acc;
    }, {});

    const topActions = Object.entries(actionCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return {
      totalLogs: logs.length,
      uniqueUsers: uniqueUsers.size,
      uniqueBirims: uniqueBirims.size,
      latestLogAt: logs[0]?.tarihSaat ?? null,
      topActions,
    };
  }, [logs]);

  const formatDate = (value: string | null) => {
    if (!value) return 'Henüz yok';
    return new Date(value).toLocaleString('tr-TR');
  };

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Raporlar</h2>
          <p className="text-muted-foreground">
            Son 100 audit kaydı üzerinden hızlı sistem raporu.
          </p>
        </div>
        <Button variant="outline" onClick={fetchLogs} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Yenile
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Toplam Kayıt</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-2xl font-bold">{summary.totalLogs}</div>
            <History className="h-5 w-5 text-muted-foreground" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">İşlem Yapan Kullanıcı</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-2xl font-bold">{summary.uniqueUsers}</div>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Etkilenen Birim</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-2xl font-bold">{summary.uniqueBirims}</div>
            <Shield className="h-5 w-5 text-muted-foreground" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Son Kayıt</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between gap-4">
            <div className="text-sm font-medium">{formatDate(summary.latestLogAt)}</div>
            <BarChart3 className="h-5 w-5 text-muted-foreground shrink-0" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-5">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>En Sık İşlemler</CardTitle>
            <CardDescription>Son 100 kayıt içindeki işlem dağılımı</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {summary.topActions.length === 0 ? (
              <div className="text-sm text-muted-foreground">Gösterilecek veri bulunamadı.</div>
            ) : (
              summary.topActions.map(([action, count]) => (
                <div key={action} className="flex items-center justify-between rounded-md border p-3">
                  <span className="font-medium">{action}</span>
                  <Badge variant="secondary">{count}</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="xl:col-span-3">
          <CardHeader>
            <CardTitle>Son Kayıtlar</CardTitle>
            <CardDescription>En güncel audit hareketleri</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tarih</TableHead>
                    <TableHead>Kullanıcı</TableHead>
                    <TableHead>İşlem</TableHead>
                    <TableHead>Birim</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.slice(0, 10).map((log) => (
                    <TableRow key={log.logID}>
                      <TableCell>{formatDate(log.tarihSaat)}</TableCell>
                      <TableCell>{log.userName || 'Sistem'}</TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell>{log.birimName || '-'}</TableCell>
                    </TableRow>
                  ))}
                  {logs.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        Kayıt bulunamadı.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
