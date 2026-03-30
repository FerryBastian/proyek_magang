import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleHomeClick = (e) => {
    if (user) {
      e.preventDefault();
      navigate(user.role === "admin" ? "/admin" : "/user", { replace: true });
    }
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    logout();
  };

  const currentTab = new URLSearchParams(location.search).get("tab") || "submissions";

  const adminMenus = [
    {
      label: "Dashboard", tab: "dashboard",
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/><rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/><rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/><rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/></svg>,
    },
    {
      label: "Pengajuan", tab: "submissions",
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
    },
    {
      label: "Workshop", tab: "workshops",
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="2"/><polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" strokeWidth="2"/></svg>,
    },
    {
      label: "Divisi", tab: "divisions",
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2"/><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2"/></svg>,
    },
    {
      label: "Users", tab: "users",
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
    },
  ];

  const globalStyles = `
    @keyframes backdropIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes modalIn { from { opacity: 0; transform: scale(0.92) translateY(12px); } to { opacity: 1; transform: scale(1) translateY(0); } }
    @keyframes slideInLeft { from { transform: translateX(-100%); } to { transform: translateX(0); } }
    .lm-backdrop { animation: backdropIn 0.2s ease forwards; }
    .lm-modal { animation: modalIn 0.25s ease forwards; }
    .lm-btn-batal:hover { background: rgba(0,180,216,0.08) !important; border-color: #00B4D8 !important; color: #00B4D8 !important; }
    .lm-btn-logout:hover { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(239,68,68,0.45) !important; }
    .adm-nav-item { transition: background 0.15s, color 0.15s; }
    .adm-nav-item:hover { background: rgba(255,255,255,0.12) !important; color: #fff !important; }
    .adm-nav-item.active { background: rgba(255,255,255,0.2) !important; color: #fff !important; font-weight: 600; }
    .adm-logout-btn:hover { background: rgba(239,68,68,0.2) !important; color: #FCA5A5 !important; }
    .dtech-nav { background: linear-gradient(90deg, #001a2e 0%, #003f5c 50%, #0077A8 100%) !important; border-bottom: 1px solid rgba(0,150,199,0.4) !important; }
    .dtech-nav a, .dtech-nav button { color: #fff !important; }
    .dtech-nav a:hover { color: #fff !important; background: rgba(255,255,255,0.15) !important; }
    .dtech-logout:hover { color: #FFD0D0 !important; background: rgba(255,100,100,0.15) !important; }
    .mobile-menu-item:hover { background: rgba(255,255,255,0.1) !important; }
  `;

  const LogoutModal = () => showLogoutModal ? (
    <div className="lm-backdrop" onClick={() => setShowLogoutModal(false)} style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(15,10,40,0.45)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
    }}>
      <div className="lm-modal" onClick={e => e.stopPropagation()} style={{
        background: "#fff", borderRadius: 20, padding: "36px 28px",
        width: "100%", maxWidth: 400, textAlign: "center",
        boxShadow: "0 24px 64px rgba(0,119,168,0.2)", border: "1px solid #cce6f0",
      }}>
        <div style={{ width: 68, height: 68, borderRadius: "50%", margin: "0 auto 20px", background: "linear-gradient(135deg, #FFF1F2, #FFE4E6)", border: "2px solid #FECDD3", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30 }}>🚪</div>
        <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: "#0D3040" }}>Konfirmasi Logout</h3>
        <p style={{ margin: "0 0 28px", fontSize: 13, color: "#9CA3AF", lineHeight: 1.6 }}>Apakah kamu yakin ingin keluar dari akun ini?</p>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="lm-btn-batal" onClick={() => setShowLogoutModal(false)} style={{ flex: 1, padding: "13px", background: "#f5fbfd", border: "2px solid #cce6f0", borderRadius: 12, fontSize: 14, fontWeight: 600, color: "#6B7280", cursor: "pointer", transition: "all 0.2s" }}>Batal</button>
          <button className="lm-btn-logout" onClick={handleConfirmLogout} style={{ flex: 1, padding: "13px", background: "linear-gradient(135deg, #EF4444, #DC2626)", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, color: "#fff", cursor: "pointer", boxShadow: "0 4px 14px rgba(239,68,68,0.35)", transition: "all 0.2s" }}>Ya, Logout</button>
        </div>
      </div>
    </div>
  ) : null;

  // ── ADMIN LAYOUT ──
  if (user?.role === "admin") {
    const SidebarContent = ({ onClose }) => (
      <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "linear-gradient(180deg, #001a2e 0%, #003f5c 50%, #0077A8 100%)" }}>
        {/* Logo */}
        <div style={{ padding: "20px", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link to="/admin" onClick={() => { navigate("/admin"); onClose?.(); }} style={{ textDecoration: "none" }}>
            <img src="/dtech-logo.png" alt="Dtech" style={{ height: 32, objectFit: "contain" }} />
          </Link>
          {onClose && (
            <button onClick={onClose} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 8, width: 30, height: 30, color: "#fff", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
          )}
        </div>
        {/* Profile */}
        <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 15, fontWeight: 700, flexShrink: 0, border: "1.5px solid rgba(255,255,255,0.3)" }}>
            {user.name?.charAt(0).toUpperCase() || "A"}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ color: "#fff", fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name || user.email?.split("@")[0]}</div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginTop: 1 }}>Administrator</div>
          </div>
        </div>
        {/* Menu */}
        <div style={{ flex: 1, padding: "12px", display: "flex", flexDirection: "column", gap: 2, overflowY: "auto" }}>
          {adminMenus.map(menu => {
            const isActive = menu.label === "Dashboard"
              ? location.pathname === "/admin" && !location.search
              : currentTab === menu.tab;
            return (
              <button key={menu.label} className={`adm-nav-item ${isActive ? "active" : ""}`}
                onClick={() => { menu.label === "Dashboard" ? navigate("/admin") : navigate(`/admin?tab=${menu.tab}`); onClose?.(); }}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 12px", borderRadius: 10, border: "none", cursor: "pointer", width: "100%", textAlign: "left", background: "transparent", color: isActive ? "#fff" : "rgba(255,255,255,0.65)", fontSize: 13, fontWeight: 500, fontFamily: "'Sora', sans-serif" }}>
                {menu.icon}{menu.label}
              </button>
            );
          })}
        </div>
        {/* Logout */}
        <div style={{ padding: "12px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <button className="adm-logout-btn" onClick={() => { setShowLogoutModal(true); onClose?.(); }}
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 12px", borderRadius: 10, border: "none", cursor: "pointer", width: "100%", textAlign: "left", background: "transparent", color: "rgba(255,255,255,0.55)", fontSize: 13, fontWeight: 500, fontFamily: "'Sora', sans-serif", transition: "all 0.15s" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Logout
          </button>
        </div>
      </div>
    );

    return (
      <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Sora', 'Barlow', sans-serif", background: "#EBF6FA" }}>
        <style>{globalStyles}{`
          .admin-sidebar { display: flex; width: 230px; flex-shrink: 0; position: sticky; top: 0; height: 100vh; box-shadow: 4px 0 20px rgba(0,0,0,0.15); }
          .admin-mobile-header { display: none; }
          @media(max-width: 768px) {
            .admin-sidebar { display: none !important; }
            .admin-mobile-header { display: flex !important; }
            .admin-topbar { padding: 0 16px !important; }
            .admin-content { padding: 16px !important; }
          }
        `}</style>

        {/* Desktop Sidebar */}
        <div className="admin-sidebar" style={{ flexDirection: "column" }}>
          <SidebarContent />
        </div>

        {/* Mobile Header */}
        <div className="admin-mobile-header" style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          background: "linear-gradient(90deg, #001a2e, #0077A8)",
          height: 56, alignItems: "center", padding: "0 16px", gap: 12,
          boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
        }}>
          <button onClick={() => setMobileSidebarOpen(true)} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 8, width: 36, height: 36, cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>☰</button>
          <img src="/dtech-logo.png" alt="Dtech" style={{ height: 28, objectFit: "contain" }} />
        </div>

        {/* Mobile Sidebar Overlay */}
        {mobileSidebarOpen && (
          <>
            <div onClick={() => setMobileSidebarOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(2px)" }} />
            <div style={{ position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 201, width: 260, animation: "slideInLeft 0.25s ease forwards" }}>
              <SidebarContent onClose={() => setMobileSidebarOpen(false)} />
            </div>
          </>
        )}

        {/* Main */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          {/* Topbar */}
          <div className="admin-topbar" style={{
            background: "#fff", padding: "0 24px", height: 60,
            borderBottom: "1px solid #d4eef8",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            position: "sticky", top: 0, zIndex: 40,
            boxShadow: "0 2px 8px rgba(0,150,199,0.06)",
            marginTop: 0,
          }}>
            <style>{`@media(max-width:768px){.admin-topbar{margin-top:56px!important}}`}</style>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#0D3040" }}>Admin Dashboard</div>
              <div style={{ fontSize: 11, color: "#9CA3AF" }}>Submission App · DTECH Engineering</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 12px", borderRadius: 20, background: "#EBF6FA", border: "1px solid #d4eef8" }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg, #0096C7, #00B4D8)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 700 }}>
                {user.name?.charAt(0).toUpperCase() || "A"}
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#0D3040" }} className="hidden sm:inline">{user.name || "Admin"}</span>
              <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 10, background: "#0096C7", color: "#fff", fontWeight: 600 }}>Admin</span>
            </div>
          </div>

          {/* Content */}
          <main className="admin-content" style={{ flex: 1, padding: "24px", overflowY: "auto" }}>
            {children}
          </main>
        </div>

        <LogoutModal />
      </div>
    );
  }

  // ── USER / GUEST LAYOUT ──
  return (
    <div className="min-h-screen" style={{ background: "#EBF6FA" }}>
      <style>{globalStyles}{`
        @media(max-width:640px){
          .user-nav-desktop { display: none !important; }
          .user-nav-mobile-btn { display: flex !important; }
        }
        .user-nav-mobile-btn { display: none; }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        .mobile-menu-dropdown { animation: slideDown 0.2s ease forwards; }
      `}</style>

      <nav className="dtech-nav border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" onClick={handleHomeClick} style={{ textDecoration: "none" }}>
                <img src="/dtech-logo.png" alt="Dtech-Engineering" style={{ height: 38, objectFit: "contain" }} />
              </Link>
            </div>

            {/* Desktop Nav */}
            <div className="user-nav-desktop flex items-center gap-2">
              {user?.role === "user" && (
                <Link to="/user" className="px-4 py-2 rounded-lg transition-colors font-medium flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  My Dashboard
                </Link>
              )}
              {!user && (
                <Link to="/login" className="ml-2 px-4 py-2 rounded-lg transition-all font-medium flex items-center gap-2" style={{ background: "#00B4D8", color: "#000" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
                  Login
                </Link>
              )}
              {user && (
                <div className="flex items-center gap-3 ml-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)" }}>
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} referrerPolicy="no-referrer" className="w-8 h-8 rounded-full object-cover"
                        onError={e => { e.target.onerror = null; e.target.replaceWith(Object.assign(document.createElement("div"), { className: "w-8 h-8 rounded-full flex items-center justify-center", style: "background:#00B4D8", innerHTML: `<span style="color:white;font-size:14px;font-weight:600">${(user.name?.charAt(0) || "U").toUpperCase()}</span>` })); }} />
                    ) : (
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#00B4D8" }}>
                        <span className="text-white text-sm font-semibold">{user.name?.charAt(0).toUpperCase()}</span>
                      </div>
                    )}
                    <span className="text-sm font-medium" style={{ color: "#fff" }}>{user.name || user.email?.split("@")[0]}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full capitalize" style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }}>{user.role}</span>
                  </div>
                  <button onClick={() => setShowLogoutModal(true)} className="dtech-logout px-4 py-2 rounded-lg transition-colors font-medium flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Hamburger */}
            <div className="user-nav-mobile-btn items-center">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 8, width: 38, height: 38, cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                {mobileMenuOpen ? "×" : "☰"}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu-dropdown" style={{ background: "rgba(0,26,46,0.97)", borderTop: "1px solid rgba(255,255,255,0.1)", padding: "12px 16px", display: "flex", flexDirection: "column", gap: 4 }}>
            {user && (
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", background: "rgba(255,255,255,0.08)", borderRadius: 10, marginBottom: 6 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#00B4D8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{user.name}</div>
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>{user.email}</div>
                </div>
              </div>
            )}
            {user?.role === "user" && (
              <Link to="/user" onClick={() => setMobileMenuOpen(false)} className="mobile-menu-item" style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 12px", borderRadius: 10, color: "#fff", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                My Dashboard
              </Link>
            )}
            {!user && (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 12px", borderRadius: 10, background: "#00B4D8", color: "#000", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>
                Login
              </Link>
            )}
            {user && (
              <button onClick={() => { setShowLogoutModal(true); setMobileMenuOpen(false); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 12px", borderRadius: 10, background: "rgba(239,68,68,0.15)", border: "none", color: "#FCA5A5", cursor: "pointer", fontSize: 14, fontWeight: 500, width: "100%", textAlign: "left" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                Logout
              </button>
            )}
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>

      <LogoutModal />
    </div>
  );
}