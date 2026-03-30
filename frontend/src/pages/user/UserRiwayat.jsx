import { useState, useEffect } from "react";
import { submissionsApi } from "../../services/api";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import socket from "../../services/socket";
import { ConfirmModal, SuccessBanner } from "../../components/Modals";

export default function UserRiwayat() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");
  const [openHistory, setOpenHistory] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [confirmCancel, setConfirmCancel] = useState(null);
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    submissionsApi.mySubmissions()
      .then(res => setSubmissions(res.data))
      .catch(console.log)
      .finally(() => setLoading(false));

    if (user?.id) {
      socket.connect();
      socket.on("connect", () => socket.emit("join", user.id));
    }
    socket.on("notifikasi", (data) => {
      submissionsApi.mySubmissions().then(res => setSubmissions(res.data)).catch(console.log);
      setSuccessMsg(`🔔 Status pengajuan "${data.title}" telah diupdate menjadi: ${data.status}`);
    });

    return () => {
      socket.off("connect");
      socket.off("notifikasi");
      socket.disconnect();
    };
  }, [user?.id]);

  const handleCancel = async () => {
    if (!confirmCancel) return;
    setCancelling(confirmCancel.id);
    setConfirmCancel(null);
    try {
      await API.patch(`/submissions/${confirmCancel.id}/cancel`);
      setSubmissions(prev => prev.map(s => s.id === confirmCancel.id ? { ...s, status: "cancelled" } : s));
      setSuccessMsg(`✅ Pengajuan "${confirmCancel.title}" berhasil dibatalkan`);
    } catch (err) {
      setSuccessMsg("❌ " + (err?.response?.data?.message || "Gagal membatalkan pengajuan"));
    } finally {
      setCancelling(null);
    }
  };

  const getStatusConfig = (status) => {
    const map = {
      pending:   { bg: "#FFF8E7", border: "#F59E0B", text: "#B45309", label: "Menunggu",   icon: "⏳" },
      approved:  { bg: "#F0FDF4", border: "#22C55E", text: "#15803D", label: "Disetujui",  icon: "✅" },
      rejected:  { bg: "#FFF1F2", border: "#F43F5E", text: "#BE123C", label: "Ditolak",    icon: "❌" },
      review:    { bg: "#EFF6FF", border: "#3B82F6", text: "#1D4ED8", label: "Direview",   icon: "🔍" },
      cancelled: { bg: "#F3F4F6", border: "#9CA3AF", text: "#6B7280", label: "Dibatalkan", icon: "🚫" },
    };
    return map[status?.toLowerCase()] || map.pending;
  };

  const urgencyConfig = {
    standart:  { color: "#22C55E", icon: "🟢", label: "Standart" },
    urgent:    { color: "#F59E0B", icon: "🟠", label: "Urgent" },
    emergency: { color: "#EF4444", icon: "🔴", label: "Emergency" },
  };

  const stats = {
    total:     submissions.length,
    pending:   submissions.filter(s => s.status?.toLowerCase() === "pending").length,
    approved:  submissions.filter(s => s.status?.toLowerCase() === "approved").length,
    rejected:  submissions.filter(s => s.status?.toLowerCase() === "rejected").length,
    cancelled: submissions.filter(s => s.status?.toLowerCase() === "cancelled").length,
  };

  const filtered = submissions
    .filter(s => filterStatus === "all" || s.status?.toLowerCase() === filterStatus)
    .filter(s => !search || s.title?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const aIsCancelled = a.status?.toLowerCase() === "cancelled";
      const bIsCancelled = b.status?.toLowerCase() === "cancelled";
      if (aIsCancelled && !bIsCancelled) return 1;
      if (!aIsCancelled && bIsCancelled) return -1;
      return 0;
    });

  const renderStatusHistory = (item) => {
    const history = item.status_history || [];
    const fallback = [{ status: "pending", note: "Pengajuan dikirim", created_at: item.created_at }];
    if (["review","approved","rejected"].includes(item.status?.toLowerCase())) fallback.push({ status: "review", note: "Sedang ditinjau oleh admin", created_at: null });
    if (["approved","rejected"].includes(item.status?.toLowerCase())) fallback.push({ status: item.status, note: item.status === "approved" ? "Pengajuan disetujui" : "Pengajuan ditolak", admin_note: item.admin_note || null, created_at: item.updated_at });
    if (item.status?.toLowerCase() === "cancelled") fallback.push({ status: "cancelled", note: item.cancelled_by === "admin" ? "Pengajuan dibatalkan oleh admin" : "Pengajuan dibatalkan oleh kamu", created_at: item.updated_at });
    const display = history.length > 0 ? history : fallback;

    return (
      <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #d4eef8" }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: "#7ab3c4", margin: "0 0 12px" }}>Riwayat Status</p>
        {display.map((h, idx) => {
          const sc = getStatusConfig(h.status);
          const isLast = idx === display.length - 1;
          return (
            <div key={idx} style={{ display: "flex", gap: 12 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", flexShrink: 0, background: sc.bg, border: `1.5px solid ${sc.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>{sc.icon}</div>
                {!isLast && <div style={{ width: 1.5, flex: 1, background: "#d4eef8", margin: "4px 0", minHeight: 16 }} />}
              </div>
              <div style={{ paddingBottom: isLast ? 4 : 16, flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: sc.text }}>{sc.label}</div>
                {h.note && <div style={{ fontSize: 12, color: "#7ab3c4", marginTop: 2 }}>{h.note}</div>}
                {h.admin_note && <div style={{ marginTop: 8, padding: "8px 12px", background: sc.bg, border: `1px solid ${sc.border}`, borderRadius: 8, fontSize: 12, color: sc.text }}>💬 Catatan admin: "{h.admin_note}"</div>}
                {h.created_at && <div style={{ fontSize: 11, color: "#a0c4d4", marginTop: 3 }}>🕐 {new Date(h.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</div>}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div style={{ fontFamily: "'Barlow', sans-serif" }}>
      <style>{`
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .fade-in{animation:fadeIn 0.3s ease forwards}
        .card-hover{transition: all 0.2s ease;}
        .card-hover:hover{transform: translateY(-3px); box-shadow: 0 12px 40px rgba(0,150,199,0.15)!important;}

        .desktop-list { display: block; }
        .mobile-list { display: none; }

        @media (max-width: 768px) {
          .desktop-list { display: none !important; }
          .mobile-list { display: flex !important; flex-direction: column; gap: 16px; }
        }
      `}</style>

      {/* Header */}
      <div className="fade-in header-section" style={{ marginBottom: 28 }}>
        <h2 style={{ margin: "0 0 4px", fontSize: 24, fontWeight: 700, color: "#0D3040" }}>📋 Riwayat Pengajuan</h2>
        <p style={{ margin: 0, fontSize: 14, color: "#7ab3c4" }}>Pantau status semua pengajuan kamu</p>
      </div>

      {/* Success Message */}
      <SuccessBanner message={successMsg} onClose={() => setSuccessMsg("")} />

      {/* Stats + Search + Button */}
      <div className="fade-in" style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 28, alignItems: "center" }}>
        {[
          { label: "Total", value: stats.total, color: "#0096C7", bg: "#e0f3fa", filter: "all" },
          { label: "Menunggu", value: stats.pending, color: "#F59E0B", bg: "#FFF8E7", filter: "pending" },
          { label: "Disetujui", value: stats.approved, color: "#22C55E", bg: "#F0FDF4", filter: "approved" },
          { label: "Ditolak", value: stats.rejected, color: "#EF4444", bg: "#FFF1F2", filter: "rejected" },
          { label: "Dibatalkan", value: stats.cancelled, color: "#9CA3AF", bg: "#F3F4F6", filter: "cancelled" },
        ].map(s => (
          <div key={s.label} onClick={() => setFilterStatus(filterStatus === s.filter ? "all" : s.filter)} style={{
            background: filterStatus === s.filter ? s.bg : "#fff",
            borderRadius: 14, padding: "14px 20px", minWidth: 95,
            border: `1.5px solid ${filterStatus === s.filter ? s.color : "#cce6f0"}`,
            cursor: "pointer", transition: "all 0.2s",
          }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "#6B7280" }}>{s.label}</div>
          </div>
        ))}

        <div style={{ flex: 1, minWidth: 260, position: "relative" }}>
          <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontSize: 18, color: "#9CA3AF" }}>🔍</span>
          <input 
            type="text" 
            placeholder="Cari nama barang..." 
            value={search} 
            onChange={e => setSearch(e.target.value)}
            style={{ 
              width: "100%", 
              padding: "13px 16px 13px 50px", 
              border: "1.5px solid #cce6f0", 
              borderRadius: 14, 
              fontSize: 14, 
              background: "#fff" 
            }} 
          />
        </div>

        <button 
          onClick={() => navigate("/user")} 
          style={{
            padding: "13px 26px",
            borderRadius: 14,
            fontSize: 14.5,
            fontWeight: 700,
            background: "linear-gradient(135deg, #0077A8, #0096C7)", 
            color: "#fff",
            border: "none", 
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(0,150,199,0.25)",
          }}
        >
          + Ajukan Barang
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 80, color: "#7ab3c4" }}>Memuat data...</div>
      ) : filtered.length === 0 ? (
        <div style={{ background: "#fff", borderRadius: 20, padding: 80, textAlign: "center", boxShadow: "0 4px 24px rgba(0,150,199,0.08)" }}>
          <div style={{ fontSize: 80, marginBottom: 16 }}>📭</div>
          <h3 style={{ color: "#0D3040" }}>Belum Ada Pengajuan</h3>
          <p style={{ color: "#7ab3c4", margin: "16px 0 24px" }}>Kamu belum punya pengajuan {filterStatus !== "all" ? `dengan status "${filterStatus}"` : ""}</p>
          <button onClick={() => navigate("/user")} style={{ padding: "14px 32px", background: "linear-gradient(135deg, #0077A8, #0096C7)", color: "#fff", border: "none", borderRadius: 14, fontSize: 15, fontWeight: 700 }}>+ Ajukan Barang Baru</button>
        </div>
      ) : (
        <>
          {/* DESKTOP VIEW */}
          <div className="desktop-list">
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {filtered.map((item, i) => {
                const sc = getStatusConfig(item.status);
                const uc = urgencyConfig[item.urgency] || urgencyConfig.standart;
                const isOpen = openHistory === item.id;
                const isPending = item.status?.toLowerCase() === "pending";

                return (
                  <div key={item.id} className="card-hover fade-in" style={{ 
                    background: "#fff", borderRadius: 18, padding: "22px 26px", 
                    boxShadow: "0 4px 20px rgba(0,150,199,0.08)", border: "1px solid #d4eef8"
                  }}>
                    <div style={{ display: "flex", gap: 18 }}>
                      <div style={{ width: 52, height: 52, borderRadius: 14, flexShrink: 0, background: sc.bg, border: `2px solid ${sc.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{sc.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                          <h4 style={{ margin: 0, fontSize: 16.5, fontWeight: 700, color: "#0D3040" }}>{item.title}</h4>
                          <span style={{ padding: "4px 14px", borderRadius: 9999, fontSize: 12.5, fontWeight: 700, background: sc.bg, color: sc.text }}>{sc.label}</span>
                          <span style={{ padding: "4px 14px", borderRadius: 9999, fontSize: 12.5, fontWeight: 700, background: `${uc.color}15`, color: uc.color }}>{uc.icon} {uc.label}</span>
                        </div>

                        <div style={{ marginTop: 8, fontSize: 13.5, color: "#6B7280" }}>
                          {item.quantity} {item.unit} • {item.workshop?.name || "-"} • {new Date(item.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                        </div>

                        <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
                          <button 
                            onClick={() => setOpenHistory(isOpen ? null : item.id)} 
                            style={{ padding: "8px 18px", fontSize: 13.5, fontWeight: 600, background: "#EBF6FA", border: "1px solid #a0d4e8", borderRadius: 10 }}
                          >
                            {isOpen ? "Sembunyikan Riwayat" : "Lihat Riwayat"}
                          </button>

                          {isPending && (
                            <button 
                              onClick={() => setConfirmCancel(item)} 
                              disabled={cancelling === item.id}
                              style={{ padding: "8px 18px", fontSize: 13.5, fontWeight: 600, background: "#FFF1F2", color: "#EF4444", border: "1px solid #FECACA", borderRadius: 10 }}
                            >
                              Batalkan
                            </button>
                          )}
                        </div>

                        {isOpen && renderStatusHistory(item)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* MOBILE VIEW - Sekarang pasti kelihatan */}
          <div className="mobile-list">
            {filtered.map(item => {
              const sc = getStatusConfig(item.status);
              const uc = urgencyConfig[item.urgency] || urgencyConfig.standart;
              const isOpen = openHistory === item.id;
              const isPending = item.status?.toLowerCase() === "pending";

              return (
                <div key={item.id} className="card-hover fade-in" style={{ 
                  background: "#fff", borderRadius: 16, padding: "18px", 
                  boxShadow: "0 4px 16px rgba(0,150,199,0.08)", border: "1px solid #d4eef8"
                }}>
                  <div style={{ display: "flex", gap: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: sc.bg, border: `1.5px solid ${sc.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                      {sc.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: 0, fontSize: 15.5, fontWeight: 700, color: "#0D3040" }}>{item.title}</h4>
                      <div style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>
                        {item.quantity} {item.unit} • {new Date(item.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                      </div>
                      <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                        <span style={{ padding: "3px 10px", borderRadius: 9999, fontSize: 11.5, background: sc.bg, color: sc.text }}>{sc.label}</span>
                        <span style={{ padding: "3px 10px", borderRadius: 9999, fontSize: 11.5, background: `${uc.color}15`, color: uc.color }}>{uc.icon} {uc.label}</span>
                      </div>

                      <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
                        <button 
                          onClick={() => setOpenHistory(isOpen ? null : item.id)} 
                          style={{ flex: 1, padding: "9px", fontSize: 13.5, fontWeight: 600, background: "#EBF6FA", border: "1px solid #a0d4e8", borderRadius: 10 }}
                        >
                          {isOpen ? "Tutup Riwayat" : "Lihat Riwayat"}
                        </button>
                        {isPending && (
                          <button 
                            onClick={() => setConfirmCancel(item)} 
                            style={{ padding: "9px 18px", fontSize: 13.5, fontWeight: 600, background: "#FFF1F2", color: "#EF4444", border: "1px solid #FECACA", borderRadius: 10 }}
                          >
                            Batalkan
                          </button>
                        )}
                      </div>

                      {isOpen && renderStatusHistory(item)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <ConfirmModal
        show={!!confirmCancel}
        title="Batalkan Pengajuan?"
        message={`Pengajuan yang dibatalkan tidak bisa diaktifkan kembali.`}
        onConfirm={handleCancel}
        onCancel={() => setConfirmCancel(null)}
        confirmLabel="Ya, Batalkan"
      />
    </div>
  );
}