import { useState } from 'react'
import './ProductFormPage.css'

const MODES = ['frontend', 'backend', 'full stack']
const PLATFORMS = ['Android', 'iOS', 'web']
const STATUSES = ['Active Development', 'Completed', 'Maintenance', 'Archived']

function selectedFiles(event) {
  return Array.from(event.target.files || [])
}

function ProductFormPage({ product, onCancel, onSave }) {
  const isEditing = Boolean(product)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [files, setFiles] = useState({
    imagePrimary: [],
    imagePhone: [],
    readMe: [],
    gallery: [],
  })
  const [platforms, setPlatforms] = useState(product?.developerInfo?.targetPlatforms || [])

  const handleFileChange = (field, event) => {
    setFiles((current) => ({ ...current, [field]: selectedFiles(event) }))
  }

  const handlePlatformChange = (platform) => {
    setPlatforms((current) => current.includes(platform)
      ? current.filter((item) => item !== platform)
      : [...current, platform])
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaveError('')
    setSaving(true)
    const formData = new FormData(event.currentTarget)

    const data = {
      name: String(formData.get('name') || '').trim(),
      type: String(formData.get('type') || '').trim(),
      description: String(formData.get('description') || '').trim(),
      url: String(formData.get('url') || '').trim(),
      developerInfo: {
        description: String(formData.get('developerDescription') || '').trim(),
        mode: String(formData.get('mode') || ''),
        targetPlatforms: platforms,
        languages: String(formData.get('languages') || '').trim(),
        framework: String(formData.get('framework') || '').trim(),
        styling: String(formData.get('styling') || '').trim(),
        animation: String(formData.get('animation') || '').trim(),
        icons: String(formData.get('icons') || '').trim(),
        hosting: String(formData.get('hosting') || '').trim(),
        status: String(formData.get('status') || ''),
        initialRelease: String(formData.get('initialRelease') || '').trim(),
      },
    }

    try {
      await onSave(data, files)
    } catch (error) {
      setSaveError(error.message || 'Unable to save this product.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">CATALOGUE</span>
          <h1>{isEditing ? 'Edit product' : 'Add product'}</h1>
          <p>{isEditing ? 'Update the details for this product.' : 'Enter the details for your new product.'}</p>
        </div>
      </div>

      <form className="product-form-card" onSubmit={handleSubmit}>
        <div className="form-section-heading"><span className="form-section-heading__icon">01</span><div><h2>Product details</h2><p>Public information shown with this project.</p></div></div>
        <div className="product-form-grid">
          <label className="field">Product name<input defaultValue={product?.name || ''} name="name" placeholder="e.g. Pick-A-Card" required /></label>
          <label className="field">Type<input defaultValue={product?.type || ''} name="type" placeholder="e.g. game" required /></label>
          <label className="field field--wide">Description<textarea defaultValue={product?.description || ''} name="description" placeholder="Describe this product..." rows="3" /></label>
          <label className="field field--wide">Project URL<input defaultValue={product?.url || ''} name="url" placeholder="https://example.com" type="url" /></label>
        </div>

        <div className="form-section-heading"><span className="form-section-heading__icon">02</span><div><h2>Product files</h2><p>Choose a replacement file to update it; otherwise the existing file is retained.</p></div></div>
        <div className="product-form-grid">
          <label className="field">Primary image
            <input accept="image/*" name="imagePrimary" onChange={(event) => handleFileChange('imagePrimary', event)} type="file" />
            {product?.imagePrimary && <small className="current-file">Current: {product.imagePrimary.split('/').pop()}</small>}
          </label>
          <label className="field">Phone image
            <input accept="image/*" name="imagePhone" onChange={(event) => handleFileChange('imagePhone', event)} type="file" />
            {product?.imagePhone && <small className="current-file">Current: {product.imagePhone.split('/').pop()}</small>}
          </label>
          <label className="field">ReadMe file
            <input accept=".md,.txt,.pdf,text/markdown,text/plain,application/pdf" name="readMe" onChange={(event) => handleFileChange('readMe', event)} type="file" />
            {product?.readMe && <small className="current-file">Current: {product.readMe.split('/').pop()}</small>}
          </label>
          <label className="field">Gallery images
            <input accept="image/*" multiple name="gallery" onChange={(event) => handleFileChange('gallery', event)} type="file" />
            {product?.gallery?.length > 0 && <small className="current-file">{product.gallery.length} current image(s) — selecting new files replaces the gallery.</small>}
          </label>
        </div>

        <div className="form-section-heading"><span className="form-section-heading__icon">03</span><div><h2>Developer dossier</h2><p>Technical details about the product and its implementation.</p></div></div>
        <div className="product-form-grid">
          <label className="field field--wide">Developer description<textarea defaultValue={product?.developerInfo?.description || ''} name="developerDescription" placeholder="A short overview of this project and its implementation..." rows="3" /></label>

          <fieldset className="choice-field">
            <legend>Development mode</legend>
            <div className="choice-options">
              {MODES.map((mode) => <label className="choice-option" key={mode}><input defaultChecked={product?.developerInfo?.mode === mode} name="mode" type="radio" value={mode} /><span>{mode.replace(/\b\w/g, (letter) => letter.toUpperCase())}</span></label>)}
            </div>
          </fieldset>

          <fieldset className="choice-field">
            <legend>Target platforms</legend>
            <div className="choice-options">
              {PLATFORMS.map((platform) => <label className="choice-option" key={platform}><input checked={platforms.includes(platform)} onChange={() => handlePlatformChange(platform)} type="checkbox" /><span>{platform === 'web' ? 'Web' : platform}</span></label>)}
            </div>
          </fieldset>

          <label className="field">Language(s)<input defaultValue={product?.developerInfo?.languages || ''} name="languages" placeholder="e.g. JavaScript" /></label>
          <label className="field">Framework<input defaultValue={product?.developerInfo?.framework || ''} name="framework" placeholder="e.g. React" /></label>
          <label className="field">Styling<input defaultValue={product?.developerInfo?.styling || ''} name="styling" placeholder="e.g. Tailwind CSS" /></label>
          <label className="field">Animation<input defaultValue={product?.developerInfo?.animation || ''} name="animation" placeholder="e.g. Motion" /></label>
          <label className="field">Icons<input defaultValue={product?.developerInfo?.icons || ''} name="icons" placeholder="e.g. React Icons" /></label>
          <label className="field">Hosting<input defaultValue={product?.developerInfo?.hosting || ''} name="hosting" placeholder="e.g. Vercel" /></label>
          <label className="field">Initial release<input defaultValue={product?.developerInfo?.initialRelease || ''} name="initialRelease" placeholder="e.g. September 29, 2025" /></label>

          <fieldset className="choice-field">
            <legend>Status</legend>
            <div className="choice-options">
              {STATUSES.map((status) => <label className="choice-option" key={status}><input defaultChecked={product?.developerInfo?.status === status || (!product?.developerInfo?.status && status === 'Active Development')} name="status" type="radio" value={status} /><span>{status}</span></label>)}
            </div>
          </fieldset>
        </div>

        {saveError && <div className="form-error" role="alert">{saveError}</div>}
        <div className="form-actions">
          <button className="button button--outline" disabled={saving} onClick={onCancel} type="button">Cancel</button>
          <button className="button button--primary" disabled={saving} type="submit">{saving ? 'Saving...' : isEditing ? 'Save changes' : 'Save product'}</button>
        </div>
      </form>
    </section>
  )
}

export default ProductFormPage
