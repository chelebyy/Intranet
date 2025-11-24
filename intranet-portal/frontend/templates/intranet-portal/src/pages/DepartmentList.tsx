import React from 'react';
import { Page } from '../types';

interface DepartmentListProps {
    onNavigate: (page: Page) => void;
}

export const DepartmentList: React.FC<DepartmentListProps> = ({ onNavigate }) => {
  return (
    <div className="p-6 md:p-8 flex flex-col h-full w-full max-w-7xl mx-auto">
        <div className="flex flex-col gap-4 mb-6">
            <div className="flex gap-2 text-sm text-text-secondary dark:text-dark-text-secondary">
                <span>Yönetim Paneli</span> / <span className="text-text-primary dark:text-dark-text-primary font-medium">Birimler</span>
            </div>
            <div className="flex justify-between items-center flex-wrap gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-black text-text-primary dark:text-dark-text-primary">Birim Yönetimi</h1>
                    <p className="text-text-secondary dark:text-dark-text-secondary">Sistemde tanımlı tüm birimleri görüntüleyin ve yönetin.</p>
                </div>
            </div>
        </div>

        <div className="bg-card dark:bg-dark-card border border-border-color dark:border-dark-border rounded-xl p-4 mb-6 shadow-sm flex flex-wrap gap-4 justify-between items-center">
             <div className="flex items-center gap-2 flex-1 min-w-[300px]">
                <div className="relative flex-1">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary dark:text-dark-text-secondary">search</span>
                    <input type="text" placeholder="Birim adı veya sorumluya göre ara..." className="w-full pl-10 pr-4 py-2 border border-border-color dark:border-dark-border rounded-lg bg-background dark:bg-slate-800 text-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm placeholder:text-text-muted dark:placeholder:text-dark-text-muted" />
                </div>
                <button className="w-10 h-10 flex items-center justify-center border border-border-color dark:border-dark-border rounded-lg text-text-secondary dark:text-dark-text-secondary hover:bg-slate-50 dark:hover:bg-slate-800">
                    <span className="material-symbols-outlined">filter_list</span>
                </button>
             </div>
             <button onClick={() => onNavigate(Page.DEPARTMENT_CREATE)} className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold shadow-sm transition-colors">
                <span className="material-symbols-outlined text-xl">add</span>
                Yeni Birim Ekle
             </button>
        </div>

        <div className="bg-card dark:bg-dark-card border border-border-color dark:border-dark-border rounded-xl shadow-sm overflow-hidden flex-1 flex flex-col">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-background dark:bg-slate-800 border-b border-border-color dark:border-dark-border text-text-secondary dark:text-dark-text-secondary uppercase text-xs font-medium">
                        <tr>
                            <th className="px-6 py-3">Birim Adı</th>
                            <th className="px-6 py-3">Sorumlu Kişi</th>
                            <th className="px-6 py-3">Kullanıcı Sayısı</th>
                            <th className="px-6 py-3">Durum</th>
                            <th className="px-6 py-3 text-right">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-color dark:divide-dark-border">
                        {[
                            { name: 'Pazarlama', manager: 'Ayşe Yılmaz', count: 15, status: 'Aktif' },
                            { name: 'İnsan Kaynakları', manager: 'Mehmet Öztürk', count: 8, status: 'Aktif' },
                            { name: 'Bilgi Teknolojileri', manager: 'Fatma Kaya', count: 22, status: 'Aktif' },
                            { name: 'Muhasebe', manager: 'Ali Vural', count: 12, status: 'Pasif' }
                        ].map((dept, i) => (
                            <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <td className="px-6 py-4 font-medium text-text-primary dark:text-dark-text-primary">{dept.name}</td>
                                <td className="px-6 py-4 text-text-secondary dark:text-dark-text-secondary">{dept.manager}</td>
                                <td className="px-6 py-4 text-text-secondary dark:text-dark-text-secondary">{dept.count}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${dept.status === 'Aktif' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-400'}`}>
                                        {dept.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-3">
                                        <button className="text-text-secondary dark:text-dark-text-secondary hover:text-primary dark:hover:text-primary"><span className="material-symbols-outlined">edit</span></button>
                                        <button className="text-text-secondary dark:text-dark-text-secondary hover:text-red-500 dark:hover:text-red-400"><span className="material-symbols-outlined">delete</span></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="p-4 border-t border-border-color dark:border-dark-border flex items-center justify-between mt-auto">
                 <p className="text-sm text-text-secondary dark:text-dark-text-secondary">10 kayıttan 1-4 arası gösteriliyor</p>
                 <div className="flex gap-1">
                    <button className="w-8 h-8 flex items-center justify-center border border-border-color dark:border-dark-border rounded hover:bg-slate-50 dark:hover:bg-slate-800 text-text-secondary dark:text-dark-text-secondary"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
                    <button className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded text-sm font-semibold">1</button>
                    <button className="w-8 h-8 flex items-center justify-center border border-border-color dark:border-dark-border rounded hover:bg-slate-50 dark:hover:bg-slate-800 text-text-primary dark:text-dark-text-primary text-sm font-semibold">2</button>
                    <button className="w-8 h-8 flex items-center justify-center text-text-secondary dark:text-dark-text-secondary">...</button>
                    <button className="w-8 h-8 flex items-center justify-center border border-border-color dark:border-dark-border rounded hover:bg-slate-50 dark:hover:bg-slate-800 text-text-secondary dark:text-dark-text-secondary"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
                 </div>
            </div>
        </div>
    </div>
  );
};