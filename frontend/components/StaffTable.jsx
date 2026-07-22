import { Edit2, Mail, Phone, Trash2, UserRound } from "lucide-react";

const StaffTable = ({ staff = [], onEdit, onDelete, disabled = false }) => (
  <div className="staff-table-wrapper">
    <table className="staff-table">
      <thead><tr><th>Staff member</th><th>Contact</th><th>Role</th><th>Position</th><th>Branch</th><th>Actions</th></tr></thead>
      <tbody>
        {staff.length ? staff.map((member) => (
          <tr key={member.id}>
            <td><div className="staff-person"><span><UserRound size={18} /></span><div><strong>{member.full_name}</strong><small>Staff ID: {String(member.id).slice(0, 8)}</small></div></div></td>
            <td><div className="staff-contact"><span><Mail size={14} />{member.email}</span><span><Phone size={14} />{member.phone || "No phone"}</span></div></td>
            <td><span className={`staff-role ${member.role}`}>{member.role}</span></td>
            <td>{member.position || "—"}</td>
            <td>{member.branch_name ?? member.branch?.branch_name ?? "Unassigned"}</td>
            <td><div className="staff-actions"><button type="button" className="btn-icon" disabled={disabled} onClick={() => onEdit(member)} aria-label={`Edit ${member.full_name}`}><Edit2 size={16} /></button><button type="button" className="btn-icon staff-delete" disabled={disabled} onClick={() => onDelete(member)} aria-label={`Delete ${member.full_name}`}><Trash2 size={16} /></button></div></td>
          </tr>
        )) : <tr><td colSpan="6" className="staff-empty"><UserRound size={26} /><strong>No staff members found</strong><p>Adjust your filters or add the first staff member.</p></td></tr>}
      </tbody>
    </table>
  </div>
);

export default StaffTable;
