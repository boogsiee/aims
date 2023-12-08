import React, { useState, useEffect, useMemo, useCallback } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useLocation } from "react-router-dom";

const AddItems = () => {
  const path = useLocation();
  const selectedUserId = path.pathname.split("/")[2];

  const [rows, setRows] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3000/users", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch data. Status: ${response.status}`);
      }

      const data = await response.json();

      const rowsWithIds = data.map((row, index) => ({
        ...row,
        id: index + 1,
        firstName: row.user_fname,
        midName: row.user_mname,
        lastName: row.user_lname,
        suffix: row.user_suffix,
        batch: row.batch_year,
        strand: row.strand_name,
        section: row.section_number,
      }));

      setRows(rowsWithIds);
    } catch (error) {
      console.error("Error fetching data:", error.message);
      // Handle the error, e.g., display an error message to the user
    }
  };

  const handleUpdate = useCallback(async (userId) => {
    try {
      const response = await fetch(`http://localhost:3000/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userId),
      });

      if (response.ok) {
        // Handle successful update, e.g., show a success message
        console.log("User updated successfully!");
      } else {
        // Handle update failure, e.g., show an error message
        console.error("Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error.message);
    }
  }, []);

  const handleDelete = useCallback(async (userId) => {
    try {
      const response = await fetch(`http://localhost:3000/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete data");
      }

      // Update the state by filtering out the deleted item
      setRows((prevRows) => prevRows.filter((row) => row.user_ID !== userId));
    } catch (error) {
      console.error("Error deleting data:", error.message);
    }
  }, []);

  const columns = useMemo(
    () => [
      { field: "user_ID", headerName: "User ID", width: 50 },
      { field: "firstName", headerName: "First name", width: 130 },
      { field: "midName", headerName: "Middle name", width: 130 },
      { field: "lastName", headerName: "Last name", width: 130 },
      { field: "suffix", headerName: "Suffix", width: 50 },
      { field: "batch", headerName: "Batch", width: 60 },
      { field: "strand", headerName: "Strand", width: 100 },
      { field: "section", headerName: "Section", width: 60 },
      {
        field: "deletebtn",
        headerName: "Delete",
        width: 100,
        renderCell: (params) => (
          <DeleteButton
            id={params.row.id}
            onDelete={() => handleDelete(params.row.user_ID)}
          />
        ),
      },
      {
        field: "updatebtn",
        headerName: "Update",
        width: 100,
        renderCell: (params) => (
          <UpdateButton
            id={params.row.id}
            onUpdate={() => handleUpdate(params.row)}
          />
        ),
      },
    ],
    [handleDelete, handleUpdate]
  );

  useEffect(() => {
    fetchData();
  }, [selectedUserId]);

  return (
    <div>
      <h2>Recently Added Alumni</h2> <br />
      <div style={{ height: 350, width: "100%" }}>
        <DataGrid rows={rows} columns={columns} getRowId={(row) => row.id} />
      </div>
      <br />
    </div>
  );
};

const UpdateButton = React.memo(function ({ id, onUpdate }) {
  const handleUpdate = () => {
    onUpdate(id);
  };

  return <button onClick={handleUpdate}>Update</button>;
});

const DeleteButton = React.memo(function ({ id, onDelete }) {
  const handleDelete = () => {
    onDelete(id);
  };

  return <button onClick={handleDelete}>Delete</button>;
});

export default AddItems;
