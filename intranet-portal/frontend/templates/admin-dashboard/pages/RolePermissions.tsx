import React from 'react';

export const RolePermissions: React.FC = () => {
  return (
    <div className="p-6 md:p-8 w-full max-w-7xl mx-auto">
        <div className="flex flex-col gap-1 mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary dark:text-dark-text-primary">Role & Permission Management</h1>
            <p className="text-text-secondary dark:text-dark-text-secondary">Define roles, assign permissions and manage access to modules.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-text-primary dark:text-dark-text-primary">Roles</h2>
                    <button className="flex items-center gap-2 bg-primary text-white px-3 py-2 rounded-lg text-sm font-bold hover:bg-primary-dark transition-colors">
                        <span className="material-symbols-outlined text-sm">add</span> Add New Role
                    </button>
                </div>
                <div className="relative">
                     <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary dark:text-dark-text-secondary">search</span>
                     <input type="text" placeholder="Search for a role..." className="w-full pl-10 pr-4 py-3 border border-border-color dark:border-dark-border rounded-lg bg-card dark:bg-dark-card text-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-text-muted dark:placeholder:text-dark-text-muted" />
                </div>
                <div className="flex flex-col border border-border-color dark:border-dark-border rounded-xl bg-card dark:bg-dark-card overflow-hidden">
                    <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-primary cursor-pointer">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-800 flex items-center justify-center text-primary dark:text-blue-200">
                                <span className="material-symbols-outlined">shield_person</span>
                            </div>
                            <span className="font-medium text-text-primary dark:text-dark-text-primary">System Administrator</span>
                        </div>
                        <span className="material-symbols-outlined text-text-secondary dark:text-dark-text-secondary">chevron_right</span>
                    </div>
                    <div className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 border-t border-border-color dark:border-dark-border cursor-pointer">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-text-secondary dark:text-dark-text-secondary">
                                <span className="material-symbols-outlined">manage_accounts</span>
                            </div>
                            <span className="font-medium text-text-secondary dark:text-dark-text-secondary">Department Manager</span>
                        </div>
                         <span className="material-symbols-outlined text-text-secondary dark:text-dark-text-secondary">chevron_right</span>
                    </div>
                    <div className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 border-t border-border-color dark:border-dark-border cursor-pointer">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-text-secondary dark:text-dark-text-secondary">
                                <span className="material-symbols-outlined">edit_note</span>
                            </div>
                            <span className="font-medium text-text-secondary dark:text-dark-text-secondary">Editor</span>
                        </div>
                         <span className="material-symbols-outlined text-text-secondary dark:text-dark-text-secondary">chevron_right</span>
                    </div>
                    <div className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 border-t border-border-color dark:border-dark-border cursor-pointer">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-text-secondary dark:text-dark-text-secondary">
                                <span className="material-symbols-outlined">badge</span>
                            </div>
                            <span className="font-medium text-text-secondary dark:text-dark-text-secondary">Human Resources</span>
                        </div>
                         <span className="material-symbols-outlined text-text-secondary dark:text-dark-text-secondary">chevron_right</span>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-2 bg-card dark:bg-dark-card border border-border-color dark:border-dark-border rounded-xl p-6 flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-text-primary dark:text-dark-text-primary">Permissions for System Administrator</h2>
                        <p className="text-text-secondary dark:text-dark-text-secondary mt-1">Set permissions for this role.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-text-secondary dark:text-dark-text-secondary rounded-lg font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700">Cancel</button>
                        <button className="px-4 py-2 bg-primary text-white rounded-lg font-bold text-sm hover:bg-primary-dark">Save Changes</button>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="border border-border-color dark:border-dark-border rounded-lg">
                        <div className="p-4 flex justify-between items-center cursor-pointer bg-slate-50/50 dark:bg-slate-800/30">
                            <h3 className="font-semibold text-text-primary dark:text-dark-text-primary">Announcements</h3>
                            <div className="flex items-center gap-4">
                                <button className="text-primary text-sm font-medium hover:underline">Select All</button>
                                <span className="material-symbols-outlined text-text-muted dark:text-dark-text-muted">expand_more</span>
                            </div>
                        </div>
                        <div className="border-t border-border-color dark:border-dark-border p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                             {['View', 'Create', 'Edit', 'Delete'].map((perm) => (
                                <label key={perm} className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" defaultChecked className="rounded text-primary focus:ring-primary border-gray-300 dark:border-gray-600 dark:bg-slate-700" />
                                    <span className="text-text-secondary dark:text-dark-text-secondary">{perm}</span>
                                </label>
                             ))}
                        </div>
                    </div>

                     <div className="border border-border-color dark:border-dark-border rounded-lg">
                        <div className="p-4 flex justify-between items-center cursor-pointer bg-slate-50/50 dark:bg-slate-800/30">
                            <h3 className="font-semibold text-text-primary dark:text-dark-text-primary">Document Management</h3>
                            <div className="flex items-center gap-4">
                                <button className="text-primary text-sm font-medium hover:underline">Select All</button>
                                <span className="material-symbols-outlined text-text-muted dark:text-dark-text-muted">expand_more</span>
                            </div>
                        </div>
                        <div className="border-t border-border-color dark:border-dark-border p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                             {['View', 'Upload', 'Delete', 'Create Folder'].map((perm) => (
                                <label key={perm} className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" defaultChecked className="rounded text-primary focus:ring-primary border-gray-300 dark:border-gray-600 dark:bg-slate-700" />
                                    <span className="text-text-secondary dark:text-dark-text-secondary">{perm}</span>
                                </label>
                             ))}
                        </div>
                    </div>

                     <div className="border border-border-color dark:border-dark-border rounded-lg">
                        <div className="p-4 flex justify-between items-center cursor-pointer bg-slate-50/50 dark:bg-slate-800/30">
                            <h3 className="font-semibold text-text-primary dark:text-dark-text-primary">User Management</h3>
                            <div className="flex items-center gap-4">
                                <button className="text-primary text-sm font-medium hover:underline">Select All</button>
                                <span className="material-symbols-outlined text-text-muted dark:text-dark-text-muted">expand_more</span>
                            </div>
                        </div>
                        <div className="border-t border-border-color dark:border-dark-border p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                             {['Add User', 'Edit User', 'Assign Role'].map((perm) => (
                                <label key={perm} className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" defaultChecked className="rounded text-primary focus:ring-primary border-gray-300 dark:border-gray-600 dark:bg-slate-700" />
                                    <span className="text-text-secondary dark:text-dark-text-secondary">{perm}</span>
                                </label>
                             ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};