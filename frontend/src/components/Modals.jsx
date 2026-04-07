/**
 * Modals.jsx
 * Kumpulan semua modal components
 */

import { useState, useEffect } from "react";
import API from "../services/api";

/**
 * Reusable Alert Modal Component
 */
export function AlertModal({ show, message, onClose }) {
  if (!show) return null;
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(15,10,40,0.45)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
      animation: "backdropIn 0.2s ease forwards",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#fff", borderRadius: 20, padding: "36px 32px",
        width: "100%", maxWidth: 400, textAlign: "center",
        boxShadow: "0 24px 64px rgba(0,119,168,0.2)", border: "1px solid #cce6f0",
        animation: "modalIn 0.25s ease forwards",
      }}>
        <div style={{
          width: 68, height: 68, borderRadius: "50%", margin: "0 auto 20px",
          background: "linear-gradient(135deg, #FFF1F2, #FFE4E6)",
          border: "2px solid #FECDD3",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30,
        }}>⚠️</div>
        <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: "#0D3040" }}>
          Terjadi Kesalahan
        </h3>
        <p style={{ margin: "0 0 28px", fontSize: 13, color: "#9CA3AF", lineHeight: 1.6 }}>
          {message}
        </p>
        <button onClick={onClose} style={{
          width: "100%", padding: "13px",
          background: "linear-gradient(135deg, #0077A8, #0096C7)",
          border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700,
          color: "#fff", cursor: "pointer",
        }}>OK</button>
      </div>
    </div>
  );
}

/**
 * Reusable Confirm Modal Component
 */
export function ConfirmModal({ 
  show, 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  confirmLabel = "Ya, Hapus", 
  confirmColor = "linear-gradient(135deg, #EF4444, #DC2626)" 
}) {
  if (!show) return null;
  return (
    <div onClick={onCancel} style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(15,10,40,0.45)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
      animation: "backdropIn 0.2s ease forwards",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#fff", borderRadius: 20, padding: "36px 32px",
        width: "100%", maxWidth: 400, textAlign: "center",
        boxShadow: "0 24px 64px rgba(0,119,168,0.2)", border: "1px solid #cce6f0",
        animation: "modalIn 0.25s ease forwards",
      }}>
        <div style={{
          width: 68, height: 68, borderRadius: "50%", margin: "0 auto 20px",
          background: "linear-gradient(135deg, #FFF1F2, #FFE4E6)",
          border: "2px solid #FECDD3",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30,
        }}>🗑️</div>
        <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: "#0D3040" }}>
          {title}
        </h3>
        <p style={{ margin: "0 0 28px", fontSize: 13, color: "#9CA3AF", lineHeight: 1.6 }}>
          {message}
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onCancel} style={{
            flex: 1, padding: "13px", background: "#f5fbfd",
            border: "2px solid #cce6f0", borderRadius: 12, fontSize: 14,
            fontWeight: 600, color: "#6B7280", cursor: "pointer",
          }}>Batal</button>
          <button onClick={onConfirm} style={{
            flex: 1, padding: "13px", background: confirmColor,
            border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700,
            color: "#fff", cursor: "pointer", boxShadow: "0 4px 14px rgba(239,68,68,0.35)",
          }}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

/**
 * Cancel Submission Modal dengan Alasan Wajib
 */
