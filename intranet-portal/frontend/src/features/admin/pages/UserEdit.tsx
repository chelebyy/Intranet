import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usersApi } from '../../../api/usersApi';
import { unvansApi } from '../../../api/unvansApi';
import { birimsApi } from '../../../api/birimsApi';
import { rolesApi } from '../../../api/rolesApi';
import type { Unvan } from '../../../types/api/unvans';
import type { UserDto } from '../../../types/api/users';
import type { Birim } from '../../../types/api/birims';
import type { Role } from '../../../types/api/roles';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, Loader2, User, Briefcase, Shield, Trash2, Plus } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const UserEdit: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [unvanlar, setUnvanlar] = useState<Unvan[]>([]);
    const [birimler, setBirimler] = useState<Birim[]>([]);
    const [roller, setRoller] = useState<Role[]>([]);
    const [user, setUser] = useState<UserDto | null>(null);
    const [showAssignmentModal, setShowAssignmentModal] = useState(false);
    const [assignmentForm, setAssignmentForm] = useState({ birimId: '', roleId: '' });
    const [assignmentSaving, setAssignmentSaving] = useState(false);

    const [formData, setFormData] = useState({
        ad: '',
        soyad: '',
        sicil: '',
        unvan: '',
        isActive: true
    });

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;

            try {
                setLoading(true);
                const [userData, unvanData, birimData, roleData] = await Promise.all([
                    usersApi.getById(Number(id)),
                    unvansApi.getAll(),
                    birimsApi.getAll(),
                    rolesApi.getAll()
                ]);

                setUser(userData);
                setUnvanlar(unvanData.filter(u => u.isActive));
                setBirimler(birimData.filter(b => b.isActive));
                setRoller(roleData);

                setFormData({
                    ad: userData.ad || '',
                    soyad: userData.soyad || '',
                    sicil: userData.sicil || '',
                    unvan: userData.unvan || '',
                    isActive: userData.isActive
                });
            } catch (err) {
                console.error('Error fetching data:', err);
                toast.error('Kullanıcı bilgileri yüklenirken bir hata oluştu.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleUnvanChange = (value: string) => {
        setFormData(prev => ({ ...prev, unvan: value }));
    };

    const handleSwitchChange = (checked: boolean) => {
        setFormData(prev => ({ ...prev, isActive: checked }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;

        setSaving(true);

        try {
            await usersApi.update(Number(id), {
                ad: formData.ad,
                soyad: formData.soyad,
                sicil: formData.sicil,
                unvan: formData.unvan,
                isActive: formData.isActive
            });
            toast.success('Kullanıcı başarıyla güncellendi');
            navigate('/users');
        } catch (err: any) {
            console.error('Error updating user:', err);
            toast.error(err.response?.data?.error?.message || 'Kullanıcı güncellenirken bir hata oluştu.');
        } finally {
            setSaving(false);
        }
    };

    const refreshUser = async () => {
        if (!id) return;
        try {
            const userData = await usersApi.getById(Number(id));
            setUser(userData);
        } catch (err) {
            console.error('Error refreshing user:', err);
        }
    };

    const handleAddAssignment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id || !assignmentForm.birimId || !assignmentForm.roleId) return;

        setAssignmentSaving(true);

        try {
            await usersApi.addBirimRole(
                Number(id),
                Number(assignmentForm.birimId),
                Number(assignmentForm.roleId)
            );
            toast.success('Atama başarıyla eklendi');
            setShowAssignmentModal(false);
            setAssignmentForm({ birimId: '', roleId: '' });
            await refreshUser();
        } catch (err: any) {
            console.error('Error adding assignment:', err);
            toast.error(err.response?.data?.error?.message || 'Atama eklenirken bir hata oluştu.');
        } finally {
            setAssignmentSaving(false);
        }
    };

    const handleRemoveAssignment = async (birimId: number) => {
        if (!id) return;
        if (!confirm('Bu atamayı kaldırmak istediğinizden emin misiniz?')) return;

        try {
            await usersApi.removeBirimRole(Number(id), birimId);
            toast.success('Atama kaldırıldı');
            await refreshUser();
        } catch (err: any) {
            console.error('Error removing assignment:', err);
            toast.error(err.response?.data?.error?.message || 'Atama kaldırılırken bir hata oluştu.');
        }
    };

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="p-8 text-center">
                <p className="text-muted-foreground">Kullanıcı bulunamadı.</p>
                <Button variant="link" onClick={() => navigate('/users')}>Listeye Dön</Button>
            </div>
        );
    }

    return (
        <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/users')}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Kullanıcı Düzenle</h2>
                        <p className="text-muted-foreground">
                            {user.ad} {user.soyad} ({user.sicil})
                        </p>
                    </div>
                </div>
                <Badge className={`px-3 py-1 ${formData.isActive ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}>
                    {formData.isActive ? 'Aktif' : 'Pasif'}
                </Badge>
            </div>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="general">Genel Bilgiler</TabsTrigger>
                    <TabsTrigger value="assignments">Birim & Rol Atamaları</TabsTrigger>
                    <TabsTrigger value="permissions" disabled>Sayfa Yetkileri</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="mt-6">
                    <Card>
                        <form onSubmit={handleSubmit}>
                            <CardHeader>
                                <CardTitle>Kullanıcı Bilgileri</CardTitle>
                                <CardDescription>
                                    Kullanıcının temel kimlik bilgilerini güncelleyin.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="ad">Ad <span className="text-destructive">*</span></Label>
                                        <Input
                                            id="ad"
                                            name="ad"
                                            value={formData.ad}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="soyad">Soyad <span className="text-destructive">*</span></Label>
                                        <Input
                                            id="soyad"
                                            name="soyad"
                                            value={formData.soyad}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="sicil">Sicil No <span className="text-destructive">*</span></Label>
                                        <Input
                                            id="sicil"
                                            name="sicil"
                                            value={formData.sicil}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="unvan">Ünvan</Label>
                                        <Select value={formData.unvan} onValueChange={handleUnvanChange}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seçiniz" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {unvanlar.map(unvan => (
                                                    <SelectItem key={unvan.unvanID} value={unvan.unvanAdi}>
                                                        {unvan.unvanAdi}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <Separator />

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Kullanıcı Durumu</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Pasif kullanıcılar sisteme giriş yapamaz.
                                        </p>
                                    </div>
                                    <Switch
                                        checked={formData.isActive}
                                        onCheckedChange={handleSwitchChange}
                                        className="data-[state=checked]:bg-green-600"
                                    />
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end gap-4 border-t bg-muted/50 px-6 py-4">
                                <Button type="button" className="bg-red-600 hover:bg-red-700 text-white" onClick={() => navigate('/users')}>
                                    İptal
                                </Button>
                                <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white">
                                    {saving ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Kaydediliyor...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="mr-2 h-4 w-4" />
                                            Kaydet
                                        </>
                                    )}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </TabsContent>

                <TabsContent value="assignments" className="mt-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Birim & Rol Atamaları</CardTitle>
                                <CardDescription>
                                    Kullanıcının atandığı birimler ve sahip olduğu roller.
                                </CardDescription>
                            </div>
                            <Button onClick={() => setShowAssignmentModal(true)} className="bg-purple-600 hover:bg-purple-700 text-white">
                                <Plus className="mr-2 h-4 w-4" />
                                Yeni Atama Ekle
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {user.birimRoles && user.birimRoles.length > 0 ? (
                                <div className="space-y-4">
                                    {user.birimRoles.map((br) => (
                                        <div key={`${br.birimID}-${br.roleID}`} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 bg-primary/10 rounded-full text-primary">
                                                    <Briefcase className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">{br.birimAdi}</p>
                                                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
                                                        <Shield className="h-3.5 w-3.5" />
                                                        {br.roleName}
                                                    </div>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleRemoveAssignment(br.birimID)}
                                                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                                    <User className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                                    <h3 className="text-lg font-medium">Henüz atama yapılmamış</h3>
                                    <p className="text-muted-foreground text-sm mt-1">
                                        Bu kullanıcıya birim ve rol atamak için "Yeni Atama Ekle" butonunu kullanın.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="permissions" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Sayfa Yetkileri</CardTitle>
                            <CardDescription>
                                Kullanıcının erişebildiği sayfalar ve modüller.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="py-12 text-center">
                            <div className="mx-auto w-16 h-16 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center mb-4">
                                <Shield className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                            </div>
                            <h3 className="text-lg font-medium mb-2">Yakında Eklenecek</h3>
                            <p className="text-muted-foreground max-w-md mx-auto">
                                Sayfa bazlı yetkilendirme sistemi henüz geliştirme aşamasındadır.
                                Bu özellik ile kullanıcılara özel sayfa erişim yetkileri tanımlayabileceksiniz.
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Assignment Modal */}
            <Dialog open={showAssignmentModal} onOpenChange={setShowAssignmentModal}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Yeni Birim-Rol Ataması</DialogTitle>
                        <DialogDescription>
                            Kullanıcıya yeni bir birim ve rol atayın.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddAssignment}>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="birimId">Birim <span className="text-destructive">*</span></Label>
                                <Select
                                    value={assignmentForm.birimId}
                                    onValueChange={(value) => setAssignmentForm(prev => ({ ...prev, birimId: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Birim Seçiniz" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {birimler.map(birim => (
                                            <SelectItem key={birim.birimID} value={String(birim.birimID)}>
                                                {birim.birimAdi}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="roleId">Rol <span className="text-destructive">*</span></Label>
                                <Select
                                    value={assignmentForm.roleId}
                                    onValueChange={(value) => setAssignmentForm(prev => ({ ...prev, roleId: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Rol Seçiniz" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roller.map(rol => (
                                            <SelectItem key={rol.roleID} value={String(rol.roleID)}>
                                                {rol.roleName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setShowAssignmentModal(false)}>İptal</Button>
                            <Button type="submit" disabled={assignmentSaving} className="bg-purple-600 hover:bg-purple-700 text-white">
                                {assignmentSaving ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Atanıyor...
                                    </>
                                ) : (
                                    'Ata'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};