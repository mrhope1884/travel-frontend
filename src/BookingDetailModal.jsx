import React, { useState } from 'react';

function BookingDetailModal({ isOpen, onClose, booking }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !booking) return null;

  const isCancelled = booking.status === 'cancelled';
  const bookingCode = `VN-${booking._id ? booking._id.slice(-8).toUpperCase() : 'TOUR99'}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(bookingCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '520px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
          position: 'relative'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header vé */}
        <div style={{
          background: isCancelled 
            ? 'linear-gradient(135deg, #450a0a 0%, #991b1b 60%, #dc2626 100%)' 
            : 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #2563eb 100%)',
          color: '#fff',
          padding: '24px 28px',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '20px' }}>✈️</span>
              <span style={{ fontSize: '13px', fontWeight: '800', letterSpacing: '2px', color: isCancelled ? '#fca5a5' : '#93c5fd' }}>
                TRAVEL BOOKING PASS
              </span>
            </div>

            {/* Dấu xác nhận hoặc Dấu Hủy */}
            <span style={{
              background: isCancelled ? '#ef4444' : '#22c55e',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: '700',
              padding: '4px 10px',
              borderRadius: '20px',
              boxShadow: isCancelled ? '0 2px 6px rgba(239,68,68,0.5)' : '0 2px 6px rgba(34,197,94,0.4)'
            }}>
              {isCancelled ? '❌ VÉ ĐÃ HỦY' : '✓ ĐÃ XÁC NHẬN'}
            </span>
          </div>

          <h3 style={{ margin: '0 0 10px 0', fontSize: '19px', fontWeight: '800', lineHeight: 1.3 }}>
            {booking.tour?.title || 'Tour Du Lịch Trọn Gói'}
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '13px', color: '#cbd5e1' }}>Mã vé:</span>
            <span style={{ fontSize: '14px', fontWeight: '800', color: '#facc15', letterSpacing: '1px' }}>
              {bookingCode}
            </span>
            <button 
              onClick={handleCopyCode}
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                color: '#fff',
                padding: '2px 8px',
                borderRadius: '6px',
                fontSize: '11px',
                cursor: 'pointer'
              }}
            >
              {copied ? '✓ Đã chép' : 'Sao chép'}
            </button>
          </div>

          <button 
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '18px',
              right: '18px',
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              color: '#fff',
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            ✕
          </button>
        </div>

        {/* Thân vé */}
        <div style={{ padding: '24px 28px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            background: isCancelled ? '#fff1f2' : '#f8fafc',
            padding: '16px',
            borderRadius: '14px',
            border: isCancelled ? '1px solid #fecdd3' : '1px solid #e2e8f0',
            marginBottom: '20px'
          }}>
            <div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Hành khách</div>
              <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', marginTop: '2px' }}>
                {booking.user?.name || 'Quý khách'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Số lượng chỗ</div>
              <div style={{ fontSize: '15px', fontWeight: '700', color: isCancelled ? '#94a3b8' : '#2563eb', marginTop: '2px' }}>
                {booking.numBookedSeats} khách
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Email</div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#334155', marginTop: '2px', wordBreak: 'break-all' }}>
                {booking.user?.email || 'Chưa cập nhật'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Tình trạng</div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: isCancelled ? '#dc2626' : '#166534', marginTop: '2px' }}>
                {isCancelled ? 'Đã hủy hoàn chỗ' : 'Đang giữ chỗ'}
              </div>
            </div>
          </div>

          {/* Đường đứt nét ngăn cách */}
          <div style={{
            borderTop: '2px dashed #cbd5e1',
            margin: '20px 0',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              left: '-38px',
              top: '-10px',
              width: '20px',
              height: '20px',
              background: 'rgba(15, 23, 42, 0.8)',
              borderRadius: '50%'
            }} />
            <div style={{
              position: 'absolute',
              right: '-38px',
              top: '-10px',
              width: '20px',
              height: '20px',
              background: 'rgba(15, 23, 42, 0.8)',
              borderRadius: '50%'
            }} />
          </div>

          {/* Khung thanh toán */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: isCancelled ? '#fef2f2' : '#eff6ff',
            padding: '16px 20px',
            borderRadius: '12px',
            border: isCancelled ? '1px solid #fecaca' : '1px solid #bfdbfe',
            marginBottom: '20px'
          }}>
            <div>
              <div style={{ fontSize: '12px', color: isCancelled ? '#991b1b' : '#1e40af', fontWeight: '600' }}>
                {isCancelled ? 'TIỀN ĐÃ HOÀN TRẢ' : 'TỔNG TIỀN THANH TOÁN'}
              </div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>
                {isCancelled ? 'Đơn này đã được hủy' : 'Đã bao gồm VAT & Dịch vụ'}
              </div>
            </div>
            <div style={{
              fontSize: '24px',
              fontWeight: '900',
              color: isCancelled ? '#94a3b8' : '#dc2626',
              textDecoration: isCancelled ? 'line-through' : 'none'
            }}>
              {(booking.price || 0).toLocaleString('vi-VN')} đ
            </div>
          </div>

          {/* Cụm nút bấm */}
          <div style={{ display: 'flex', gap: '12px' }}>
            {!isCancelled && (
              <button 
                onClick={() => window.print()}
                style={{
                  flex: 1,
                  padding: '13px',
                  background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                🖨️ In Vé / Lưu PDF
              </button>
            )}
            <button 
              onClick={onClose}
              style={{
                flex: isCancelled ? 1 : 'none',
                padding: '13px 24px',
                background: '#f1f5f9',
                color: '#475569',
                border: 'none',
                borderRadius: '12px',
                fontWeight: '700',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingDetailModal;
