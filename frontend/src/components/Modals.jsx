/**
 * Reusable Alert Modal Component
 * - Preserves original styling for mobile responsiveness
 * - Used for error messages and notifications
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
 * - Used for delete/restore confirmations
 * - Customizable title, message, confirm button
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
 * Reusable Logout Confirmation Modal
 * - Used for logout confirmation
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
 * - Shows success/error messages with auto-dismiss
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

export default { AlertModal, ConfirmModal, LogoutModal, SuccessBanner };
