import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { adminApi } from "../../services/api";
import { AlertModal } from "../../components/Modals";

function getStatusBadge(status) {
  const cfg = {
    pending: { bg: "#FFF8E7", border: "#F59E0B", text: "#B45309", label: "Pending" },
    approved: { bg: "#F0FDF4", border: "#22C55E", text: "#15803D", label: "Approved" },
    rejected: { bg: "#FFF1F2", border: "#F43F5E", text: "#BE123C", label: "Rejected" },
    review: { bg: "#EFF6FF", border: "#3B82F6", text: "#1D4ED8", label: "In Review" },
    cancelled: { bg: "#F3F4F6", border: "#9CA3AF", text: "#6B7280", label: "Cancelled" },
  };
  const c = cfg[status?.toLowerCase()] || cfg.pending;
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      padding: "4px 10px",
      borderRadius: 6,
      background: c.bg,
      color: c.text,
      border: `1px solid ${c.border}`,
      fontSize: 11,
      fontWeight: 700
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.text, display: "inline-block" }} />
      {c.label}
    </span>
  );
}

function getUrgencyBadge(urgency) {
  const cfg = {
    standart: { color: "#22C55E", label: "Standart" },
    urgent: { color: "#F59E0B", label: "Urgent" },
    emergency: { color: "#EF4444", label: "Emergency" },
  };
  const c = cfg[urgency?.toLowerCase()] || cfg.standart;
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      padding: "4px 10px",
      borderRadius: 6,
      background: `${c.color}18`,
      color: c.color,
      border: `1px solid ${c.color}50`,
      fontSize: 11,
      fontWeight: 700
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.color, display: "inline-block" }} />
      {c.label}
    </span>
  );
}

