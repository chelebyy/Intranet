import React, { useState, useEffect, useMemo } from 'react';
import { birimsApi } from '../../../api/birimsApi';
import type { Birim, CreateBirimRequest } from '../../../types/api/birims';
import toast from 'react-hot-toast';
import { Search, Building2, Edit, Loader2 } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const DepartmentList: React.FC = () => {
    const [birimler, setBirimler] = useState<Birim[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingBirim, setEditingBirim] = useState<Birim | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState<CreateBirimRequest>({
        birimAdi: '',
        aciklama: '',
        isActive: true
    });

    // Filter birimler based on search
    const filteredBirimler = useMemo(() => {
        if (!searchTerm.trim()) return birimler;
        const term = searchTerm.toLowerCase();
        return birimler.filter(b => 
            b.birimAdi.toLowerCase().includes(term) ||
            b.aciklama?.toLowerCase().includes(term)
        );
    }, [birimler, searchTerm]);

    useEffect(() => {
        fetchBirimler();
    }, []);

    const fetchBirimler = async () => {
        try {
            setLoading(true);
            // Admin sayfasında pasif birimler de görünsün
            const data = await birimsApi.getAll(true);
            setBirimler(data);
        } catch (error) {
            console.error('Birimler yüklenirken hata:', error);
            toast.error('Birimler yüklenemedi');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingBirim) return; // Sadece güncelleme destekleniyor
        try {
            await birimsApi.update(editingBirim.birimID, formData);
            toast.success('Birim başarıyla güncellendi');
            setShowModal(false);
            setEditingBirim(null);
            setFormData({ birimAdi: '', aciklama: '', isActive: true });
            fetchBirimler();
        } catch (error) {
            console.error('Birim kaydedilirken hata:', error);
            toast.error('Birim kaydedilemedi');
        }
    };

    const handleEdit = (birim: Birim) => {
        setEditingBirim(birim);
        setFormData({
            birimAdi: birim.birimAdi,
            aciklama: birim.aciklama || '',
            isActive: birim.isActive
        });
        setShowModal(true);
    };


    return (
        <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
            {/* Header */}
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Birim Yönetimi</h2>
                    <p className="text-muted-foreground">
                        Sistemdeki birimleri yönetin ({filteredBirimler.length}/{birimler.length} birim)
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    {/* Manuel birim ekleme devre dışı bırakıldı - Sistem modülleri otomatik yüklenir */}
                </div>
            </div>

            {/* Search */}
            <div className="flex items-center space-x-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Birim ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                    />
                </div>
            </div>

            {/* Birim Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading ? (
                    <div className="col-span-full flex items-center justify-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : filteredBirimler.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center h-64 text-muted-foreground">
                        <Building2 className="w-12 h-12 mb-2 opacity-50" />
                        <p>{searchTerm ? 'Arama sonucu bulunamadı' : 'Henüz birim bulunmuyor'}</p>
                    </div>
                ) : (
                    filteredBirimler.map((birim) => (
                        <Card key={birim.birimID} className="hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <Building2 className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-base font-semibold">
                                            {birim.birimAdi}
                                        </CardTitle>
                                        <div className={`inline-flex items-center gap-1 text-xs mt-1 ${birim.isActive ? 'text-green-600 dark:text-green-400' : 'text-slate-500'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${birim.isActive ? 'bg-green-500' : 'bg-slate-400'}`}></span>
                                            {birim.isActive ? 'Aktif' : 'Pasif'}
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {birim.aciklama && (
                                    <CardDescription className="line-clamp-2 mt-2">
                                        {birim.aciklama}
                                    </CardDescription>
                                )}
                            </CardContent>
                            <CardFooter className="border-t bg-muted/50 px-6 py-3">
                                <div className="flex w-full items-center justify-center">
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="h-8"
                                        onClick={() => handleEdit(birim)}
                                    >
                                        <Edit className="w-4 h-4 mr-2" />
                                        Düzenle
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    ))
                )}
            </div>

            {/* Modal */}
            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Birim Düzenle</DialogTitle>
                        <DialogDescription>
                            Birim açıklamasını düzenleyebilirsiniz.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="birimAdi">Birim Adı</Label>
                                <Input
                                    id="birimAdi"
                                    value={formData.birimAdi}
                                    disabled
                                    className="bg-muted"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="aciklama">Açıklama</Label>
                                <Textarea
                                    id="aciklama"
                                    value={formData.aciklama}
                                    onChange={(e) => setFormData({ ...formData, aciklama: e.target.value })}
                                    placeholder="Birim hakkında kısa açıklama..."
                                    className="resize-none"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setShowModal(false)}>İptal</Button>
                            <Button type="submit" className="bg-purple-600 text-white hover:bg-purple-700">
                                Güncelle
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};
