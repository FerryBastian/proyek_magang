import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminApi } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getDashboard()
      .then(res => setDashboardData(res.data))
      .catch(console.log)
      .finally(() => setLoading(false));
  }, []);

  const stats = dashboardData?.stats;

  const cards = [
    { label: "Total Users",       value: stats?.total_users,       bg: "#e0f3fa", iconColor: "#0096C7", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z", onClick: () => navigate("/admin/users") },
    { label: "Total Pengajuan",   value: stats?.total_submissions, bg: "#e0f3fa", iconColor: "#0077A8", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", onClick: () => navigate("/admin/submissions") },
    { label: "Pending",           value: stats?.pending_count,     bg: "#FFF8E7", iconColor: "#F59E0B", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", onClick: () => navigate("/admin/submissions?status=pending") },
    { label: "Approved",          value: stats?.approved_count,    bg: "#F0FDF4", iconColor: "#22C55E", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", onClick: () => navigate("/admin/submissions?status=approved") },
    { label: "Rejected",          value: stats?.rejected_count,    bg: "#FFF1F2", iconColor: "#F43F5E", icon: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z", onClick: () => navigate("/admin/submissions?status=rejected") },
  ];

  const quickLinks = [
    { label: "Kelola Pengajuan", icon: "📋", path: "/admin/submissions", desc: "Lihat & update status pengajuan" },
    { label: "Workshop",         icon: "🏭", path: "/admin/workshops",   desc: "Tambah & kelola workshop" },
    { label: "Divisi",           icon: "🏢", path: "/admin/divisions",   desc: "Tambah & kelola divisi" },
    { label: "User Management",  icon: "👥", path: "/admin/users",       desc: "Kelola role & akses user" },
  ];

  return (
    <div style={{ fontFamily: "'Barlow', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&family=Barlow:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}.fade-in{animation:fadeIn 0.3s ease forwards}`}</style>

      {/* Header Banner */}
      <div className="fade-in" style={{
        background: "linear-gradient(135deg, #0077A8 0%, #0096C7 50%, #00B4D8 100%)",
        borderRadius: 20, padding: "28px 32px", marginBottom: 24,
        boxShadow: "0 16px 48px rgba(0,150,199,0.3)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, margin: "0 0 4px" }}>Selamat datang kembali 👋</p>
          <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 800, margin: 0, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: 0.5 }}>
            {user?.name || "Admin"}
          </h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, margin: "6px 0 0" }}>
            {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg xmlns="http://www.w3.org/2000/svg" style={{ width: 36, height: 36, color: "#fff" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
      </div>

      {/* Stats */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#9CA3AF" }}>Memuat data...</div>
      ) : (
        <div className="fade-in" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 14, marginBottom: 28 }}>
          {cards.map(card => (
            <div key={card.label} onClick={card.onClick} style={{
              background: "#fff", borderRadius: 16, padding: "20px",
              border: "1px solid #cce6f0", boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
              cursor: "pointer", transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#0096C7"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,150,199,0.15)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#cce6f0"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.05)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.5 }}>{card.label}</p>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: card.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" style={{ width: 18, height: 18 }} fill="none" viewBox="0 0 24 24" stroke={card.iconColor}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} />
                  </svg>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: 32, fontWeight: 800, color: "#0D3040", fontFamily: "'Barlow Condensed', sans-serif" }}>{card.value ?? 0}</p>
            </div>
          ))}
        </div>
      )}

      {/* Quick Links */}
      <div className="fade-in">
        <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, color: "#0D3040" }}>Menu Cepat</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
          {quickLinks.map(link => (
            <div key={link.path} onClick={() => navigate(link.path)} style={{
              background: "#fff", borderRadius: 16, padding: "20px",
              border: "1px solid #cce6f0", boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
              cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 14,
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#0096C7"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,150,199,0.15)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#cce6f0"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.05)"; }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 14, background: "#EBF6FA", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                {link.icon}
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#0D3040" }}>{link.label}</p>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: "#9CA3AF" }}>{link.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}