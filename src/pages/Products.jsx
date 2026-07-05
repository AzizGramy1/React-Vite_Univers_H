// src/pages/Products.jsx
import React, { useState, useEffect } from 'react';
import { getProducts, deleteProduct } from '../api/endpoints';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ cat: 'all', stock: 'all' });

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

  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="page-head-title">Produits</div>
          <div className="page-head-sub">Catalogue, stock et statut des références</div>
        </div>
        <div className="page-head-actions">
          <button 
            onClick={() => toast.info('Formulaire d\'ajout de produit')}
            className="btn-ghost"
          >
            <Plus size={18} /> Ajouter
          </button>
        </div>
      </div>

      <div className="table-card">
        <div className="toolbar">
          <div className="search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
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

        <div className="overflow-x-auto">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Catégorie</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan="6" className="table-loader">Chargement...</td></tr>
              ) : filteredProducts.length === 0 ? (
                <tr><td colSpan="6" className="table-empty">Aucun produit</td></tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{product.emoji || '📦'}</span>
                        <div>
                          <p className="font-medium text-gray-800">{product.name}</p>
                          {product.badge && (
                            <span className="text-xs px-2 py-1 bg-cyan-100 text-cyan-700 rounded-full">
                              {product.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{product.cat}</td>
                    <td className="px-6 py-4 font-medium">{product.price} DT</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        product.stock === 0 ? 'bg-red-100 text-red-700' :
                        product.stock < (product.threshold || 10) ? 'bg-orange-100 text-orange-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        product.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {product.active ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
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
      </div>
    </div>
  );
};

export default Products;