import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, PlusCircle, Target, History, LogOut } from 'lucide-react';
import { cn } from './ui/index';
import { Toaster } from 'react-hot-toast';

import logo from '../assets/zyone-logo.png';

export function Layout() {
    const { signOut } = useAuth();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex justify-center">
            {/* Mobile Container Limit */}
            <div className="w-full max-w-[480px] bg-white min-h-screen shadow-2xl relative flex flex-col">

                {/* Header */}
                <header className="h-16 border-b flex items-center justify-between px-6 bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-2">
                        <div className="h-10 w-10 flex items-center justify-center">
                            <img src={logo} alt="Zyone" className="h-full w-full object-contain" />
                        </div>
                        <h1 className="font-bold text-lg tracking-tight">Gestor Zyone</h1>
                    </div>
                    <button onClick={signOut} className="text-gray-400 hover:text-red-500 transition-colors">
                        <LogOut size={20} />
                    </button>
                </header>

                {/* Content Area */}
                <main className="flex-1 p-4 pb-24 overflow-y-auto">
                    <Outlet />
                </main>

                {/* Bottom Navigation */}
                <nav className="fixed bottom-0 w-full max-w-[480px] bg-white border-t border-gray-100 h-20 px-6 flex items-center justify-between z-20 pb-2">
                    <NavLink to="/" icon={<Home size={24} />} label="Início" active={isActive('/')} />
                    <NavLink to="/add-sale" icon={<PlusCircle size={28} />} label="Vender" active={isActive('/add-sale')} isPrimary />
                    <NavLink to="/goals" icon={<Target size={24} />} label="Metas" active={isActive('/goals')} />
                    <NavLink to="/history" icon={<History size={24} />} label="Histórico" active={isActive('/history')} />
                </nav>

                <Toaster position="top-center" />
            </div>
        </div>
    );
}

function NavLink({ to, icon, label, active, isPrimary }: { to: string; icon: React.ReactNode; label: string; active: boolean; isPrimary?: boolean }) {
    return (
        <Link
            to={to}
            className={cn(
                "flex flex-col items-center justify-center gap-1 transition-all active:scale-90",
                active ? "text-black font-semibold" : "text-gray-400 hover:text-gray-600",
                isPrimary && "text-black"
            )}
        >
            <div className={cn(
                "flex items-center justify-center rounded-2xl transition-all",
                isPrimary ? "bg-black text-white h-12 w-12 shadow-lg shadow-black/20 mb-4 border-4 border-white" : "",
                active && !isPrimary && "bg-gray-100 h-10 w-10"
            )}>
                {icon}
            </div>
            <span className={cn("text-[10px]", isPrimary && "font-bold mb-3")}>{label}</span>
        </Link>
    );
}
