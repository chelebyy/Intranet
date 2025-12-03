import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Lock, User } from 'lucide-react';
import MatrixBackground from '../../shared/components/MatrixBackground';
import { useAuthStore } from '../../store/authStore';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);

    const [formData, setFormData] = useState({ sicil: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await login({ ...formData, rememberMe });

            // Check if user needs to select birim
            const authState = useAuthStore.getState();
            if (authState.birimleri.length > 1 && !authState.selectedBirim) {
                navigate('/select-birim');
            } else {
                navigate('/dashboard');
            }
        } catch (err: any) {
            setError(err.message || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <>
            <MatrixBackground />
            <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
                <Card className="w-full max-w-[400px] bg-black/40 backdrop-blur-xl border-white/10 shadow-2xl">
                    <CardHeader className="space-y-1 text-center pb-8">
                        <CardTitle className="text-3xl font-bold bg-gradient-to-br from-purple-400 to-purple-600 bg-clip-text text-transparent">
                            Hoş Geldiniz
                        </CardTitle>
                        <CardDescription className="text-gray-400 text-base">
                            Kurumsal İntranet Portalı
                        </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="p-3 text-sm bg-red-500/10 border border-red-500/20 rounded-md text-red-400">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2 group">
                                <Label htmlFor="sicil" className="text-gray-300 font-medium ml-1">Sicil Numarası</Label>
                                <div className="relative transition-all duration-300 group-focus-within:scale-[1.02]">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-colors duration-300 group-focus-within:text-purple-400">
                                        <User className="h-5 w-5" />
                                    </div>
                                    <Input
                                        id="sicil"
                                        name="sicil"
                                        placeholder="00001"
                                        value={formData.sicil}
                                        onChange={handleChange}
                                        className="pl-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-600 rounded-xl transition-all duration-300 hover:bg-white/10 focus-visible:bg-white/10 focus-visible:border-purple-500/50 focus-visible:ring-4 focus-visible:ring-purple-500/10"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 group">
                                <Label htmlFor="password" className="text-gray-300 font-medium ml-1">Şifre</Label>
                                <div className="relative transition-all duration-300 group-focus-within:scale-[1.02]">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-colors duration-300 group-focus-within:text-purple-400">
                                        <Lock className="h-5 w-5" />
                                    </div>
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="pl-12 pr-12 h-12 bg-white/5 border-white/10 text-white rounded-xl transition-all duration-300 hover:bg-white/10 focus-visible:bg-white/10 focus-visible:border-purple-500/50 focus-visible:ring-4 focus-visible:ring-purple-500/10"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors p-1 rounded-full hover:bg-white/10"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox 
                                    id="remember" 
                                    checked={rememberMe}
                                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                                    className="border-white/20 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                                />
                                <label
                                    htmlFor="remember"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-400"
                                >
                                    Beni hatırla
                                </label>
                            </div>

                            <Button 
                                type="submit" 
                                className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white shadow-lg shadow-purple-900/20 border-0 h-11"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Giriş Yapılıyor
                                    </>
                                ) : (
                                    'Giriş Yap'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                    
                    <CardFooter className="flex justify-center pb-8">
                        <Button variant="link" className="text-purple-400 hover:text-purple-300 text-sm font-normal p-0 h-auto">
                            Şifremi Unuttum
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </>
    );
};

export default LoginPage;