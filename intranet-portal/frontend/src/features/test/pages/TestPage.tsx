import React from 'react';

/**
 * Test Sayfası - Admin Dashboard altyapısını test etmek için sandbox ortamı
 * Bu sayfa geliştirme sürecinde layout, navigasyon ve routing mekanizmalarını
 * doğrulamak amacıyla kullanılır.
 */
export const TestPage: React.FC = () => {
  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary mb-2">
          Test Paneli
        </h1>
        <p className="text-text-secondary dark:text-dark-text-secondary">
          Bu sayfa, Admin Dashboard altyapısını test etmek için oluşturulmuş bir sandbox ortamıdır.
        </p>
      </div>

      {/* Test Content Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Layout Test Card */}
        <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-border-color dark:border-dark-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-3xl text-primary">dashboard</span>
            <h2 className="text-lg font-semibold text-text-primary dark:text-dark-text-primary">
              Layout Testi
            </h2>
          </div>
          <p className="text-text-secondary dark:text-dark-text-secondary text-sm">
            AdminLayout bileşeni (Header + Sidebar) bu sayfayı düzgün bir şekilde çevreliyor mu?
          </p>
          <div className="mt-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-green-500">check_circle</span>
            <span className="text-sm text-green-600 dark:text-green-400">Layout aktif</span>
          </div>
        </div>

        {/* Navigation Test Card */}
        <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-border-color dark:border-dark-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-3xl text-primary">menu</span>
            <h2 className="text-lg font-semibold text-text-primary dark:text-dark-text-primary">
              Navigasyon Testi
            </h2>
          </div>
          <p className="text-text-secondary dark:text-dark-text-secondary text-sm">
            Sidebar'da "Test Sayfası" linki görünüyor ve tıklandığında aktif duruma geçiyor mu?
          </p>
          <div className="mt-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-green-500">check_circle</span>
            <span className="text-sm text-green-600 dark:text-green-400">Navigasyon çalışıyor</span>
          </div>
        </div>

        {/* Routing Test Card */}
        <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-border-color dark:border-dark-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-3xl text-primary">route</span>
            <h2 className="text-lg font-semibold text-text-primary dark:text-dark-text-primary">
              Routing Testi
            </h2>
          </div>
          <p className="text-text-secondary dark:text-dark-text-secondary text-sm">
            /test rotası doğru şekilde bu sayfaya yönlendiriyor mu?
          </p>
          <div className="mt-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-green-500">check_circle</span>
            <span className="text-sm text-green-600 dark:text-green-400">Rota aktif</span>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined text-blue-500 text-2xl">info</span>
          <div>
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2">
              Sandbox Ortamı
            </h3>
            <p className="text-blue-700 dark:text-blue-400 text-sm">
              Bu sayfa, geliştirme sürecinde yeni özellikleri test etmek için kullanılabilir. 
              İstenildiği zaman kolayca silinebilir veya değiştirilebilir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
