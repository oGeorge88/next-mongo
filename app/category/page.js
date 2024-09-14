"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { DataGrid } from '@mui/x-data-grid';
import { Button, TextField, Grid, Paper, Typography } from '@mui/material'; // Ensure Button is imported

// Define columns for DataGrid with action buttons
const columns = [
  { field: "name", headerName: "Name", width: 200 },
  { field: "order", headerName: "Order", width: 120 },
  {
    field: "_id", headerName: "Action", width: 180,
    renderCell: (params) => (
      <strong>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => startEdit(params.row)}
        >
          Edit
        </Button>
        {' '}
        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={() => confirmDelete(params.row)}
        >
          Delete
        </Button>
      </strong>
    ),
  }
];

export default function Home() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;
  const [categoryList, setCategoryList] = useState([]);
  const [updateForm, setUpdateForm] = useState(false);
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
      order: 0
    }
  });

  async function fetchCategory() {
    const response = await fetch(`${API_BASE}/category`);
    const categories = await response.json();
    setCategoryList(categories.map(category => ({ ...category, id: category._id })));
  }

  useEffect(() => {
    fetchCategory();
  }, []);

  function startEdit(category) {
    reset(category); // Populate form with category details for editing
    setUpdateForm(true);
  }

  function confirmDelete(category) {
    if (window.confirm(`Are you sure you want to delete ${category.name}?`)) {
      deleteCategory(category._id);
    }
  }

  function deleteCategory(id) {
    fetch(`${API_BASE}/category/${id}`, {
      method: "DELETE"
    }).then(() => fetchCategory());
  }

  function createOrUpdateCategory(data) {
    const method = updateForm ? "PUT" : "POST";
    fetch(`${API_BASE}/category`, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(() => {
      fetchCategory();
      reset();
      setUpdateForm(false);
    });
  }

  return (
    <main>
      <Paper style={{ padding: 20, marginBottom: 20 }}>
        <Typography variant="h4">{updateForm ? "Update Category" : "Add New Category"}</Typography>
        <form onSubmit={handleSubmit(createOrUpdateCategory)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Name"
                fullWidth
                variant="outlined"
                {...register("name", { required: true })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Order"
                type="number"
                fullWidth
                variant="outlined"
                {...register("order", { required: true })}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                {updateForm ? "Update" : "Add"}
              </Button>
              {updateForm && (
                <Button
                  onClick={() => {
                    reset();
                    setUpdateForm(false);
                  }}
                  style={{ marginTop: 10 }}
                  fullWidth
                  variant="contained"
                >
                  Cancel
                </Button>
              )}
            </Grid>
          </Grid>
        </form>
      </Paper>
      <Paper style={{ height: 400, width: '100%', padding: 10 }}>
        <Typography variant="h6">Category List</Typography>
        <DataGrid
          rows={categoryList}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
      </Paper>
    </main>
  );
}
