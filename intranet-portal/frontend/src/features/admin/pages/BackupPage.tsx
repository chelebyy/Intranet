import React, { useState, useEffect } from 'react';
import { backupApi } from '../../../api/backupApi';
import type { BackupFile, BackupStats } from '../../../api/backupApi';
import toast from 'react-hot-toast';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Database,
    Download,
    Trash2,
    RefreshCw,
    Clock,
    HardDrive,
    FileArchive,
    Terminal,
    Loader2,
    Check,
    X
} from 'lucide-react';
import AnimatedBadge from "@/components/ui/animated-badge";

// Render table content based on state
function renderTableContent(
    loading: boolean,
    backups: BackupFile[],
    deleteConfirm: string | null,
    setDeleteConfirm: (value: string | null) => void,
    handleDownload: (fileName: string) => void,
    handleDelete: (fileName: string) => void,
    formatDate: (dateStr: string) => string
) {
    if (loading) {
        return (
            <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                    <div className="flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <span className="ml-2 text-muted-foreground">Yükleniyor...</span>
                    </div>
                </TableCell>
            </TableRow>
        );
    }

    if (backups.length === 0) {
        return (
            <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Database className="h-8 w-8 mb-2" />
                        Henüz yedek dosyası bulunmuyor
                    </div>
                </TableCell>
            </TableRow>
        );
    }

    return backups.map((backup) => (
        <TableRow key={backup.fileName} className="group">
            <TableCell className="font-mono text-sm">
                <div className="flex items-center gap-2">
                    <FileArchive className="h-4 w-4 text-muted-foreground" />
                    {backup.fileName}
                </div>
            </TableCell>
            <TableCell>{backup.sizeFormatted}</TableCell>
            <TableCell className="text-muted-foreground text-sm">
                {formatDate(backup.createdAt)}
            </TableCell>
            <TableCell className="text-right">
                {deleteConfirm === backup.fileName ? (
                    <div className="flex items-center justify-end gap-2">
                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(backup.fileName)}
                            className="h-8 px-2"
                        >
                            <Check className="h-4 w-4 mr-1" /> Onayla
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setDeleteConfirm(null)}
                            className="h-8 px-2"
                        >
                            <X className="h-4 w-4 mr-1" /> İptal
                        </Button>
                    </div>
                ) : (
                    <div className="flex items-center justify-end gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDownload(backup.fileName)}
                            title="İndir"
                            className="h-8 w-8"
                        >
                            <Download className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteConfirm(backup.fileName)}
                            title="Sil"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </TableCell>
        </TableRow>
    ));
}

