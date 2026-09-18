import React, { useState } from 'react';
import axios from 'axios';

function BookingModal({ isOpen, onClose, tour }) {
  const [numSeats, setNumSeats] = useState(1);
  const [loading, setLoading] = useState(false);

  if (!isOpen || !tour) return null;

  let currentUser = null;
  try {
    const saved = localStorage.getItem('user');
    if (saved) currentUser = JSON.parse(saved);
  } catch (e) {}

  const availableSeats = tour.maxGroupSize !== undefined ? tour.maxGroupSize : 20;
  const totalPrice = (tour.price || 0) * numSeats;

  const handleBooking = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert("⚠️ Bạn cần đăng nhập để đặt tour!");
      return;
    }

    if (numSeats < 1) {
      alert("Vui lòng chọn ít nhất 1 vé!");
      return;
    }

    if (availableSeats > 0 && numSeats > availableSeats) {
      alert(`Tour này chỉ còn lại ${availableSeats} chỗ trống!`);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        'https://travel-4trh.onrender.com/api/bookings/create',
        {
          tourId: tour._id,
          numBookedSeats: Number(numSeats)
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert(res.data?.message || "🎉 Đặt tour thành công!");
      // 👉 TỰ ĐỘNG TẢI LẠI TRANG LÀM MỚI SỐ GHẾ TRỐNG
      window.location.reload();
    } catch (err) {
      console.error("Lỗi đặt tour:", err);
      const msg = err.response?.data?.message || err.message || "Lỗi khi đặt tour!";
      alert(`❌ Lỗi: ${msg}`);
      setLoading(false);
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '480px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)'
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#f8fafc'
        }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
            🎫 Đặt Vé Tour Du Lịch
          </h3>
          <button 
            onClick={onClose}
            style={{
              background: '#e2e8f0',
              border: 'none',
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontWeight: '700',
              color: '#475569'
            }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleBooking} style={{ padding: '24px' }}>
          <div style={{
            display: 'flex',
            gap: '14px',
            background: '#f8fafc',
            padding: '12px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            marginBottom: '20px',
            alignItems: 'center'
          }}>
            <img 
              src={tour.imageCover || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300'} 
              alt={tour.title} 
              style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: '700', fontSize: '14px', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {tour.title}
              </div>
              <div style={{ fontSize: '13px', color: '#2563eb', fontWeight: '700', marginTop: '2px' }}>
                {(tour.price || 0).toLocaleString('vi-VN')} đ / vé
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                Còn lại: <strong>{availableSeats} chỗ</strong>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>
              Người đặt vé
            </label>
            <input 
              type="text" 
              readOnly 
              value={currentUser ? `${currentUser.name} (${currentUser.email})` : 'Chưa đăng nhập'}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#f1f5f9',
                color: '#475569',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>
              Số lượng vé
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button 
                type="button"
                onClick={() => setNumSeats(Math.max(1, numSeats - 1))}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  background: '#f8fafc',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                -
              </button>
              <span style={{ fontSize: '18px', fontWeight: '800', minWidth: '40px', textAlign: 'center' }}>
                {numSeats}
              </span>
              <button 
                type="button"
                onClick={() => setNumSeats(numSeats + 1)}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  background: '#f8fafc',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                +
              </button>
              <span style={{ fontSize: '13px', color: '#64748b', marginLeft: 'auto' }}>
                vé người lớn
              </span>
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '14px 18px',
            background: '#fef2f2',
            borderRadius: '12px',
            border: '1px solid #fecaca',
            marginBottom: '20px'
          }}>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#991b1b' }}>Tổng tiền:</span>
            <span style={{ fontSize: '20px', fontWeight: '800', color: '#dc2626' }}>
              {totalPrice.toLocaleString('vi-VN')} đ
            </span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                background: '#f8fafc',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Hủy bỏ
            </button>
            <button 
              type="submit"
              disabled={loading}
              style={{
                flex: 2,
                padding: '12px',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                color: '#fff',
                fontWeight: '700',
                fontSize: '15px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Đang xử lý...' : 'Xác Nhận Đặt Tour'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookingModal;
