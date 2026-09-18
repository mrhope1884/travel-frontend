import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookingDetailModal from './BookingDetailModal';

function MyBookingsModal({ isOpen, onClose }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    setLoading(true);
    axios.get('http://localhost:3000/api/bookings/all', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setBookings(res.data?.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi lấy danh sách đơn:", err);
        setLoading(false);
      });
  }, [isOpen]);

  // Hàm xử lý Hủy Đơn & Tự Động Reload
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy đơn đặt tour này? Số ghế sẽ được hoàn lại cho người khác.")) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Phiên đăng nhập đã hết, vui lòng đăng nhập lại!");
        return;
      }

      const res = await axios.patch(`http://localhost:3000/api/bookings/cancel/${bookingId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert(res.data?.message || "🎉 Đã hủy đơn và hoàn lại ghế thành công!");

      // 👉 TỰ ĐỘNG TẢI LẠI TRANG NGAY LẬP TỨC
      window.location.reload();
    } catch (err) {
      console.error("Chi tiết lỗi khi hủy đơn:", err);
      const errMsg = err.response?.data?.message || err.message || "Lỗi kết nối Server!";
      alert(`❌ Lỗi: ${errMsg}`);
    }
  };

  if (!isOpen) return null;

  return (
    <>
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
            borderRadius: '16px',
            width: '100%',
            maxWidth: '660px',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)'
          }}
          onClick={e => e.stopPropagation()}
        >
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#f8fafc'
          }}>
            <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '700', color: '#0f172a' }}>
              📋 Đơn Đặt Tour Của Tôi ({bookings.length})
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

          <div style={{ padding: '16px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                ⏳ Đang tải dữ liệu...
              </div>
            ) : bookings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                Bạn chưa có đơn đặt tour nào!
              </div>
            ) : (
              bookings.map(item => {
                const isCancelled = item.status === 'cancelled';
                return (
                  <div 
                    key={item._id}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      gap: '14px',
                      padding: '12px',
                      background: isCancelled ? '#fef2f2' : '#ffffff',
                      border: isCancelled ? '1px solid #fecaca' : '1px solid #e2e8f0',
                      borderRadius: '12px',
                      alignItems: 'center',
                      opacity: isCancelled ? 0.8 : 1
                    }}
                  >
                    <img 
                      src={item.tour?.imageCover || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300'} 
                      alt={item.tour?.title || 'Tour'} 
                      style={{
                        width: '110px',
                        height: '85px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        flexShrink: 0,
                        filter: isCancelled ? 'grayscale(80%)' : 'none'
                      }}
                    />

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h4 style={{
                          margin: '0 0 6px 0',
                          fontSize: '15px',
                          fontWeight: '700',
                          color: '#0f172a',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: '280px'
                        }}>
                          {item.tour?.title || 'Tour du lịch'}
                        </h4>

                        <span style={{
                          fontSize: '11px',
                          fontWeight: '700',
                          padding: '3px 8px',
                          borderRadius: '12px',
                          background: isCancelled ? '#fee2e2' : '#dcfce7',
                          color: isCancelled ? '#b91c1c' : '#15803d'
                        }}>
                          {isCancelled ? '❌ ĐÃ HỦY' : '✓ ĐÃ XÁC NHẬN'}
                        </span>
                      </div>
                      
                      <div style={{ fontSize: '13px', color: '#64748b', display: 'flex', gap: '12px', marginBottom: '8px' }}>
                        <span>👥 <strong>{item.numBookedSeats} vé</strong></span>
                        <span>📅 {new Date(item.createdAt).toLocaleDateString('vi-VN')}</span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '15px', fontWeight: '800', color: isCancelled ? '#94a3b8' : '#dc2626' }}>
                          {(item.price || 0).toLocaleString('vi-VN')} đ
                        </span>

                        <div style={{ display: 'flex', gap: '8px' }}>
                          {!isCancelled && (
                            <button 
                              type="button"
                              onClick={() => handleCancelBooking(item._id)}
                              style={{
                                background: '#fee2e2',
                                color: '#b91c1c',
                                border: '1px solid #fca5a5',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                fontWeight: '600',
                                fontSize: '12px',
                                cursor: 'pointer'
                              }}
                            >
                              ❌ Hủy Tour
                            </button>
                          )}

                          <button 
                            type="button"
                            onClick={() => setSelectedBooking(item)}
                            style={{
                              background: isCancelled ? '#94a3b8' : '#0284c7',
                              color: '#ffffff',
                              border: 'none',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              fontWeight: '600',
                              fontSize: '12px',
                              cursor: 'pointer'
                            }}
                          >
                            🎫 Xem Vé
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <BookingDetailModal 
        isOpen={Boolean(selectedBooking)}
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
      />
    </>
  );
}

export default MyBookingsModal;
