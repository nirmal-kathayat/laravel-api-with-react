import { useRef, useState } from 'react'
import { C, F, primaryBtn, subtleBtn, XIcon, ImageIcon } from '../shared'
import { createProduct, updateProduct } from '../../../lib/products'

export default function ProductFormModal({ product, onClose, onSaved }) {
  const isEdit = Boolean(product)
  const [form, setForm] = useState({
    name:        product?.name ?? '',
    description: product?.description ?? '',
    price:       product?.price ?? '',
    stock:       product?.stock ?? '',
    sku:         product?.sku ?? '',
    is_active:   product?.is_active ?? true,
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(product?.image ?? null)
  const fileInputRef = useRef(null)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))
  const labelStyle = { display: 'flex', flexDirection: 'column', gap: 6 }
  const spanStyle  = { fontSize: 13, fontWeight: 600, color: C.inkSoft }
  const inputStyle = { width: '100%', height: 42, border: `1px solid ${C.line}`, borderRadius: 11, padding: '0 13px', fontFamily: F.body, fontSize: 13.5, color: C.ink, outline: 'none', boxSizing: 'border-box' }
  const fieldError = { fontSize: 12, fontWeight: 600, color: '#DC2626' }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSubmit = async () => {
    setFormError('')
    setErrors({})

    if (!form.name.trim() || form.price === '') {
      setFormError('Name and price are required.')
      return
    }

    const payload = {
      name:        form.name.trim(),
      description: form.description.trim() || null,
      price:       Number(form.price),
      stock:       form.stock === '' ? 0 : Number(form.stock),
      sku:         form.sku.trim() || null,
      is_active:   Boolean(form.is_active),
    }
    if (imageFile) payload.image = imageFile

    setSubmitting(true)
    try {
      if (isEdit) {
        await updateProduct(product.id, payload)
      } else {
        await createProduct(payload)
      }
      onSaved()
    } catch (err) {
      if (err.status === 422 && err.errors) {
        setErrors(err.errors)
      } else {
        setFormError(err.message || 'Something went wrong. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,.45)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, animation: 'overlayIn .2s ease' }}>
      <div style={{ background: C.white, borderRadius: 24, width: '100%', maxWidth: 540, maxHeight: '90vh', overflowY: 'auto', animation: 'modalIn .25s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 28px 0' }}>
          <h2 style={{ fontFamily: F.display, fontWeight: 800, fontSize: 21, color: C.ink, margin: 0 }}>{isEdit ? 'Edit Product' : 'Add Product'}</h2>
          <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: 10, border: 'none', background: C.cloud, color: C.slate, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><XIcon /></button>
        </div>
        <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {formError && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#DC2626' }}>
              {formError}
            </div>
          )}

          <div
            onClick={() => fileInputRef.current?.click()}
            style={{ width: '100%', height: 140, background: '#F8FAFC', border: `2px dashed ${C.line}`, borderRadius: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', color: C.faint, overflow: 'hidden' }}
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Product preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <>
                <ImageIcon size={28} />
                <span style={{ fontSize: 13, fontWeight: 600 }}>Click to upload product image</span>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </div>
          {errors.image && <span style={fieldError}>{errors.image[0]}</span>}

          <label style={labelStyle}><span style={spanStyle}>Product name</span>
            <input value={form.name} onChange={set('name')} placeholder="e.g. Aurora Linen Throw" style={inputStyle} />
            {errors.name && <span style={fieldError}>{errors.name[0]}</span>}
          </label>
          <label style={labelStyle}><span style={spanStyle}>Description</span>
            <textarea value={form.description} onChange={set('description')} placeholder="Short product description…" rows={3} style={{ ...inputStyle, height: 'auto', padding: '10px 13px', resize: 'vertical' }} />
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <label style={labelStyle}><span style={spanStyle}>Price ($)</span>
              <input value={form.price} onChange={set('price')} placeholder="0.00" type="number" min="0" step="0.01" style={inputStyle} />
              {errors.price && <span style={fieldError}>{errors.price[0]}</span>}
            </label>
            <label style={labelStyle}><span style={spanStyle}>Stock</span>
              <input value={form.stock} onChange={set('stock')} placeholder="0" type="number" min="0" style={inputStyle} />
            </label>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <label style={labelStyle}><span style={spanStyle}>SKU</span>
              <input value={form.sku} onChange={set('sku')} placeholder="LUM-XXX-000" style={inputStyle} />
              {errors.sku && <span style={fieldError}>{errors.sku[0]}</span>}
            </label>
            <label style={labelStyle}><span style={spanStyle}>Status</span>
              <select value={form.is_active ? 'active' : 'inactive'} onChange={e => setForm(f => ({ ...f, is_active: e.target.value === 'active' }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </label>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, padding: '0 28px 28px', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={subtleBtn}>Cancel</button>
          <button onClick={handleSubmit} disabled={submitting} style={{ ...primaryBtn, opacity: submitting ? 0.7 : 1 }}>
            {submitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Product'}
          </button>
        </div>
      </div>
    </div>
  )
}
