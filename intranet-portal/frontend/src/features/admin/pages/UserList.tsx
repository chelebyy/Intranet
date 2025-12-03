import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usersApi } from '../../../api/usersApi';
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
    Search, 
    Plus, 
    RefreshCw, 
    UserX, 
    Edit, 
    Key, 
    Trash2, 
    Check, 
    X, 
    Loader2 
} from 'lucide-react';

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
    const [resetPasswordModal, setResetPasswordModal] = useState<UserListItem | null>(null);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [resetLoading, setResetLoading] = useState(false);

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

    const handleResetPassword = async () => {
        if (!resetPasswordModal) return;
        
        if (newPassword.length < 8) {
            toast.error('Şifre en az 8 karakter olmalıdır');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            toast.error('Şifreler eşleşmiyor');
            return;
        }

        try {
            setResetLoading(true);
            await usersApi.resetPassword(resetPasswordModal.userID, newPassword);
            toast.success('Şifre başarıyla sıfırlandı');
            setResetPasswordModal(null);
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            console.error('Şifre sıfırlanırken hata:', error);
            toast.error('Şifre sıfırlanamadı');
        } finally {
            setResetLoading(false);
        }
    };

    const openResetModal = (user: UserListItem) => {
        setResetPasswordModal(user);
        setNewPassword('');
        setConfirmPassword('');
    };

    const filteredUsers = users.filter(user => 
        user.adSoyad.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.sicil.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Kullanıcı Listesi</h2>
                    <p className="text-muted-foreground">
                        Sistemdeki tüm kullanıcıları yönetin ve görüntüleyin ({users.length} kullanıcı)
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button onClick={() => navigate('/users/create')} className="bg-purple-600 hover:bg-purple-700 text-white">
                        <Plus className="mr-2 h-4 w-4" />
                        Yeni Kullanıcı Ekle
                    </Button>
                </div>
            </div>

            <div className="flex items-center justify-between space-x-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Ad soyad veya sicil numarası ile ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                    />
                </div>
                <Button variant="outline" onClick={fetchUsers}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Yenile
                </Button>
            </div>

            <div className="rounded-md border bg-card text-card-foreground shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Adı Soyadı</TableHead>
                            <TableHead>Sicil</TableHead>
                            <TableHead>Ünvan</TableHead>
                            <TableHead>Durum</TableHead>
                            <TableHead>Son Giriş</TableHead>
                            <TableHead className="text-right">İşlemler</TableHead>
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
                        ) : filteredUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                                        <UserX className="h-8 w-8 mb-2" />
                                        {searchTerm ? 'Arama sonucu bulunamadı' : 'Henüz kullanıcı bulunmuyor'}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredUsers.map((user) => (
                                <TableRow key={user.userID} className="group">
                                    <TableCell className="font-medium">{user.adSoyad}</TableCell>
                                    <TableCell className="font-mono text-xs">{user.sicil}</TableCell>
                                    <TableCell>{user.unvan || '-'}</TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                                            {user.isActive ? 'Aktif' : 'Pasif'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-xs">
                                        {user.lastLoginAt 
                                            ? new Date(user.lastLoginAt).toLocaleString('tr-TR') 
                                            : 'Hiç giriş yapmadı'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {deleteConfirm === user.userID ? (
                                            <div className="flex items-center justify-end gap-2">
                                                <Button 
                                                    size="sm" 
                                                    variant="destructive" 
                                                    onClick={() => handleDelete(user.userID)}
                                                    className="h-8 px-2"
                                                >
                                                    <Check className="h-4 w-4 mr-1" /> Sil
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
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => navigate(`/users/${user.userID}/edit`)}
                                                    title="Düzenle"
                                                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => openResetModal(user)}
                                                    title="Şifre Sıfırla"
                                                    className="h-8 w-8 text-muted-foreground hover:text-amber-500"
                                                >
                                                    <Key className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setDeleteConfirm(user.userID)}
                                                    title="Sil"
                                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Password Reset Modal */}
            <Dialog open={!!resetPasswordModal} onOpenChange={(open) => !open && setResetPasswordModal(null)}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Şifre Sıfırla</DialogTitle>
                        <DialogDescription>
                            <strong>{resetPasswordModal?.adSoyad}</strong> kullanıcısı için yeni şifre belirleyin.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="new-password">Yeni Şifre</Label>
                            <Input
                                id="new-password"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="En az 8 karakter"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="confirm-password">Şifre Tekrar</Label>
                            <Input
                                id="confirm-password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Şifreyi tekrar girin"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setResetPasswordModal(null)}>İptal</Button>
                        <Button onClick={handleResetPassword} disabled={resetLoading} className="bg-purple-600 text-white hover:bg-purple-700">
                            {resetLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sıfırlanıyor...
                                </>
                            ) : (
                                'Şifreyi Sıfırla'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
