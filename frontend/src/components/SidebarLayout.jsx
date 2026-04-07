import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogoutModal, ProfileModal } from "../components/Modals";

export default function SidebarLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed]             = useState(false);
  const [mobileOpen, setMobileOpen]           = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const adminNav = [
    { path: "/admin",              icon: "📊", label: "Dashboard" },
    { path: "/admin/submissions",  icon: "📋", label: "Pengajuan" },
    { path: "/admin/workshops",    icon: "🏭", label: "Workshop" },
    { path: "/admin/divisions",    icon: "🏢", label: "Divisi" },
    { path: "/admin/users",        icon: "👥", label: "User Management" },
  ];

  const userNav = [
    { path: "/user",         icon: "📦", label: "Ajukan Barang" },
    { path: "/user/riwayat", icon: "📋", label: "Riwayat Pengajuan" },
  ];

  const navItems     = user?.role === "admin" ? adminNav : userNav;
  const dashboardPath = user?.role === "admin" ? "/admin" : "/user";
  const isActive     = (path) => location.pathname === path;
  const currentLabel = navItems.find(n => isActive(n.path))?.label || "Dashboard";

  const handleLogout = () => {
    setShowLogoutModal(false);
    logout();
  };

  // ── Sidebar Content ──
  const SidebarContent = ({ mobile = false }) => (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "linear-gradient(180deg,#001a2e 0%,#003f5c 60%,#0077A8 100%)" }}>
      {/* Logo */}
      <div style={{ padding: collapsed && !mobile ? "20px 12px" : "20px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: collapsed && !mobile ? "center" : "space-between", minHeight: 72 }}>
        {(!collapsed || mobile) && (
          <Link to={dashboardPath} style={{ textDecoration: "none" }}>
            <img src="/dtech-logo.png" alt="Dtech" style={{ height: 32, objectFit: "contain" }} />
          </Link>
        )}
        {collapsed && !mobile && (
          <img src="/dtech.png" alt="D" style={{ height: 28, width: 28, objectFit: "contain" }} />
        )}
        {!mobile ? (
          <button onClick={() => setCollapsed(!collapsed)} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 8, width: 28, height: 28, cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>
            {collapsed ? "→" : "←"}
          </button>
        ) : (
          <button onClick={() => setMobileOpen(false)} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 8, width: 28, height: 28, cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>×</button>
        )}
      </div>

      {/* User info */}
      <div style={{ padding: collapsed && !mobile ? "16px 12px" : "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: 12, justifyContent: collapsed && !mobile ? "center" : "flex-start" }}>
        {user?.avatar ? (
          <img src={user.avatar} alt={user.name} referrerPolicy="no-referrer" style={{ width: 38, height: 38, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(0,180,216,0.6)", flexShrink: 0 }} />
        ) : (
          <div style={{ width: 38, height: 38, borderRadius: "50%", flexShrink: 0, background: "linear-gradient(135deg,#00B4D8,#0096C7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: "#fff", border: "2px solid rgba(0,180,216,0.6)" }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        )}
        {(!collapsed || mobile) && (
          <div style={{ minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.name}</p>
            <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: user?.role === "admin" ? "rgba(124,58,237,0.4)" : "rgba(0,180,216,0.3)", color: user?.role === "admin" ? "#C4B5FD" : "#BAE6FD", textTransform: "uppercase", letterSpacing: 0.5 }}>{user?.role}</span>
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: "12px 10px", overflowY: "auto" }}>
        {navItems.map((item) => (
          <Link key={item.path} to={item.path}
            onClick={() => mobile && setMobileOpen(false)}
            style={{ display: "flex", alignItems: "center", gap: 12, padding: collapsed && !mobile ? "12px" : "11px 14px", borderRadius: 12, marginBottom: 4, textDecoration: "none", justifyContent: collapsed && !mobile ? "center" : "flex-start", background: isActive(item.path) ? "linear-gradient(135deg,rgba(0,180,216,0.3),rgba(0,150,199,0.2))" : "transparent", border: isActive(item.path) ? "1px solid rgba(0,180,216,0.4)" : "1px solid transparent", transition: "all 0.2s" }}
            onMouseEnter={e => { if (!isActive(item.path)) e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}
            onMouseLeave={e => { if (!isActive(item.path)) e.currentTarget.style.background = "transparent"; }}
          >
            <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
            {(!collapsed || mobile) && (
              <span style={{ fontSize: 13, fontWeight: isActive(item.path) ? 600 : 500, color: isActive(item.path) ? "#fff" : "rgba(255,255,255,0.7)", whiteSpace: "nowrap" }}>{item.label}</span>
            )}
            {isActive(item.path) && (!collapsed || mobile) && (
              <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "#00B4D8", flexShrink: 0 }} />
            )}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: "12px 10px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <button onClick={() => setShowLogoutModal(true)} style={{ display: "flex", alignItems: "center", gap: 12, padding: collapsed && !mobile ? "12px" : "11px 14px", borderRadius: 12, width: "100%", border: "1px solid transparent", background: "transparent", cursor: "pointer", transition: "all 0.2s", justifyContent: collapsed && !mobile ? "center" : "flex-start", fontFamily: "inherit" }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.15)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <span style={{ fontSize: 18, flexShrink: 0 }}>🚪</span>
          {(!collapsed || mobile) && <span style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,200,200,0.8)" }}>Logout</span>}
        </button>
      </div>
    </div>
  );

  // ── Avatar Dropdown (topbar) ──
  const AvatarDropdown = () => (
    <div ref={dropdownRef} style={{ position: "relative" }}>
      <button
        onClick={() => setProfileDropdown(v => !v)}
        style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 10px 5px 5px", borderRadius: 99, background: profileDropdown ? "#e0f3fa" : "#EBF6FA", border: `1.5px solid ${profileDropdown ? "#0096C7" : "#cce6f0"}`, cursor: "pointer", outline: "none", transition: "all 0.2s", fontFamily: "inherit" }}
      >
        {/* Avatar */}
        <div style={{ width: 32, height: 32, borderRadius: "50%", overflow: "hidden", flexShrink: 0, background: "linear-gradient(135deg,#00B4D8,#0077A8)", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #cce6f0" }}>
          {user?.avatar
            ? <img src={user.avatar} alt={user.name} referrerPolicy="no-referrer" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>{user?.name?.charAt(0).toUpperCase() || "U"}</span>
          }
        </div>
        {/* Name */}
        <div style={{ textAlign: "left" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#0D3040", lineHeight: 1.2 }}>{user?.name?.split(" ")[0]}</div>
          <div style={{ fontSize: 10, color: "#9CA3AF", textTransform: "capitalize" }}>{user?.role}</div>
        </div>
        {/* Chevron */}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ color: "#9CA3AF", transition: "transform 0.2s", transform: profileDropdown ? "rotate(180deg)" : "rotate(0deg)", flexShrink: 0 }}>
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {profileDropdown && (
        <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, width: 220, background: "#fff", borderRadius: 16, boxShadow: "0 16px 48px rgba(0,40,80,0.16),0 0 0 1px rgba(0,150,199,0.1)", overflow: "hidden", zIndex: 500, animation: "ddIn 0.2s cubic-bezier(0.34,1.56,0.64,1) forwards" }}>
          <style>{`@keyframes ddIn{from{opacity:0;transform:translateY(-8px) scale(0.96)}to{opacity:1;transform:translateY(0) scale(1)}}`}</style>
          {/* Header */}
          <div style={{ padding: "14px 16px 12px", background: "linear-gradient(135deg,#002d45,#0077A8)", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", overflow: "hidden", background: "rgba(255,255,255,0.2)", border: "1.5px solid rgba(255,255,255,0.4)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {user?.avatar
                ? <img src={user.avatar} alt="" referrerPolicy="no-referrer" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <span style={{ color: "#fff", fontSize: 15, fontWeight: 700 }}>{user?.name?.charAt(0).toUpperCase()}</span>
              }
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ color: "#fff", fontSize: 13, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.name}</div>
              <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.email}</div>
            </div>
          </div>
          {/* Items */}
          <div style={{ padding: "6px" }}>
            <button onClick={() => { setProfileDropdown(false); setShowProfileModal(true); }}
              style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, fontFamily: "inherit", transition: "background 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(0,150,199,0.07)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <span style={{ width: 32, height: 32, borderRadius: 9, background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>👤</span>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: "#0D3040" }}>Profil Saya</div>
              </div>
            </button>
            <div style={{ height: 1, background: "#f0f7fb", margin: "4px 6px" }} />
            <button onClick={() => { setProfileDropdown(false); setShowLogoutModal(true); }}
              style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, fontFamily: "inherit", transition: "background 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.07)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <span style={{ width: 32, height: 32, borderRadius: 9, background: "#FFF1F2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>🚪</span>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: "#EF4444" }}>Logout</div>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#EBF6FA", fontFamily: "'Barlow', sans-serif" }}>
      <style>{`
        * { box-sizing: border-box; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)} }
        .fade-in { animation: fadeIn 0.3s ease forwards; }
        @keyframes slideIn { from{transform:translateX(-100%)}to{transform:translateX(0)} }
        .slide-in { animation: slideIn 0.25s ease forwards; }
        @keyframes backdropIn { from{opacity:0}to{opacity:1} }
        .lm-backdrop { animation: backdropIn 0.2s ease forwards; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #d0eef7; border-radius: 4px; }
        ::-webkit-scrollbar-thumb { background: #0096C7; border-radius: 4px; }
        @media(min-width:768px) { .desktop-sidebar{display:block!important} .mobile-header{display:none!important} }
        @media(max-width:767px) { .top-bar{margin-top:56px!important} }
      `}</style>

      {/* Desktop Sidebar */}
      <div className="desktop-sidebar" style={{ width: collapsed ? 68 : 240, flexShrink: 0, transition: "width 0.25s ease", position: "sticky", top: 0, height: "100vh", display: "none" }}>
        <SidebarContent />
      </div>

      {/* Mobile Header */}
      <div className="mobile-header" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "linear-gradient(90deg,#001a2e,#0077A8)", height: 56, display: "flex", alignItems: "center", padding: "0 16px", gap: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.2)" }}>
        <button onClick={() => setMobileOpen(true)} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 8, width: 36, height: 36, cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>☰</button>
        <img src="/dtech-logo.png" alt="Dtech" style={{ height: 28, objectFit: "contain" }} />
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <>
          <div className="lm-backdrop" onClick={() => setMobileOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(2px)" }} />
          <div className="slide-in" style={{ position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 201, width: 260 }}>
            <SidebarContent mobile />
          </div>
        </>
      )}

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Top Bar */}
        <div className="top-bar" style={{ background: "#fff", borderBottom: "1px solid #d4eef8", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 8px rgba(0,150,199,0.06)", position: "sticky", top: 0, zIndex: 50 }}>
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, color: "#9CA3AF" }}>{user?.role === "admin" ? "Admin" : "User"}</span>
            <span style={{ color: "#cce6f0" }}>/</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#0D3040" }}>{currentLabel}</span>
          </div>

          {/* Right: date + avatar dropdown */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: "#EBF6FA", color: "#0077A8", border: "1px solid #cce6f0" }}>
              {new Date().toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short" })}
            </div>
            <AvatarDropdown />
          </div>
        </div>

        {/* Page Content */}
        <div style={{ flex: 1, padding: "28px 24px", overflowY: "auto" }}>
          {children}
        </div>
      </div>

      <LogoutModal show={showLogoutModal} onConfirm={handleLogout} onCancel={() => setShowLogoutModal(false)} />
      <ProfileModal show={showProfileModal} onClose={() => setShowProfileModal(false)} user={user} />
    </div>
  );
}