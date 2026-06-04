// 📁 File: src/components/Sidebar.tsx
import { useAppContext } from "../context/Appcontext";
import { NavLink } from "react-router-dom";
import { ActivityIcon, HomeIcon, UserIcon, Moon, Sun, LogOut, LayoutDashboard, Bot } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const Sidebar = () => {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAppContext(); 

  const navItems = [
    { path: '/', label: 'Home', icon: HomeIcon },
    { path: '/profile', label: 'Profile', icon: UserIcon },
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/activityLog', label: 'Activity', icon: ActivityIcon }, 
    { path: '/aiPlanner', label: 'AI Assistant', icon: Bot },
  ];

  return (
    <nav className="sticky top-0 flex flex-col w-20 h-screen p-4 transition-colors duration-200 bg-white border-r sm:w-64 dark:bg-slate-900 border-slate-100 dark:border-slate-800 sm:p-6">
      
      {/* Sidebar Brand Header */}
      <div className="flex items-center gap-3 mb-8 overflow-hidden">
        {/* On mobile mobile view layouts, 'Health Monitor' hides cleanly so it doesn't spill out */}
        <h1 className="hidden text-2xl font-bold tracking-tight truncate text-slate-800 dark:text-white sm:block">
          Health Monitor
        </h1>
        <div className="flex items-center justify-center w-8 h-8 text-xs font-bold text-white bg-blue-600 rounded-full sm:hidden">
          HM
        </div>
      </div>

      {/* Main Navigation Links Directory */}
      <div className="flex-1 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center justify-center sm:justify-start gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive 
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" 
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`
            }
          >
            <item.icon size={20} className="shrink-0" />
            <span className="hidden font-medium sm:inline">{item.label}</span>
          </NavLink>
        ))}
      </div>

      {/* Footer Actions Panel */}
      <div className="pt-4 mt-auto space-y-2 border-t border-slate-100 dark:border-slate-800">
        
        {/* Theme Toggler Option */}
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center w-full gap-3 px-4 py-3 transition-all rounded-lg sm:justify-start text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          {theme === 'light' ? <Moon size={20} className="shrink-0" /> : <Sun size={20} className="shrink-0" />}
          <span className="hidden font-medium sm:inline">
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </span>
        </button>

        {/* Unified Logout Control Trigger */}
        <button 
          onClick={logout}
          className="flex items-center justify-center w-full gap-3 px-4 py-3 font-semibold transition-all rounded-lg sm:justify-start text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
        >
          <LogOut size={20} className="shrink-0" />
          <span className="hidden font-medium sm:inline">Logout</span>
        </button>
        
      </div>
    </nav>
  );
};

export default Sidebar;