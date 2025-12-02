import React, { useState, useEffect, useCallback } from 'react';
import { auditLogApi } from '../../../api/auditLogApi';
import type { AuditLogItem, AuditLogFilter } from '../../../api/auditLogApi';
import toast from 'react-hot-toast';

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

    const getActionColor = (action: string) => {
        if (action.includes('Login') || action.includes('Logout')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
        if (action.includes('Create') || action.includes('Add')) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
        if (action.includes('Update') || action.includes('Edit')) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
        if (action.includes('Delete') || action.includes('Remove')) return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400';
    };

    return (
        <div className="p-6 md:p-8 flex flex-col h-full w-full max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col gap-1 mb-6">
                <h1 className="text-3xl font-bold text-text-primary dark:text-dark-text-primary">Audit Log</h1>
                <p className="text-text-secondary dark:text-dark-text-secondary">
                    Sistemdeki tüm işlemlerin kayıtlarını görüntüleyin.
                    <span className="font-medium ml-1">({totalCount} kayıt)</span>
                </p>
            </div>

            {/* Filters */}
            <form onSubmit={handleSearch} className="bg-card dark:bg-dark-card border border-border-color dark:border-dark-border rounded-xl p-4 mb-6 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-grow">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary dark:text-dark-text-secondary">search</span>
                        <input 
                            type="text" 
                            placeholder="Kullanıcı adı, IP adresi veya kaynak ara..." 
                            value={filter.searchTerm}
                            onChange={(e) => setFilter(prev => ({ ...prev, searchTerm: e.target.value }))}
                            className="w-full pl-10 pr-4 py-2 border border-border-color dark:border-dark-border rounded-lg bg-background dark:bg-dark-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm text-text-primary dark:text-dark-text-primary" 
                        />
                    </div>
                    <select
                        value={filter.action}
                        onChange={(e) => setFilter(prev => ({ ...prev, action: e.target.value, page: 1 }))}
                        className="px-4 py-2 border border-border-color dark:border-dark-border rounded-lg bg-background dark:bg-dark-background text-sm text-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                        <option value="">Tüm Aksiyonlar</option>
                        {actions.map(action => (
                            <option key={action} value={action}>{action}</option>
                        ))}
                    </select>
                    <button 
                        type="submit"
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors flex items-center gap-2 text-sm font-medium"
                    >
                        <span className="material-symbols-outlined text-lg">filter_alt</span>
                        Filtrele
                    </button>
                    <button 
                        type="button"
                        onClick={fetchLogs}
                        className="px-4 py-2 border border-border-color dark:border-dark-border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 text-sm"
                    >
                        <span className="material-symbols-outlined text-lg">refresh</span>
                        Yenile
                    </button>
                </div>
            </form>

            {/* Table */}
            <div className="bg-card dark:bg-dark-card border border-border-color dark:border-dark-border rounded-xl shadow-sm overflow-hidden flex-1 flex flex-col">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                ) : logs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-text-secondary dark:text-dark-text-secondary">
                        <span className="material-symbols-outlined text-5xl mb-2">history</span>
                        <p>Kayıt bulunamadı</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto flex-1">
                            <table className="w-full text-sm text-left text-text-secondary dark:text-dark-text-secondary">
                                <thead className="text-xs text-text-primary dark:text-dark-text-primary uppercase bg-slate-50 dark:bg-slate-800 border-b border-border-color dark:border-dark-border">
                                    <tr>
                                        <th className="px-4 py-3">Tarih/Saat</th>
                                        <th className="px-4 py-3">Kullanıcı</th>
                                        <th className="px-4 py-3">Aksiyon</th>
                                        <th className="px-4 py-3">Kaynak</th>
                                        <th className="px-4 py-3">IP Adresi</th>
                                        <th className="px-4 py-3">Detay</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border-color dark:divide-dark-border">
                                    {logs.map((log) => (
                                        <tr key={log.logID} className="hover:bg-slate-50 dark:hover:bg-slate-800 bg-white dark:bg-dark-card">
                                            <td className="px-4 py-3 whitespace-nowrap text-xs">
                                                {formatDate(log.tarihSaat)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-text-primary dark:text-dark-text-primary">
                                                        {log.userName || 'Sistem'}
                                                    </span>
                                                    {log.birimName && (
                                                        <span className="text-xs text-text-secondary dark:text-dark-text-secondary">
                                                            {log.birimName}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getActionColor(log.action)}`}>
                                                    {log.action}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-xs">{log.resource || '-'}</td>
                                            <td className="px-4 py-3 font-mono text-xs">{log.ipAddress || '-'}</td>
                                            <td className="px-4 py-3">
                                                {log.details && (
                                                    <button
                                                        onClick={() => setSelectedLog(log)}
                                                        className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                                        title="Detayları Görüntüle"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">visibility</span>
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-between px-4 py-3 border-t border-border-color dark:border-dark-border bg-slate-50 dark:bg-slate-800">
                            <div className="text-sm text-text-secondary dark:text-dark-text-secondary">
                                Sayfa {filter.page} / {totalPages} ({totalCount} kayıt)
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handlePageChange(filter.page! - 1)}
                                    disabled={filter.page === 1}
                                    className="px-3 py-1 border border-border-color dark:border-dark-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-slate-700 transition-colors text-sm"
                                >
                                    Önceki
                                </button>
                                <button
                                    onClick={() => handlePageChange(filter.page! + 1)}
                                    disabled={filter.page === totalPages}
                                    className="px-3 py-1 border border-border-color dark:border-dark-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-slate-700 transition-colors text-sm"
                                >
                                    Sonraki
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Detail Modal */}
            {selectedLog && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-card dark:bg-dark-card rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-border-color dark:border-dark-border">
                            <h3 className="text-lg font-semibold text-text-primary dark:text-dark-text-primary">
                                Log Detayı #{selectedLog.logID}
                            </h3>
                            <button
                                onClick={() => setSelectedLog(null)}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto max-h-[60vh]">
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="text-xs text-text-secondary dark:text-dark-text-secondary">Tarih/Saat</label>
                                    <p className="font-medium text-text-primary dark:text-dark-text-primary">{formatDate(selectedLog.tarihSaat)}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-text-secondary dark:text-dark-text-secondary">Kullanıcı</label>
                                    <p className="font-medium text-text-primary dark:text-dark-text-primary">{selectedLog.userName || 'Sistem'}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-text-secondary dark:text-dark-text-secondary">Aksiyon</label>
                                    <p className="font-medium text-text-primary dark:text-dark-text-primary">{selectedLog.action}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-text-secondary dark:text-dark-text-secondary">IP Adresi</label>
                                    <p className="font-mono text-text-primary dark:text-dark-text-primary">{selectedLog.ipAddress || '-'}</p>
                                </div>
                            </div>
                            {selectedLog.details && (
                                <div>
                                    <label className="text-xs text-text-secondary dark:text-dark-text-secondary">Detaylar (JSON)</label>
                                    <pre className="mt-1 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs overflow-x-auto text-text-primary dark:text-dark-text-primary">
                                        {JSON.stringify(JSON.parse(selectedLog.details), null, 2)}
                                    </pre>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
