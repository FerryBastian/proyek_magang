import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

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

  // Baca tab aktif dari URL
  const currentTab = new URLSearchParams(location.search).get("tab") || "submissions";

  const adminMenus = [
    {
      label: "Dashboard",
      tab: "submissions",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
          <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
          <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
          <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
    },
    {
      label: "Pengajuan",
      tab: "submissions",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      label: "Workshop",
      tab: "workshops",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="2"/>
          <polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
    },
    {
      label: "Divisi",
      tab: "divisions",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2"/>
          <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
          <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
    },
    {
      label: "Users",
      tab: "users",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
    },
  ];

  // ── ADMIN LAYOUT (sidebar) ──
  if (user?.role === "admin") {
    return (
      <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Sora', 'Barlow', sans-serif", background: "#EBF6FA" }}>
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <style>{`
          .adm-nav-item { transition: background 0.15s, color 0.15s; }
          .adm-nav-item:hover { background: rgba(255,255,255,0.12) !important; color: #fff !important; }
          .adm-nav-item.active { background: rgba(255,255,255,0.2) !important; color: #fff !important; font-weight: 600; }
          .adm-logout-btn:hover { background: rgba(239,68,68,0.2) !important; color: #FCA5A5 !important; }
          @keyframes backdropIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes modalIn { from { opacity: 0; transform: scale(0.92) translateY(12px); } to { opacity: 1; transform: scale(1) translateY(0); } }
          .lm-backdrop { animation: backdropIn 0.2s ease forwards; }
          .lm-modal { animation: modalIn 0.25s ease forwards; }
          .lm-btn-batal:hover { background: rgba(0,180,216,0.08) !important; border-color: #00B4D8 !important; color: #00B4D8 !important; }
          .lm-btn-logout:hover { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(239,68,68,0.45) !important; }
        `}</style>

        {/* ── SIDEBAR ── */}
        <div style={{
          width: 230, flexShrink: 0,
          background: "linear-gradient(180deg, #001a2e 0%, #003f5c 50%, #0077A8 100%)",
          display: "flex", flexDirection: "column",
          position: "sticky", top: 0, height: "100vh",
          boxShadow: "4px 0 20px rgba(0,0,0,0.15)",
        }}>
          {/* Logo */}
          <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
            <Link to="/admin" onClick={() => navigate("/admin?tab=submissions")} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
              <img src="/dtech-logo.png" alt="Dtech" style={{ height: 32, objectFit: "contain" }} />
            </Link>
          </div>

          {/* Profile */}
          <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 38, height: 38, borderRadius: "50%",
              background: "rgba(255,255,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: 15, fontWeight: 700, flexShrink: 0,
              border: "1.5px solid rgba(255,255,255,0.3)",
            }}>
              {user.name?.charAt(0).toUpperCase() || "A"}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ color: "#fff", fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user.name || user.email?.split("@")[0]}
              </div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginTop: 1 }}>Administrator</div>
            </div>
          </div>

          {/* Menu */}
          <div style={{ flex: 1, padding: "12px", display: "flex", flexDirection: "column", gap: 2, overflowY: "auto" }}>
            {adminMenus.map((menu) => {
              const isActive = currentTab === menu.tab && !(menu.label === "Dashboard" && currentTab !== "submissions");
              const isReallyActive = menu.label === "Dashboard"
                ? location.pathname === "/admin" && !location.search
                : currentTab === menu.tab;

              return (
                <button
                  key={menu.label}
                  className={`adm-nav-item ${isReallyActive ? "active" : ""}`}
                  onClick={() => {
                    if (menu.label === "Dashboard") {
                      navigate("/admin");
                    } else {
                      navigate(`/admin?tab=${menu.tab}`);
                    }
                  }}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 12px", borderRadius: 10,
                    border: "none", cursor: "pointer", width: "100%", textAlign: "left",
                    background: "transparent",
                    color: isReallyActive ? "#fff" : "rgba(255,255,255,0.65)",
                    fontSize: 13, fontWeight: 500,
                    fontFamily: "'Sora', sans-serif",
                  }}
                >
                  {menu.icon}
                  {menu.label}
                </button>
              );
            })}
          </div>

          {/* Logout */}
          <div style={{ padding: "12px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <button
              className="adm-logout-btn"
              onClick={() => setShowLogoutModal(true)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 12px", borderRadius: 10,
                border: "none", cursor: "pointer", width: "100%", textAlign: "left",
                background: "transparent",
                color: "rgba(255,255,255,0.55)",
                fontSize: 13, fontWeight: 500,
                fontFamily: "'Sora', sans-serif",
                transition: "all 0.15s",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Logout
            </button>
          </div>
        </div>

        {/* ── MAIN AREA ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          {/* Topbar */}
          <div style={{
            background: "#fff", padding: "0 24px", height: 60,
            borderBottom: "1px solid #d4eef8",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            position: "sticky", top: 0, zIndex: 40,
            boxShadow: "0 2px 8px rgba(0,150,199,0.06)",
          }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#0D3040" }}>Admin Dashboard</div>
              <div style={{ fontSize: 11, color: "#9CA3AF" }}>Submission App · DTECH Engineering</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "5px 12px", borderRadius: 20,
                background: "#EBF6FA", border: "1px solid #d4eef8",
              }}>
                <div style={{
                  width: 26, height: 26, borderRadius: "50%",
                  background: "linear-gradient(135deg, #0096C7, #00B4D8)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontSize: 11, fontWeight: 700,
                }}>
                  {user.name?.charAt(0).toUpperCase() || "A"}
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#0D3040" }}>
                  {user.name || "Admin"}
                </span>
                <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 10, background: "#0096C7", color: "#fff", fontWeight: 600 }}>
                  Admin
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <main style={{ flex: 1, padding: "24px", overflowY: "auto" }}>
            {children}
          </main>
        </div>

        {/* Logout Modal */}
        {showLogoutModal && (
          <div className="lm-backdrop" onClick={() => setShowLogoutModal(false)} style={{
            position: "fixed", inset: 0, zIndex: 1000,
            background: "rgba(15,10,40,0.45)", backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
          }}>
            <div className="lm-modal" onClick={(e) => e.stopPropagation()} style={{
              background: "#fff", borderRadius: 20, padding: "36px 32px",
              width: "100%", maxWidth: 400, textAlign: "center",
              boxShadow: "0 24px 64px rgba(0,119,168,0.2)",
              border: "1px solid #cce6f0",
            }}>
              <div style={{
                width: 68, height: 68, borderRadius: "50%", margin: "0 auto 20px",
                background: "linear-gradient(135deg, #FFF1F2, #FFE4E6)",
                border: "2px solid #FECDD3",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30,
              }}>🚪</div>
              <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: "#0D3040" }}>Konfirmasi Logout</h3>
              <p style={{ margin: "0 0 28px", fontSize: 13, color: "#9CA3AF", lineHeight: 1.6 }}>
                Apakah kamu yakin ingin keluar dari akun ini?
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="lm-btn-batal" onClick={() => setShowLogoutModal(false)} style={{
                  flex: 1, padding: "13px", background: "#f5fbfd",
                  border: "2px solid #cce6f0", borderRadius: 12,
                  fontSize: 14, fontWeight: 600, color: "#6B7280", cursor: "pointer", transition: "all 0.2s",
                }}>Batal</button>
                <button className="lm-btn-logout" onClick={handleConfirmLogout} style={{
                  flex: 1, padding: "13px",
                  background: "linear-gradient(135deg, #EF4444, #DC2626)",
                  border: "none", borderRadius: 12,
                  fontSize: 14, fontWeight: 700, color: "#fff", cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(239,68,68,0.35)", transition: "all 0.2s",
                }}>Ya, Logout</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── USER / GUEST LAYOUT (navbar atas) ──
  return (
    <div className="min-h-screen" style={{ background: "#EBF6FA" }}>
      <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Barlow:wght@400;500&display=swap" rel="stylesheet" />
      <style>{`
        .dtech-nav { background: linear-gradient(90deg, #001a2e 0%, #003f5c 50%, #0077A8 100%) !important; border-bottom: 1px solid rgba(0,150,199,0.4) !important; }
        .dtech-nav a, .dtech-nav button { color: #fff !important; }
        .dtech-nav a:hover { color: #fff !important; background: rgba(255,255,255,0.15) !important; }
        .dtech-logout:hover { color: #FFD0D0 !important; background: rgba(255,100,100,0.15) !important; }
        @keyframes backdropIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalIn { from { opacity: 0; transform: scale(0.92) translateY(12px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        .lm-backdrop { animation: backdropIn 0.2s ease forwards; }
        .lm-modal { animation: modalIn 0.25s ease forwards; }
        .lm-btn-batal:hover { background: rgba(0,180,216,0.08) !important; border-color: #00B4D8 !important; color: #00B4D8 !important; }
        .lm-btn-logout:hover { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(239,68,68,0.45) !important; }
      `}</style>

      <nav className="dtech-nav border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" onClick={handleHomeClick} style={{ textDecoration: "none" }}>
                <img src="/dtech-logo.png" alt="Dtech-Engineering" style={{ height: 38, objectFit: "contain" }} />
              </Link>
            </div>
            <div className="flex items-center gap-2">
              {!user && <Link to="/" className="px-4 py-2 rounded-lg transition-colors font-medium">Home</Link>}
              {user?.role === "user" && (
                <Link to="/user" className="px-4 py-2 rounded-lg transition-colors font-medium flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  My Dashboard
                </Link>
              )}
              {!user && (
                <Link to="/login" className="ml-2 px-4 py-2 rounded-lg transition-all font-medium flex items-center gap-2"
                  style={{ background: "#00B4D8", color: "#000" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Login
                </Link>
              )}
              {user && (
                <div className="flex items-center gap-3 ml-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                    style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)" }}>
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.replaceWith(Object.assign(document.createElement("div"), {
                            className: "w-8 h-8 rounded-full flex items-center justify-center",
                            style: "background:#00B4D8",
                            innerHTML: `<span style="color:white;font-size:14px;font-weight:600">${(user.name?.charAt(0) || user.email?.charAt(0) || "U").toUpperCase()}</span>`
                          }));
                        }}
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#00B4D8" }}>
                        <span className="text-white text-sm font-semibold">
                          {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span className="text-sm font-medium hidden sm:block" style={{ color: "#fff" }}>
                      {user.name || user.email?.split("@")[0]}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full capitalize"
                      style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }}>
                      {user.role}
                    </span>
                  </div>
                  <button onClick={() => setShowLogoutModal(true)}
                    className="dtech-logout px-4 py-2 rounded-lg transition-colors font-medium flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {showLogoutModal && (
        <div className="lm-backdrop" onClick={() => setShowLogoutModal(false)} style={{
          position: "fixed", inset: 0, zIndex: 1000,
          background: "rgba(15,10,40,0.45)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
        }}>
          <div className="lm-modal" onClick={(e) => e.stopPropagation()} style={{
            background: "#fff", borderRadius: 20, padding: "36px 32px",
            width: "100%", maxWidth: 400, textAlign: "center",
            boxShadow: "0 24px 64px rgba(0,119,168,0.2)",
            border: "1px solid #cce6f0",
            fontFamily: "'Sora', 'Plus Jakarta Sans', sans-serif",
          }}>
            <div style={{
              width: 68, height: 68, borderRadius: "50%", margin: "0 auto 20px",
              background: "linear-gradient(135deg, #FFF1F2, #FFE4E6)",
              border: "2px solid #FECDD3",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30,
            }}>🚪</div>
            <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: "#0D3040" }}>Konfirmasi Logout</h3>
            <p style={{ margin: "0 0 28px", fontSize: 13, color: "#9CA3AF", lineHeight: 1.6 }}>
              Apakah kamu yakin ingin keluar dari akun ini?
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="lm-btn-batal" onClick={() => setShowLogoutModal(false)} style={{
                flex: 1, padding: "13px", background: "#f5fbfd",
                border: "2px solid #cce6f0", borderRadius: 12,
                fontSize: 14, fontWeight: 600, color: "#6B7280", cursor: "pointer", transition: "all 0.2s",
              }}>Batal</button>
              <button className="lm-btn-logout" onClick={handleConfirmLogout} style={{
                flex: 1, padding: "13px",
                background: "linear-gradient(135deg, #EF4444, #DC2626)",
                border: "none", borderRadius: 12,
                fontSize: 14, fontWeight: 700, color: "#fff", cursor: "pointer",
                boxShadow: "0 4px 14px rgba(239,68,68,0.35)", transition: "all 0.2s",
              }}>Ya, Logout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}