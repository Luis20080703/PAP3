import React from "react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarRail,
    useSidebar,
} from "./ui/sidebar";
import {
    Upload,
    BookOpen,
    TrendingUp,
    Users,
    Shield,
    LogOut,
    Trophy,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { cn } from "./ui/utils";

interface AdminSidebarProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
    onLogout: () => void;
}

export function AdminSidebar({ activeTab, onTabChange, onLogout }: AdminSidebarProps) {
    const { user } = useApp();
    const { state } = useSidebar();
    const isExpanded = state === "expanded";

    const menuItems = [
        { id: "plays", label: "Jogadas", icon: Upload, color: "text-emerald-500" },
        { id: "tips", label: "Dicas", icon: BookOpen, color: "text-amber-500" },
        { id: "team-stats", label: "Equipas", icon: TrendingUp, color: "text-blue-500" },
        { id: "athlete-stats", label: "Atletas", icon: Users, color: "text-indigo-500" },
        { id: "admin", label: "Admin", icon: Shield, color: "text-rose-500" },
    ];

    return (
        <Sidebar className="border-r border-gray-100 bg-white shadow-xl" collapsible="offcanvas">
            <SidebarHeader className="p-6">
                <div className="flex items-center gap-3 px-2">
                    <img src="/logo.png" alt="NexusHand Logo" className="w-10 h-10 object-contain" />
                    {isExpanded && (
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-xl font-black tracking-tight text-gray-900 truncate">
                                Nexus<span className="text-blue-600">Hand</span>
                            </span>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-1">
                                Plataforma PRO
                            </div>
                        </div>
                    )}
                </div>
            </SidebarHeader>

            <SidebarContent className="px-2 py-6">
                <SidebarGroup>
                    {isExpanded && (
                        <SidebarGroupLabel className="px-4 text-xs font-black text-gray-400 uppercase tracking-widest mb-6">
                            Navegação
                        </SidebarGroupLabel>
                    )}
                    <SidebarGroupContent>
                        <div className="radio-container" style={{ "--total-radio": menuItems.length } as React.CSSProperties}>
                            {menuItems.map((item, index) => (
                                <React.Fragment key={item.id}>
                                    <input
                                        type="radio"
                                        id={item.id}
                                        name="admin-nav"
                                        checked={activeTab === item.id}
                                        onChange={() => onTabChange(item.id)}
                                    />
                                    <label htmlFor={item.id}>
                                        <item.icon className={cn(
                                            "w-5 h-5 transition-all duration-300",
                                            activeTab === item.id ? item.color : "text-gray-400"
                                        )} />
                                        {isExpanded && <span className="text-sm">{item.label}</span>}
                                    </label>
                                </React.Fragment>
                            ))}
                            <div className="glider-container">
                                <div className="glider"></div>
                            </div>
                        </div>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="p-4 border-t border-gray-50 space-y-4">
                {/* User Card */}
                <div className="bg-gray-50/50 p-4 rounded-3xl border border-gray-100 flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 font-black flex-shrink-0">
                        {user?.nome?.charAt(0).toUpperCase()}
                    </div>
                    {isExpanded && (
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-bold text-gray-900 truncate">{user?.nome}</p>
                            <p className="text-[10px] font-black text-gray-400 uppercase truncate">
                                {user?.tipo}
                            </p>
                        </div>
                    )}
                </div>

                {/* Logout Button */}
                <SidebarMenuButton
                    onClick={onLogout}
                    className={cn(
                        "w-full flex items-center gap-3 px-4 py-6 rounded-2xl text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-all font-bold group border border-transparent hover:border-rose-100",
                        !isExpanded && "justify-center px-0"
                    )}
                >
                    <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform flex-shrink-0" />
                    {isExpanded && <span>Sair</span>}
                </SidebarMenuButton>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}



