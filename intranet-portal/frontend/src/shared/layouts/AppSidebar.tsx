import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { usePermission, Permissions } from '../../hooks/usePermission';
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
    ChevronRight,
    Activity,
    Server,
    Bug,
    DatabaseBackup,
    type LucideIcon,
} from 'lucide-react';

import {
    Sidebar,
    SidebarContent,
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
} from "@/components/ui/sidebar";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Types
interface Permission {
    resource: string;
    action: string;
}

interface SubMenuItem {
    title: string;
    url: string;
    icon?: LucideIcon;
    permission?: Permission;
}

interface MenuItem {
    title: string;
    url?: string;
    icon?: LucideIcon;
    permission?: Permission;
    subItems?: SubMenuItem[];
}

interface MenuGroup {
    title: string;
    items: MenuItem[];
}

// Props types for sub-components
interface MenuSubItemProps {
    subItem: SubMenuItem;
    isActive: (path: string) => boolean;
    navigate: (path: string) => void;
}

interface CollapsibleMenuItemProps {
    item: MenuItem;
    isGroupActive: (subItems: SubMenuItem[]) => boolean;
    isActive: (path: string) => boolean;
    navigate: (path: string) => void;
    filterItems: (items: SubMenuItem[]) => SubMenuItem[];
}

interface SimpleMenuItemProps {
    item: MenuItem;
    isActive: (path: string) => boolean;
    navigate: (path: string) => void;
}

// Sub-components extracted to reduce nesting
function MenuSubItem({ subItem, isActive, navigate }: Readonly<MenuSubItemProps>) {
    return (
        <SidebarMenuSubItem>
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
    );
}

function CollapsibleMenuItem({ item, isGroupActive, isActive, navigate, filterItems }: Readonly<CollapsibleMenuItemProps>) {
    const subItems = item.subItems || [];
    const filteredSubItems = filterItems(subItems);

    return (
        <Collapsible
            asChild
            defaultOpen={isGroupActive(subItems)}
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
                        {filteredSubItems.map((subItem) => (
                            <MenuSubItem
                                key={subItem.title}
                                subItem={subItem}
                                isActive={isActive}
                                navigate={navigate}
                            />
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </SidebarMenuItem>
        </Collapsible>
    );
}

function SimpleMenuItem({ item, isActive, navigate }: Readonly<SimpleMenuItemProps>) {
    return (
        <SidebarMenuItem>
            <SidebarMenuButton
                asChild
                isActive={isActive(item.url || '')}
                tooltip={item.title}
                onClick={() => navigate(item.url || '')}
            >
                <div className="cursor-pointer">
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                </div>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
}

export function AppSidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { selectedBirim, currentRoleInfo } = useAuthStore();
    const { hasPermission } = usePermission();

    // SuperAdmin check
    const isSuperAdmin = currentRoleInfo?.roleName === 'SuperAdmin';

    const isActive = (path: string) => location.pathname === path;
    const isGroupActive = (subItems: SubMenuItem[]) => subItems.some(item => location.pathname === item.url);

    const isITUnit = selectedBirim?.birimAdi === 'Bilgi İşlem';
    const isTestUnit = selectedBirim?.birimAdi === 'Test Birimi';

    const menuItems: MenuGroup[] = useMemo(() => [
        // Genel - Dashboard (SuperAdmin Only)
        ...(isSuperAdmin ? [{
            title: "Genel",
            items: [
                {
                    title: "Dashboard",
                    url: "/dashboard",
                    icon: LayoutDashboard,
                },
            ]
        }] : []),
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
                    title: "Yedekleme Merkezi",
                    url: "/admin/backups",
                    icon: DatabaseBackup,
                    permission: Permissions.System.Read
                },
            ]
        }
    ], [isSuperAdmin, isITUnit, isTestUnit]);

    // Helper to filter items by permission
    const filterItems = <T extends { permission?: Permission }>(items: T[]): T[] => {
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
                        <SidebarMenuButton
                            size="lg"
                            className="cursor-default"
                        >
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                <Building2 className="size-4" />
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">Intranet Portal</span>
                                <span className="truncate text-xs">{selectedBirim?.birimAdi || 'Yönetim Paneli'}</span>
                            </div>
                        </SidebarMenuButton>
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
                                            <CollapsibleMenuItem
                                                key={item.title}
                                                item={item}
                                                isGroupActive={isGroupActive}
                                                isActive={isActive}
                                                navigate={navigate}
                                                filterItems={filterItems}
                                            />
                                        ) : (
                                            <SimpleMenuItem
                                                key={item.title}
                                                item={item}
                                                isActive={isActive}
                                                navigate={navigate}
                                            />
                                        )
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    );
                })}
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    );
}
