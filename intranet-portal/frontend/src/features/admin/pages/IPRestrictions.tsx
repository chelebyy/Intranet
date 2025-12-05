import React, { useState, useEffect } from 'react';
import { ipRestrictionsApi } from '../../../api/ipRestrictionsApi';
import type { IPRestriction, CreateIPRestrictionDto } from '../../../api/ipRestrictionsApi';
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
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Ban, Trash2, Shield, Loader2, Check, X } from 'lucide-react';
import AnimatedBadge from "@/components/ui/animated-badge";

// Render table content based on state
function renderTableContent(
    loading: boolean,
    restrictions: IPRestriction[],
    deleteConfirm: number | null,
    setDeleteConfirm: (value: number | null) => void,
    handleToggleActive: (restriction: IPRestriction) => void,
    handleDelete: (id: number) => void,
    formatDate: (dateStr: string) => string
) {
    if (loading) {
        return (
            <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                    <div className="flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <span className="ml-2 text-muted-foreground">Yükleniyor...</span>
                    </div>
                </TableCell>
            </TableRow>
        );
    }

    if (restrictions.length === 0) {
        return (
            <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Shield className="h-8 w-8 mb-2" />
                        Henüz IP kuralı bulunmuyor
                    </div>
                </TableCell>
            </TableRow>
        );
    }

    return restrictions.map((restriction) => (
        <TableRow key={restriction.id} className="group">
            <TableCell className="font-mono">{restriction.ipAddress}</TableCell>
            <TableCell>
                <Badge variant={restriction.type === 'Whitelist' ? 'secondary' : 'destructive'}>
                    {restriction.type}
                </Badge>
            </TableCell>
            <TableCell>{restriction.description || '-'}</TableCell>
            <TableCell>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleActive(restriction)}
                    className={`h-6 text-xs font-medium rounded-full px-2 ${restriction.isActive
                        ? 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800'
                        : 'bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                        }`}
                >
                    {restriction.isActive ? 'Aktif' : 'Pasif'}
                </Button>
            </TableCell>
            <TableCell className="text-muted-foreground text-xs">
                {formatDate(restriction.createdAt)}
            </TableCell>
            <TableCell className="text-right">
                {deleteConfirm === restriction.id ? (
                    <div className="flex items-center justify-end gap-2">
                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(restriction.id)}
                            className="h-8 px-2"
                        >
                            <Check className="h-4 w-4 mr-1" /> Onayla
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
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteConfirm(restriction.id)}
                        title="Sil"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                )}
            </TableCell>
        </TableRow>
    ));
}

export const IPRestrictions: React.FC = () => {
    const [restrictions, setRestrictions] = useState<IPRestriction[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
    const [formData, setFormData] = useState<CreateIPRestrictionDto>({
        ipAddress: '',
        description: '',
        type: 'Whitelist'
    });

    useEffect(() => {
        fetchRestrictions();
    }, []);

    const fetchRestrictions = async () => {
        try {
            setLoading(true);
            const data = await ipRestrictionsApi.getAll();
            setRestrictions(data);
        } catch (error) {
            console.error('IP kuralları yüklenirken hata:', error);
            toast.error('IP kuralları yüklenemedi');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.ipAddress) {
            toast.error('IP adresi gerekli');
            return;
        }

        try {
            await ipRestrictionsApi.create(formData);
            toast.success('IP kuralı eklendi');
            setShowModal(false);
            setFormData({ ipAddress: '', description: '', type: 'Whitelist' });
            fetchRestrictions();
        } catch (error) {
            console.error('IP kuralı eklenirken hata:', error);
            toast.error('IP kuralı eklenemedi');
        }
    };

    const handleToggleActive = async (restriction: IPRestriction) => {
        try {
            await ipRestrictionsApi.update(restriction.id, { isActive: !restriction.isActive });
            toast.success(restriction.isActive ? 'Kural devre dışı bırakıldı' : 'Kural aktifleştirildi');
            fetchRestrictions();
        } catch (error) {
            console.error('Kural güncellenirken hata:', error);
            toast.error('Kural güncellenemedi');
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await ipRestrictionsApi.delete(id);
            toast.success('IP kuralı silindi');
            setDeleteConfirm(null);
            fetchRestrictions();
        } catch (error) {
            console.error('IP kuralı silinirken hata:', error);
            toast.error('IP kuralı silinemedi');
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleString('tr-TR');
    };

    return (
        <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">IP Kısıtlamaları</h2>
                    <p className="text-muted-foreground">
                        Sisteme erişim izni verilen veya engellenen IP adreslerini yönetin.
                    </p>
                </div>
                <Button
                    variant="ghost"
                    onClick={() => setShowModal(true)}
                    className="p-0 h-auto hover:bg-transparent"
                >
                    <AnimatedBadge
                        text="Yeni Kural Ekle"
                        color="#22d3ee"
                    />
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Whitelist
                        </CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {restrictions.filter(r => r.type === 'Whitelist' && r.isActive).length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Aktif izin verilen kural
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Blacklist
                        </CardTitle>
                        <Ban className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {restrictions.filter(r => r.type === 'Blacklist' && r.isActive).length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Aktif engellenen kural
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="rounded-md border bg-card text-card-foreground shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>IP Adresi</TableHead>
                            <TableHead>Tip</TableHead>
                            <TableHead>Açıklama</TableHead>
                            <TableHead>Durum</TableHead>
                            <TableHead>Oluşturulma</TableHead>
                            <TableHead className="text-right">İşlemler</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {renderTableContent(
                            loading,
                            restrictions,
                            deleteConfirm,
                            setDeleteConfirm,
                            handleToggleActive,
                            handleDelete,
                            formatDate
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Create Modal */}
            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Yeni IP Kuralı</DialogTitle>
                        <DialogDescription>
                            Erişimi yönetmek için yeni bir IP kuralı ekleyin.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreate}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="ipAddress">IP Adresi / CIDR</Label>
                                <Input
                                    id="ipAddress"
                                    value={formData.ipAddress}
                                    onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                                    placeholder="192.168.1.1 veya 192.168.1.0/24"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="type">Tip</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(value) => setFormData({ ...formData, type: value as 'Whitelist' | 'Blacklist' })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Tip seçin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Whitelist">Whitelist (İzin Ver)</SelectItem>
                                        <SelectItem value="Blacklist">Blacklist (Engelle)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">Açıklama</Label>
                                <Input
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Örn: Ofis ağı"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setShowModal(false)}>İptal</Button>
                            <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">
                                Ekle
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};
