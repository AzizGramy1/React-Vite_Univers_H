// src/pages/Products.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { getProducts, deleteProduct, updateProduct } from '../api/endpoints';
import toast from 'react-hot-toast';
import { Edit, Package, RefreshCw, Search, Trash2, Boxes, Save, X } from 'lucide-react';

const emptyProductForm = {
  name: '',
  cat: '',
  price: '',
  stock: '',
  threshold: '',
  active: 'true',
  badge: ''
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ cat: 'all', stock: 'all' });
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState(emptyProductForm);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.cat !== 'all') params.cat = filters.cat;
      if (filters.stock === 'low') params.lowStock = true;
      if (filters.stock === 'out') params.outOfStock = true;

      const response = await getProducts(params);
      setProducts(response.data.data || []);
    } catch (error) {
      toast.error('Erreur de chargement des produits');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce produit ?')) return;
    try {
      await deleteProduct(id);
      toast.success('Produit supprimé');
      fetchProducts();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      cat: product.cat || '',
      price: product.price ?? '',
      stock: product.stock ?? '',
      threshold: product.threshold ?? '',
      active: product.active ? 'true' : 'false',
      badge: product.badge || ''
    });
  };

  const closeEditModal = () => {
    setEditingProduct(null);
    setFormData(emptyProductForm);
  };

  const handleSaveEdit = async (event) => {
    event.preventDefault();

    if (!editingProduct) return;
    if (!formData.name.trim() || !formData.cat.trim()) {
      toast.error('Le nom et la catégorie sont requis');
      return;
    }

    try {
      await updateProduct(editingProduct.id, {
        ...editingProduct,
        ...formData,
        price: Number(formData.price || 0),
        stock: Number(formData.stock || 0),
        threshold: Number(formData.threshold || 0),
        active: formData.active === 'true'
      });
      toast.success('Produit mis à jour');
      closeEditModal();
      fetchProducts();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const filteredProducts = useMemo(() =>
    products.filter((product) =>
      product.name?.toLowerCase().includes(search.toLowerCase()) ||
      product.cat?.toLowerCase().includes(search.toLowerCase())
    ),
    [products, search]
  );

  const summary = useMemo(() => {
    const lowStock = products.filter((product) => product.stock < (product.threshold || 10)).length;
    const outStock = products.filter((product) => product.stock === 0).length;
    const active = products.filter((product) => product.active).length;

    return {
      total: products.length,
      lowStock,
      outStock,
      active
    };
  }, [products]);

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="page-head-title">Produits</div>
          <div className="page-head-sub">Catalogue, stock et statut des références</div>
        </div>
        <div className="page-head-actions">
          <button onClick={fetchProducts} className="btn-ghost">
            <RefreshCw size={18} /> Rafraîchir
          </button>
        </div>
      </div>

      <div className="order-summary-grid">
        <div className="kpi-card order-summary-card">
          <div className="kpi-top">
            <div>
              <div className="kpi-label">Produits</div>
              <div className="kpi-value">{summary.total}</div>
            </div>
            <div className="kpi-icon" style={{ background: 'rgba(14, 165, 201, 0.12)', color: 'var(--aqua)' }}>
              <Package size={20} />
            </div>
          </div>
          <div className="order-summary-meta">Références enregistrées</div>
        </div>

        <div className="kpi-card order-summary-card">
          <div className="kpi-top">
            <div>
              <div className="kpi-label">Stock faible</div>
              <div className="kpi-value">{summary.lowStock}</div>
            </div>
            <div className="kpi-icon" style={{ background: 'rgba(245, 158, 11, 0.12)', color: 'var(--amber)' }}>
              <Boxes size={20} />
            </div>
          </div>
          <div className="order-summary-meta">À réapprovisionner</div>
        </div>

        <div className="kpi-card order-summary-card">
          <div className="kpi-top">
            <div>
              <div className="kpi-label">Rupture</div>
              <div className="kpi-value">{summary.outStock}</div>
            </div>
            <div className="kpi-icon" style={{ background: 'rgba(239, 68, 68, 0.12)', color: 'var(--red)' }}>
              <Boxes size={20} />
            </div>
          </div>
          <div className="order-summary-meta">Produit indisponible</div>
        </div>
      </div>

      <div className="table-card">
        <div className="toolbar">
          <div className="search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Rechercher par nom ou catégorie..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="toolbar-actions">
            <select
              value={filters.cat}
              onChange={(e) => setFilters({ ...filters, cat: e.target.value })}
              className="f-input"
            >
              <option value="all">Toutes catégories</option>
              <option value="desinfection">Désinfection</option>
              <option value="nettoyage">Nettoyage</option>
              <option value="nuisibles">Anti-nuisibles</option>
              <option value="sanitaire">Sanitaire</option>
              <option value="pro">Usage Pro</option>
            </select>
            <select
              value={filters.stock}
              onChange={(e) => setFilters({ ...filters, stock: e.target.value })}
              className="f-input"
            >
              <option value="all">Tous stocks</option>
              <option value="low">Stock faible</option>
              <option value="out">Rupture</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Produit</th>
                <th>Catégorie</th>
                <th>Prix</th>
                <th>Stock</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="table-loader">Chargement...</td></tr>
              ) : filteredProducts.length === 0 ? (
                <tr><td colSpan="6" className="table-empty">Aucun produit trouvé</td></tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="cell-prod">
                        <div className="cell-emoji">📦</div>
                        <div>
                          <div className="order-client-name">{product.name}</div>
                          {product.badge && (
                            <div className="order-client-meta">{product.badge}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="order-client-name">{product.cat || '—'}</span>
                    </td>
                    <td>
                      <div className="order-amount">{product.price} DT</div>
                    </td>
                    <td>
                      <span className={`badge ${product.stock === 0 ? 'b-annulee' : product.stock < (product.threshold || 10) ? 'b-attente' : 'b-livree'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td>
                      <span className={product.active ? 'badge b-livree' : 'badge b-inactif'}>
                        {product.active ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td>
                      <div className="order-action-box">
                        <button
                          className="icon-btn"
                          aria-label={`Modifier ${product.name}`}
                          onClick={() => openEditModal(product)}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="icon-btn"
                          aria-label={`Supprimer ${product.name}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className={`modal-overlay ${editingProduct ? 'open' : ''}`}>
        <div className="modal">
          <div className="modal-hd">
            <div>
              <div className="modal-hd-title">Modifier le produit</div>
              <div className="modal-hd-sub">Mettez à jour les informations du produit</div>
            </div>
            <button type="button" className="modal-x" onClick={closeEditModal}>
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSaveEdit}>
            <div className="modal-body">
              <div className="f-row2">
                <div className="f-group">
                  <label className="f-label">Nom</label>
                  <input
                    className="f-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nom du produit"
                  />
                </div>
                <div className="f-group">
                  <label className="f-label">Catégorie</label>
                  <input
                    className="f-input"
                    value={formData.cat}
                    onChange={(e) => setFormData({ ...formData, cat: e.target.value })}
                    placeholder="Catégorie"
                  />
                </div>
              </div>

              <div className="f-row2">
                <div className="f-group">
                  <label className="f-label">Prix (DT)</label>
                  <input
                    className="f-input"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="f-group">
                  <label className="f-label">Stock</label>
                  <input
                    className="f-input"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="f-row2">
                <div className="f-group">
                  <label className="f-label">Seuil d’alerte</label>
                  <input
                    className="f-input"
                    type="number"
                    value={formData.threshold}
                    onChange={(e) => setFormData({ ...formData, threshold: e.target.value })}
                    placeholder="10"
                  />
                </div>
                <div className="f-group">
                  <label className="f-label">Statut</label>
                  <select
                    className="f-input"
                    value={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.value })}
                  >
                    <option value="true">Actif</option>
                    <option value="false">Inactif</option>
                  </select>
                </div>
              </div>

              <div className="f-group">
                <label className="f-label">Badge</label>
                <input
                  className="f-input"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  placeholder="Ex. Nouveau"
                />
              </div>
            </div>

            <div className="modal-ft">
              <button type="button" className="btn-ghost" onClick={closeEditModal}>
                <X size={16} /> Annuler
              </button>
              <button type="submit" className="btn-primary">
                <Save size={16} /> Enregistrer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Products;