export function CancelSubmissionModal({ 
  show, 
  submission, 
  onConfirm, 
  onCancel,
  loading = false 
}) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError("Alasan pembatalan wajib diisi");
      return;
    }
    setError("");
    onConfirm(reason.trim());
  };

  if (!show || !submission) return null;

  return (
    <div 
      onClick={onCancel} 
      style={{
        position: "fixed", 
        inset: 0, 
        zIndex: 1000,
        background: "rgba(15,10,40,0.45)", 
        backdropFilter: "blur(4px)",
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        padding: 24,
      }}
    >
      <div 
        onClick={e => e.stopPropagation()} 
        style={{
          background: "#fff", 
          borderRadius: 20, 
          padding: "32px 28px",
          width: "100%", 
          maxWidth: 420, 
          boxShadow: "0 24px 64px rgba(0,119,168,0.2)", 
          border: "1px solid #cce6f0",
        }}
      >
        <div style={{
          width: 68, height: 68, borderRadius: "50%", margin: "0 auto 20px",
          background: "linear-gradient(135deg, #FFF1F2, #FFE4E6)",
          border: "2px solid #FECDD3",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32,
        }}>🚫</div>

        <h3 style={{ 
          margin: "0 0 8px", 
          fontSize: 19, 
          fontWeight: 700, 
          color: "#0D3040", 
          textAlign: "center" 
        }}>
          Batalkan Pengajuan?
        </h3>

        <p style={{ 
          margin: "0 0 24px", 
          fontSize: 14, 
          color: "#6B7280", 
          textAlign: "center", 
          lineHeight: 1.5 
        }}>
          Pengajuan <strong>"{submission.title}"</strong> akan dibatalkan dan tidak bisa diaktifkan kembali.
        </p>

        <div style={{ marginBottom: 20 }}>
          <label style={{ 
            display: "block", 
            fontSize: 14, 
            fontWeight: 600, 
            color: "#374151", 
            marginBottom: 8 
          }}>
            Alasan Pembatalan <span style={{ color: "#EF4444" }}>*</span>
          </label>
          
          <textarea
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (error) setError("");
            }}
            placeholder="Jelaskan alasan pembatalan secara jelas..."
            rows={5}
            style={{
              width: "100%",
              padding: "14px 16px",
              border: `2px solid ${error ? "#EF4444" : "#cce6f0"}`,
              borderRadius: 14,
              fontSize: 14.5,
              resize: "vertical",
              minHeight: 130,
              fontFamily: "inherit",
              outline: "none"
            }}
          />
          
          {error && (
            <p style={{ color: "#EF4444", fontSize: 13, marginTop: 6, textAlign: "left" }}>
              {error}
            </p>
          )}
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button 
            onClick={onCancel}
            style={{
              flex: 1, 
              padding: "13px", 
              background: "#f5fbfd",
              border: "2px solid #cce6f0", 
              borderRadius: 12, 
              fontSize: 14.5,
              fontWeight: 600, 
              color: "#6B7280", 
              cursor: "pointer",
            }}
          >
            Kembali
          </button>

          <button 
            onClick={handleConfirm}
            disabled={loading || !reason.trim()}
            style={{
              flex: 1, 
              padding: "13px", 
              background: loading ? "#9CA3AF" : "linear-gradient(135deg, #EF4444, #DC2626)",
              border: "none", 
              borderRadius: 12, 
              fontSize: 14.5, 
              fontWeight: 700,
              color: "#fff", 
              cursor: loading || !reason.trim() ? "not-allowed" : "pointer",
              boxShadow: "0 4px 14px rgba(239,68,68,0.35)",
            }}
          >
            {loading ? "Membatalkan..." : "Ya, Batalkan"}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Reusable Logout Confirmation Modal
 */
export function LogoutModal({ show, onConfirm, onCancel }) {
  if (!show) return null;
  return (
    <div onClick={onCancel} style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(15,10,40,0.45)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
      animation: "backdropIn 0.2s ease forwards",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#fff", borderRadius: 20, padding: "36px 32px",
        width: "100%", maxWidth: 400, textAlign: "center",
        boxShadow: "0 24px 64px rgba(0,119,168,0.2)", border: "1px solid #cce6f0",
        animation: "modalIn 0.25s ease forwards",
      }}>
        <div style={{
          width: 68, height: 68, borderRadius: "50%", margin: "0 auto 20px",
          background: "linear-gradient(135deg, #FFF1F2, #FFE4E6)",
          border: "2px solid #FECDD3",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30,
        }}>🚪</div>
        <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: "#0D3040" }}>
          Konfirmasi Logout
        </h3>
        <p style={{ margin: "0 0 28px", fontSize: 13, color: "#9CA3AF", lineHeight: 1.6 }}>
          Apakah kamu yakin ingin keluar dari akun ini?
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onCancel} style={{
            flex: 1, padding: "13px", background: "#f5fbfd",
            border: "2px solid #cce6f0", borderRadius: 12, fontSize: 14,
            fontWeight: 600, color: "#6B7280", cursor: "pointer",
          }}>Batal</button>
          <button onClick={onConfirm} style={{
            flex: 1, padding: "13px", background: "linear-gradient(135deg, #EF4444, #DC2626)",
            border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700,
            color: "#fff", cursor: "pointer", boxShadow: "0 4px 14px rgba(239,68,68,0.35)",
          }}>Ya, Logout</button>
        </div>
      </div>
    </div>
  );
}

