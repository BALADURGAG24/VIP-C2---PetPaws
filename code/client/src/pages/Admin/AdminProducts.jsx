import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productAPI } from '../../utils/api';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiEye } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (search) params.keyword = search;
      if (category) params.category = category;
      const res = await productAPI.getAll(params);
      setProducts(res.data.products);
      setPagination(res.data.pagination);
    } catch { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, [page, category]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await productAPI.delete(id);
      toast.success('Product deleted');
      fetchProducts();
    } catch { toast.error('Failed to delete'); }
  };

  const CATEGORIES = ['','Dog Food','Cat Food','Bird Food','Fish Food','Dog Accessories','Cat Accessories','Toys','Grooming','Health & Supplements','Cages & Habitats','Beds & Furniture','Leashes & Collars','Other'];

  return (
    <div>
      <div className="admin-section-header">
        <div>
          <h2>Products</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>
            {pagination.total || 0} total products
          </p>
        </div>
        <Link to="/admin/products/new" className="btn btn-primary">
          <FiPlus /> Add Product
        </Link>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', flex: 1, minWidth: '240px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={16} />
            <input className="form-input" style={{ paddingLeft: '36px' }} placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary btn-sm">Search</button>
        </form>
        <select className="form-select" style={{ width: '180px' }} value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c || 'All Categories'}</option>)}
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}><div className="loading-spinner" style={{ margin: '0 auto' }} /></div>
      ) : (
        <>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Rating</th>
                  <th>Featured</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No products found</td></tr>
                ) : products.map(p => (
                  <tr key={p._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src={p.image} alt={p.name}
                          style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }}
                          onError={e => e.target.src = 'https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?w=60'} />
                        <div>
                          <div style={{ fontWeight: '600', fontSize: '0.875rem', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.brand}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge badge-info">{p.category}</span></td>
                    <td>
                      <div style={{ fontWeight: '700' }}>₹{(p.discountedPrice || p.price).toLocaleString()}</div>
                      {p.discount > 0 && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>₹{p.price.toLocaleString()}</div>}
                    </td>
                    <td>
                      <span className={`badge ${p.stock === 0 ? 'badge-danger' : p.stock < 10 ? 'badge-warning' : 'badge-success'}`}>
                        {p.stock} units
                      </span>
                    </td>
                    <td>
                      {p.ratings?.count > 0 ? (
                        <span>⭐ {p.ratings.average} ({p.ratings.count})</span>
                      ) : <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>No reviews</span>}
                    </td>
                    <td>
                      <span className={`badge ${p.isFeatured ? 'badge-success' : 'badge-warning'}`}>
                        {p.isFeatured ? '✓ Featured' : 'Not Featured'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <Link to={`/products/${p._id}`} className="btn btn-ghost btn-sm" title="View" target="_blank"><FiEye size={14} /></Link>
                        <Link to={`/admin/products/edit/${p._id}`} className="btn btn-ghost btn-sm" title="Edit"><FiEdit2 size={14} /></Link>
                        <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(p._id, p.name)} title="Delete" style={{ color: 'var(--danger)' }}><FiTrash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination.pages > 1 && (
            <div className="pagination" style={{ marginTop: '20px' }}>
              <button className="page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
              {[...Array(pagination.pages)].map((_, i) => (
                <button key={i+1} className={`page-btn ${page === i+1 ? 'active' : ''}`} onClick={() => setPage(i+1)}>{i+1}</button>
              ))}
              <button className="page-btn" disabled={page === pagination.pages} onClick={() => setPage(p => p + 1)}>Next →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminProducts;
