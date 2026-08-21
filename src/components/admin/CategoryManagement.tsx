import React, { useState } from 'react';
import { Plus, Edit, Trash2, CheckCircle2, XCircle, X } from 'lucide-react';
import type { CategoryItem, ProductCategory } from '../../types';

export const DEFAULT_CATEGORIES: CategoryItem[] = [
  {
    id: 'cat-kasavu-sarees',
    name: 'Kasavu Sarees',
    parentCategory: 'women',
    slug: 'kasavu-sarees',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
    description: 'Authentic GI Tagged Kuthampully Kasavu sarees with pure electroplated 24k gold zari borders.',
    seoTitle: 'Buy Authentic Kuthampully Kasavu Sarees Online | Kavish',
    seoDescription: 'Handcrafted GI certified Kerala Kasavu sarees directly from master weavers in Kuthampully.',
    status: 'Active',
    productCount: 18
  },
  {
    id: 'cat-set-mundu',
    name: 'Set Mundu & Kerala Drapes',
    parentCategory: 'women',
    slug: 'set-mundu',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
    description: 'Traditional two-piece Kerala Mundum Neriyathum drapes woven with pure organic cotton.',
    seoTitle: 'Pure Cotton Set Mundu & Mundum Neriyathum | Kavish Kerala',
    seoDescription: 'Shop handcrafted traditional Kerala Set Mundu for Onam, Vishu, and temple rituals.',
    status: 'Active',
    productCount: 12
  },
  {
    id: 'cat-double-mundu',
    name: 'Double Kasavu Mundu',
    parentCategory: 'men',
    slug: 'double-mundu',
    image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=600&q=80',
    description: 'Classic 4-meter ceremonial double dhotis crafted on heritage pit looms in Thrissur.',
    seoTitle: 'Men’s Double Kasavu Mundu & Traditional Dhoti | Kavish',
    seoDescription: 'Premium double kasavu mundu for grooms, festivals, and ceremonial occasions.',
    status: 'Active',
    productCount: 14
  },
  {
    id: 'cat-linen-shirts',
    name: 'Pure Flax Linen Shirts',
    parentCategory: 'men',
    slug: 'linen-shirts',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80',
    description: '100% pure organic European flax linen shirts tailored for understated modern luxury.',
    seoTitle: 'Luxury Organic Linen Shirts for Men | Kavish Kerala Atelier',
    seoDescription: 'Breathable, tailored European flax linen shirts pairing perfectly with Kasavu dhotis.',
    status: 'Active',
    productCount: 16
  },
  {
    id: 'cat-kids-kasavu',
    name: 'Pattu Pavada & Kasavu Frocks',
    parentCategory: 'kids',
    slug: 'kids-kasavu',
    image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=600&q=80',
    description: 'Delicate heritage festive wear and pure cotton kasavu dresses for infants and children.',
    seoTitle: 'Kids Kasavu Dresses & Traditional Kerala Wear | Kavish',
    seoDescription: 'Handcrafted, soft cotton traditional pattu pavada and kasavu shirts for kids.',
    status: 'Active',
    productCount: 9
  },
  {
    id: 'cat-bridal-tissue',
    name: 'Bridal Tissue Kasavu Editions',
    parentCategory: 'women',
    slug: 'bridal-tissue',
    image: 'https://images.unsplash.com/photo-1583391733975-00c50d31062f?auto=format&fit=crop&w=600&q=80',
    description: 'Regal full-tissue wedding sarees featuring antique motifs inspired by Travancore royalty.',
    seoTitle: 'Royal Kerala Bridal Tissue Kasavu Sarees | Kavish Luxury',
    seoDescription: 'Exclusive heirloom bridal Kasavu collection crafted by fifth-generation master weavers.',
    status: 'Active',
    productCount: 8
  }
];

