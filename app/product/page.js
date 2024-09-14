"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Button, TextField, Grid, Paper, Typography } from '@mui/material';

export default function Home() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;
  const { register, handleSubmit } = useForm();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);

  async function fetchProducts() {
    try {
      const response = await fetch(`${API_BASE}/product`);
      if (!response.ok) throw new Error('Network response was not ok');
      const products = await response.json();
      setProducts(products);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  }

  async function fetchCategory() {
    try {
      const response = await fetch(`${API_BASE}/category`);
      if (!response.ok) throw new Error('Network response was not ok');
      const categories = await response.json();
      setCategory(categories);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  }

  const createProduct = async (data) => {
    try {
      const response = await fetch(`${API_BASE}/product`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      fetchProducts();
    } catch (error) {
      console.error("Failed to create product:", error);
    }
  };

  const deleteById = (id) => async () => {
    if (!confirm("Are you sure?")) return;
    try {
      const response = await fetch(`${API_BASE}/product/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error('Network response was not ok');
      fetchProducts();
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  useEffect(() => {
    fetchCategory();
    fetchProducts();
  }, []);

  return (
    <div style={{ display: 'flex', gap: '16px', padding: '20px' }}>
      <Paper style={{ flex: 1, padding: '20px' }}>
        <Typography variant="h5" gutterBottom>Add Product</Typography>
        <form onSubmit={handleSubmit(createProduct)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                variant="outlined"
                {...register("name", { required: true })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                variant="outlined"
                {...register("description", { required: true })}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth>Add Product</Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
      <Paper style={{ flex: 2, padding: '20px' }}>
        <Typography variant="h5" gutterBottom>Products ({products.length})</Typography>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {products.map((p) => (
            <li key={p._id} style={{ marginBottom: '10px' }}>
              <Button
                variant="contained"
                color="error"
                onClick={deleteById(p._id)}
                style={{ marginRight: '10px' }}
              >
                Delete
              </Button>
              <Link href={`/product/${p._id}`} style={{ fontWeight: 'bold', color: '#1976d2', textDecoration: 'none' }}>
                {p.name}
              </Link> - {p.description}
            </li>
          ))}
        </ul>
      </Paper>
    </div>
  );
}
