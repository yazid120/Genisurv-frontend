import { Link, useLocation } from "react-router";
import {
  CalenderIcon,
  GridIcon,
  UserCircleIcon,
  DollarLineIcon,
  LockIcon,
  PieChartIcon,
  BoxCubeIcon,
  PlugInIcon,
  PageIcon,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
import { useAuth } from "../hooks/useAuth";

// Type Nav
type NavItem = {
  name: string;
  icon: React.ReactNode;
  path: string;
  permission?: string | string[];
};

// Menus principaux avec permission
const mainNavItems: NavItem[] = [
  { name: "Dashboard", icon: <GridIcon />, path: "/", permission: "voir_caisse" },
  { name: "Calendar", icon: <CalenderIcon />, path: "/calendar" },
  { name: "User Profile", icon: <UserCircleIcon />, path: "/profile" },
  { name: "Ma Caisse", icon: <DollarLineIcon />, path: "/caisse", permission: "voir_caisse" },
  { name: "Encaissements", icon: <DollarLineIcon />, path: "/encaissements", permission: "voir_encaissement" },
  { name: "Décaissements", icon: <DollarLineIcon />, path: "/decaissements", permission: "voir_decaissement" },
  { name: "Utilisateurs", icon: <LockIcon />, path: "/admin/users", permission: "gerer_user" },
  { name: "Rôles", icon: <LockIcon />, path: "/admin/roles", permission: "gerer_role" },
  { name: "Wilayas", icon: <LockIcon />, path: "/admin/wilayas", permission: "gerer_wilaya" },
  { name: "Caisses Admin", icon: <LockIcon />, path: "/admin/caisses", permission: "voir_tous_caisses" },
  { name: "Alimentations", icon: <LockIcon />, path: "/admin/alimentations", permission: "gerer_alimentation" },
];

// Autres menus visibles sans permission
const otherNavItems: NavItem[] = [
  { name: "Pages", icon: <PageIcon />, path: "/pages" },
  { name: "Charts", icon: <PieChartIcon />, path: "/charts" },
  { name: "UI Elements", icon: <BoxCubeIcon />, path: "/ui-elements" },
  { name: "Authentication", icon: <PlugInIcon />, path: "/auth" },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  // Vérifie la permission
  const hasPermission = (permission?: string | string[]) => {
    if (!permission) return true;
    if (!user) return false;
    if (Array.isArray(permission)) return permission.some((p) => user.permissions.includes(p));
    return user.permissions.includes(permission);
  };

  // Filtrer les menus
  const filteredMainItems = mainNavItems.filter((item) => hasPermission(item.permission));

  const renderMenu = (items: NavItem[]) => (
    <ul className="flex flex-col gap-4">
      {items.map((nav) => (
        <li key={nav.name}>
          <Link
            to={nav.path}
            className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"}`}
          >
            <span
              className={`menu-item-icon-size ${
                isActive(nav.path) ? "menu-item-icon-active" : "menu-item-icon-inactive"
              }`}
            >
              {nav.icon}
            </span>
            {(isExpanded || isHovered || isMobileOpen) && <span className="menu-item-text">{nav.name}</span>}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 ${
        isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"
      } ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo */}
      <div className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img className="dark:hidden" src="/images/logo/logo.svg" alt="Logo" width={150} height={40} />
              <img className="hidden dark:block" src="/images/logo/logo-dark.svg" alt="Logo" width={150} height={40} />
            </>
          ) : (
            <img src="/images/logo/logo-icon.svg" alt="Logo" width={32} height={32} />
          )}
        </Link>
      </div>

      {/* Menu principal */}
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <h2
          className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
            !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
          }`}
        >
          {isExpanded || isHovered || isMobileOpen ? "Menu" : "…"}
        </h2>
        {renderMenu(filteredMainItems)}

        {/* Autres menus */}
        <div className="mt-6">
          <h2
            className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
              !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
            }`}
          >
            {isExpanded || isHovered || isMobileOpen ? "Others" : "…"}
          </h2>
          {renderMenu(otherNavItems)}
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;