import React, { useState, useEffect, useCallback } from 'react';
import { auditLogApi } from '../../../api/auditLogApi';
import type { AuditLogItem, AuditLogFilter } from '../../../api/auditLogApi';
import toast from 'react-hot-toast';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Search, RefreshCw, Filter, Eye, History, Loader2 } from 'lucide-react';

export const AuditLogList: React.FC = () => {
    const [logs, setLogs] = useState<AuditLogItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [actions, setActions] = useState<string[]>([]);
    const [selectedLog, setSelectedLog] = useState<AuditLogItem | null>(null);

    const [filter, setFilter] = useState<AuditLogFilter>({
        page: 1,
        pageSize: 20,
        searchTerm: '',
        action: ''
    });

    const fetchLogs = useCallback(async () => {
        try {
            setLoading(true);
            const result = await auditLogApi.getAll(filter);
            setLogs(result.items);
            setTotalCount(result.totalCount);
            setTotalPages(result.totalPages);
        } catch (error) {
            console.error('Audit loglar yüklenirken hata:', error);
            toast.error('Audit loglar yüklenemedi');
        } finally {
            setLoading(false);
        }
    }, [filter]);

    const fetchActions = async () => {
        try {
            const result = await auditLogApi.getActions();
            setActions(result);
        } catch (error) {
            console.error('Aksiyonlar yüklenirken hata:', error);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    useEffect(() => {
        fetchActions();
    }, []);

    const handlePageChange = (newPage: number) => {
        setFilter(prev => ({ ...prev, page: newPage }));
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleString('tr-TR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    // Aksiyon türüne göre renk sınıfları - Lookup Map (Cognitive Complexity düşürüldü)
    const ACTION_COLORS: Record<string, string> = {
        // Authentication - Giriş/Çıkış işlemleri
        Login: 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-600',
        Logout: 'bg-sky-500 hover:bg-sky-600 text-white border-sky-600',
        LoginFailed: 'bg-rose-500 hover:bg-rose-600 text-white border-rose-600',
        TokenRefresh: 'bg-cyan-500 hover:bg-cyan-600 text-white border-cyan-600',
        // Backup - Yedekleme işlemleri
        BackupCreated: 'bg-violet-500 hover:bg-violet-600 text-white border-violet-600',
        BackupDownloaded: 'bg-indigo-500 hover:bg-indigo-600 text-white border-indigo-600',
        BackupDeleted: 'bg-fuchsia-500 hover:bg-fuchsia-600 text-white border-fuchsia-600',
        // User Management - Kullanıcı işlemleri
        CreateUser: 'bg-green-500 hover:bg-green-600 text-white border-green-600',
        UpdateUser: 'bg-amber-500 hover:bg-amber-600 text-white border-amber-600',
        DeleteUser: 'bg-red-500 hover:bg-red-600 text-white border-red-600',
        ActivateUser: 'bg-teal-500 hover:bg-teal-600 text-white border-teal-600',
        DeactivateUser: 'bg-orange-500 hover:bg-orange-600 text-white border-orange-600',
        // File - Dosya işlemleri
        UploadFile: 'bg-lime-500 hover:bg-lime-600 text-white border-lime-600',
        DownloadFile: 'bg-cyan-500 hover:bg-cyan-600 text-white border-cyan-600',
        DeleteFile: 'bg-red-400 hover:bg-red-500 text-white border-red-500',
        // Security - Güvenlik olayları
        UnauthorizedAccess: 'bg-red-600 hover:bg-red-700 text-white border-red-700',
        IPBlocked: 'bg-red-700 hover:bg-red-800 text-white border-red-800',
        RateLimitExceeded: 'bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-600',
    };

    // Keyword-based renk eşleştirmeleri
    const KEYWORD_COLORS: Array<{ keywords: string[]; color: string }> = [
        { keywords: ['Role'], color: 'bg-purple-500 hover:bg-purple-600 text-white border-purple-600' },
        { keywords: ['Permission'], color: 'bg-pink-500 hover:bg-pink-600 text-white border-pink-600' },
        { keywords: ['Birim'], color: 'bg-blue-500 hover:bg-blue-600 text-white border-blue-600' },
        { keywords: ['Create', 'Add'], color: 'bg-green-500 hover:bg-green-600 text-white border-green-600' },
        { keywords: ['Update', 'Edit'], color: 'bg-amber-500 hover:bg-amber-600 text-white border-amber-600' },
        { keywords: ['Delete', 'Remove'], color: 'bg-red-500 hover:bg-red-600 text-white border-red-600' },
        { keywords: ['Export'], color: 'bg-slate-500 hover:bg-slate-600 text-white border-slate-600' },
    ];

    const DEFAULT_COLOR = 'bg-gray-500 hover:bg-gray-600 text-white border-gray-600';

    const getActionColor = (action: string): string => {
        // 1. Tam eşleşme kontrolü
        if (ACTION_COLORS[action]) {
            return ACTION_COLORS[action];
        }
        // 2. Keyword tabanlı eşleşme
        const matchedKeyword = KEYWORD_COLORS.find(({ keywords }) =>
            keywords.some(keyword => action.includes(keyword))
        );
        return matchedKeyword?.color ?? DEFAULT_COLOR;
    };

    // Tablo içeriğini render eden helper fonksiyon (nested ternary yerine)
    const renderTableContent = () => {
        if (loading) {
            return (
                <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                        <div className="flex items-center justify-center">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            <span className="ml-2 text-muted-foreground">Yükleniyor...</span>
                        </div>
                    </TableCell>
                </TableRow>
            );
        }

        if (logs.length === 0) {
            return (
                <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <History className="h-8 w-8 mb-2" />
                            Kayıt bulunamadı
                        </div>
                    </TableCell>
                </TableRow>
            );
        }

        return logs.map((log) => (
            <TableRow key={log.logID} className="hover:bg-muted/50">
                <TableCell className="font-mono text-xs text-muted-foreground">
                    {formatDate(log.tarihSaat)}
                </TableCell>
                <TableCell>
                    <div className="flex flex-col">
                        <span className="font-medium">
                            {log.userName || 'Sistem'}
                        </span>
                        {log.birimName && (
                            <span className="text-xs text-muted-foreground">
                                {log.birimName}
                            </span>
                        )}
                    </div>
                </TableCell>
                <TableCell>
                    <Badge className={getActionColor(log.action)}>
                        {log.action}
                    </Badge>
                </TableCell>
                <TableCell className="text-xs font-medium">{log.resource || '-'}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{log.ipAddress || '-'}</TableCell>
                <TableCell className="text-right">
                    {log.details && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedLog(log)}
                            title="Detayları Görüntüle"
                            className="h-8 w-8"
                        >
                            <Eye className="h-4 w-4" />
                        </Button>
                    )}
                </TableCell>
            </TableRow>
        ));
    };

    return (
        <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Audit Log</h2>
                    <p className="text-muted-foreground">
                        Sistemdeki tüm işlemlerin kayıtlarını görüntüleyin ({totalCount} kayıt)
                    </p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex flex-1 items-center space-x-2">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Kullanıcı, IP veya kaynak ara..."
                            value={filter.searchTerm}
                            onChange={(e) => setFilter(prev => ({ ...prev, searchTerm: e.target.value }))}
                            className="pl-8"
                        />
                    </div>
                    <Select
                        value={filter.action}
                        onValueChange={(value) => setFilter(prev => ({ ...prev, action: value, page: 1 }))}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Tüm Aksiyonlar" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tüm Aksiyonlar</SelectItem>
                            {actions.map(action => (
                                <SelectItem key={action} value={action}>{action}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button variant="secondary" onClick={() => fetchLogs()}>
                        <Filter className="mr-2 h-4 w-4" />
                        Filtrele
                    </Button>
                </div>
                <button
                    onClick={fetchLogs}
                    className="relative inline-flex h-10 overflow-hidden rounded-md p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                >
                    <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                    <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-md bg-white dark:bg-slate-950 px-4 py-2 text-sm font-medium text-slate-900 dark:text-white backdrop-blur-3xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Yenile
                    </span>
                </button>
            </div>

            <div className="rounded-md border bg-card text-card-foreground shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tarih/Saat</TableHead>
                            <TableHead>Kullanıcı</TableHead>
                            <TableHead>Aksiyon</TableHead>
                            <TableHead>Kaynak</TableHead>
                            <TableHead>IP Adresi</TableHead>
                            <TableHead className="text-right">Detay</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {renderTableContent()}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-2">
                <div className="text-sm text-muted-foreground">
                    Sayfa {filter.page} / {totalPages}
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(filter.page! - 1)}
                        disabled={filter.page === 1}
                    >
                        Önceki
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(filter.page! + 1)}
                        disabled={filter.page === totalPages}
                    >
                        Sonraki
                    </Button>
                </div>
            </div>

            {/* Detail Modal */}
            <Dialog open={!!selectedLog} onOpenChange={(open) => !open && setSelectedLog(null)}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Log Detayı #{selectedLog?.logID}</DialogTitle>
                        <DialogDescription>
                            İşlem detayları ve JSON verisi.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedLog && (
                        <div className="flex-1 overflow-y-auto pr-2">
                            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                                <div className="space-y-1">
                                    <p className="text-muted-foreground text-xs">Tarih/Saat</p>
                                    <p className="font-medium">{formatDate(selectedLog.tarihSaat)}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-muted-foreground text-xs">Kullanıcı</p>
                                    <p className="font-medium">{selectedLog.userName || 'Sistem'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-muted-foreground text-xs">Aksiyon</p>
                                    <Badge className={getActionColor(selectedLog.action)}>{selectedLog.action}</Badge>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-muted-foreground text-xs">IP Adresi</p>
                                    <p className="font-mono">{selectedLog.ipAddress || '-'}</p>
                                </div>
                            </div>

                            {selectedLog.details && (
                                <div className="space-y-2">
                                    <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Detaylar (JSON)</p>
                                    <div className="rounded-md bg-muted p-4 overflow-x-auto">
                                        <pre className="text-xs font-mono">
                                            {JSON.stringify(JSON.parse(selectedLog.details), null, 2)}
                                        </pre>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};
