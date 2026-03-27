import { useState, useEffect } from "react";

function AlertModal({ show, message, onClose }) {
  if (!show) return null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(15,10,40,0.45)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, animation: "backdropIn 0.2s ease forwards" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 20, padding: "36px 32px", width: "100%", maxWidth: 400, textAlign: "center", boxShadow: "0 24px 64px rgba(0,119,168,0.2)", border: "1px solid #cce6f0", animation: "modalIn 0.25s ease forwards" }}>
        <div style={{ width: 68, height: 68, borderRadius: "50%", margin: "0 auto 20px", background: "linear-gradient(135deg, #FFF1F2, #FFE4E6)", border: "2px solid #FECDD3", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30 }}>⚠️</div>
        <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: "#0D3040" }}>Terjadi Kesalahan</h3>
        <p style={{ margin: "0 0 28px", fontSize: 13, color: "#9CA3AF", lineHeight: 1.6 }}>{message}</p>
        <button onClick={onClose} style={{ width: "100%", padding: "13px", background: "linear-gradient(135deg, #0077A8, #0096C7)", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, color: "#fff", cursor: "pointer" }}>OK</button>
      </div>
    </div>
  );
}

import API from "../../services/api";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [search, setSearch] = useState("");
  const [showDeleted, setShowDeleted] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [alertMsg, setAlertMsg] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await API.get("/admin/users");
      setUsers(res.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleRoleChange = async (userId, newRole) => {
    setUpdating(userId);
    try {
      await API.patch(`/admin/users/${userId}/role`, { role: newRole });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      showSuccess("Role berhasil diubah!");
    } catch (err) {
      setAlertMsg(err?.response?.data?.message || "Gagal mengubah role");
    } finally { setUpdating(null); }
  };

  const handleDelete = async (user) => {
    setUpdating(user.id);
    setConfirmDelete(null);
    try {
      await API.delete(`/admin/users/${user.id}`);
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, deleted_at: new Date().toISOString() } : u));
      showSuccess(`User "${user.name}" berhasil dihapus`);
    } catch (err) {
      setAlertMsg(err?.response?.data?.message || "Gagal menghapus user");
    } finally { setUpdating(null); }
  };

  const handleRestore = async (user) => {
    setUpdating(user.id);
    try {
      await API.patch(`/admin/users/${user.id}/restore`);
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, deleted_at: null } : u));
      showSuccess(`User "${user.name}" berhasil dipulihkan`);
    } catch (err) {
      setAlertMsg(err?.response?.data?.message || "Gagal memulihkan user");
    } finally { setUpdating(null); }
  };

  const activeUsers = users.filter(u => !u.deleted_at);
  const deletedUsers = users.filter(u => u.deleted_at);
  const displayed = (showDeleted ? deletedUsers : activeUsers).filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: activeUsers.length,
    admin: activeUsers.filter(u => u.role === "admin").length,
    user: activeUsers.filter(u => u.role === "user").length,
    deleted: deletedUsers.length,
  };

  return (
    <div style={{ fontFamily: "'Sora', 'Plus Jakarta Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.3s ease forwards; }
        .lm-backdrop { animation: backdropIn 0.2s ease forwards; }
        .lm-modal { animation: modalIn 0.25s ease forwards; }

        /* Desktop tetap table asli */
        .desktop-table { display: block; }
        .mobile-list { display: none; }

        @media (max-width: 768px) {
          .desktop-table { display: none !important; }
          .mobile-list { display: flex !important; flex-direction: column; gap: 16px; padding: 0 4px; }

          .toolbar { flex-direction: column !important; align-items: stretch !important; gap: 12px !important; padding: 20px 16px !important; }
          .search-wrapper input { padding-left: 52px !important; }
          .search-wrapper span { left: 18px !important; font-size: 18px !important; }
        }

        .user-card {
          background: #fff;
          border-radius: 16px;
          padding: 18px;
          border: 1px solid #F0EFFE;
          box-shadow: 0 4px 16px rgba(0,0,0,0.05);
          transition: all 0.2s ease;
        }
        .user-card:active { transform: scale(0.98); box-shadow: 0 8px 24px rgba(79,70,229,0.15); }
      `}</style>

      {/* Header */}
      <div className="fade-in header-section" style={{ marginBottom: 28 }}>
        <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 700, color: "#1E1B4B" }}>👥 User Management</h2>
        <p style={{ margin: 0, fontSize: 13, color: "#9CA3AF" }}>Kelola role dan akses semua pengguna yang terdaftar</p>
      </div>

      {/* Stats */}
      <div className="fade-in user-stats" style={{ display: "flex", gap: 14, marginBottom: 24, flexWrap: "wrap" }}>
        {[
          { label: "Total Aktif", value: stats.total, color: "#4F46E5", bg: "#EEF2FF" },
          { label: "Admin", value: stats.admin, color: "#7C3AED", bg: "#F5F3FF" },
          { label: "User Biasa", value: stats.user, color: "#0891B2", bg: "#ECFEFF" },
          { label: "Dihapus", value: stats.deleted, color: "#EF4444", bg: "#FFF1F2" },
        ].map(s => (
          <div key={s.label} style={{ background: s.bg, borderRadius: 14, padding: "14px 22px", border: `1px solid ${s.color}20`, minWidth: 110 }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "#6B7280", fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Success Message */}
      {successMsg && (
        <div className="fade-in" style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 12, padding: "12px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
          <span>✅</span>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#15803D" }}>{successMsg}</p>
        </div>
      )}

      {/* Main Container */}
      <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 4px 24px rgba(0,0,0,0.06)", border: "1px solid #F0EFFE", overflow: "hidden" }}>
        {/* Toolbar */}
        <div className="toolbar" style={{ padding: "16px 24px", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div className="search-wrapper" style={{ position: "relative", flex: 1, minWidth: 200 }}>
            <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontSize: 18, color: "#9CA3AF" }}>🔍</span>
            <input type="text" placeholder="Cari nama atau email..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: "100%", padding: "12px 16px 12px 52px", border: "2px solid #E9E8FF", borderRadius: 12, fontSize: 14, color: "#1E1B4B", background: "#FAFAFE", fontFamily: "'Sora', sans-serif" }} />
          </div>

          <button onClick={() => setShowDeleted(!showDeleted)}
            style={{ padding: "12px 20px", borderRadius: 12, fontSize: 13, fontWeight: 600, border: `2px solid ${showDeleted ? "#EF4444" : "#E9E8FF"}`, background: showDeleted ? "#FFF1F2" : "#FAFAFE", color: showDeleted ? "#EF4444" : "#6B7280", cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap" }}>
            {showDeleted ? "👥 Tampilkan Aktif" : `🗑️ Tampilkan Dihapus (${stats.deleted})`}
          </button>
        </div>

        {loading ? (
          <div style={{ padding: "60px 24px", textAlign: "center", color: "#9CA3AF", fontSize: 14 }}>Memuat data...</div>
        ) : displayed.length === 0 ? (
          <div style={{ padding: "60px 24px", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>{showDeleted ? "🗑️" : "👤"}</div>
            <p style={{ color: "#9CA3AF", fontSize: 14 }}>{showDeleted ? "Tidak ada user yang dihapus" : "Tidak ada user ditemukan"}</p>
          </div>
        ) : (
          <>
            {/* ==================== DESKTOP TABLE (tampilan asli yang kamu suka) ==================== */}
            <div className="desktop-table">
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#F8F7FF", borderBottom: "1px solid #F0EFFE" }}>
                      {["#", "User", "Email", "Role", "Bergabung", "Aksi"].map(h => (
                        <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {displayed.map((u, i) => (
                      <tr key={u.id} className="row-hover" style={{ borderBottom: "1px solid #F3F4F6", transition: "background 0.15s", opacity: u.deleted_at ? 0.6 : 1 }}>
                        <td style={{ padding: "14px 20px", fontSize: 13, color: "#9CA3AF" }}>{i + 1}</td>
                        <td style={{ padding: "14px 20px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            {u.avatar ? (
                              <img src={u.avatar} alt={u.name} referrerPolicy="no-referrer" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }} onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }} />
                            ) : null}
                            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #4F46E5, #7C3AED)", display: u.avatar ? "none" : "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                              {u.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <span style={{ fontSize: 14, fontWeight: 600, color: "#1E1B4B" }}>{u.name}</span>
                              {u.deleted_at && <span style={{ display: "block", fontSize: 11, color: "#EF4444", fontWeight: 500 }}>Dihapus</span>}
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "14px 20px", fontSize: 13, color: "#6B7280" }}>{u.email}</td>
                        <td style={{ padding: "14px 20px" }}>
                          {u.deleted_at ? (
                            <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: "#F3F4F6", color: "#9CA3AF" }}>—</span>
                          ) : (
                            <div style={{ position: "relative", display: "inline-block" }}>
                              <select value={u.role} disabled={updating === u.id} onChange={e => handleRoleChange(u.id, e.target.value)}
                                style={{ padding: "6px 32px 6px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, border: "2px solid", borderColor: u.role === "admin" ? "#7C3AED" : "#22C55E", background: u.role === "admin" ? "#F5F3FF" : "#F0FDF4", color: u.role === "admin" ? "#7C3AED" : "#15803D", cursor: updating === u.id ? "not-allowed" : "pointer", appearance: "none", fontFamily: "'Sora', sans-serif" }}>
                                <option value="user">👤 User</option>
                                <option value="admin">🛡️ Admin</option>
                              </select>
                              <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", fontSize: 10, color: u.role === "admin" ? "#7C3AED" : "#15803D", pointerEvents: "none" }}>▼</span>
                            </div>
                          )}
                        </td>
                        <td style={{ padding: "14px 20px", fontSize: 12, color: "#9CA3AF" }}>
                          {new Date(u.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                        </td>
                        <td style={{ padding: "14px 20px" }}>
                          {u.deleted_at ? (
                            <button onClick={() => handleRestore(u)} className="btn-restore" disabled={updating === u.id}
                              style={{ padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, border: "1.5px solid #6EE7B7", background: "#F0FDF4", color: "#065F46", cursor: "pointer" }}>♻️ Pulihkan</button>
                          ) : (
                            <button onClick={() => setConfirmDelete(u)} className="btn-delete" disabled={updating === u.id}
                              style={{ padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, border: "1.5px solid #FECACA", background: "#FFF1F2", color: "#EF4444", cursor: "pointer" }}>🗑️ Hapus</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ==================== MOBILE CARDS ==================== */}
            <div className="mobile-list">
              {displayed.map(u => (
                <div key={u.id} className="user-card">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg, #4F46E5, #7C3AED)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#fff" }}>
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#1E1B4B" }}>{u.name}</p>
                        <p style={{ margin: 0, fontSize: 13, color: "#6B7280" }}>{u.email}</p>
                      </div>
                    </div>
                    {u.deleted_at && <span style={{ fontSize: 11, color: "#EF4444", fontWeight: 600, background: "#FFF1F2", padding: "2px 8px", borderRadius: 20 }}>Dihapus</span>}
                  </div>

                  <div style={{ margin: "16px 0 12px", display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 13, color: "#6B7280" }}>Role</span>
                    {u.deleted_at ? (
                      <span style={{ padding: "4px 12px", borderRadius: 9999, fontSize: 12, fontWeight: 600, background: "#F3F4F6", color: "#9CA3AF" }}>—</span>
                    ) : (
                      <select value={u.role} disabled={updating === u.id} onChange={e => handleRoleChange(u.id, e.target.value)}
                        style={{ padding: "6px 12px", borderRadius: 9999, fontSize: 13, fontWeight: 700, border: "2px solid", borderColor: u.role === "admin" ? "#7C3AED" : "#22C55E", background: u.role === "admin" ? "#F5F3FF" : "#F0FDF4", color: u.role === "admin" ? "#7C3AED" : "#15803D" }}>
                        <option value="user">👤 User</option>
                        <option value="admin">🛡️ Admin</option>
                      </select>
                    )}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
                    <div style={{ color: "#9CA3AF" }}>Bergabung {new Date(u.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}</div>
                    {u.deleted_at ? (
                      <button onClick={e => { e.stopPropagation(); handleRestore(u); }} style={{ padding: "8px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600, color: "#065F46" }}>♻️ Pulihkan</button>
                    ) : (
                      <button onClick={e => { e.stopPropagation(); setConfirmDelete(u); }} style={{ padding: "8px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600, color: "#EF4444" }}>🗑️ Hapus</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <AlertModal show={!!alertMsg} message={alertMsg} onClose={() => setAlertMsg("")} />

      {confirmDelete && (
        <div className="lm-backdrop" onClick={() => setConfirmDelete(null)} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(15,10,40,0.45)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div className="lm-modal" onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 20, padding: "36px 32px", width: "100%", maxWidth: 400, textAlign: "center", boxShadow: "0 24px 64px rgba(239,68,68,0.15)", border: "1px solid #FECACA" }}>
            <div style={{ width: 68, height: 68, borderRadius: "50%", margin: "0 auto 20px", background: "linear-gradient(135deg, #FFF1F2, #FFE4E6)", border: "2px solid #FECDD3", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30 }}>🗑️</div>
            <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: "#1E1B4B" }}>Hapus User?</h3>
            <p style={{ margin: "0 0 6px", fontSize: 14, fontWeight: 600, color: "#4B5563" }}>{confirmDelete.name}</p>
            <p style={{ margin: "0 0 28px", fontSize: 13, color: "#9CA3AF", lineHeight: 1.6 }}>User akan dihapus sementara dan bisa dipulihkan kembali.</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setConfirmDelete(null)} style={{ flex: 1, padding: "13px", background: "#F9FAFB", border: "2px solid #E5E7EB", borderRadius: 12, fontSize: 14, fontWeight: 600, color: "#6B7280" }}>Batal</button>
              <button onClick={() => handleDelete(confirmDelete)} style={{ flex: 1, padding: "13px", background: "linear-gradient(135deg, #EF4444, #DC2626)", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, color: "#fff" }}>Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}