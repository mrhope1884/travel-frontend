import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TrashModal({ isOpen, onClose, onRestoreSuccess }) {
  const [trashTours, setTrashTours] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTrash = () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setLoading(true);
    axios.get('https://travel-4trh.onrender.com/api/tours/trash', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setTrashTours(res.data?.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi lấy danh sách thùng rác:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (isOpen) fetchTrash();
  }, [isOpen]);

  // Khôi phục tour
  const handleRestore = async (id, title) => {
    if (!window.confirm(`Bạn có chắc muốn khôi phục tour "${title}"?`)) return;

    try {
      const token = localStorage.getItem('token');
      const res = await axios.patch(`https://travel-4trh.onrender.com/api/tours/restore/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(res.data?.message || "🎉 Khôi phục tour thành công!");
      fetchTrash();
      if (onRestoreSuccess) onRestoreSuccess();
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Lỗi khi khôi phục!");
    }
  };

  // Xóa vĩnh viễn
  const handleDestroy = async (id, title) => {
    if (!window.confirm(`⚠️ Bạn có chắc muốn XÓA VĨNH VIỄN tour "${title}" khỏi Database?`)) return;

    try {
      const token = localStorage.getItem('token');
      const res = await axios.delete(`https://travel-4trh.onrender.com/api/tours/destroy/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(res.data?.message || "💥 Đã xóa vĩnh viễn!");
      fetchTrash();
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Lỗi khi xóa vĩnh viễn!");
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.8)',
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
          maxWidth: '850px',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header Thùng Rác */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#fff1f2'
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#991b1b' }}>
              🗑️ Thùng Rác & Lịch Sử Xóa Tour ({trashTours.length})
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748b' }}>
              Xem lịch sử các tour đã xóa, bấm Khôi phục để bán lại hoặc Xóa vĩnh viễn.
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

        {/* Danh sách */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
              ⏳ Đang nạp danh sách thùng rác...
            </div>
          ) : trashTours.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px 20px', color: '#94a3b8' }}>
              <div style={{ fontSize: '40px', marginBottom: '8px' }}>🎉</div>
              <p style={{ fontSize: '16px', margin: 0, fontWeight: '700' }}>Thùng rác trống!</p>
              <p style={{ fontSize: '13px', margin: '4px 0 0 0' }}>Không có tour nào bị xóa.</p>
            </div>
          ) : (
            trashTours.map(item => (
              <div 
                key={item._id}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '16px',
                  padding: '14px',
                  background: '#fafafa',
                  border: '1px solid #fecdd3',
                  borderRadius: '12px',
                  alignItems: 'center'
                }}
              >
                <img 
                  src={item.imageCover || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300'} 
                  alt={item.title} 
                  style={{
                    width: '100px',
                    height: '75px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    filter: 'grayscale(70%)',
                    flexShrink: 0
                  }}
                />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{
                    margin: '0 0 4px 0',
                    fontSize: '15px',
                    fontWeight: '700',
                    color: '#0f172a',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {item.title}
                  </h4>
                  
                  <div style={{ fontSize: '13px', color: '#64748b', display: 'flex', gap: '12px', marginBottom: '4px' }}>
                    <span>💰 Giá: <strong style={{ color: '#dc2626' }}>{(item.price || 0).toLocaleString('vi-VN')} đ</strong></span>
                    <span>🕒 <strong>Thời gian xóa:</strong> {item.deletedAt ? new Date(item.deletedAt).toLocaleString('vi-VN') : 'Không rõ'}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  <button 
                    onClick={() => handleRestore(item._id, item.title)}
                    style={{
                      background: '#16a34a',
                      color: '#ffffff',
                      border: 'none',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      fontWeight: '700',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    🔄 Khôi Phục
                  </button>

                  <button 
                    onClick={() => handleDestroy(item._id, item.title)}
                    style={{
                      background: '#fee2e2',
                      color: '#b91c1c',
                      border: '1px solid #fca5a5',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontWeight: '600',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    💥 Xóa Vĩnh Viễn
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default TrashModal;
