import React from 'react';
import { AlertTriangle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

const MaintenanceLockPage: React.FC = () => {
    const navigate = useNavigate();
    const { logout } = useAuthStore();

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
            <div className="max-w-md w-full space-y-8 text-center bg-white dark:bg-slate-900 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800">
                <div className="flex justify-center">
                    <div className="h-24 w-24 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center animate-pulse">
                        <AlertTriangle className="h-12 w-12 text-yellow-600 dark:text-yellow-500" />
                    </div>
                </div>
                
                <div className="space-y-4">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                        Sistem Bakım Modunda
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Şu anda sistemde planlı bakım çalışması yapılmaktadır. 
                        Veri güvenliğini sağlamak amacıyla geçici olarak erişim kısıtlanmıştır.
                    </p>
                    
                    <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-500 bg-slate-50 dark:bg-slate-950 py-3 rounded-lg border border-slate-100 dark:border-slate-800">
                        <Clock className="h-4 w-4" />
                        <span>Lütfen daha sonra tekrar deneyiniz.</span>
                    </div>
                </div>

                <div className="pt-4">
                    <Button 
                        variant="outline" 
                        onClick={() => logout()}
                        className="w-full"
                    >
                        Çıkış Yap
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default MaintenanceLockPage;
