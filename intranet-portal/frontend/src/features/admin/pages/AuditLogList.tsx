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

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setFilter(prev => ({ ...prev, page: 1 }));
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

    const getActionVariant = (action: string): "default" | "secondary" | "destructive" | "outline" => {
        if (action.includes('Login') || action.includes('Logout')) return 'outline';
        if (action.includes('Create') || action.includes('Add')) return 'default'; // Greenish usually, using default/primary
        if (action.includes('Update') || action.includes('Edit')) return 'secondary';
        if (action.includes('Delete') || action.includes('Remove')) return 'destructive';
        return 'outline';
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
                <Button variant="outline" onClick={fetchLogs}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Yenile
                </Button>
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
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    <div className="flex items-center justify-center">
                                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                        <span className="ml-2 text-muted-foreground">Yükleniyor...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : logs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                                        <History className="h-8 w-8 mb-2" />
                                        Kayıt bulunamadı
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            logs.map((log) => (
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
                                        <Badge variant={getActionVariant(log.action)}>
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
                            ))
                        )}
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
                                    <Badge variant={getActionVariant(selectedLog.action)}>{selectedLog.action}</Badge>
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
