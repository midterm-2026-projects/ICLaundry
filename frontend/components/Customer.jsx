import { useState } from "react";

import CustomerSearch from "./CustomerSearch";
import CustomerTable from "./CustomerTable";
import CustomerActions from "./CustomerActions";
import CustomerModal from "./CustomerModal";

export default function Customer() {
  const [showModal, setShowModal] =
    useState(false);

  const [editing, setEditing] =
    useState(false);

  return (
    <>
      <CustomerSearch />

      <CustomerTable />

      <CustomerActions
        setShowModal={setShowModal}
        setEditing={setEditing}
      />

      {showModal && (
        <CustomerModal
          editing={editing}
        />
      )}
    </>
  );
}