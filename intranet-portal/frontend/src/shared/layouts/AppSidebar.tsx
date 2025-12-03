import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { usePermission, Permissions } from '../../hooks/usePermission';
import { Page } from '../../types';
import {
    LayoutDashboard,
    Users,
    Settings,
    BadgeCheck,
    Building2,
    ShieldCheck,
    History,
    Shield,
    FlaskConical,
    User,
    LogOut,
    Moon,
    Sun,
    ChevronRight,
    Activity,
    Server,
    Bug,
} from 'lucide-react';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarRail,
    SidebarSeparator,
} from "@/components/ui/sidebar";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AppSidebarProps {
    isDarkMode: boolean;
    toggleTheme: () => void;
}

export function AppSidebar({ isDarkMode, toggleTheme }: AppSidebarProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, selectedBirim, currentRoleInfo, logout } = useAuthStore();
    const { hasPermission } = usePermission();

    // SuperAdmin check
    const isSuperAdmin = currentRoleInfo?.roleName === 'SuperAdmin';

    const isActive = (path: string) => location.pathname === path;
    const isGroupActive = (subItems: any[]) => subItems.some(item => location.pathname === item.path);

    const isITUnit = selectedBirim?.birimAdi === 'Bilgi İşlem';
    const isTestUnit = selectedBirim?.birimAdi === 'test';

    const menuItems = useMemo(() => [
        {
            title: "Genel",
            items: [
                {
                    title: "Dashboard",
                    url: "/dashboard",
                    icon: LayoutDashboard,
                },
            ]
        },
        // IT Module - Conditional
        ...(isITUnit ? [{
            title: "Bilgi İşlem Modülü",
            items: [
                {
                    title: "IT Dashboard",
                    url: "/it/dashboard",
                    icon: Activity,
                },
                {
                    title: "Arıza Kayıtları",
                    url: "/it/ariza",
                    icon: Server,
                }
            ]
        }] : []),
        // Test Module - Conditional
        ...(isTestUnit ? [{
            title: "Test Birimi Modülü",
            items: [
                {
                    title: "Test Paneli",
                    url: "/test-unit/dashboard",
                    icon: FlaskConical,
                },
                {
                    title: "Test Senaryoları",
                    url: "/test-unit/cases",
                    icon: Bug,
                }
            ]
        }] : []),
        {
            title: "Yönetim",
            items: [
                {
                    title: "Kullanıcı Yönetimi",
                    url: "/users",
                    icon: Users,
                    permission: Permissions.User.Read
                },
                {
                    title: "Tanımlamalar",
                    icon: Settings,
                    permission: Permissions.Unvan.Read,
                    subItems: [
                        {
                            title: "Ünvanlar",
                            url: "/definitions/unvanlar",
                            icon: BadgeCheck,
                            permission: Permissions.Unvan.Read
                        },
                        {
                            title: "Birimler",
                            url: "/definitions/departments",
                            icon: Building2,
                            permission: Permissions.Birim.Read
                        }
                    ]
                },
                {
                    title: "Role & Permission",
                    url: "/roles",
                    icon: ShieldCheck,
                    permission: Permissions.Role.Read
                }
            ]
        },
        {
            title: "Sistem",
            items: [
                {
                    title: "Audit Log",
                    url: "/audit-log",
                    icon: History,
                    permission: Permissions.AuditLog.Read
                },
                {
                    title: "IP Kısıtlamaları",
                    url: "/ip-restrictions",
                    icon: Shield,
                    permission: Permissions.System.Read
                },
                {
                    title: "Test Sayfası",
                    url: "/test",
                    icon: FlaskConical,
                }
            ]
        }
    ], [isITUnit, isTestUnit]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Helper to filter items by permission
    const filterItems = (items: any[]) => {
        return items.filter(item => {
            if (!item.permission) return true;
            if (isSuperAdmin) return true;
            return hasPermission(item.permission.resource, item.permission.action);
        });
    };

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    size="lg"
                                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                >
                                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                        <Building2 className="size-4" />
                                    </div>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">Intranet Portal</span>
                                        <span className="truncate text-xs">{selectedBirim?.birimAdi || 'Yönetim Paneli'}</span>
                                    </div>
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                {menuItems.map((group) => {
                    const visibleItems = filterItems(group.items);
                    if (visibleItems.length === 0) return null;

                    return (
                        <SidebarGroup key={group.title}>
                            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {visibleItems.map((item) => (
                                        item.subItems ? (
                                            <Collapsible
                                                key={item.title}
                                                asChild
                                                defaultOpen={isGroupActive(item.subItems)}
                                                className="group/collapsible"
                                            >
                                                <SidebarMenuItem>
                                                    <CollapsibleTrigger asChild>
                                                        <SidebarMenuButton tooltip={item.title}>
                                                            {item.icon && <item.icon />}
                                                            <span>{item.title}</span>
                                                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                        </SidebarMenuButton>
                                                    </CollapsibleTrigger>
                                                    <CollapsibleContent>
                                                        <SidebarMenuSub>
                                                            {filterItems(item.subItems).map((subItem) => (
                                                                <SidebarMenuSubItem key={subItem.title}>
                                                                    <SidebarMenuSubButton
                                                                        asChild
                                                                        isActive={isActive(subItem.url)}
                                                                        onClick={() => navigate(subItem.url)}
                                                                    >
                                                                        <div className="cursor-pointer flex items-center">
                                                                            {subItem.icon && <subItem.icon className="mr-2 h-4 w-4" />}
                                                                            <span>{subItem.title}</span>
                                                                        </div>
                                                                    </SidebarMenuSubButton>
                                                                </SidebarMenuSubItem>
                                                            ))}
                                                        </SidebarMenuSub>
                                                    </CollapsibleContent>
                                                </SidebarMenuItem>
                                            </Collapsible>
                                        ) : (
                                            <SidebarMenuItem key={item.title}>
                                                <SidebarMenuButton
                                                    asChild
                                                    isActive={isActive(item.url)}
                                                    tooltip={item.title}
                                                    onClick={() => navigate(item.url)}
                                                >
                                                    <div className="cursor-pointer">
                                                        {item.icon && <item.icon />}
                                                        <span>{item.title}</span>
                                                    </div>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        )
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    );
                })}
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    size="lg"
                                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                >
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        <AvatarImage src={user?.avatar} alt={user?.ad} />
                                        <AvatarFallback className="rounded-lg">{user?.ad?.[0]}{user?.soyad?.[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">{user?.ad} {user?.soyad}</span>
                                        <span className="truncate text-xs">{selectedBirim?.roleName}</span>
                                    </div>
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                                side="bottom"
                                align="end"
                                sideOffset={4}
                            >
                                <DropdownMenuItem onClick={toggleTheme}>
                                    {isDarkMode ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                                    {isDarkMode ? 'Açık Tema' : 'Koyu Tema'}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigate('/profile')}>
                                    <User className="mr-2 h-4 w-4" />
                                    Profil
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleLogout}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Çıkış Yap
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
