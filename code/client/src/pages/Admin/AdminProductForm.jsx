import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import { FiSave, FiChevronLeft, FiPlus, FiTrash2 } from 'react-icons/fi';

const CATEGORIES = ['Dog Food','Cat Food','Bird Food','Fish Food','Small Animal Food','Dog Accessories','Cat Accessories','Toys','Grooming','Health & Supplements','Cages & Habitats','Beds & Furniture','Leashes & Collars','Clothing & Apparel','Other'];
const PET_TYPES = ['Dog','Cat','Bird','Fish','Rabbit','Hamster','Reptile','All'];

const INITIAL_FORM = {
  name: '', description: '', price: '', discount: 0, category: 'Dog Food',
  petType: ['Dog'], brand: '', image: '', images: [], stock: '',
  weight: '', tags: '', isFeatured: false, isActive: true,
};

const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(!!id);
  const [imageInput, setImageInput] = useState('');

  useEffect(() => {
    if (id) {
      setFetchLoading(true);
      productAPI.getOne(id)
        .then(res => {
          const p = res.data.product;
          setForm({
            name: p.name || '', description: p.description || '',
            price: p.price || '', discount: p.discount || 0,
            category: p.category || 'Dog Food', petType: p.petType || ['Dog'],
            brand: p.brand || '', image: p.image || '',
            images: p.images || [], stock: p.stock || '',
            weight: p.weight || '', tags: p.tags?.join(', ') || '',
            isFeatured: p.isFeatured || false, isActive: p.isActive !== false,
          });
        })
        .catch(() => { toast.error('Failed to load product'); navigate('/admin/products'); })
        .finally(() => setFetchLoading(false));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handlePetTypeToggle = (pt) => {
    setForm(prev => ({
      ...prev,
      petType: prev.petType.includes(pt)
        ? prev.petType.filter(t => t !== pt)
        : [...prev.petType, pt]
    }));
  };

  const handleAddImage = () => {
    if (!imageInput.trim()) return;
    setForm(prev => ({ ...prev, images: [...prev.images, imageInput.trim()] }));
    setImageInput('');
  };

  const handleRemoveImage = (i) => {
    setForm(prev => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.price || !form.stock) {
      toast.error('Please fill all required fields'); return;
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        discount: Number(form.discount),
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      };
      if (id) {
        await productAPI.update(id, payload);
        toast.success('Product updated!');
      } else {
        await productAPI.create(payload);
        toast.success('Product created!');
      }
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally { setLoading(false); }
  };

  if (fetchLoading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}><div className="loading-spinner" /></div>
  );

  const previewPrice = form.discount > 0 && form.price
    ? Math.round(Number(form.price) - (Number(form.price) * Number(form.discount)) / 100)
    : null;

  return (
    <div>
      <div className="admin-section-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/products')}>
            <FiChevronLeft /> Back
          </button>
          <h2>{id ? 'Edit Product' : 'Add New Product'}</h2>
        </div>
        <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
          <FiSave /> {loading ? 'Saving...' : 'Save Product'}
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', alignItems: 'start' }}>
          {/* Left */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Basic Info */}
            <div className="card p-6">
              <h3 style={{ fontWeight: '700', marginBottom: '16px' }}>Basic Information</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Product Name *</label>
                  <input className="form-input" name="name" value={form.name} onChange={handleChange} placeholder="e.g., Royal Canin Adult Dog Food 10kg" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Description *</label>
                  <textarea className="form-input" name="description" value={form.description} onChange={handleChange} rows={5} placeholder="Describe the product..." required style={{ resize: 'vertical' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Brand</label>
                    <input className="form-input" name="brand" value={form.brand} onChange={handleChange} placeholder="e.g., Royal Canin" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Weight / Size</label>
                    <input className="form-input" name="weight" value={form.weight} onChange={handleChange} placeholder="e.g., 10kg, 500ml" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Tags (comma separated)</label>
                  <input className="form-input" name="tags" value={form.tags} onChange={handleChange} placeholder="e.g., dog food, premium, chicken" />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="card p-6">
              <h3 style={{ fontWeight: '700', marginBottom: '16px' }}>Pricing & Stock</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Price (₹) *</label>
                  <input className="form-input" name="price" type="number" min="0" value={form.price} onChange={handleChange} placeholder="0" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Discount (%)</label>
                  <input className="form-input" name="discount" type="number" min="0" max="100" value={form.discount} onChange={handleChange} placeholder="0" />
                </div>
                <div className="form-group">
                  <label className="form-label">Stock Qty *</label>
                  <input className="form-input" name="stock" type="number" min="0" value={form.stock} onChange={handleChange} placeholder="0" required />
                </div>
              </div>
              {previewPrice && (
                <div style={{ marginTop: '10px', padding: '10px 14px', background: '#D1FAE5', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}>
                  Discounted price: <strong>₹{previewPrice.toLocaleString()}</strong>
                  <span style={{ color: 'var(--text-muted)', marginLeft: '8px' }}>
                    (Save ₹{(Number(form.price) - previewPrice).toLocaleString()})
                  </span>
                </div>
              )}
            </div>

            {/* Images */}
            <div className="card p-6">
              <h3 style={{ fontWeight: '700', marginBottom: '16px' }}>Images</h3>
              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label">Main Image URL *</label>
                <input className="form-input" name="image" value={form.image} onChange={handleChange} placeholder="https://..." />
                {form.image && (
                  <img src={form.image} alt="preview" style={{ marginTop: '8px', width: '120px', height: '120px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                    onError={e => e.target.style.display = 'none'} />
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Additional Images</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input className="form-input" placeholder="Image URL..." value={imageInput} onChange={e => setImageInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddImage())} />
                  <button type="button" className="btn btn-outline btn-sm" onClick={handleAddImage}><FiPlus /></button>
                </div>
                {form.images.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                    {form.images.map((img, i) => (
                      <div key={i} style={{ position: 'relative' }}>
                        <img src={img} alt="" style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px' }} onError={e => e.target.src = 'https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?w=70'} />
                        <button type="button" onClick={() => handleRemoveImage(i)}
                          style={{ position: 'absolute', top: '-4px', right: '-4px', width: '18px', height: '18px', borderRadius: '50%', background: 'var(--danger)', color: 'white', border: 'none', cursor: 'pointer', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Category */}
            <div className="card p-6">
              <h3 style={{ fontWeight: '700', marginBottom: '14px' }}>Category</h3>
              <div className="form-group">
                <label className="form-label">Product Category *</label>
                <select className="form-select" name="category" value={form.category} onChange={handleChange}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Pet Type */}
            <div className="card p-6">
              <h3 style={{ fontWeight: '700', marginBottom: '14px' }}>Suitable For</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {PET_TYPES.map(pt => (
                  <button key={pt} type="button"
                    className={`btn btn-sm ${form.petType.includes(pt) ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ border: '1px solid var(--border)' }}
                    onClick={() => handlePetTypeToggle(pt)}>
                    {pt}
                  </button>
                ))}
              </div>
            </div>

            {/* Settings */}
            <div className="card p-6">
              <h3 style={{ fontWeight: '700', marginBottom: '14px' }}>Settings</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                  <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} style={{ accentColor: 'var(--primary)', width: '16px', height: '16px' }} />
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>Featured Product</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Show on homepage</div>
                  </div>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                  <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} style={{ accentColor: 'var(--primary)', width: '16px', height: '16px' }} />
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>Active / Visible</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Product is listed publicly</div>
                  </div>
                </label>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%' }}>
              <FiSave /> {loading ? 'Saving...' : id ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminProductForm;
