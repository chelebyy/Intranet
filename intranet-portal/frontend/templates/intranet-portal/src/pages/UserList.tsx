import React from 'react';
import { Page } from '../types';

interface UserListProps {
    onNavigate: (page: Page) => void;
}

export const UserList: React.FC<UserListProps> = ({ onNavigate }) => {
  return (
    <div className="p-6 md:p-8 flex flex-col h-full w-full max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold text-text-primary">Kullanıcı Listesi</h1>
                <p className="text-text-secondary">Sistemdeki tüm kullanıcıları yönetin ve görüntüleyin.</p>
            </div>
            <button onClick={() => onNavigate(Page.USER_CREATE)} className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold text-sm shadow-sm transition-colors">
                <span className="material-symbols-outlined">add</span>
                Yeni Kullanıcı Ekle
            </button>
        </div>

        <div className="bg-card border border-border-color rounded-xl p-4 mb-6 shadow-sm flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
                 <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">search</span>
                 <input type="text" placeholder="Kullanıcı adı veya e-posta ile ara..." className="w-full pl-10 pr-4 py-2 border border-border-color rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm" />
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0">
                <button className="flex items-center gap-2 px-4 py-2 bg-background border border-border-color rounded-lg text-sm text-text-primary whitespace-nowrap hover:bg-slate-100">
                    Birim: Tümü <span className="material-symbols-outlined text-sm">expand_more</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-background border border-border-color rounded-lg text-sm text-text-primary whitespace-nowrap hover:bg-slate-100">
                    Rol: Tümü <span className="material-symbols-outlined text-sm">expand_more</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-background border border-border-color rounded-lg text-sm text-text-primary whitespace-nowrap hover:bg-slate-100">
                    Durum: Tümü <span className="material-symbols-outlined text-sm">expand_more</span>
                </button>
            </div>
        </div>

        <div className="bg-card border border-border-color rounded-xl shadow-sm overflow-hidden flex-1 flex flex-col">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-text-secondary">
                    <thead className="text-xs text-text-primary uppercase bg-slate-50 border-b border-border-color">
                        <tr>
                            <th className="p-4 w-4">
                                <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                            </th>
                            <th className="px-6 py-3">Adı Soyadı</th>
                            <th className="px-6 py-3">Sicil</th>
                            <th className="px-6 py-3">Birim</th>
                            <th className="px-6 py-3">Rol</th>
                            <th className="px-6 py-3">Durum</th>
                            <th className="px-6 py-3">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-color">
                        {[
                            { name: 'Ayşe Yılmaz', sicil: '10254', unit: 'Pazarlama', role: 'Editör', status: 'Aktif' },
                            { name: 'Mehmet Öztürk', sicil: '10369', unit: 'İnsan Kaynakları', role: 'Admin', status: 'Aktif' },
                            { name: 'Fatma Kaya', sicil: '10478', unit: 'IT', role: 'Kullanıcı', status: 'Pasif' }
                        ].map((user, i) => (
                            <tr key={i} className="hover:bg-slate-50 bg-white">
                                <td className="p-4 w-4">
                                    <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                                </td>
                                <th className="px-6 py-4 font-semibold text-text-primary whitespace-nowrap">{user.name}</th>
                                <td className="px-6 py-4">{user.sicil}</td>
                                <td className="px-6 py-4">{user.unit}</td>
                                <td className="px-6 py-4">{user.role}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${user.status === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
                                        <span className={`w-2 h-2 rounded-full ${user.status === 'Aktif' ? 'bg-green-500' : 'bg-slate-500'}`}></span>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <button className="p-2 text-text-secondary hover:bg-slate-100 rounded-lg transition-colors"><span className="material-symbols-outlined text-lg">edit</span></button>
                                        <button className="p-2 text-text-secondary hover:bg-slate-100 rounded-lg transition-colors"><span className="material-symbols-outlined text-lg">delete</span></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="p-4 border-t border-border-color flex items-center justify-between mt-auto">
                 <span className="text-sm font-normal text-text-secondary">Toplam <span className="font-semibold text-text-primary">100</span> kullanıcıdan <span className="font-semibold text-text-primary">1-10</span> arası gösteriliyor</span>
                 <nav className="inline-flex items-center -space-x-px">
                    <button className="px-3 py-1 ml-0 leading-tight text-text-secondary bg-white border border-border-color rounded-l-lg hover:bg-slate-100">Önceki</button>
                    <button className="px-3 py-1 leading-tight text-text-secondary bg-white border border-border-color hover:bg-slate-100">1</button>
                    <button className="px-3 py-1 leading-tight text-primary bg-blue-50 border border-blue-200 hover:bg-blue-100">2</button>
                    <button className="px-3 py-1 leading-tight text-text-secondary bg-white border border-border-color hover:bg-slate-100">3</button>
                    <button className="px-3 py-1 leading-tight text-text-secondary bg-white border border-border-color rounded-r-lg hover:bg-slate-100">Sonraki</button>
                 </nav>
            </div>
        </div>
    </div>
  );
};