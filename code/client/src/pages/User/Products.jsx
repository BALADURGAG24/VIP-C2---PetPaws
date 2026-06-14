import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productAPI } from '../../utils/api';
import ProductCard from '../../components/Common/ProductCard';
import { FiFilter, FiX, FiChevronDown } from 'react-icons/fi';
import './Products.css';

const CATEGORIES = ['Dog Food','Cat Food','Bird Food','Fish Food','Small Animal Food','Dog Accessories','Cat Accessories','Toys','Grooming','Health & Supplements','Cages & Habitats','Beds & Furniture','Leashes & Collars','Clothing & Apparel','Other'];
const PET_TYPES = ['Dog','Cat','Bird','Fish','Rabbit','Hamster','Reptile','All'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    category: searchParams.get('category') || '',
    petType: searchParams.get('petType') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || 'newest',
    page: parseInt(searchParams.get('page')) || 1,
    featured: searchParams.get('featured') || '',
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
      params.limit = 12;
      const res = await productAPI.getAll(params);
      setProducts(res.data.products);
      setPagination(res.data.pagination);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  useEffect(() => {
    const params = {};
    Object.entries(filters).forEach(([k, v]) => { if (v && k !== 'page') params[k] = v; });
    if (filters.page > 1) params.page = filters.page;
    setSearchParams(params);
  }, [filters]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({ keyword: '', category: '', petType: '', minPrice: '', maxPrice: '', sort: 'newest', page: 1, featured: '' });
  };

  const hasActiveFilters = filters.category || filters.petType || filters.minPrice || filters.maxPrice || filters.keyword;

  return (
    <div className="products-page">
      <div className="container">
        {/* Header */}
        <div className="products-header">
          <div>
            <h1>
              {filters.keyword ? `Results for "${filters.keyword}"` :
               filters.category ? filters.category :
               filters.featured ? 'Featured Products' : 'All Products'}
            </h1>
            <p>{pagination.total || 0} products found</p>
          </div>
          <div className="products-controls">
            <select className="form-select sort-select" value={filters.sort} onChange={e => updateFilter('sort', e.target.value)}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <button className={`filter-toggle-btn ${filterOpen ? 'active' : ''}`} onClick={() => setFilterOpen(!filterOpen)}>
              <FiFilter size={16} /> Filters
            </button>
          </div>
        </div>

        <div className="products-layout">
          {/* Sidebar */}
          <aside className={`filters-sidebar ${filterOpen ? 'open' : ''}`}>
            <div className="filters-header">
              <h3>Filters</h3>
              {hasActiveFilters && (
                <button className="clear-filters" onClick={clearFilters}><FiX size={14} /> Clear All</button>
              )}
            </div>

            {/* Category */}
            <div className="filter-group">
              <h4>Category</h4>
              <div className="filter-options">
                <label className={`filter-opt ${!filters.category ? 'selected' : ''}`}>
                  <input type="radio" name="category" value="" checked={!filters.category} onChange={() => updateFilter('category', '')} />
                  All Categories
                </label>
                {CATEGORIES.map(cat => (
                  <label key={cat} className={`filter-opt ${filters.category === cat ? 'selected' : ''}`}>
                    <input type="radio" name="category" value={cat} checked={filters.category === cat} onChange={() => updateFilter('category', cat)} />
                    {cat}
                  </label>
                ))}
              </div>
            </div>

            {/* Pet Type */}
            <div className="filter-group">
              <h4>Pet Type</h4>
              <div className="filter-options">
                <label className={`filter-opt ${!filters.petType ? 'selected' : ''}`}>
                  <input type="radio" name="petType" value="" checked={!filters.petType} onChange={() => updateFilter('petType', '')} />
                  All Pets
                </label>
                {PET_TYPES.filter(p => p !== 'All').map(pt => (
                  <label key={pt} className={`filter-opt ${filters.petType === pt ? 'selected' : ''}`}>
                    <input type="radio" name="petType" value={pt} checked={filters.petType === pt} onChange={() => updateFilter('petType', pt)} />
                    {pt}
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="filter-group">
              <h4>Price Range</h4>
              <div className="price-range-inputs">
                <div className="form-group">
                  <label className="form-label">Min (₹)</label>
                  <input type="number" className="form-input" placeholder="0" value={filters.minPrice} onChange={e => updateFilter('minPrice', e.target.value)} />
                </div>
                <div className="price-separator">–</div>
                <div className="form-group">
                  <label className="form-label">Max (₹)</label>
                  <input type="number" className="form-input" placeholder="Any" value={filters.maxPrice} onChange={e => updateFilter('maxPrice', e.target.value)} />
                </div>
              </div>
              <div className="quick-prices">
                {[['0','500','Under ₹500'],['500','1000','₹500–₹1000'],['1000','2500','₹1000–₹2500'],['2500','','₹2500+']].map(([min,max,label]) => (
                  <button key={label} className="quick-price-btn" onClick={() => setFilters(p => ({...p, minPrice: min, maxPrice: max, page: 1}))}>{label}</button>
                ))}
              </div>
            </div>
          </aside>

          {/* Products */}
          <div className="products-content">
            {loading ? (
              <div className="loading-center">
                <div className="loading-spinner" />
                <p>Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="no-products">
                <div className="no-products-emoji">🐾</div>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search term</p>
                <button className="btn btn-primary" onClick={clearFilters}>Clear Filters</button>
              </div>
            ) : (
              <>
                <div className="products-grid">
                  {products.map(p => <ProductCard key={p._id} product={p} />)}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="pagination">
                    <button className="page-btn" disabled={filters.page === 1} onClick={() => updateFilter('page', filters.page - 1)}>← Prev</button>
                    {[...Array(pagination.pages)].map((_, i) => (
                      <button key={i+1} className={`page-btn ${filters.page === i+1 ? 'active' : ''}`} onClick={() => updateFilter('page', i+1)}>{i+1}</button>
                    ))}
                    <button className="page-btn" disabled={filters.page === pagination.pages} onClick={() => updateFilter('page', filters.page + 1)}>Next →</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