/**
 * Reusable Success Message Banner
 */
export function SuccessBanner({ message, onClose }) {
  if (!message) return null;
  
  const isSuccess = message.startsWith("✅") || message.startsWith("🔔");
  const bgColor = isSuccess ? "#F0FDF4" : "#FFF1F2";
  const borderColor = isSuccess ? "#BBF7D0" : "#FECACA";
  const textColor = isSuccess ? "#15803D" : "#BE123C";
  
  return (
    <div style={{
      background: bgColor, border: `1px solid ${borderColor}`,
      borderRadius: 12, padding: "14px 18px", marginBottom: 20,
      display: "flex", alignItems: "center", gap: 10,
      animation: "fadeIn 0.3s ease forwards",
    }}>
      <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: textColor }}>{message}</p>
      <button onClick={onClose} style={{
        marginLeft: "auto", background: "none", border: "none",
        fontSize: 20, cursor: "pointer", color: "#9CA3AF",
      }}>×</button>
    </div>
  );
}

/**
 * Profile Modal — edit no. telp, divisi, workshop
 * Data disimpan via API dan di-cache ke localStorage untuk auto-fill
 */
export function ProfileModal({ show, onClose, user }) {
  const [workshops, setWorkshops]   = useState([]);
  const [divisions, setDivisions]   = useState([]);
  const [workshopId, setWorkshopId] = useState("");
  const [divisionId, setDivisionId] = useState("");
  const [phone, setPhone]           = useState("");
  const [saving, setSaving]         = useState(false);
  const [saved, setSaved]           = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  // Load workshops, divisions, and existing profile
  useEffect(() => {
    if (!show) return;
    setLoadingData(true);
    setSaved(false);

    Promise.all([
      API.get("/workshops"),
      API.get("/divisions"),
      API.get("/profile").catch(() => ({ data: null })),
    ]).then(([wsRes, dvRes, profileRes]) => {
      setWorkshops(wsRes.data || []);
      setDivisions(dvRes.data || []);

      // Priority: server profile → localStorage cache
      const serverProfile = profileRes.data;
      const cached = JSON.parse(localStorage.getItem("userProfile") || "{}");
      const src = serverProfile || cached;

      setWorkshopId(String(src?.workshop_id  || src?.workshopId  || ""));
      setDivisionId(String(src?.division_id  || src?.divisionId  || ""));
      setPhone(src?.nomor_telepon || src?.phone || "");
    }).catch(console.error)
      .finally(() => setLoadingData(false));
  }, [show]);

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      workshop_id:    workshopId  || null,
      division_id:    divisionId  || null,
      nomor_telepon:  phone       || null,
    };
    try {
      await API.put("/profile", payload);
    } catch {
      // If endpoint doesn't exist yet, fall through to localStorage only
    }
    // Always persist to localStorage as auto-fill cache
    localStorage.setItem("userProfile", JSON.stringify({
      workshopId:    workshopId,
      divisionId:    divisionId,
      phone:         phone,
      workshop_id:   workshopId,
      division_id:   divisionId,
      nomor_telepon: phone,
    }));
    setSaving(false);
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 900);
  };

  if (!show) return null;

  const selectedWorkshop = workshops.find(w => String(w.id) === String(workshopId));
  const selectedDivision = divisions.find(d => String(d.id) === String(divisionId));

  const inputStyle = (filled) => ({
    width: "100%",
    padding: "13px 16px",
    border: `2px solid ${filled ? "#0096C7" : "#cce6f0"}`,
    borderRadius: 14,
    fontSize: 14,
    background: filled ? "#f0faff" : "#f5fbfd",
    fontFamily: "'Barlow', sans-serif",
    outline: "none",
    color: "#0D3040",
    transition: "border-color 0.2s, background 0.2s",
  });

  return (
    <>
      <style>{`
        @keyframes backdropIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(32px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes checkPop { 0% { transform: scale(0); } 60% { transform: scale(1.25); } 100% { transform: scale(1); } }
        .profile-field-label { font-size: 13px; font-weight: 700; color: #4B6B7A; margin-bottom: 8px; display: block; letter-spacing: 0.02em; text-transform: uppercase; }
        .profile-save-btn { transition: all 0.2s ease; }
        .profile-save-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(0,150,199,0.4) !important; }
        .profile-close-btn:hover { background: rgba(0,150,199,0.1) !important; }
        .profile-select option { background: #fff; color: #0D3040; }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 1100,
          background: "rgba(5, 20, 35, 0.6)",
          backdropFilter: "blur(6px)",
          animation: "backdropIn 0.2s ease forwards",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "20px",
        }}
      >
        {/* Modal */}
        <div
          onClick={e => e.stopPropagation()}
          style={{
            width: "100%",
            maxWidth: 480,
            borderRadius: 24,
            overflow: "hidden",
            boxShadow: "0 32px 80px rgba(0, 60, 100, 0.35), 0 0 0 1px rgba(0,150,199,0.15)",
            animation: "slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards",
            background: "#fff",
          }}
        >
          {/* Header — gradient strip */}
          <div style={{
            background: "linear-gradient(135deg, #003f5c 0%, #0077A8 55%, #00B4D8 100%)",
            padding: "28px 28px 24px",
            position: "relative",
          }}>
            {/* Decorative circles */}
            <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
            <div style={{ position: "absolute", bottom: -20, left: 20, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />

            {/* Avatar + info */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, position: "relative" }}>
              <div style={{
                width: 64, height: 64, borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                border: "2.5px solid rgba(255,255,255,0.5)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 28, flexShrink: 0,
                boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
              }}>
                {user?.avatar
                  ? <img src={user.avatar} alt="" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                  : "👤"
                }
              </div>
              <div>
                <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>Profil Saya</div>
                <div style={{ color: "#fff", fontSize: 20, fontWeight: 800, marginTop: 2 }}>{user?.name || "—"}</div>
                <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, marginTop: 2 }}>{user?.email || ""}</div>
              </div>
            </div>

            {/* Close btn */}
            <button
              className="profile-close-btn"
              onClick={onClose}
              style={{
                position: "absolute", top: 16, right: 16,
                width: 34, height: 34, borderRadius: "50%",
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.25)",
                color: "#fff", fontSize: 18, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.2s",
              }}
            >×</button>
          </div>

          {/* Body */}
          <div style={{ padding: "28px 28px 24px" }}>
            {loadingData ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: "#7ab3c4", fontSize: 14 }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>⏳</div>
                Memuat data profil...
              </div>
            ) : (
              <>
                {/* Info chip */}
                <div style={{
                  background: "#EFF6FF",
                  border: "1.5px solid #BFDBFE",
                  borderRadius: 12,
                  padding: "11px 16px",
                  marginBottom: 24,
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                }}>
                  <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>💡</span>
                  <p style={{ margin: 0, fontSize: 13, color: "#1D4ED8", lineHeight: 1.5 }}>
                    Data ini akan otomatis mengisi form pengajuan. Kamu tidak perlu mengisi ulang setiap kali submit.
                  </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {/* Nomor Telepon */}
                  <div>
                    <label className="profile-field-label">
                      📱 Nomor Telepon
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="Contoh: 08123456789"
                      style={inputStyle(!!phone)}
                    />
                  </div>

                  {/* Workshop */}
                  <div>
                    <label className="profile-field-label">
                      🏭 Workshop Default
                    </label>
                    <div style={{ position: "relative" }}>
                      <select
                        className="profile-select"
                        value={workshopId}
                        onChange={e => setWorkshopId(e.target.value)}
                        style={{ ...inputStyle(!!workshopId), appearance: "none", paddingRight: 40, cursor: "pointer" }}
                      >
                        <option value="">— Pilih Workshop —</option>
                        {workshops.map(w => (
                          <option key={w.id} value={w.id}>{w.name}</option>
                        ))}
                      </select>
                      <span style={{
                        position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                        color: "#7ab3c4", fontSize: 13, pointerEvents: "none",
                      }}>▾</span>
                    </div>
                    {selectedWorkshop && (
                      <div style={{ marginTop: 6, fontSize: 12, color: "#0096C7", display: "flex", alignItems: "center", gap: 4 }}>
                        <span>✓</span> {selectedWorkshop.name} terpilih
                      </div>
                    )}
                  </div>

                  {/* Divisi */}
                  <div>
                    <label className="profile-field-label">
                      🏢 Divisi Default
                    </label>
                    <div style={{ position: "relative" }}>
                      <select
                        className="profile-select"
                        value={divisionId}
                        onChange={e => setDivisionId(e.target.value)}
                        style={{ ...inputStyle(!!divisionId), appearance: "none", paddingRight: 40, cursor: "pointer" }}
                      >
                        <option value="">— Pilih Divisi —</option>
                        {divisions.map(d => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </select>
                      <span style={{
                        position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                        color: "#7ab3c4", fontSize: 13, pointerEvents: "none",
                      }}>▾</span>
                    </div>
                    {selectedDivision && (
                      <div style={{ marginTop: 6, fontSize: 12, color: "#0096C7", display: "flex", alignItems: "center", gap: 4 }}>
                        <span>✓</span> {selectedDivision.name} terpilih
                      </div>
                    )}
                  </div>
                </div>

                {/* Completeness bar */}
                <div style={{ marginTop: 24 }}>
                  {(() => {
                    const filled = [phone, workshopId, divisionId].filter(Boolean).length;
                    const pct    = Math.round((filled / 3) * 100);
                    const color  = pct === 100 ? "#22C55E" : pct >= 50 ? "#0096C7" : "#F59E0B";
                    return (
                      <>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#7ab3c4", marginBottom: 6 }}>
                          <span>Kelengkapan profil</span>
                          <span style={{ fontWeight: 700, color }}>{pct}%</span>
                        </div>
                        <div style={{ height: 6, background: "#e0f0f8", borderRadius: 99, overflow: "hidden" }}>
                          <div style={{
                            height: "100%",
                            width: `${pct}%`,
                            background: `linear-gradient(90deg, #0096C7, ${color})`,
                            borderRadius: 99,
                            transition: "width 0.4s ease",
                          }} />
                        </div>
                      </>
                    );
                  })()}
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          {!loadingData && (
            <div style={{
              padding: "0 28px 28px",
              display: "flex", gap: 12,
            }}>
              <button
                onClick={onClose}
                style={{
                  flex: 1, padding: "14px",
                  background: "#f5fbfd",
                  border: "2px solid #d4eef8",
                  borderRadius: 14, fontSize: 14.5, fontWeight: 600,
                  color: "#6B7280", cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                Batal
              </button>
              <button
                className="profile-save-btn"
                onClick={handleSave}
                disabled={saving || saved}
                style={{
                  flex: 2, padding: "14px",
                  background: saved
                    ? "linear-gradient(135deg, #22C55E, #16A34A)"
                    : saving
                    ? "#b0d4e3"
                    : "linear-gradient(135deg, #0077A8, #0096C7)",
                  border: "none", borderRadius: 14,
                  fontSize: 14.5, fontWeight: 700,
                  color: "#fff", cursor: saving || saved ? "default" : "pointer",
                  boxShadow: "0 4px 16px rgba(0,150,199,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}
              >
                {saved ? (
                  <>
                    <span style={{ animation: "checkPop 0.4s ease forwards", display: "inline-block" }}>✓</span>
                    Tersimpan!
                  </>
                ) : saving ? (
                  "Menyimpan..."
                ) : (
                  <>
                    <span>💾</span> Simpan Profil
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Export semua modal sekaligus
export default { 
  AlertModal, 
  ConfirmModal, 
  CancelSubmissionModal, 
  LogoutModal, 
  SuccessBanner,
  ProfileModal,
};