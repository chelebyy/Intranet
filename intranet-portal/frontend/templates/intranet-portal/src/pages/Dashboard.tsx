import React from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { name: 'İK', value: 250 },
  { name: 'IT', value: 850 },
  { name: 'Pazarlama', value: 150 },
  { name: 'Satış', value: 450 },
  { name: 'Finans', value: 550 },
  { name: 'Operasyon', value: 950 },
];

export const Dashboard: React.FC = () => {
  return (
    <div className="p-6 md:p-8 flex flex-col gap-8 w-full max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
            <h1 className="text-text-primary dark:text-dark-text-primary text-3xl font-black leading-tight tracking-tight">Hoş Geldiniz, Yönetici!</h1>
            <p className="text-text-secondary dark:text-dark-text-secondary text-base font-normal">Sistem genelindeki kritik bilgilere buradan hızla erişebilirsiniz.</p>
        </div>
        <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-text-secondary dark:text-dark-text-secondary cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700">
                <span className="material-symbols-outlined">notifications</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-200 bg-cover bg-center cursor-pointer" style={{backgroundImage: 'url("https://picsum.photos/200")'}}></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card dark:bg-dark-card border border-border-color dark:border-dark-border rounded-xl p-6 shadow-sm">
            <p className="text-text-secondary dark:text-dark-text-secondary text-base font-medium">Toplam Kullanıcı</p>
            <p className="text-text-primary dark:text-dark-text-primary text-4xl font-bold mt-2">1,250</p>
        </div>
        <div className="bg-card dark:bg-dark-card border border-border-color dark:border-dark-border rounded-xl p-6 shadow-sm">
            <p className="text-text-secondary dark:text-dark-text-secondary text-base font-medium">Aktif Departman</p>
            <p className="text-text-primary dark:text-dark-text-primary text-4xl font-bold mt-2">15</p>
        </div>
        <div className="bg-card dark:bg-dark-card border border-border-color dark:border-dark-border rounded-xl p-6 shadow-sm">
            <p className="text-text-secondary dark:text-dark-text-secondary text-base font-medium">Toplam İçerik</p>
            <p className="text-text-primary dark:text-dark-text-primary text-4xl font-bold mt-2">8,430</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card dark:bg-dark-card border border-border-color dark:border-dark-border rounded-xl p-6 shadow-sm">
            <div className="flex flex-col gap-1 mb-6">
                <p className="text-text-primary dark:text-dark-text-primary text-lg font-bold">Departmanlara Göre Kullanıcı Dağılımı</p>
                <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold text-text-primary dark:text-dark-text-primary">1,250 Toplam</p>
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full text-sm font-medium flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">arrow_upward</span>
                        +5.2%
                    </span>
                </div>
            </div>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12, fontWeight: 600}} dy={10}/>
                        <Tooltip 
                            cursor={{fill: 'transparent'}} 
                            contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: '#1E293B', color: '#F8FAFC'}}
                            itemStyle={{color: '#F8FAFC'}}
                        />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#BFDBFE' : '#3B82F6'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="bg-card dark:bg-dark-card border border-border-color dark:border-dark-border rounded-xl p-6 shadow-sm flex flex-col gap-6">
            <h3 className="text-text-primary dark:text-dark-text-primary text-lg font-bold">Son Sistem Aktiviteleri</h3>
            <div className="flex flex-col gap-6">
                <div className="flex gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0 text-primary">
                        <span className="material-symbols-outlined text-sm">person_add</span>
                    </div>
                    <div>
                        <p className="text-sm text-text-primary dark:text-dark-text-primary"><b>Ahmet Yılmaz</b> yeni bir kullanıcı ekledi: <b>Ayşe Kaya</b>.</p>
                        <p className="text-xs text-text-secondary dark:text-dark-text-secondary mt-1">2 dakika önce</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0 text-primary">
                        <span className="material-symbols-outlined text-sm">edit_document</span>
                    </div>
                    <div>
                        <p className="text-sm text-text-primary dark:text-dark-text-primary"><b>Zeynep Öztürk</b> "Finans Raporu Q3" içeriğini güncelledi.</p>
                        <p className="text-xs text-text-secondary dark:text-dark-text-secondary mt-1">15 dakika önce</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0 text-primary">
                        <span className="material-symbols-outlined text-sm">delete</span>
                    </div>
                    <div>
                        <p className="text-sm text-text-primary dark:text-dark-text-primary"><b>Caner Veli</b> "Eski Pazarlama Kampanyası" içeriğini sildi.</p>
                        <p className="text-xs text-text-secondary dark:text-dark-text-secondary mt-1">1 saat önce</p>
                    </div>
                </div>
                 <div className="flex gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0 text-primary">
                        <span className="material-symbols-outlined text-sm">shield</span>
                    </div>
                    <div>
                        <p className="text-sm text-text-primary dark:text-dark-text-primary">Sistem, "Operasyon" departmanı yetkilerini güncelledi.</p>
                        <p className="text-xs text-text-secondary dark:text-dark-text-secondary mt-1">3 saat önce</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};