export const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<CategoryItem[]>(DEFAULT_CATEGORIES);

  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [form, setForm] = useState<Partial<CategoryItem>>({
    name: '',
    parentCategory: 'women',
    slug: '',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
    description: '',
    seoTitle: '',
    seoDescription: '',
    status: 'Active'
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      setCategories(categories.map(c => c.id === editingCategory.id ? { ...editingCategory, ...form } as CategoryItem : c));
    } else {
      const newCat: CategoryItem = {
        id: `cat-${Date.now()}`,
        name: form.name || 'New Category',
        parentCategory: form.parentCategory || 'women',
        slug: form.slug || form.name?.toLowerCase().replace(/\s+/g, '-') || `cat-${Date.now()}`,
        image: form.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
        description: form.description || '',
        seoTitle: form.seoTitle || form.name || '',
        seoDescription: form.seoDescription || '',
        status: form.status || 'Active',
        productCount: 0
      };
      setCategories([...categories, newCat]);
    }
    setShowModal(false);
    setEditingCategory(null);
  };

  const handleToggleStatus = (id: string) => {
    setCategories(categories.map(c => c.id === id ? { ...c, status: c.status === 'Active' ? 'Disabled' : 'Active' } : c));
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DDC7] pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37] block">
            Taxonomy &amp; Navigation
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#12372A] mt-0.5">
            Category Management ({categories.length})
          </h1>
        </div>

        <button
          onClick={() => {
            setEditingCategory(null);
            setForm({
              name: '', parentCategory: 'women', slug: '', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
              description: '', seoTitle: '', seoDescription: '', status: 'Active'
            });
            setShowModal(true);
          }}
          className="bg-[#12372A] text-[#FAF8F1] px-5 py-3 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#D4AF37] hover:text-[#12372A] transition-all flex items-center gap-2 border border-[#D4AF37] shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#D4AF37]" />
          <span>Create Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(cat => (
          <div key={cat.id} className="bg-white border border-[#E8DDC7] hover:border-[#D4AF37] rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="h-44 relative overflow-hidden">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <span className="absolute top-3 right-3 bg-[#12372A] text-[#D4AF37] text-[10px] uppercase font-bold px-2.5 py-1 rounded-full border border-[#D4AF37]">
                  {cat.parentCategory}
                </span>
                <h3 className="absolute bottom-3 left-4 font-serif text-xl font-bold text-[#FAF8F1]">
                  {cat.name}
                </h3>
              </div>

              <div className="p-4 space-y-2 text-xs">
                <p className="text-[#6B5846] font-light line-clamp-2 leading-relaxed">{cat.description}</p>
                <div className="pt-2 border-t border-[#FAF8F1] flex justify-between items-center text-[11px] font-mono text-[#12372A]">
                  <span className="bg-[#FAF8F1] px-2 py-0.5 rounded border border-[#E8DDC7]">/{cat.slug}</span>
                  <span className="font-bold text-[#12372A]">{cat.productCount} Garments</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#FAF8F1] border-t border-[#E8DDC7] flex items-center justify-between">
              <button
                onClick={() => handleToggleStatus(cat.id)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 border ${
                  cat.status === 'Active' ? 'bg-green-100 text-green-800 border-green-300' : 'bg-gray-200 text-gray-700'
                }`}
              >
                {cat.status === 'Active' ? <CheckCircle2 className="w-3 h-3 text-green-600" /> : <XCircle className="w-3 h-3" />}
                <span>{cat.status}</span>
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingCategory(cat);
                    setForm(cat);
                    setShowModal(true);
                  }}
                  className="p-1.5 text-[#12372A] hover:bg-white rounded-lg transition-colors"
                  title="Edit Category"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="p-1.5 text-red-600 hover:bg-white rounded-lg transition-colors"
                  title="Delete Category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Category Editor Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[calc(100vh-2rem)] sm:max-h-[85vh]">
            
            {/* Modal Fixed Header */}
            <div className="p-5 bg-[#12372A] text-[#FAF8F1] flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#FAF8F1]">
                  {editingCategory ? 'Edit Category' : 'Create New Category'}
                </h3>
                <p className="text-xs text-[#E8DDC7]/80">Configure taxonomy, department &amp; SEO metadata</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-1 text-[#E8DDC7] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Form Body */}
            <form id="category-modal-form" onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              <div>
                <label className="block font-semibold text-[#6B5846] mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Kasavu Sarees"
                  className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1] font-bold text-[#12372A]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#6B5846] mb-1">Parent Department</label>
                <select
                  value={form.parentCategory}
                  onChange={(e) => setForm({ ...form, parentCategory: e.target.value as ProductCategory })}
                  className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1] font-bold text-[#12372A]"
                >
                  <option value="women">Women</option>
                  <option value="men">Men</option>
                  <option value="kids">Kids</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#6B5846] mb-1">Category Banner Image URL</label>
                <input
                  type="text"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#6B5846] mb-1">Category Description</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-[#E8DDC7] p-2.5 rounded-xl bg-[#FAF8F1]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#E8DDC7]">
                <div>
                  <label className="block font-semibold text-[#6B5846] mb-1">SEO Title</label>
                  <input
                    type="text"
                    value={form.seoTitle}
                    onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
                    className="w-full border border-[#E8DDC7] p-2 rounded-xl bg-[#FAF8F1]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#6B5846] mb-1">SEO Description</label>
                  <input
                    type="text"
                    value={form.seoDescription}
                    onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}
                    className="w-full border border-[#E8DDC7] p-2 rounded-xl bg-[#FAF8F1]"
                  />
                </div>
              </div>
            </form>

            {/* Modal Fixed Footer */}
            <div className="p-4 bg-[#FAF8F1] border-t border-[#E8DDC7] flex gap-3 shrink-0">
              <button
                type="submit"
                form="category-modal-form"
                className="flex-1 bg-[#12372A] text-[#FAF8F1] py-3 uppercase font-bold text-xs rounded-xl border border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#12372A] transition-all"
              >
                Save Category
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-5 py-3 border border-[#E8DDC7] font-bold text-xs uppercase rounded-xl hover:bg-white transition-all"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
