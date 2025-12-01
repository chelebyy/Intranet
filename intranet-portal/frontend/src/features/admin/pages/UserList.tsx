import React from 'react';
import { useNavigate } from 'react-router-dom';

export const UserList: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="p-6 md:p-8 flex flex-col h-full w-full max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold text-text-primary dark:text-dark-text-primary">Kullanıcı Listesi</h1>
                    <p className="text-text-secondary dark:text-dark-text-secondary">Sistemdeki tüm kullanıcıları yönetin ve görüntüleyin.</p>
                </div>
                <button onClick={() => navigate('/users/create')} className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold text-sm shadow-sm transition-colors">
                    <span className="material-symbols-outlined">add</span>
                    Yeni Kullanıcı Ekle
                </button>
            </div>

            <div className="bg-card dark:bg-dark-card border border-border-color dark:border-dark-border rounded-xl p-4 mb-6 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary dark:text-dark-text-secondary">search</span>
                    <input type="text" placeholder="Kullanıcı adı veya e-posta ile ara..." className="w-full pl-10 pr-4 py-2 border border-border-color dark:border-dark-border rounded-lg bg-background dark:bg-dark-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm text-text-primary dark:text-dark-text-primary" />
                </div>
            </div>

            <div className="bg-card dark:bg-dark-card border border-border-color dark:border-dark-border rounded-xl shadow-sm overflow-hidden flex-1 flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-text-secondary dark:text-dark-text-secondary">
                        <thead className="text-xs text-text-primary dark:text-dark-text-primary uppercase bg-slate-50 dark:bg-slate-800 border-b border-border-color dark:border-dark-border">
                            <tr>
                                <th className="px-6 py-3">Adı Soyadı</th>
                                <th className="px-6 py-3">Sicil</th>
                                <th className="px-6 py-3">Birim</th>
                                <th className="px-6 py-3">Rol</th>
                                <th className="px-6 py-3">Durum</th>
                                <th className="px-6 py-3">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-color dark:divide-dark-border">
                            {[
                                { name: 'Ayşe Yılmaz', sicil: '10254', unit: 'Pazarlama', role: 'Editör', status: 'Aktif' },
                                { name: 'Mehmet Öztürk', sicil: '10369', unit: 'İnsan Kaynakları', role: 'Admin', status: 'Aktif' },
                                { name: 'Fatma Kaya', sicil: '10478', unit: 'IT', role: 'Kullanıcı', status: 'Pasif' }
                            ].map((user, i) => (
                                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800 bg-white dark:bg-dark-card">
                                    <th className="px-6 py-4 font-semibold text-text-primary dark:text-dark-text-primary whitespace-nowrap">{user.name}</th>
                                    <td className="px-6 py-4">{user.sicil}</td>
                                    <td className="px-6 py-4">{user.unit}</td>
                                    <td className="px-6 py-4">{user.role}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${user.status === 'Aktif' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-400'}`}>
                                            <span className={`w-2 h-2 rounded-full ${user.status === 'Aktif' ? 'bg-green-500' : 'bg-slate-500'}`}></span>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button className="p-2 text-text-secondary dark:text-dark-text-secondary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"><span className="material-symbols-outlined text-lg">edit</span></button>
                                            <button className="p-2 text-text-secondary dark:text-dark-text-secondary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"><span className="material-symbols-outlined text-lg">delete</span></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
