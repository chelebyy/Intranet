import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usersApi } from '../../../api/usersApi';
import { unvansApi } from '../../../api/unvansApi';
import type { Unvan } from '../../../types/api/unvans';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, Loader2, Info } from 'lucide-react';
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const UserCreate: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [unvanlar, setUnvanlar] = useState<Unvan[]>([]);

    const [formData, setFormData] = useState({
        ad: '',
        soyad: '',
        sicil: '',
        unvan: '',
        password: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const unvanData = await unvansApi.getAll();
                setUnvanlar(unvanData.filter(u => u.isActive));
            } catch (err) {
                console.error('Error fetching form data:', err);
                toast.error('Form verileri yüklenirken bir hata oluştu.');
            }
        };
        fetchData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleUnvanChange = (value: string) => {
        setFormData(prev => ({ ...prev, unvan: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await usersApi.create({
                ad: formData.ad,
                soyad: formData.soyad,
                sicil: formData.sicil,
                unvan: formData.unvan,
                sifre: formData.password
            });
            toast.success('Kullanıcı başarıyla oluşturuldu');
            navigate('/users');
        } catch (err: any) {
            console.error('Error creating user:', err);
            toast.error(err.message || 'Kullanıcı oluşturulurken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex max-w-3xl mx-auto">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/users')}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Yeni Kullanıcı Ekle</h2>
                    <p className="text-muted-foreground">
                        Sisteme yeni bir personel tanımlayın.
                    </p>
                </div>
            </div>

            <Card>
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle>Kullanıcı Bilgileri</CardTitle>
                        <CardDescription>
                            Kullanıcının temel kimlik ve giriş bilgilerini giriniz.
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
                                    placeholder="Örn: Ahmet"
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
                                    placeholder="Örn: Yılmaz"
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
                                    placeholder="Örn: 12345"
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

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="password">Şifre <span className="text-destructive">*</span></Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    minLength={12}
                                    placeholder="En az 12 karakter"
                                />
                                <p className="text-[0.8rem] text-muted-foreground">
                                    Şifre en az 12 karakter uzunluğunda olmalıdır.
                                </p>
                            </div>
                        </div>

                        <Alert className="bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300">
                            <Info className="h-4 w-4 !text-blue-600 dark:!text-blue-400" />
                            <AlertTitle>Birim ve Rol Ataması</AlertTitle>
                            <AlertDescription>
                                Kullanıcı oluşturulduktan sonra, düzenleme sayfasından birim ve rol ataması yapabilirsiniz.
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-4 border-t bg-muted/50 px-6 py-4">
                        <Button type="button" className="bg-red-600 hover:bg-red-700 text-white" onClick={() => navigate('/users')}>
                            İptal
                        </Button>
                        <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
                            {loading ? (
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
        </div>
    );
};
