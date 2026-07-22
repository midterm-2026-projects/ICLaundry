import { useEffect, useState } from "react";
import { BarChart3, Boxes, LayoutDashboard, Menu, Settings, Shirt, ShoppingBag, UserRound, UsersRound, X } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

const navigation = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/orders", label: "Orders", icon: ShoppingBag },
  { to: "/customers", label: "Customers", icon: UserRound },
  { to: "/staff", label: "Staff", icon: UsersRound },
  { to: "/inventory", label: "Inventory", icon: Boxes },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function SideNavigation() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => {
    if (!open) return undefined;
    const close = (event) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);

  return <>
    <button type="button" className="side-nav-mobile-trigger" aria-label="Open navigation" aria-expanded={open} onClick={() => setOpen(true)}><Menu size={21} /></button>
    {open && <button type="button" className="side-nav-backdrop" aria-label="Close navigation" onClick={() => setOpen(false)} />}
    <aside className={`side-nav ${open ? "open" : ""}`} aria-label="Primary navigation">
      <header className="side-nav-brand"><span><Shirt size={22} /></span><div><strong>IC Laundry</strong><small>Management System</small></div><button type="button" aria-label="Close navigation menu" onClick={() => setOpen(false)}><X size={19} /></button></header>
      <div className="side-nav-section-label">Workspace</div>
      <nav>{navigation.map(({ to, label, icon: Icon, end }) => <NavLink key={to} to={to} end={end} className={({ isActive }) => isActive ? "active" : ""}><button type="button"><Icon size={18} /><span>{label}</span></button></NavLink>)}</nav>
      <footer><span>IC</span><div><strong>Administrator</strong><small>System access</small></div></footer>
    </aside>
  </>;
}
