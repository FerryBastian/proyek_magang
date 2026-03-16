import { useEffect, useState } from "react";
import API from "../../services/api";

function ConfirmModal({ show, title, message, onConfirm, onCancel, confirmLabel = "Ya, Hapus", confirmColor = "linear-gradient(135deg, #EF4444, #DC2626)" }) {
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
        <div style={{ width: 68, height: 68, borderRadius: "50%", margin: "0 auto 20px", background: "linear-gradient(135deg, #FFF1F2, #FFE4E6)", border: "2px solid #FECDD3", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30 }}>🗑️</div>
        <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: "#0D3040" }}>{title}</h3>
        <p style={{ margin: "0 0 28px", fontSize: 13, color: "#9CA3AF", lineHeight: 1.6 }}>{message}</p>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: "13px", background: "#f5fbfd", border: "2px solid #cce6f0", borderRadius: 12, fontSize: 14, fontWeight: 600, color: "#6B7280", cursor: "pointer" }}>Batal</button>
          <button onClick={onConfirm} style={{ flex: 1, padding: "13px", background: confirmColor, border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, color: "#fff", cursor: "pointer", boxShadow: "0 4px 14px rgba(239,68,68,0.35)" }}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

function AlertModal({ show, message, onClose }) {
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
        <div style={{ width: 68, height: 68, borderRadius: "50%", margin: "0 auto 20px", background: "linear-gradient(135deg, #FFF1F2, #FFE4E6)", border: "2px solid #FECDD3", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30 }}>⚠️</div>
        <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: "#0D3040" }}>Terjadi Kesalahan</h3>
        <p style={{ margin: "0 0 28px", fontSize: 13, color: "#9CA3AF", lineHeight: 1.6 }}>{message}</p>
        <button onClick={onClose} style={{ width: "100%", padding: "13px", background: "linear-gradient(135deg, #0077A8, #0096C7)", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, color: "#fff", cursor: "pointer" }}>OK</button>
      </div>
    </div>
  );
}

function CrudForm({ title, form, setForm, onSubmit, editing, onCancelEdit, loading: formLoading }) {
  const inputStyle = { width: "100%", padding: "10px 14px", border: "1.5px solid #cce6f0", borderRadius: 10, fontSize: 13, color: "#0D3040", background: "#f5fbfd", fontFamily: "'Barlow', sans-serif", outline: "none" };
  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: "20px 24px", marginBottom: 20, border: "1px solid #cce6f0", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
      <h4 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: "#0D3040" }}>
        {editing ? `✏️ Edit ${title}` : `➕ Tambah ${title} Baru`}
      </h4>
      <form onSubmit={onSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#0D3040", marginBottom: 6 }}>Nama <span style={{ color: "#EF4444" }}>*</span></label>
            <input type="text" value={form.name} required onChange={e => setForm({ ...form, name: e.target.value })} placeholder={`Nama ${title}...`} style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#0096C7"} onBlur={e => e.target.style.borderColor = "#cce6f0"} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#0D3040", marginBottom: 6 }}>Deskripsi</label>
            <input type="text" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Deskripsi singkat..." style={inputStyle}
              onFocus={e => e.target.style.borderColor = "#0096C7"} onBlur={e => e.target.style.borderColor = "#cce6f0"} />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <input type="checkbox" id={`active-${title}`} checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} style={{ width: 16, height: 16, accentColor: "#0096C7", cursor: "pointer" }} />
          <label htmlFor={`active-${title}`} style={{ fontSize: 13, fontWeight: 500, color: "#0D3040", cursor: "pointer" }}>Aktif</label>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button type="submit" disabled={formLoading} style={{ padding: "10px 24px", background: "linear-gradient(135deg, #0077A8, #0096C7)", color: "#fff", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", opacity: formLoading ? 0.6 : 1, boxShadow: "0 4px 12px rgba(0,150,199,0.3)" }}>
            {formLoading ? "Menyimpan..." : editing ? "Update" : "Simpan"}
          </button>
          {editing && (
            <button type="button" onClick={onCancelEdit} style={{ padding: "10px 24px", background: "#f5fbfd", color: "#0D3040", border: "1.5px solid #cce6f0", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Batal</button>
          )}
        </div>
      </form>
    </div>
  );
}

function CrudTable({ items, onEdit, onDelete, onRestore }) {
  return (
    <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", border: "1px solid #cce6f0", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
      {items.length === 0 ? (
        <div style={{ padding: 60, textAlign: "center", color: "#9CA3AF" }}>Belum ada data</div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#EBF6FA" }}>
                {["Nama", "Deskripsi", "Status", "Aksi"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#0077A8", textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} style={{ borderTop: "1px solid #e8f4fa", opacity: item.deleted_at ? 0.6 : 1, transition: "background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f5fbfd"}
                  onMouseLeave={e => e.currentTarget.style.background = ""}>
                  <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: "#0D3040" }}>{item.name}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#6B7280" }}>{item.description || "-"}</td>
                  <td style={{ padding: "12px 16px" }}>
                    {item.deleted_at
                      ? <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: "#FFF1F2", color: "#BE123C" }}>Dihapus</span>
                      : item.is_active
                        ? <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: "#F0FDF4", color: "#15803D" }}>Aktif</span>
                        : <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: "#F3F4F6", color: "#6B7280" }}>Nonaktif</span>}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      {item.deleted_at ? (
                        <button onClick={() => onRestore(item.id)} style={{ padding: "6px 14px", fontSize: 12, fontWeight: 600, background: "#F0FDF4", color: "#15803D", border: "1px solid #BBF7D0", borderRadius: 8, cursor: "pointer" }}>♻️ Pulihkan</button>
                      ) : (
                        <>
                          <button onClick={() => onEdit(item)} style={{ padding: "6px 14px", fontSize: 12, fontWeight: 600, background: "#e0f3fa", color: "#0077A8", border: "1px solid #bde8f5", borderRadius: 8, cursor: "pointer" }}>✏️ Edit</button>
                          <button onClick={() => onDelete(item.id)} style={{ padding: "6px 14px", fontSize: 12, fontWeight: 600, background: "#FFF1F2", color: "#BE123C", border: "1px solid #FECACA", borderRadius: 8, cursor: "pointer" }}>🗑️ Hapus</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function useCrud(apiBase) {
  const [items, setItems]       = useState([]);
  const [form, setForm]         = useState({ name: "", description: "", is_active: true });
  const [editing, setEditing]   = useState(null);
  const [loading, setLoading]   = useState(false);
  const [confirm, setConfirm]   = useState(null); // { id }
  const [alertMsg, setAlertMsg] = useState("");

  useEffect(() => { fetchData(); }, []);
  const fetchData = () => API.get(apiBase).then(res => setItems(res.data)).catch(console.log);

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      editing ? await API.put(`${apiBase}/${editing.id}`, form) : await API.post(apiBase, form);
      setForm({ name: "", description: "", is_active: true }); setEditing(null); fetchData();
    } catch (err) { setAlertMsg(err?.response?.data?.message || "Gagal menyimpan data"); }
    finally { setLoading(false); }
  };

  const handleDelete = async () => {
    if (!confirm) return;
    try { await API.delete(`${apiBase}/${confirm.id}`); fetchData(); }
    catch (err) { setAlertMsg(err?.response?.data?.message || "Gagal menghapus data"); }
    finally { setConfirm(null); }
  };

  const handleRestore = async (id) => {
    try { await API.patch(`${apiBase}/${id}/restore`); fetchData(); }
    catch (err) { setAlertMsg(err?.response?.data?.message || "Gagal memulihkan data"); }
  };

  const startEdit = (item) => { setEditing(item); setForm({ name: item.name, description: item.description || "", is_active: item.is_active }); };
  const cancelEdit = () => { setEditing(null); setForm({ name: "", description: "", is_active: true }); };

  return { items, form, setForm, editing, loading, confirm, setConfirm, alertMsg, setAlertMsg, handleSubmit, handleDelete, handleRestore, startEdit, cancelEdit };
}

