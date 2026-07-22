import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, RefreshCw, UsersRound } from "lucide-react";
import StaffToolbar from "../../components/StaffToolbar";
import StaffTable from "../../components/StaffTable";
import StaffModal from "../../components/StaffModal";
import { getStaff, createStaff, updateStaff, deleteStaff } from "../API/staffAPI";
import { getBranches } from "../API/branchAPI";

const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [branches, setBranches] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadData = useCallback(async () => {
    try {
      setLoading(true); setError("");
      const [staffData, branchData] = await Promise.all([getStaff(), getBranches()]);
      setStaff(Array.isArray(staffData) ? staffData : []);
      setBranches(Array.isArray(branchData) ? branchData : []);
    } catch (requestError) { setError(requestError.message || "Unable to load staff records."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);
  const filteredStaff = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return staff.filter((member) => {
      const searchable = [member.full_name, member.email, member.phone, member.position].some((value) => String(value || "").toLowerCase().includes(keyword));
      return searchable && (!roleFilter || member.role === roleFilter) && (!branchFilter || String(member.branch_id) === String(branchFilter));
    });
  }, [staff, search, roleFilter, branchFilter]);

  const openAdd = () => { setError(""); setMessage(""); setSelectedStaff(null); setModalOpen(true); };
  const openEdit = (member) => { setError(""); setMessage(""); setSelectedStaff(member); setModalOpen(true); };
  const closeModal = () => { if (!saving) { setModalOpen(false); setSelectedStaff(null); } };
  const submit = async (form) => {
    try {
      setSaving(true); setError("");
      if (selectedStaff) await updateStaff(selectedStaff.id, form); else await createStaff(form);
      await loadData();
      setModalOpen(false); setSelectedStaff(null);
      setMessage(selectedStaff ? "Staff member updated successfully." : "Staff member created successfully.");
    } catch (requestError) { setError(requestError.message); throw requestError; }
    finally { setSaving(false); }
  };
  const remove = async (member) => {
    if (!window.confirm(`Delete ${member.full_name}?`)) return;
    try { setSaving(true); setError(""); await deleteStaff(member.id); await loadData(); setMessage(`${member.full_name} was deleted successfully.`); }
    catch (requestError) { setError(requestError.message); }
    finally { setSaving(false); }
  };

  return <main className="staff-page"><div className="staff-shell">
    <header className="staff-header"><div><span className="staff-eyebrow"><UsersRound size={15} /> Team management</span><h1>Staff</h1><p>Manage employee accounts, roles, positions, and branch assignments.</p></div><div className="staff-header-actions"><button type="button" className="btn btn-secondary" onClick={loadData} disabled={loading}><RefreshCw size={17} /> Refresh</button><button type="button" className="btn btn-primary" onClick={openAdd}><Plus size={17} /> Add Staff</button></div></header>
    {message && <div className="staff-message" role="status">{message}<button type="button" aria-label="Close success message" onClick={() => setMessage("")}>×</button></div>}
    {error && <div className="staff-error" role="alert">{error}<button type="button" onClick={loadData}>Try again</button></div>}
    <StaffToolbar search={search} onSearchChange={setSearch} roleFilter={roleFilter} onRoleFilterChange={setRoleFilter} branchFilter={branchFilter} onBranchFilterChange={setBranchFilter} branches={branches} onAddStaff={openAdd} onClear={() => { setSearch(""); setRoleFilter(""); setBranchFilter(""); }} />
    <section className="staff-card"><div className="staff-summary"><span>{filteredStaff.length} staff member{filteredStaff.length === 1 ? "" : "s"}</span><span>{roleFilter ? `${roleFilter} role` : "All roles"}</span></div>{loading ? <div className="staff-loading">Loading staff...</div> : <StaffTable staff={filteredStaff} onEdit={openEdit} onDelete={remove} disabled={saving} />}</section>
    <StaffModal open={modalOpen} mode={selectedStaff ? "edit" : "add"} staff={selectedStaff} branches={branches} onClose={closeModal} onSubmit={submit} submitting={saving} />
  </div></main>;
};

export default Staff;
