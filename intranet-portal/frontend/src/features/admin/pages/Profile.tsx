import React, { useState } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { profileApi } from '../../../api/profileApi';
import toast from 'react-hot-toast';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { User, Building2, BadgeCheck, Calendar, Activity, Key, Loader2 } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, selectedBirim } = useAuthStore();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  if (!user) {
    return <div>Kullanıcı bilgileri bulunamadı.</div>;
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Şifreler eşleşmiyor');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('Şifre en az 8 karakter olmalıdır');
      return;
    }

    try {
      setLoading(true);
      await profileApi.changePassword(passwordData);
      toast.success('Şifre değiştirildi');
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: unknown) {
      console.error('Şifre değiştirilirken hata:', error);
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Şifre değiştirilemedi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex max-w-5xl mx-auto">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Profil Bilgileri</h2>
          <p className="text-muted-foreground">
            Kişisel bilgilerinizi ve hesap ayarlarınızı buradan yönetebilirsiniz.
          </p>
        </div>
        <Button onClick={() => setShowPasswordModal(true)} className="bg-purple-600 hover:bg-purple-700 text-white">
            <Key className="mr-2 h-4 w-4" />
            Şifre Değiştir
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Kullanıcı Kartı */}
        <Card>
            <CardHeader>
                <CardTitle>Kişisel Bilgiler</CardTitle>
                <CardDescription>Temel kimlik bilgileriniz</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={user.avatar} alt={user.ad} />
                        <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                            {user.ad?.[0]}{user.soyad?.[0]}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="text-xl font-semibold">{user.ad} {user.soyad}</h3>
                        <p className="text-sm text-muted-foreground">{selectedBirim?.roleName || 'Kullanıcı'}</p>
                    </div>
                </div>
                <div className="grid gap-4">
                    <div className="grid gap-1">
                        <Label className="text-muted-foreground">Sicil Numarası</Label>
                        <div className="flex items-center gap-2 font-medium">
                            <User className="h-4 w-4 text-primary" />
                            {user.sicil}
                        </div>
                    </div>
                    <div className="grid gap-1">
                        <Label className="text-muted-foreground">Unvan</Label>
                        <div className="flex items-center gap-2 font-medium">
                            <BadgeCheck className="h-4 w-4 text-primary" />
                            {user.unvan || '-'}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>

        {/* Organizasyon Kartı */}
        <Card>
            <CardHeader>
                <CardTitle>Organizasyon Bilgileri</CardTitle>
                <CardDescription>Birim ve yetki detaylarınız</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid gap-4">
                    <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                        <div className="flex items-center justify-between">
                            <Label className="text-muted-foreground">Aktif Birim</Label>
                            <Building2 className="h-4 w-4 text-primary" />
                        </div>
                        <p className="text-lg font-semibold text-primary">
                            {selectedBirim?.birimAdi}
                        </p>
                    </div>

                    <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                        <div className="flex items-center justify-between">
                            <Label className="text-muted-foreground">Aktif Rol</Label>
                            <BadgeCheck className="h-4 w-4 text-primary" />
                        </div>
                        <p className="text-lg font-semibold text-primary">
                            {selectedBirim?.roleName}
                        </p>
                    </div>
                </div>

                <div className="pt-4 border-t space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            Oluşturulma Tarihi
                        </span>
                        <span>{new Date(user.createdAt).toLocaleDateString('tr-TR')}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-muted-foreground">
                            <Activity className="h-4 w-4" />
                            Hesap Durumu
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${user.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                            {user.isActive ? 'Aktif' : 'Pasif'}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>

      {/* Password Change Modal */}
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Şifre Değiştir</DialogTitle>
                <DialogDescription>
                    Hesap güvenliğiniz için güçlü bir şifre belirleyin.
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleChangePassword}>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="currentPassword">Mevcut Şifre</Label>
                        <Input
                            id="currentPassword"
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="newPassword">Yeni Şifre</Label>
                        <Input
                            id="newPassword"
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            required
                            minLength={8}
                            placeholder="En az 8 karakter"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="confirmPassword">Yeni Şifre Tekrar</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            required
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setShowPasswordModal(false)}>İptal</Button>
                    <Button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700 text-white">
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Değiştiriliyor...
                            </>
                        ) : (
                            'Şifreyi Değiştir'
                        )}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
