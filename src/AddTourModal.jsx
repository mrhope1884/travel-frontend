import React, { useState } from 'react';
import axios from 'axios';

export default function AddTourModal({ isOpen, onClose, onTourAdded }) {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [maxGroupSize, setMaxGroupSize] = useState('20');
  const [imageCover, setImageCover] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'https://travel-4trh.onrender.com/api/tours/create',
        {
          title: title.trim(),
          price: Number(price),
          maxGroupSize: Number(maxGroupSize) || 20,
          imageCover: imageCover.trim() || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600',
          description: description.trim(),
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert('🎉 Đã tạo tour mới thành công!');
      // Reset form
      setTitle('');
      setPrice('');
      setMaxGroupSize('20');
      setImageCover('');
      setDescription('');
      
      onClose();
      if (onTourAdded) onTourAdded();
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi tạo tour, vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container admin-modal" onClick={(e) => e.stopPropagation()}>
        {/* Nút X nằm gọn gàng bên trong góc phải của khung trắng */}
        <button type="button" className="modal-close" onClick={onClose}>✕</button>

        <div className="admin-modal-header">
          <span className="badge-admin">👑 QUẢN TRỊ VIÊN</span>
          <h2 style={{ fontSize: '1.4rem', margin: '6px 0', color: '#0f172a' }}>Tạo Tour Du Lịch Mới</h2>
          <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>Điền thông tin chi tiết để mở bán chuyến đi trên hệ thống</p>
        </div>

        {error && <div className="modal-error">⚠️ {error}</div>}

        <form onSubmit={handleSubmit} className="modal-form" style={{ marginTop: '16px' }}>
          <div className="form-group">
            <label>🏷️ Tên tour / Chuyến đi *</label>
            <input
              type="text"
              placeholder="VD: Du Lịch Biển Quy Nhơn 3N2Đ"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label>💰 Giá vé (VNĐ) *</label>
              <input
                type="number"
                placeholder="VD: 2500000"
                required
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>👥 Số khách tối đa *</label>
              <input
                type="number"
                placeholder="VD: 20"
                required
                min="1"
                value={maxGroupSize}
                onChange={(e) => setMaxGroupSize(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>🖼️ Đường dẫn ảnh đại diện (URL)</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={imageCover}
              onChange={(e) => setImageCover(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>📝 Lịch trình & Giới thiệu tour *</label>
            <textarea
              rows="4"
              placeholder="Mô tả điểm nhấn hấp dẫn của tour, khách sạn, dịch vụ bao gồm..."
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                resize: 'vertical',
                boxSizing: 'border-box',
                fontFamily: 'inherit'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '18px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 18px',
                background: '#f1f5f9',
                color: '#475569',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="btn-submit-auth"
              disabled={loading}
              style={{ width: 'auto', padding: '10px 22px', margin: 0, background: '#0284c7' }}
            >
              {loading ? '⏳ Đang lưu...' : '🪄 Tạo Tour Mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
