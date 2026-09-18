import { useState, useEffect } from 'react';
import axios from 'axios';

function EditTourModal({ isOpen, onClose, tour, onTourUpdated }) {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [maxGroupSize, setMaxGroupSize] = useState('');
  const [imageCover, setImageCover] = useState('');
  const [description, setDescription] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Tự động điền dữ liệu hiện tại của tour vào các ô nhập khi mở popup
  useEffect(() => {
    if (tour) {
      setTitle(tour.title || '');
      setPrice(tour.price || '');
      setMaxGroupSize(tour.maxGroupSize || '');
      setImageCover(tour.imageCover || '');
      setDescription(tour.description || '');
      setErrorMsg('');
      setSuccessMsg('');
    }
  }, [tour]);

  if (!isOpen || !tour) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setErrorMsg('Vui lòng đăng nhập tài khoản Admin!');
        setLoading(false);
        return;
      }

      // 👉 GỌI API PUT: /api/tours/update/:id
      await axios.put(
        `http://localhost:3000/api/tours/update/${tour._id}`,
        {
          title,
          price: Number(price),
          maxGroupSize: Number(maxGroupSize),
          imageCover: imageCover.trim() || undefined,
          description
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setSuccessMsg('🎉 Cập nhật thông tin tour thành công!');

      setTimeout(() => {
        onTourUpdated(); // Tải lại danh sách tour
        onClose();       // Đóng popup
      }, 1000);

    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Không thể cập nhật tour!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box admin-modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="admin-header">
          <span className="admin-pill">✏️ CẬP NHẬT DỮ LIỆU</span>
          <h2 className="modal-title">Chỉnh Sửa Tour Du Lịch</h2>
          <p className="modal-subtitle">Thay đổi giá vé, tên chuyến đi, số lượng khách hoặc lịch trình</p>
        </div>

        {errorMsg && <div className="auth-alert error">{errorMsg}</div>}
        {successMsg && <div className="auth-alert success">{successMsg}</div>}

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>🏷️ Tên tour / Chuyến đi *</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required 
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>💰 Giá vé (VNĐ) *</label>
              <input 
                type="number" 
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required 
              />
            </div>

            <div className="form-group">
              <label>👥 Số khách tối đa *</label>
              <input 
                type="number" 
                value={maxGroupSize}
                onChange={(e) => setMaxGroupSize(e.target.value)}
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label>🖼️ Đường dẫn ảnh đại diện (URL)</label>
            <input 
              type="url" 
              value={imageCover}
              onChange={(e) => setImageCover(e.target.value)}
            />
            {imageCover.trim() && (
              <div className="image-preview-wrapper">
                <img 
                  src={imageCover} 
                  alt="Xem trước ảnh tour" 
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  onLoad={(e) => { e.currentTarget.style.display = 'block'; }}
                />
              </div>
            )}
          </div>

          <div className="form-group">
            <label>📝 Lịch trình & Giới thiệu tour *</label>
            <textarea 
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="admin-textarea"
            ></textarea>
          </div>

          <div className="admin-form-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Hủy bỏ
            </button>
            <button type="submit" className="btn-submit-tour" disabled={loading}>
              {loading ? '⏳ Đang lưu...' : '💾 Lưu Thay Đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditTourModal;