export const BackupPage: React.FC = () => {
    const [backups, setBackups] = useState<BackupFile[]>([]);
    const [stats, setStats] = useState<BackupStats | null>(null);
    const [logs, setLogs] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [triggering, setTriggering] = useState(false);
    const [showLogs, setShowLogs] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [backupsRes, statsRes] = await Promise.all([
                backupApi.getBackups(),
                backupApi.getStats()
            ]);

            if (backupsRes.data.success && backupsRes.data.data) {
                setBackups(backupsRes.data.data);
            }
            if (statsRes.data.success && statsRes.data.data) {
                setStats(statsRes.data.data);
            }
        } catch (error) {
            console.error('Yedekler yüklenirken hata:', error);
            toast.error('Yedekler yüklenemedi');
        } finally {
            setLoading(false);
        }
    };

    const handleTriggerBackup = async () => {
        try {
            setTriggering(true);
            toast.loading('Yedekleme başlatılıyor...', { id: 'backup' });

            const response = await backupApi.triggerBackup();

            if (response.data.success && response.data.data?.success) {
                toast.success('Yedekleme başarıyla tamamlandı!', { id: 'backup' });
                fetchData(); // Listeyi yenile
            } else {
                toast.error(response.data.data?.message || 'Yedekleme başarısız', { id: 'backup' });
            }
        } catch (error) {
            console.error('Yedekleme hatası:', error);
            toast.error('Yedekleme işlemi başarısız oldu', { id: 'backup' });
        } finally {
            setTriggering(false);
        }
    };

    const handleDownload = async (fileName: string) => {
        try {
            toast.loading('İndiriliyor...', { id: 'download' });
            await backupApi.downloadBackup(fileName);
            toast.success('İndirme başarılı', { id: 'download' });
        } catch (error) {
            console.error('İndirme hatası:', error);
            toast.error('Dosya indirilemedi', { id: 'download' });
        }
    };

    const handleDelete = async (fileName: string) => {
        try {
            const response = await backupApi.deleteBackup(fileName);
            if (response.data.success) {
                toast.success('Yedek silindi');
                setDeleteConfirm(null);
                fetchData();
            } else {
                toast.error('Silme işlemi başarısız');
            }
        } catch (error) {
            console.error('Silme hatası:', error);
            toast.error('Yedek silinemedi');
        }
    };

    const handleShowLogs = async () => {
        try {
            const response = await backupApi.getLogs(100);
            if (response.data.success && response.data.data) {
                setLogs(response.data.data);
            }
            setShowLogs(true);
        } catch (error) {
            console.error('Log yükleme hatası:', error);
            toast.error('Loglar yüklenemedi');
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleString('tr-TR');
    };

    return (
        <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Yedekleme Merkezi</h2>
                    <p className="text-muted-foreground">
                        Veritabanı yedeklerini yönetin, manuel yedekleme başlatın ve logları görüntüleyin.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={handleShowLogs}
                        className="gap-2"
                    >
                        <Terminal className="h-4 w-4" />
                        Logları Görüntüle
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={handleTriggerBackup}
                        disabled={triggering}
                        className="p-0 h-auto hover:bg-transparent"
                    >
                        <AnimatedBadge
                            text={triggering ? "Yedekleniyor..." : "Şimdi Yedekle"}
                            color="#10b981"
                        />
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Son Yedekleme
                        </CardTitle>
                        <Clock className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg font-bold">
                            {stats?.lastBackupDate
                                ? formatDate(stats.lastBackupDate)
                                : 'Henüz yok'
                            }
                        </div>
                        <p className="text-xs text-muted-foreground">
                            En son yedek alınma zamanı
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Toplam Boyut
                        </CardTitle>
                        <HardDrive className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats?.totalSizeFormatted || '0 B'}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Tüm yedeklerin boyutu
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Yedek Sayısı
                        </CardTitle>
                        <FileArchive className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats?.backupCount || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Mevcut yedek dosyası
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Durum
                        </CardTitle>
                        {stats?.isBackupRunning ? (
                            <Loader2 className="h-4 w-4 text-orange-600 animate-spin" />
                        ) : (
                            <Database className="h-4 w-4 text-emerald-600" />
                        )}
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats?.isBackupRunning ? 'Çalışıyor' : 'Hazır'}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Yedekleme sistemi durumu
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Backups Table */}
            <div className="rounded-md border bg-card text-card-foreground shadow-sm">
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-lg font-semibold">Yedek Dosyaları</h3>
                    <Button variant="ghost" size="sm" onClick={fetchData} className="gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Yenile
                    </Button>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Dosya Adı</TableHead>
                            <TableHead>Boyut</TableHead>
                            <TableHead>Oluşturulma Tarihi</TableHead>
                            <TableHead className="text-right">İşlemler</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {renderTableContent(
                            loading,
                            backups,
                            deleteConfirm,
                            setDeleteConfirm,
                            handleDownload,
                            handleDelete,
                            formatDate
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Logs Dialog */}
            <Dialog open={showLogs} onOpenChange={setShowLogs}>
                <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Terminal className="h-5 w-5" />
                            Yedekleme Logları
                        </DialogTitle>
                        <DialogDescription>
                            Son yedekleme işlemlerinin log kayıtları
                        </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="h-[400px] w-full rounded-md border bg-slate-950 p-4">
                        <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap">
                            {logs.length > 0
                                ? logs.join('\n')
                                : 'Log kaydı bulunamadı.'
                            }
                        </pre>
                    </ScrollArea>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowLogs(false)}>Kapat</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
