import React from 'react';

export default function TourDetailModal({ isOpen, tour, onClose, onBookTour }) {
  // QUAN TRỌNG: Nếu không mở hoặc không có tour thì KHÔNG ĐƯỢC render ra HTML
  if (!isOpen || !tour) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container tour-detail-container" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close" onClick={onClose}>✕</button>

        <div className="tour-detail-img-wrap">
          <img 
            src={tour.imageCover || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600'} 
            alt={tour.title} 
          />
        </div>

        <h2 style={{ marginTop: '16px', fontSize: '1.4rem' }}>{tour.title}</h2>
        <p style={{ color: '#64748b', margin: '10px 0', lineHeight: '1.6' }}>{tour.description}</p>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '18px 0' }}>
          <div>
            <span style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#dc2626' }}>
              {tour.price?.toLocaleString('vi-VN')} đ
            </span>
            <span style={{ color: '#64748b', fontSize: '13px' }}> / khách</span>
          </div>
          <span style={{ background: '#ecfdf5', color: '#059669', padding: '4px 10px', borderRadius: '20px', fontWeight: 'bold', fontSize: '13px' }}>
            Còn {tour.maxGroupSize !== undefined ? tour.maxGroupSize : 20} chỗ
          </span>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button 
            type="button"
            className="btn-submit-auth" 
            style={{ background: '#059669' }}
            onClick={() => {
              onClose();
              if (onBookTour) onBookTour(tour);
            }}
          >
            ✈️ Đặt Tour Này Ngay
          </button>
          <button 
            type="button"
            className="btn-submit-auth" 
            style={{ background: '#e2e8f0', color: '#334155' }}
            onClick={onClose}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
