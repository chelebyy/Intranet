import React from 'react';

export const Reports: React.FC = () => {
    return (
        <div className="p-6 md:p-8 w-full max-w-7xl mx-auto">
             <h1 className="text-3xl font-bold text-text-primary dark:text-dark-text-primary mb-2">Raporlar</h1>
             <p className="text-text-secondary dark:text-dark-text-secondary mb-8">Sistem raporlarını ve analizlerini buradan görüntüleyebilirsiniz.</p>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card dark:bg-dark-card border border-border-color dark:border-dark-border rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg text-text-primary dark:text-dark-text-primary">Kullanıcı Aktivite Raporu</h3>
                        <button className="text-primary text-sm font-medium hover:underline">Detaylar</button>
                    </div>
                    <div className="h-48 bg-slate-50 dark:bg-slate-800/50 rounded-lg flex items-center justify-center border border-dashed border-border-color dark:border-dark-border">
                        <div className="flex flex-col items-center gap-2 text-text-muted dark:text-dark-text-muted">
                            <span className="material-symbols-outlined text-4xl">bar_chart</span>
                            <span className="text-sm">Grafik Verisi</span>
                        </div>
                    </div>
                </div>

                 <div className="bg-card dark:bg-dark-card border border-border-color dark:border-dark-border rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg text-text-primary dark:text-dark-text-primary">Departman Performans Raporu</h3>
                        <button className="text-primary text-sm font-medium hover:underline">Detaylar</button>
                    </div>
                    <div className="h-48 bg-slate-50 dark:bg-slate-800/50 rounded-lg flex items-center justify-center border border-dashed border-border-color dark:border-dark-border">
                        <div className="flex flex-col items-center gap-2 text-text-muted dark:text-dark-text-muted">
                            <span className="material-symbols-outlined text-4xl">pie_chart</span>
                            <span className="text-sm">Grafik Verisi</span>
                        </div>
                    </div>
                </div>

                <div className="bg-card dark:bg-dark-card border border-border-color dark:border-dark-border rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg text-text-primary dark:text-dark-text-primary">Sistem Kullanım Özeti</h3>
                        <button className="text-primary text-sm font-medium hover:underline">Detaylar</button>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                            <span className="text-sm text-text-secondary dark:text-dark-text-secondary">Aktif Oturumlar</span>
                            <span className="font-bold text-text-primary dark:text-dark-text-primary">45</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                            <span className="text-sm text-text-secondary dark:text-dark-text-secondary">Günlük API İstekleri</span>
                            <span className="font-bold text-text-primary dark:text-dark-text-primary">12.5K</span>
                        </div>
                         <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                            <span className="text-sm text-text-secondary dark:text-dark-text-secondary">Sunucu Yükü</span>
                            <span className="font-bold text-green-600">32%</span>
                        </div>
                    </div>
                </div>

                 <div className="bg-card dark:bg-dark-card border border-border-color dark:border-dark-border rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg text-text-primary dark:text-dark-text-primary">Güvenlik Denetimi</h3>
                         <button className="text-primary text-sm font-medium hover:underline">Detaylar</button>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-900/30">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-red-500 text-sm">warning</span>
                                <span className="text-sm text-red-700 dark:text-red-400">Başarısız Giriş Denemeleri</span>
                            </div>
                            <span className="font-bold text-red-700 dark:text-red-400">12</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900/30">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span>
                                <span className="text-sm text-green-700 dark:text-green-400">Sistem Sağlığı</span>
                            </div>
                            <span className="font-bold text-green-700 dark:text-green-400">99.9%</span>
                        </div>
                    </div>
                </div>
             </div>
        </div>
    )
}