import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookingDetailModal from './BookingDetailModal';

function AdminBookingsModal({ isOpen, onClose }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, confirmed, cancelled
  const [selectedBooking, setSelectedBooking] = useState(null);

  const fetchBookings = () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setLoading(true);
    axios.get('https://travel-4trh.onrender.com/api/bookings/all', {
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
  };

  useEffect(() => {
    if (isOpen) fetchBookings();
  }, [isOpen]);

  // Admin bấm hủy đơn của khách
  const handleAdminCancel = async (bookingId) => {
    if (!window.confirm("Admin xác nhận muốn hủy đơn này? Ghế sẽ được hoàn lại tự động.")) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await axios.patch(`https://travel-4trh.onrender.com/api/bookings/cancel/${bookingId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(res.data?.message || "🎉 Đã hủy đơn thành công!");
      fetchBookings(); // Tải lại dữ liệu mới nhất
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Lỗi khi hủy đơn!");
    }
  };

  if (!isOpen) return null;

  // Lọc chỉ lấy các đơn hợp lệ (chưa hủy) để tính Doanh thu thực tế
  const activeBookings = bookings.filter(b => b.status !== 'cancelled');
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled');

  const totalRevenue = activeBookings.reduce((sum, b) => sum + (b.price || 0), 0);
  const totalSeats = activeBookings.reduce((sum, b) => sum + (b.numBookedSeats || 0), 0);

  // Lọc danh sách theo từ khóa và trạng thái
  const filteredBookings = bookings.filter(b => {
    const customer = b.user?.name?.toLowerCase() || '';
    const email = b.user?.email?.toLowerCase() || '';
    const tourTitle = b.tour?.title?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();
    const matchSearch = customer.includes(search) || email.includes(search) || tourTitle.includes(search);

    if (statusFilter === 'confirmed') return matchSearch && b.status !== 'cancelled';
    if (statusFilter === 'cancelled') return matchSearch && b.status === 'cancelled';
    return matchSearch;
  });

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
          zIndex: 9990,
          padding: '16px'
        }}
        onClick={onClose}
      >
        <div 
          style={{
            background: '#ffffff',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '1100px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)'
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header Admin */}
          <div style={{
            padding: '20px 28px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#f8fafc'
          }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>
                🛡️ Quản Lý Đơn Đặt Tour (Hệ Thống Admin)
              </h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>
                Theo dõi tình trạng đơn đặt, quản lý hủy vé và đối soát doanh thu thực tế
              </p>
            </div>
            <button 
              onClick={onClose}
              style={{
                background: '#e2e8f0',
                border: 'none',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                cursor: 'pointer',
                fontWeight: '700',
                color: '#475569'
              }}
            >
              ✕
            </button>
          </div>

          {/* 4 Thẻ Thống Kê Chuẩn Xác */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '14px',
            padding: '18px 28px 10px 28px'
          }}>
            <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
              <div style={{ fontSize: '12px', color: '#1e40af', fontWeight: '600' }}>TỔNG ĐƠN HÀNG</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#1e3a8a', marginTop: '4px' }}>
                {bookings.length} đơn
              </div>
            </div>

            <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
              <div style={{ fontSize: '12px', color: '#166534', fontWeight: '600' }}>VÉ ĐÃ BÁN (THỰC TẾ)</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#15803d', marginTop: '4px' }}>
                {totalSeats} vé
              </div>
            </div>

            <div style={{ background: '#fef2f2', padding: '14px', borderRadius: '12px', border: '1px solid #fecaca' }}>
              <div style={{ fontSize: '12px', color: '#991b1b', fontWeight: '600' }}>DOANH THU THỰC TẾ</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#dc2626', marginTop: '4px' }}>
                {totalRevenue.toLocaleString('vi-VN')} đ
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
              <div style={{ fontSize: '12px', color: '#475569', fontWeight: '600' }}>ĐƠN ĐÃ BỊ HỦY</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#64748b', marginTop: '4px' }}>
                {cancelledBookings.length} đơn
              </div>
            </div>
          </div>

          {/* Thanh tìm kiếm & Bộ lọc trạng thái */}
          <div style={{
            padding: '12px 28px',
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
            background: '#ffffff'
          }}>
            <input 
              type="text"
              placeholder="🔍 Tìm theo tên khách hàng, email hoặc tên tour..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                flex: 1,
                padding: '9px 14px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                outline: 'none'
              }}
            />

            {/* Cụm nút lọc trạng thái */}
            <div style={{ display: 'flex', gap: '6px' }}>
              <button 
                onClick={() => setStatusFilter('all')}
                style={{
                  padding: '7px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  background: statusFilter === 'all' ? '#0f172a' : '#f1f5f9',
                  color: statusFilter === 'all' ? '#fff' : '#475569',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Tất cả ({bookings.length})
              </button>

              <button 
                onClick={() => setStatusFilter('confirmed')}
                style={{
                  padding: '7px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  background: statusFilter === 'confirmed' ? '#166534' : '#f0fdf4',
                  color: statusFilter === 'confirmed' ? '#fff' : '#166534',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                ✓ Đã xác nhận ({activeBookings.length})
              </button>

              <button 
                onClick={() => setStatusFilter('cancelled')}
                style={{
                  padding: '7px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  background: statusFilter === 'cancelled' ? '#991b1b' : '#fef2f2',
                  color: statusFilter === 'cancelled' ? '#fff' : '#991b1b',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                ✕ Đã hủy ({cancelledBookings.length})
              </button>
            </div>
          </div>

          {/* Bảng dữ liệu */}
          <div style={{ padding: '0 28px 24px 28px', overflowY: 'auto', flex: 1 }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                ⏳ Đang nạp danh sách đơn...
              </div>
            ) : filteredBookings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                Không tìm thấy đơn đặt nào phù hợp!
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', color: '#475569', textAlign: 'left' }}>
                    <th style={{ padding: '12px 14px', borderRadius: '8px 0 0 8px' }}>Khách Hàng</th>
                    <th style={{ padding: '12px 14px' }}>Tour Đặt</th>
                    <th style={{ padding: '12px 14px', textAlign: 'center' }}>Số Vé</th>
                    <th style={{ padding: '12px 14px' }}>Tổng Tiền</th>
                    <th style={{ padding: '12px 14px', textAlign: 'center' }}>Trạng Thái</th>
                    <th style={{ padding: '12px 14px', textAlign: 'center', borderRadius: '0 8px 8px 0' }}>Hành Động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((b) => {
                    const isCancelled = b.status === 'cancelled';
                    return (
                      <tr 
                        key={b._id}
                        style={{
                          borderBottom: '1px solid #f1f5f9',
                          background: isCancelled ? '#fafafa' : '#ffffff',
                          opacity: isCancelled ? 0.75 : 1
                        }}
                      >
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ fontWeight: '700', color: '#0f172a' }}>{b.user?.name || 'Khách'}</div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>{b.user?.email || 'N/A'}</div>
                        </td>

                        <td style={{ padding: '12px 14px', maxWidth: '220px' }}>
                          <div style={{
                            fontWeight: '600',
                            color: isCancelled ? '#64748b' : '#1e293b',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {b.tour?.title || 'Tour du lịch'}
                          </div>
                        </td>

                        <td style={{ padding: '12px 14px', textAlign: 'center', fontWeight: '700', color: isCancelled ? '#94a3b8' : '#2563eb' }}>
                          {b.numBookedSeats}
                        </td>

                        <td style={{ padding: '12px 14px', fontWeight: '800', color: isCancelled ? '#94a3b8' : '#dc2626', textDecoration: isCancelled ? 'line-through' : 'none' }}>
                          {(b.price || 0).toLocaleString('vi-VN')} đ
                        </td>

                        {/* Cột Trạng Thái */}
                        <td style={{ padding: '12px 14px', textAlign: 'center' }}>
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
                        </td>

                        {/* Cột Thao tác */}
                        <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            {/* Nút xem chi tiết vé */}
                            <button 
                              onClick={() => setSelectedBooking(b)}
                              style={{
                                background: isCancelled ? '#64748b' : '#0284c7',
                                color: '#ffffff',
                                border: 'none',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                fontWeight: '600',
                                fontSize: '11px',
                                cursor: 'pointer'
                              }}
                            >
                              🎫 Chi Tiết Vé
                            </button>

                            {/* Nút Admin Hủy (nếu chưa hủy) */}
                            {!isCancelled && (
                              <button 
                                onClick={() => handleAdminCancel(b._id)}
                                style={{
                                  background: '#fee2e2',
                                  color: '#b91c1c',
                                  border: '1px solid #fca5a5',
                                  padding: '5px 10px',
                                  borderRadius: '6px',
                                  fontWeight: '600',
                                  fontSize: '11px',
                                  cursor: 'pointer'
                                }}
                              >
                                Hủy Đơn
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Popup Chi Tiết Vé */}
      <BookingDetailModal 
        isOpen={Boolean(selectedBooking)}
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
      />
    </>
  );
}

export default AdminBookingsModal;
