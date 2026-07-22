import { useEffect, useState } from "react";
import { UserCog, X } from "lucide-react";

const initialState = { full_name: "", email: "", phone: "", role: "staff", position: "", branch_id: "" };

const StaffModal = ({ open, mode = "add", staff, branches = [], onClose, onSubmit, submitting = false }) => {
  const [form, setForm] = useState(initialState);
  const [validation, setValidation] = useState("");

  useEffect(() => {
    if (!open) return;
    setValidation("");
    setForm(mode === "edit" && staff ? {
      full_name: staff.full_name || "", email: staff.email || "", phone: staff.phone || "", role: staff.role || "staff", position: staff.position || "", branch_id: staff.branch_id ? String(staff.branch_id) : "",
    } : initialState);
  }, [open, mode, staff]);

  useEffect(() => {
    if (!open) return undefined;
    const escape = (event) => { if (event.key === "Escape" && !submitting) onClose?.(); };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, [open, submitting, onClose]);

  if (!open) return null;
  const change = ({ target }) => setForm((current) => ({ ...current, [target.name]: target.value }));
  const submit = async (event) => {
    event.preventDefault(); setValidation("");
    if (!form.full_name.trim()) return setValidation("Full name is required.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return setValidation("Enter a valid email address.");
    try { await onSubmit?.(form); } catch (error) { setValidation(error.message); }
  };

  return <div className="modal-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !submitting) onClose?.(); }}>
    <div className="order-modal staff-modal" role="dialog" aria-modal="true" aria-labelledby="staff-modal-title">
      <header className="order-modal-header"><div className="staff-modal-heading"><span><UserCog size={20} /></span><div><h3 id="staff-modal-title">{mode === "edit" ? "Edit Staff" : "Add Staff"}</h3><p>{mode === "edit" ? "Update account and assignment details." : "Create a new staff account and branch assignment."}</p></div></div><button type="button" className="btn-icon" aria-label="Close staff modal" disabled={submitting} onClick={onClose}><X size={18} /></button></header>
      <form onSubmit={submit} noValidate>
        <div className="order-modal-body"><section className="order-section"><div className="order-section-title">Account information</div>
          {validation && <div className="staff-form-error" role="alert">{validation}</div>}
          <div className="form-group"><label htmlFor="staff-name">Full Name</label><input id="staff-name" className="form-control" name="full_name" value={form.full_name} onChange={change} autoFocus disabled={submitting} /></div>
          <div className="form-row"><div className="form-group"><label htmlFor="staff-email">Email</label><input id="staff-email" className="form-control" name="email" type="email" value={form.email} onChange={change} disabled={submitting} /></div><div className="form-group"><label htmlFor="staff-phone">Phone</label><input id="staff-phone" className="form-control" name="phone" value={form.phone} onChange={change} disabled={submitting} /></div></div>
          <div className="form-row"><div className="form-group"><label htmlFor="staff-role">Role</label><select id="staff-role" className="form-control" name="role" value={form.role} onChange={change} disabled={submitting}><option value="staff">Staff</option><option value="admin">Admin</option></select></div><div className="form-group"><label htmlFor="staff-position">Position</label><input id="staff-position" className="form-control" name="position" value={form.position} onChange={change} placeholder="e.g. Cashier" disabled={submitting} /></div></div>
          <div className="form-group"><label htmlFor="staff-branch">Branch</label><select id="staff-branch" className="form-control" name="branch_id" value={form.branch_id} onChange={change} disabled={submitting}><option value="">Unassigned</option>{branches.map((branch) => <option key={branch.id} value={String(branch.id)}>{branch.branch_name}</option>)}</select></div>
        </section></div>
        <footer className="order-modal-footer"><button type="button" className="btn btn-secondary" disabled={submitting} onClick={onClose}>Cancel</button><button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? "Saving..." : mode === "edit" ? "Update Staff" : "Create Staff"}</button></footer>
      </form>
    </div>
  </div>;
};

export default StaffModal;
