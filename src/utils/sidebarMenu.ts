export interface SidebarItem {
  label: string;
  permission: string | string[];
  path: string;
}

export const sidebarMenu: SidebarItem[] = [
  { label: "Dashboard", permission: "voir_caisse", path: "/" },
  { label: "Users", permission: "gerer_user", path: "/users" },
  { label: "Roles", permission: "gerer_role", path: "/roles" },
  { label: "Wilayas", permission: "gerer_wilaya", path: "/wilayas" },
  { label: "Alimentation", permission: "gerer_alimentation", path: "/alimentation" },
  { label: "Operations", permission: ["voir_encaissement", "voir_decaissement"], path: "/operations" },
  { label: "Caisses", permission: "voir_tous_caisses", path: "/caisses" },
  { label: "Encaissement", permission: "gerer_encaissement", path: "/encaissement" },
  { label: "Decaissement", permission: "gerer_decaissement", path: "/decaissement" },
];