export function AdminWorkshops() {
  const crud = useCrud("/admin/workshops");
  return (
    <div style={{ fontFamily: "'Barlow', sans-serif" }}>
      <style>{`@keyframes backdropIn{from{opacity:0}to{opacity:1}}@keyframes modalIn{from{opacity:0;transform:scale(0.92) translateY(12px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 700, color: "#0D3040" }}>🏭 Workshop</h2>
        <p style={{ margin: 0, fontSize: 13, color: "#9CA3AF" }}>Kelola daftar workshop</p>
      </div>
      <CrudForm title="Workshop" form={crud.form} setForm={crud.setForm} onSubmit={crud.handleSubmit}
        editing={crud.editing} onCancelEdit={crud.cancelEdit} loading={crud.loading} />
      <CrudTable items={crud.items} onEdit={crud.startEdit} onDelete={(id) => crud.setConfirm({ id })} onRestore={crud.handleRestore} />
      <ConfirmModal show={!!crud.confirm} title="Hapus Workshop?" message="Workshop akan dihapus sementara dan bisa dipulihkan kembali."
        onConfirm={crud.handleDelete} onCancel={() => crud.setConfirm(null)} />
      <AlertModal show={!!crud.alertMsg} message={crud.alertMsg} onClose={() => crud.setAlertMsg("")} />
    </div>
  );
}

export function AdminDivisions() {
  const crud = useCrud("/admin/divisions");
  return (
    <div style={{ fontFamily: "'Barlow', sans-serif" }}>
      <style>{`@keyframes backdropIn{from{opacity:0}to{opacity:1}}@keyframes modalIn{from{opacity:0;transform:scale(0.92) translateY(12px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 700, color: "#0D3040" }}>🏢 Divisi</h2>
        <p style={{ margin: 0, fontSize: 13, color: "#9CA3AF" }}>Kelola daftar divisi</p>
      </div>
      <CrudForm title="Divisi" form={crud.form} setForm={crud.setForm} onSubmit={crud.handleSubmit}
        editing={crud.editing} onCancelEdit={crud.cancelEdit} loading={crud.loading} />
      <CrudTable items={crud.items} onEdit={crud.startEdit} onDelete={(id) => crud.setConfirm({ id })} onRestore={crud.handleRestore} />
      <ConfirmModal show={!!crud.confirm} title="Hapus Divisi?" message="Divisi akan dihapus sementara dan bisa dipulihkan kembali."
        onConfirm={crud.handleDelete} onCancel={() => crud.setConfirm(null)} />
      <AlertModal show={!!crud.alertMsg} message={crud.alertMsg} onClose={() => crud.setAlertMsg("")} />
    </div>
  );
}