export default function AdminSubmissions() {
  const location = useLocation();
  const queryStatus = new URLSearchParams(location.search).get("status") || "all";

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [statusFilter, setStatusFilter] = useState(queryStatus);
  const [search, setSearch] = useState("");
  const [alertMsg, setAlertMsg] = useState("");
  const backendUrl = import.meta.env.VITE_BACKEND_APP_URL || 'http://localhost:8000';

  useEffect(() => {
    setStatusFilter(queryStatus);
  }, [queryStatus]);

  useEffect(() => {
    setLoading(true);
    adminApi.getSubmissions()
      .then(res => setData(res.data))
      .catch(console.log)
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await adminApi.updateSubmissionStatus(id, newStatus);
      setData(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
      if (selectedItem?.id === id) {
        setSelectedItem(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      setAlertMsg(err?.response?.data?.message || "Gagal mengubah status");
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = data
    .filter(item => statusFilter === "all" || item.status?.toLowerCase() === statusFilter)
    .filter(item =>
      !search ||
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.user?.name?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const aIsCancelled = a.status?.toLowerCase() === "cancelled";
      const bIsCancelled = b.status?.toLowerCase() === "cancelled";
      if (aIsCancelled && !bIsCancelled) return 1;
      if (!aIsCancelled && bIsCancelled) return -1;
      return 0;
    });

  return (
    <div style={{ fontFamily: "'Barlow', sans-serif" }}>
      <style>{`
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .fade-in{animation:fadeIn 0.3s ease forwards}
        @keyframes spin{to{transform:rotate(360deg)}}
        .spin{animation:spin 0.8s linear infinite}
        @keyframes backdropIn{from{opacity:0}to{opacity:1}}
        @keyframes modalIn{from{opacity:0;transform:scale(0.92) translateY(12px)}to{opacity:1;transform:scale(1) translateY(0)}}

        .lm-backdrop{animation:backdropIn 0.2s ease forwards}
        .lm-modal{animation:modalIn 0.25s ease forwards}

        .header-section{margin-bottom:24px}
        .header-section h2{font-size:22px;font-weight:700;color:#0D3040;margin:0 0 4px}
        .header-section p{font-size:13px;color:#9CA3AF;margin:0}
        
        .modal-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px}

        @media (max-width: 768px) {
          .header-section { margin-bottom: 12px !important; }
          .header-section h2{font-size:19px}
          .header-section p{font-size:12.5px}
          .modal-grid{grid-template-columns:1fr}
          
          .filters { flex-direction: column !important; align-items: stretch !important; gap: 12px !important; padding: 20px 16px !important; margin-bottom: 16px !important; }
          .filters input, .filters select { font-size: 15px !important; }
          
          .search-wrapper input { padding-left: 52px !important; }
          .search-wrapper span { left: 18px !important; }
          
          .desktop-table { display: none !important; }
          .mobile-list { display: flex !important; flex-direction: column !important; gap: 16px !important; padding: 0 4px; }
        }

        @media (min-width: 769px) {
          .mobile-list { display: none !important; }
        }

        .submission-card {
          background: #fff;
          border-radius: 16px;
          padding: 18px;
          border: 1px solid #cce6f0;
          box-shadow: 0 4px 16px rgba(0,0,0,0.05);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .submission-card:active {
          transform: scale(0.98);
          box-shadow: 0 8px 24px rgba(0,150,199,0.15);
        }
        .submission-card .title {
          font-size: 15px;
          font-weight: 700;
          color: "#0D3040";
          margin: 10px 0 8px;
          line-height: 1.3;
        }
      `}</style>

      <div className="fade-in header-section">
        <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 700, color: "#0D3040" }}>📋 Pengajuan</h2>
        <p style={{ margin: 0, fontSize: 13, color: "#9CA3AF" }}>Kelola semua pengajuan barang</p>
      </div>

      <AlertModal show={!!alertMsg} message={alertMsg} onClose={() => setAlertMsg("")} />

      {/* ==================== MODAL DETAIL PENGajuan ==================== */}
      {selectedItem && (
        <div
          className="lm-backdrop"
          onClick={() => setSelectedItem(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            background: "rgba(0,0,0,0.45)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24
          }}
        >
          <div
            className="lm-modal"
            onClick={e => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: 20,
              width: "100%",
              maxWidth: 640,
              maxHeight: "90vh",
              overflowY: "auto",
              border: "1px solid #cce6f0",
              boxShadow: "0 24px 64px rgba(0,0,0,0.15)"
            }}
          >
            {/* Header Modal */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid #e8f4fa" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#0D3040" }}>{selectedItem.title}</h3>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: "#9CA3AF" }}>ID #{selectedItem.id}</p>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "#9CA3AF" }}
              >
                ×
              </button>
            </div>

            <div style={{ padding: 24 }}>
              {/* Status & Urgency Badge */}
              <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
                {getStatusBadge(selectedItem.status)}
                {getUrgencyBadge(selectedItem.urgency)}
              </div>

              {/* Info Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }} className="modal-grid">
                {[
                  { label: "Pengaju", value: selectedItem.user?.name },
                  { label: "Email", value: selectedItem.user?.email, isEmail: true },
                  { label: "No. Telepon", value: selectedItem.nomor_telepon || "-", isPhone: true },
                  { label: "PIC", value: selectedItem.pic || "-" },
                  { label: "Workshop", value: selectedItem.workshop?.name || "-" },
                  { label: "Divisi", value: selectedItem.division?.name || "-" },
                  { label: "Nama Barang", value: selectedItem.title },
                  { label: "Jumlah", value: `${selectedItem.quantity} ${selectedItem.unit}` },
                ].map(({ label, value, isPhone, isEmail }) => {
                  const waNumber = isPhone && value !== "-" ? value.replace(/^0/, "62").replace(/[^0-9]/g, "") : null;
                  return (
                    <div key={label} style={{ background: "#f5fbfd", borderRadius: 12, padding: 12, border: "1px solid #e8f4fa" }}>
                      <p style={{ margin: "0 0 4px", fontSize: 11, color: "#9CA3AF", fontWeight: 600 }}>{label}</p>
                      {waNumber ? (
                        <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noreferrer" style={{ fontSize: 13, fontWeight: 600, color: "#16A34A", textDecoration: "none" }}>💬 {value}</a>
                      ) : isEmail && value ? (
                        <a href={`https://mail.google.com/mail/?view=cm&to=${value}`} target="_blank" rel="noreferrer" style={{ fontSize: 13, fontWeight: 600, color: "#0096C7", textDecoration: "none" }}>✉️ {value}</a>
                      ) : (
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#0D3040" }}>{value}</p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Kegunaan, Spesifikasi, dll */}
              {selectedItem.kegunaan && (
                <div style={{ background: "#f5fbfd", borderRadius: 12, padding: 12, border: "1px solid #e8f4fa", marginBottom: 12 }}>
                  <p style={{ margin: "0 0 4px", fontSize: 11, color: "#9CA3AF", fontWeight: 600 }}>Kegunaan</p>
                  <p style={{ margin: 0, fontSize: 13, color: "#0D3040" }}>{selectedItem.kegunaan}</p>
                </div>
              )}
              {selectedItem.spesifikasi && (
                <div style={{ background: "#f5fbfd", borderRadius: 12, padding: 12, border: "1px solid #e8f4fa", marginBottom: 12 }}>
                  <p style={{ margin: "0 0 4px", fontSize: 11, color: "#9CA3AF", fontWeight: 600 }}>Spesifikasi</p>
                  <p style={{ margin: 0, fontSize: 13, color: "#0D3040" }}>{selectedItem.spesifikasi}</p>
                </div>
              )}
              {selectedItem.content && (
                <div style={{ background: "#f5fbfd", borderRadius: 12, padding: 12, border: "1px solid #e8f4fa", marginBottom: 12 }}>
                  <p style={{ margin: "0 0 4px", fontSize: 11, color: "#9CA3AF", fontWeight: 600 }}>Keterangan Tambahan</p>
                  <p style={{ margin: 0, fontSize: 13, color: "#0D3040" }}>{selectedItem.content}</p>
                </div>
              )}

              {/* ==================== ALASAN PEMBATALAN ==================== */}
              {selectedItem.status?.toLowerCase() === "cancelled" && selectedItem.cancel_reason && (
                <div style={{
                  background: "#FFF1F2",
                  borderRadius: 14,
                  padding: 18,
                  border: "2px solid #FECACA",
                  marginBottom: 20
                }}>
                  <p style={{
                    margin: "0 0 10px",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#BE123C",
                    display: "flex",
                    alignItems: "center",
                    gap: 8
                  }}>
                    🚫 Alasan Pembatalan oleh Pengguna
                  </p>
                  <p style={{
                    margin: 0,
                    fontSize: 15,
                    lineHeight: 1.7,
                    color: "#431407",
                    fontStyle: "italic"
                  }}>
                    "{selectedItem.cancel_reason}"
                  </p>
                  {selectedItem.cancelled_at && (
                    <p style={{
                      margin: "12px 0 0 0",
                      fontSize: 12.5,
                      color: "#9CA3AF"
                    }}>
                      Dibatalkan pada: {new Date(selectedItem.cancelled_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </p>
                  )}
                </div>
              )}

              {/* Update Status Section */}
              <div style={{ background: "#EBF6FA", borderRadius: 12, padding: 16, border: "1px solid #cce6f0" }}>
                <p style={{ margin: "0 0 10px", fontSize: 12, fontWeight: 600, color: "#0077A8" }}>Update Status</p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {selectedItem.status === "cancelled" ? (
                    <div style={{
                      padding: "12px 16px",
                      background: "#F3F4F6",
                      borderRadius: 10,
                      fontSize: 13,
                      color: "#9CA3AF",
                      textAlign: "center",
                      flex: 1
                    }}>
                      🚫 Pengajuan ini sudah dibatalkan oleh pengguna
                    </div>
                  ) : (
                    ["pending", "review", "approved", "rejected"].map(s => (
                      <button
                        key={s}
                        onClick={() => handleStatusChange(selectedItem.id, s)}
                        disabled={updatingId === selectedItem.id || selectedItem.status === s}
                        style={{
                          padding: "8px 16px",
                          borderRadius: 8,
                          fontSize: 12,
                          fontWeight: 600,
                          border: selectedItem.status === s ? "none" : "1px solid #cce6f0",
                          background: selectedItem.status === s ? "#0096C7" : "#fff",
                          color: selectedItem.status === s ? "#fff" : "#0D3040",
                          cursor: selectedItem.status === s ? "default" : "pointer"
                        }}
                      >
                        {s === "review" ? "In Review" : s.charAt(0).toUpperCase() + s.slice(1)}
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="fade-in filters" style={{
        padding: "16px 20px",
        borderBottom: "1px solid #e8f4fa",
        display: "flex",
        alignItems: "center",
        gap: 12,
        flexWrap: "wrap",
        background: "#fff",
        borderRadius: 20,
        boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        border: "1px solid #cce6f0",
        marginBottom: 20
      }}>
        <div className="search-wrapper" style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontSize: 19, color: "#9CA3AF" }}>🔍</span>
          <input
            type="text"
            placeholder="Cari nama barang atau pengaju..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 16px 12px 52px",
              border: "2px solid #cce6f0",
              borderRadius: 12,
              fontSize: 14,
              color: "#0D3040",
              background: "#f5fbfd",
              fontFamily: "'Barlow', sans-serif",
              outline: "none"
            }}
          />
        </div>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          style={{
            padding: "12px 14px",
            border: "2px solid #cce6f0",
            borderRadius: 12,
            fontSize: 14,
            color: "#0D3040",
            background: "#f5fbfd",
            cursor: "pointer",
            fontFamily: "'Barlow', sans-serif",
            outline: "none",
            minWidth: 160
          }}
        >
          <option value="all">Semua Status</option>
          <option value="pending">Pending</option>
          <option value="review">In Review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <span style={{
          padding: "10px 18px",
          borderRadius: 9999,
          fontSize: 13,
          fontWeight: 700,
          background: "#EBF6FA",
          color: "#0077A8",
          whiteSpace: "nowrap"
        }}>
          {filtered.length} pengajuan
        </span>
      </div>

      {/* Loading & Empty State */}
      {loading ? (
        <div style={{ padding: "80px 20px", textAlign: "center", color: "#9CA3AF", fontSize: 15 }}>Memuat data...</div>
      ) : filtered.length === 0 ? (
        <div style={{ padding: "80px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>📭</div>
          <p style={{ color: "#9CA3AF", fontSize: 15 }}>Tidak ada pengajuan ditemukan</p>
        </div>
      ) : (
        <>
          {/* DESKTOP TABLE */}
          <div className="desktop-table fade-in" style={{ background: "#fff", borderRadius: 20, boxShadow: "0 4px 24px rgba(0,0,0,0.06)", border: "1px solid #cce6f0", overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#EBF6FA" }}>
                    {["Pengaju", "Nama Barang", "Jumlah", "Workshop", "Divisi", "Status", "Urgensi", "Tanggal", "Aksi"].map(h => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#0077A8", textTransform: "uppercase", letterSpacing: 0.5, whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(item => (
                    <tr key={item.id} onClick={() => setSelectedItem(item)} style={{ borderTop: "1px solid #e8f4fa", cursor: "pointer", transition: "background 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#f5fbfd"}
                      onMouseLeave={e => e.currentTarget.style.background = ""}>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #0096C7, #00B4D8)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>{item.user?.name?.charAt(0).toUpperCase()}</span>
                          </div>
                          <div>
                            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#0D3040" }}>{item.user?.name}</p>
                            <p style={{ margin: 0, fontSize: 11, color: "#9CA3AF" }}>{item.user?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px" }}><p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#0D3040", maxWidth: 160, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.title}</p></td>
                      <td style={{ padding: "12px 16px" }}><p style={{ margin: 0, fontSize: 13, color: "#0D3040" }}>{item.quantity} {item.unit}</p></td>
                      <td style={{ padding: "12px 16px" }}><p style={{ margin: 0, fontSize: 13, color: "#6B7280" }}>{item.workshop?.name || "-"}</p></td>
                      <td style={{ padding: "12px 16px" }}><p style={{ margin: 0, fontSize: 13, color: "#6B7280" }}>{item.division?.name || "-"}</p></td>
                      <td style={{ padding: "12px 16px" }}>{getStatusBadge(item.status)}</td>
                      <td style={{ padding: "12px 16px" }}>{getUrgencyBadge(item.urgency)}</td>
                      <td style={{ padding: "12px 16px" }}><p style={{ margin: 0, fontSize: 12, color: "#9CA3AF", whiteSpace: "nowrap" }}>{new Date(item.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</p></td>
                      <td style={{ padding: "12px 16px" }} onClick={e => e.stopPropagation()}>
                        {updatingId === item.id ? (
                          <svg className="spin" style={{ width: 18, height: 18, color: "#0096C7" }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25" />
                            <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                        ) : (
                          <select value={item.status} onChange={e => handleStatusChange(item.id, e.target.value)}
                            disabled={item.status === "cancelled"}
                            style={{ padding: "6px 10px", border: "1.5px solid #cce6f0", borderRadius: 8, fontSize: 12, color: "#0D3040", background: item.status === "cancelled" ? "#F3F4F6" : "#f5fbfd", cursor: item.status === "cancelled" ? "not-allowed" : "pointer", fontFamily: "'Barlow', sans-serif", outline: "none", opacity: item.status === "cancelled" ? 0.6 : 1 }}>
                            <option value="pending">Pending</option>
                            <option value="review">In Review</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* MOBILE CARDS */}
          <div className="mobile-list fade-in">
            {filtered.map(item => (
              <div key={item.id} className="submission-card" onClick={() => setSelectedItem(item)}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, #0096C7, #00B4D8)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ color: "#fff", fontSize: 15, fontWeight: 700 }}>{item.user?.name?.charAt(0).toUpperCase()}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#0D3040" }}>{item.user?.name}</p>
                    <p style={{ margin: 0, fontSize: 12, color: "#9CA3AF" }}>{item.user?.email}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ margin: 0, fontSize: 12, color: "#9CA3AF", whiteSpace: "nowrap" }}>
                      {new Date(item.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                    </p>
                  </div>
                </div>

                <p className="title">{item.title}</p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                  {getStatusBadge(item.status)}
                  {getUrgencyBadge(item.urgency)}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#6B7280" }}>
                  <div><strong>{item.quantity} {item.unit}</strong></div>
                  <div>{item.workshop?.name || "-"}</div>
                  <div>{item.division?.name || "-"}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}