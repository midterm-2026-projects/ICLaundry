import { useEffect, useMemo, useState } from "react";

import StaffToolbar from "../../components/StaffToolbar";
import StaffTable from "../../components/StaffTable";
import StaffModal from "../../components/StaffModal";

import {
  getStaff,
  createStaff,
  updateStaff,
  deleteStaff,
} from "../API/staffAPI";

import { getBranches } from "../API/branchAPI";

const Staff = () => {
  const [staff, setStaff] = useState([]);

  const [branches, setBranches] = useState([]);

  const [search, setSearch] = useState("");

  const [roleFilter, setRoleFilter] = useState("");

  const [branchFilter, setBranchFilter] = useState("");

  const [modalOpen, setModalOpen] = useState(false);

  const [selectedStaff, setSelectedStaff] = useState(null);

  const loadData = async () => {
    try {
      const [staffData, branchData] = await Promise.all([
        getStaff(),
        getBranches(),
      ]);

      setStaff(staffData);

      setBranches(branchData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredStaff = useMemo(() => {
    return staff.filter((member) => {
      const matchesSearch =
        member.full_name.toLowerCase().includes(search.toLowerCase()) ||
        member.email.toLowerCase().includes(search.toLowerCase());

      const matchesRole = roleFilter === "" || member.role === roleFilter;

      const matchesBranch =
        branchFilter === "" || member.branch_id === branchFilter;

      return matchesSearch && matchesRole && matchesBranch;
    });
  }, [staff, search, roleFilter, branchFilter]);

  const handleAdd = () => {
    setSelectedStaff(null);

    setModalOpen(true);
  };

  const handleEdit = (staff) => {
    setSelectedStaff(staff);

    setModalOpen(true);
  };

  const handleDelete = async (staff) => {
    if (!window.confirm(`Delete ${staff.full_name}?`)) {
      return;
    }

    await deleteStaff(staff.id);

    loadData();
  };

  const handleSubmit = async (form) => {
    if (selectedStaff) {
      await updateStaff(selectedStaff.id, form);
    } else {
      await createStaff(form);
    }

    setModalOpen(false);

    loadData();
  };

  return (
    <div className="space-y-6 p-6">
      <StaffToolbar
        search={search}
        roleFilter={roleFilter}
        branchFilter={branchFilter}
        branches={branches}
        onSearchChange={setSearch}
        onRoleFilterChange={setRoleFilter}
        onBranchFilterChange={setBranchFilter}
        onAddStaff={handleAdd}
      />

      <StaffTable
        staff={filteredStaff}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <StaffModal
        open={modalOpen}
        mode={selectedStaff ? "edit" : "add"}
        staff={selectedStaff}
        branches={branches}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default Staff;
