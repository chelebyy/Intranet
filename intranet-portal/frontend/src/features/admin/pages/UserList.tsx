import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usersApi } from '../../../api/usersApi';
import toast from 'react-hot-toast';

interface UserListItem {
    userID: number;
    adSoyad: string;
    sicil: string;
    unvan?: string;
    isActive: boolean;
    createdAt: string;
    lastLoginAt?: string;
}

export const UserList: React.FC = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState<UserListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await usersApi.getAll();
            setUsers(data as unknown as UserListItem[]);
        } catch (error) {
            console.error('Kullanıcılar yüklenirken hata:', error);
            toast.error('Kullanıcılar yüklenemedi');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId: number) => {
        try {
            await usersApi.delete(userId);
            toast.success('Kullanıcı başarıyla silindi');
            setDeleteConfirm(null);
            fetchUsers();
        } catch (error) {
            console.error('Kullanıcı silinirken hata:', error);
            toast.error('Kullanıcı silinemedi');
        }
    };

    const filteredUsers = users.filter(user => 
        user.adSoyad.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.sicil.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 md:p-8 flex flex-col h-full w-full max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold text-text-primary dark:text-dark-text-primary">Kullanıcı Listesi</h1>
                    <p className="text-text-secondary dark:text-dark-text-secondary">
                        Sistemdeki tüm kullanıcıları yönetin ve görüntüleyin. 
                        <span className="font-medium ml-1">({users.length} kullanıcı)</span>
                    </p>
                </div>
                <button onClick={() => navigate('/users/create')} className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold text-sm shadow-sm transition-colors">
                    <span className="material-symbols-outlined">add</span>
                    Yeni Kullanıcı Ekle
                </button>
            </div>

            <div className="bg-card dark:bg-dark-card border border-border-color dark:border-dark-border rounded-xl p-4 mb-6 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary dark:text-dark-text-secondary">search</span>
                    <input 
                        type="text" 
                        placeholder="Ad soyad veya sicil numarası ile ara..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-border-color dark:border-dark-border rounded-lg bg-background dark:bg-dark-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm text-text-primary dark:text-dark-text-primary" 
                    />
                </div>
                <button 
                    onClick={fetchUsers}
                    className="px-4 py-2 border border-border-color dark:border-dark-border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 text-sm"
                >
                    <span className="material-symbols-outlined text-lg">refresh</span>
                    Yenile
                </button>
            </div>

            <div className="bg-card dark:bg-dark-card border border-border-color dark:border-dark-border rounded-xl shadow-sm overflow-hidden flex-1 flex flex-col">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-text-secondary dark:text-dark-text-secondary">
                        <span className="material-symbols-outlined text-5xl mb-2">person_off</span>
                        <p>{searchTerm ? 'Arama sonucu bulunamadı' : 'Henüz kullanıcı bulunmuyor'}</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-text-secondary dark:text-dark-text-secondary">
                            <thead className="text-xs text-text-primary dark:text-dark-text-primary uppercase bg-slate-50 dark:bg-slate-800 border-b border-border-color dark:border-dark-border">
                                <tr>
                                    <th className="px-6 py-3">Adı Soyadı</th>
                                    <th className="px-6 py-3">Sicil</th>
                                    <th className="px-6 py-3">Ünvan</th>
                                    <th className="px-6 py-3">Durum</th>
                                    <th className="px-6 py-3">Son Giriş</th>
                                    <th className="px-6 py-3">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-color dark:divide-dark-border">
                                {filteredUsers.map((user) => (
                                    <tr key={user.userID} className="hover:bg-slate-50 dark:hover:bg-slate-800 bg-white dark:bg-dark-card">
                                        <th className="px-6 py-4 font-semibold text-text-primary dark:text-dark-text-primary whitespace-nowrap">
                                            {user.adSoyad}
                                        </th>
                                        <td className="px-6 py-4 font-mono">{user.sicil}</td>
                                        <td className="px-6 py-4">{user.unvan || '-'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${user.isActive ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-400'}`}>
                                                <span className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-slate-500'}`}></span>
                                                {user.isActive ? 'Aktif' : 'Pasif'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs">
                                            {user.lastLoginAt 
                                                ? new Date(user.lastLoginAt).toLocaleString('tr-TR') 
                                                : 'Hiç giriş yapmadı'}
                                        </td>
                                        <td className="px-6 py-4">
                                            {deleteConfirm === user.userID ? (
                                                <div className="flex items-center gap-2">
                                                    <button 
                                                        onClick={() => handleDelete(user.userID)}
                                                        className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                                                    >
                                                        Onayla
                                                    </button>
                                                    <button 
                                                        onClick={() => setDeleteConfirm(null)}
                                                        className="px-2 py-1 bg-slate-200 dark:bg-slate-700 text-xs rounded hover:bg-slate-300 dark:hover:bg-slate-600"
                                                    >
                                                        İptal
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <button 
                                                        onClick={() => navigate(`/users/${user.userID}/edit`)}
                                                        className="p-2 text-text-secondary dark:text-dark-text-secondary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                                        title="Düzenle"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">edit</span>
                                                    </button>
                                                    <button 
                                                        onClick={() => setDeleteConfirm(user.userID)}
                                                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                        title="Sil"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">delete</span>
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};
