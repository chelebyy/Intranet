import React, { useCallback, useEffect, useState } from 'react';
import {
    Database,
    RefreshCw,
    Activity,
    HardDrive,
    List,
    AlertTriangle,
    Play,
    Check,
    X,
    Clock
} from 'lucide-react';
import { maintenanceApi } from '../../../api/maintenanceApi';
import type { MaintenanceStats, TableStats } from '../../../api/maintenanceApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import toast from 'react-hot-toast';

export const MaintenancePage: React.FC = () => {
    const [stats, setStats] = useState<MaintenanceStats | null>(null);
    const [tables, setTables] = useState<TableStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [operationRunning, setOperationRunning] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState<{
        open: boolean;
        operation: string;
        tableName?: string;
        warning?: string;
    }>({ open: false, operation: '' });

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [statsRes, tablesRes] = await Promise.all([
                maintenanceApi.getStats(),
                maintenanceApi.getTableStats()
            ]);
            setStats(statsRes.data.data ?? null);
            setTables(tablesRes.data.data ?? []);
        } catch (error) {
            console.error('Error fetching maintenance data:', error);
            toast.error('Bakım verileri yüklenirken hata oluştu');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleToggleMaintenance = async () => {
        if (!stats) return;

        try {
            const newState = !stats.isManualMaintenanceEnabled;
            // Default message if enabling
            const message = newState ? 'Sistem bakım nedeniyle geçici olarak hizmet dışıdır.' : undefined;

            const response = await maintenanceApi.toggleMaintenanceMode(newState, message);

            if (response.data.success) {
                toast.success(newState ? 'Bakım modu aktif edildi' : 'Bakım modu kapatıldı');
                fetchData(); // Refresh state
            } else {
                toast.error(response.data.message || 'İşlem başarısız');
            }
        } catch (error) {
            console.error('Toggle maintenance failed:', error);
            toast.error('Bakım modu değiştirilemedi');
        }
    };

    const handleScheduleMaintenance = async (cancel: boolean, date?: string, message?: string) => {
        try {
            const response = await maintenanceApi.scheduleMaintenance(
                cancel ? null : (date || null), 
                message, 
                cancel
            );
            if (response.data.success) {
                toast.success(cancel ? 'Planlı bakım iptal edildi' : 'Bakım planlandı');
                fetchData();
            } else {
                toast.error(response.data.message || 'İşlem başarısız');
            }
        } catch (error) {
            console.error("Failed to schedule maintenance", error);
            toast.error('İşlem başarısız');
        }
    };

    const runOperation = async (operation: string, tableName?: string) => {
        setConfirmDialog({ open: false, operation: '' });
        setOperationRunning(true);

        try {
            let response;
            switch (operation) {
                case 'vacuum':
                    response = await maintenanceApi.runVacuum(tableName);
                    break;
                case 'vacuum-full':
                    response = await maintenanceApi.runVacuumFull(tableName);
                    break;
                case 'analyze':
                    response = await maintenanceApi.runAnalyze(tableName);
                    break;
                case 'reindex':
                    response = await maintenanceApi.runReindex(tableName);
                    break;
                default:
                    throw new Error('Unknown operation');
            }

            const result = response?.data?.data;
            if (result?.success) {
                toast.success(result.message);
                await fetchData(); // Refresh data after operation
            } else {
                toast.error(result?.message ?? 'Bakım işlemi başarısız oldu');
            }
        } catch (error: unknown) {
            console.error('Maintenance operation failed:', error);
            const errorMessage = error instanceof Error ? error.message : 'Bakım işlemi başarısız oldu';
            toast.error(errorMessage);
        } finally {
            setOperationRunning(false);
        }
    };


    const openConfirmDialog = (operation: string, tableName?: string, warning?: string) => {
        setConfirmDialog({
            open: true,
            operation,
            tableName,
            warning
        });
    };

    const getOperationLabel = (operation: string) => {
        switch (operation) {
            case 'vacuum': return 'VACUUM';
            case 'vacuum-full': return 'VACUUM FULL';
            case 'analyze': return 'ANALYZE';
            case 'reindex': return 'REINDEX';
            default: return operation.toUpperCase();
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Hiç';
        return new Date(dateString).toLocaleString('tr-TR');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Veritabanı Bakım</h1>
                    <p className="text-muted-foreground">
                        PostgreSQL veritabanı bakım ve optimizasyon işlemleri
                    </p>
                </div>
                <Button
                    variant="outline"
                    onClick={fetchData}
                    disabled={loading || operationRunning}
                >
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Yenile
                </Button>
            </div>

            {/* Manual Maintenance Mode Card */}
            <Card className={`${stats?.isManualMaintenanceEnabled ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10' : ''}`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="space-y-1">
                        <CardTitle className="text-base font-medium">
                            Manuel Bakım Modu
                        </CardTitle>
                        <CardDescription>
                            Sistem bakımdayken sadece yöneticiler giriş yapabilir.
                        </CardDescription>
                    </div>
                    {stats?.isManualMaintenanceEnabled && (
                        <div className="flex items-center text-yellow-600 dark:text-yellow-500 font-bold px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 rounded-full text-xs">
                            <AlertTriangle className="mr-1 h-3 w-3" />
                            BAKIM MODU AKTİF
                        </div>
                    )}
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between mt-2">
                        <div className="text-sm text-muted-foreground">
                            {stats?.isManualMaintenanceEnabled
                                ? `Aktif Mesaj: "${stats.maintenanceMessage || 'Belirtilmedi'}"`
                                : "Sistem normal çalışıyor."}
                        </div>
                        <Button
                            variant={stats?.isManualMaintenanceEnabled ? "default" : "secondary"}
                            onClick={handleToggleMaintenance}
                        >
                            {stats?.isManualMaintenanceEnabled ? 'Bakım Modunu Kapat' : 'Bakım Modunu Aç'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Planlı Bakım Zamanlayıcı */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-500" />
                    Planlı Bakım Zamanlayıcı
                </h2>
                <div className="space-y-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-lg text-sm">
                        <div className="font-semibold mb-1">Bilgilendirme</div>
                        Planlı bakım zamanı ayarladığınızda, kullanıcılara sayaçlı bir uyarı bandı gösterilir. 
                        Belirlenen süre dolana kadar sistem çalışmaya devam eder.
                    </div>

                    {stats?.scheduledMaintenanceTime ? (
                        <div className="flex items-center justify-between p-4 border border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50/50 dark:bg-blue-900/10">
                            <div>
                                <div className="text-sm font-medium text-slate-500">Planlanan Tarih</div>
                                <div className="text-lg font-bold text-blue-600">
                                    {new Date(stats.scheduledMaintenanceTime).toLocaleString('tr-TR')}
                                </div>
                                <div className="text-sm text-slate-600 mt-1">"{stats.scheduledMaintenanceMessage}"</div>
                            </div>
                            <Button 
                                variant="destructive" 
                                onClick={() => handleScheduleMaintenance(true)}
                            >
                                Planı İptal Et
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <Label>Bakım Tarihi ve Saati</Label>
                                <Input 
                                    type="datetime-local" 
                                    className="mt-1"
                                    id="scheduledTime"
                                />
                            </div>
                            <div>
                                <Label>Duyuru Mesajı</Label>
                                <Input 
                                    placeholder="Örn: 23:00'da sunucu güncellemesi yapılacaktır." 
                                    className="mt-1"
                                    id="scheduledMessage"
                                    defaultValue="Sistem bakım çalışması nedeniyle kısa süre kapalı kalacaktır."
                                />
                            </div>
                            <Button 
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={() => {
                                    const dateVal = (document.getElementById('scheduledTime') as HTMLInputElement).value;
                                    const msgVal = (document.getElementById('scheduledMessage') as HTMLInputElement).value;
                                    if(!dateVal) {
                                        toast.error('Lütfen tarih seçiniz');
                                        return;
                                    }
                                    handleScheduleMaintenance(false, dateVal, msgVal);
                                }}
                            >
                                Bakımı Planla
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Veritabanı Boyutu</CardTitle>
                        <Database className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.databaseSize || '0 B'}</div>
                        <p className="text-xs text-muted-foreground">{stats?.databaseName}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tablolar / İndeksler</CardTitle>
                        <List className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats?.totalTables} / {stats?.totalIndexes}
                        </div>
                        <p className="text-xs text-muted-foreground">Tablo ve index sayısı</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ölü Kayıtlar</CardTitle>
                        <AlertTriangle className={`h-4 w-4 ${(stats?.totalDeadTuples || 0) > 10000 ? 'text-amber-500' : 'text-muted-foreground'}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalDeadTuples?.toLocaleString('tr-TR') || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            Canlı: {stats?.totalLiveTuples?.toLocaleString('tr-TR') || 0}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Aktif Bağlantılar</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.activeConnections || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            Son bakım: {formatDate(stats?.lastMaintenanceDate || null)}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Hızlı İşlemler</CardTitle>
                    <CardDescription>
                        Tüm veritabanı üzerinde bakım işlemleri
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-3">
                        <Button
                            onClick={() => openConfirmDialog('vacuum')}
                            disabled={operationRunning || stats?.isMaintenanceRunning}
                            className="flex items-center gap-2"
                        >
                            <HardDrive className="h-4 w-4" />
                            VACUUM
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => openConfirmDialog('vacuum-full', undefined, 'VACUUM FULL tüm tabloları kilitler ve uzun sürebilir!')}
                            disabled={operationRunning || stats?.isMaintenanceRunning}
                            className="flex items-center gap-2"
                        >
                            <HardDrive className="h-4 w-4" />
                            VACUUM FULL
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => openConfirmDialog('analyze')}
                            disabled={operationRunning || stats?.isMaintenanceRunning}
                            className="flex items-center gap-2"
                        >
                            <Activity className="h-4 w-4" />
                            ANALYZE
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => openConfirmDialog('reindex', undefined, 'REINDEX tüm indeksleri yeniden oluşturur ve uzun sürebilir!')}
                            disabled={operationRunning || stats?.isMaintenanceRunning}
                            className="flex items-center gap-2"
                        >
                            <RefreshCw className="h-4 w-4" />
                            REINDEX
                        </Button>
                    </div>
                    {stats?.isMaintenanceRunning && (
                        <div className="mt-4 flex items-center gap-2 text-amber-600">
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            <span>Bir bakım işlemi çalışıyor...</span>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Tables List */}
            <Card>
                <CardHeader>
                    <CardTitle>Tablo Durumları</CardTitle>
                    <CardDescription>
                        Her tablo için istatistik ve bakım geçmişi
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[400px]">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Tablo</TableHead>
                                    <TableHead>Boyut</TableHead>
                                    <TableHead>Index Boyutu</TableHead>
                                    <TableHead>Canlı / Ölü</TableHead>
                                    <TableHead>Durum</TableHead>
                                    <TableHead>Son VACUUM</TableHead>
                                    <TableHead>Son ANALYZE</TableHead>
                                    <TableHead className="text-right">İşlemler</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tables.map((table) => (
                                    <TableRow key={`${table.schemaName}.${table.tableName}`}>
                                        <TableCell className="font-medium">
                                            {table.tableName}
                                        </TableCell>
                                        <TableCell>{table.tableSize}</TableCell>
                                        <TableCell>{table.indexSize}</TableCell>
                                        <TableCell>
                                            {table.liveTuples.toLocaleString('tr-TR')} / {table.deadTuples.toLocaleString('tr-TR')}
                                            <span className="text-xs text-muted-foreground ml-1">
                                                ({table.deadTuplePercentage}%)
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {table.needsMaintenance ? (
                                                <span className="inline-flex items-center gap-1 text-amber-600">
                                                    <AlertTriangle className="h-4 w-4" />
                                                    Bakım Önerilir
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-green-600">
                                                    <Check className="h-4 w-4" />
                                                    İyi
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-3 w-3 text-muted-foreground" />
                                                <span className="text-xs">
                                                    {formatDate(table.lastVacuum || table.lastAutoVacuum)}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-3 w-3 text-muted-foreground" />
                                                <span className="text-xs">
                                                    {formatDate(table.lastAnalyze || table.lastAutoAnalyze)}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => openConfirmDialog('vacuum', table.tableName)}
                                                    disabled={operationRunning || stats?.isMaintenanceRunning}
                                                    title="VACUUM"
                                                >
                                                    <Play className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => openConfirmDialog('analyze', table.tableName)}
                                                    disabled={operationRunning || stats?.isMaintenanceRunning}
                                                    title="ANALYZE"
                                                >
                                                    <Activity className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {tables.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                                            Hiç tablo bulunamadı
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </CardContent>
            </Card>

            {/* Confirmation Dialog */}
            <Dialog open={confirmDialog.open} onOpenChange={(open: boolean) => setConfirmDialog({ ...confirmDialog, open })}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>İşlemi Onayla</DialogTitle>
                        <DialogDescription>
                            {confirmDialog.tableName
                                ? `"${confirmDialog.tableName}" tablosu üzerinde ${getOperationLabel(confirmDialog.operation)} işlemi başlatılacak.`
                                : `Tüm veritabanı üzerinde ${getOperationLabel(confirmDialog.operation)} işlemi başlatılacak.`
                            }
                        </DialogDescription>
                    </DialogHeader>
                    {confirmDialog.warning && (
                        <div className="bg-amber-50 border border-amber-200 rounded-md p-3 flex items-start gap-2">
                            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                            <p className="text-sm text-amber-800">{confirmDialog.warning}</p>
                        </div>
                    )}
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setConfirmDialog({ open: false, operation: '' })}
                        >
                            <X className="h-4 w-4 mr-2" />
                            İptal
                        </Button>
                        <Button
                            onClick={() => runOperation(confirmDialog.operation, confirmDialog.tableName)}
                            disabled={operationRunning}
                        >
                            {operationRunning ? (
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                                <Check className="h-4 w-4 mr-2" />
                            )}
                            Başlat
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default MaintenancePage;
