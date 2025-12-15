import React, { useState, useEffect } from 'react';
import { unvansApi } from '../../../api/unvansApi';
import type { Unvan } from '../../../types/api/unvans';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Trash2, Loader2, ShieldX } from 'lucide-react';

// Render table content based on state
function renderTableContent(
    loading: boolean,
    unvanlar: Unvan[],
    handleOpenModal: (unvan?: Unvan) => void,
    handleDelete: (id: number) => void
) {
    if (loading) {
        return (
            <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                    <div className="flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <span className="ml-2 text-muted-foreground">Yükleniyor...</span>
                    </div>
                </TableCell>
            </TableRow>
        );
    }

    if (unvanlar.length === 0) {
        return (
            <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <ShieldX className="h-8 w-8 mb-2" />
                        Henüz ünvan tanımlanmamış.
                    </div>
                </TableCell>
            </TableRow>
        );
    }

    return unvanlar.map((unvan) => (
        <TableRow key={unvan.unvanID} className="group">
            <TableCell className="font-medium">{unvan.unvanAdi}</TableCell>
            <TableCell className="text-muted-foreground">{unvan.aciklama || '-'}</TableCell>
            <TableCell className="text-center">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${unvan.isActive
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                    }`}>
                    {unvan.isActive ? 'Aktif' : 'Pasif'}
                </span>
            </TableCell>
            <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenModal(unvan)}
                        title="Düzenle"
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(unvan.unvanID)}
                        title="Sil"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    ));
}

export const UnvanList: React.FC = () => {
    const [unvanlar, setUnvanlar] = useState<Unvan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [editingUnvan, setEditingUnvan] = useState<Unvan | null>(null);
    const [formData, setFormData] = useState({
        unvanAdi: '',
        aciklama: '',
        isActive: true
    });
    const [saving, setSaving] = useState(false);

    const fetchUnvanlar = async () => {
        try {
            setLoading(true);
            const data = await unvansApi.getAll();
            setUnvanlar(data);
            setError(null);
        } catch (err: unknown) {
            console.error('Error fetching unvanlar:', err);
            setError('Ünvanlar yüklenirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUnvanlar();
    }, []);

    const handleOpenModal = (unvan?: Unvan) => {
        if (unvan) {
            setEditingUnvan(unvan);
            setFormData({
                unvanAdi: unvan.unvanAdi,
                aciklama: unvan.aciklama || '',
                isActive: unvan.isActive
            });
        } else {
            setEditingUnvan(null);
            setFormData({
                unvanAdi: '',
                aciklama: '',
                isActive: true
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingUnvan(null);
        setFormData({
            unvanAdi: '',
            aciklama: '',
            isActive: true
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            if (editingUnvan) {
                await unvansApi.update(editingUnvan.unvanID, formData);
            } else {
                await unvansApi.create(formData);
            }
            handleCloseModal();
            fetchUnvanlar();
        } catch (err: unknown) {
            console.error('Error saving unvan:', err);
            const errorMessage = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message;
            setError(errorMessage || 'Ünvan kaydedilirken bir hata oluştu.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!globalThis.confirm('Bu ünvanı silmek istediğinizden emin misiniz?')) {
            return;
        }

        try {
            await unvansApi.delete(id);
            fetchUnvanlar();
        } catch (err: unknown) {
            console.error('Error deleting unvan:', err);
            setError('Ünvan silinirken bir hata oluştu.');
        }
    };

    return (
        <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Ünvan Tanımlamaları</h2>
                    <p className="text-muted-foreground">
                        Sistemde kullanılacak ünvanları buradan yönetebilirsiniz.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button onClick={() => handleOpenModal()} className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="mr-2 h-4 w-4" />
                        Yeni Ünvan
                    </Button>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <div className="rounded-md border bg-card text-card-foreground shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Ünvan Adı</TableHead>
                            <TableHead>Açıklama</TableHead>
                            <TableHead className="text-center">Durum</TableHead>
                            <TableHead className="text-right">İşlemler</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {renderTableContent(loading, unvanlar, handleOpenModal, handleDelete)}
                    </TableBody>
                </Table>
            </div>

            {/* Modal */}
            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{editingUnvan ? 'Ünvan Düzenle' : 'Yeni Ünvan Ekle'}</DialogTitle>
                        <DialogDescription>
                            Ünvan bilgilerini aşağıdan düzenleyebilirsiniz.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="unvanAdi">Ünvan Adı <span className="text-red-500">*</span></Label>
                                <Input
                                    id="unvanAdi"
                                    value={formData.unvanAdi}
                                    onChange={(e) => setFormData(prev => ({ ...prev, unvanAdi: e.target.value }))}
                                    required
                                    placeholder="Örn: Uzman, Müdür, Şef"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="aciklama">Açıklama</Label>
                                <Textarea
                                    id="aciklama"
                                    value={formData.aciklama}
                                    onChange={(e) => setFormData(prev => ({ ...prev, aciklama: e.target.value }))}
                                    placeholder="Ünvan hakkında açıklama..."
                                    className="resize-none"
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="isActive"
                                    checked={formData.isActive}
                                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked as boolean }))}
                                    className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                                />
                                <Label htmlFor="isActive" className="font-normal cursor-pointer">
                                    Aktif
                                </Label>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" className="bg-red-600 hover:bg-red-700 text-white" onClick={handleCloseModal}>İptal</Button>
                            <Button type="submit" disabled={saving} className="bg-blue-600 text-white hover:bg-blue-700">
                                {saving ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Kaydediliyor...
                                    </>
                                ) : (
                                    'Kaydet'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};
