import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AuthModal from './AuthModal';
import TourDetailModal from './TourDetailModal';
import BookingModal from './BookingModal';
import MyBookingsModal from './MyBookingsModal';
import AddTourModal from './AddTourModal';
import EditTourModal from './EditTourModal';
import AdminBookingsModal from './AdminBookingsModal';
import TrashModal from './TrashModal';
import './App.css';

function App() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTours, setTotalTours] = useState(0);

  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');

  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [selectedTourForDetail, setSelectedTourForDetail] = useState(null);
  const [selectedTourForBooking, setSelectedTourForBooking] = useState(null);
  const [showMyBookings, setShowMyBookings] = useState(false);
  const [showAddTour, setShowAddTour] = useState(false);
  const [editingTour, setEditingTour] = useState(null);
  const [showAdminBookings, setShowAdminBookings] = useState(false);
  const [showTrashModal, setShowTrashModal] = useState(false);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser) setUser(JSON.parse(savedUser));
    } catch (e) {}
  }, []);

  const fetchTours = async () => {
    try {
      setLoading(true);
      let url = `https://travel-4trh.onrender.com/api/tours?page=${page}&limit=9`;
      if (searchQuery) url += `&query=${encodeURIComponent(searchQuery)}`;
      if (priceFilter === 'under-3m') url += `&maxPrice=3000000`;
      if (priceFilter === '3m-4m') url += `&minPrice=3000000&maxPrice=4000000`;
      if (priceFilter === 'above-4m') url += `&minPrice=4000000`;

      const res = await axios.get(url);
      setTours(res.data?.data || []);
      setTotalPages(res.data?.totalPages || 1);
      setTotalTours(res.data?.total || 0);
    } catch (err) {
      console.error("Lỗi tải tour:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, [page, priceFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchTours();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    alert("Đã đăng xuất!");
    window.location.reload();
  };

  // Admin Xóa tour (đưa vào thùng rác)
  const handleDeleteTour = async (id, title) => {
    if (!window.confirm(`Bạn có chắc muốn chuyển tour "${title}" vào Thùng Rác?`)) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://travel-4trh.onrender.com/api/tours/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("🗑️ Đã chuyển tour vào Thùng Rác!");
      fetchTours();
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi khi xóa tour!");
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo-brand" onClick={() => window.location.reload()} style={{ cursor: 'pointer' }}>
            <span className="logo-icon">✈️</span>
            <span className="logo-text">VIET TRAVEL</span>
          </div>

          <div className="header-actions">
            {/* Các nút dành cho Admin */}
            {user && user.role === 'admin' && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn-add-tour" onClick={() => setShowAddTour(true)}>
                  + Thêm Tour Mới
                </button>
                <button className="btn-admin-orders" onClick={() => setShowAdminBookings(true)}>
                  🛡️ Quản Lý Đơn
                </button>
                <button 
                  onClick={() => setShowTrashModal(true)}
                  style={{
                    background: '#fee2e2',
                    color: '#991b1b',
                    border: '1px solid #fca5a5',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}
                >
                  🗑️ Thùng Rác
                </button>
              </div>
            )}

            {/* Tài khoản người dùng */}
            {user ? (
              <div className="user-profile">
                <button className="btn-my-bookings" onClick={() => setShowMyBookings(true)}>
                  📋 Đơn của tôi
                </button>
                <span className="user-name">👤 {user.name}</span>
                <button className="btn-logout" onClick={handleLogout}>Đăng xuất</button>
              </div>
            ) : (
              <button className="btn-login" onClick={() => setShowAuthModal(true)}>
                Đăng Nhập / Đăng Ký
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Banner & Search */}
      <section className="hero-section">
        <div className="hero-overlay">
          <h1 className="hero-title">Khám Phá Vẻ Đẹp Việt Nam</h1>
          <p className="hero-subtitle">Hơn 100+ tour du lịch chất lượng cao, giá ưu đãi đang chờ đón bạn</p>

          <form className="search-bar" onSubmit={handleSearch}>
            <input 
              type="text"
              placeholder="🔍 Bạn muốn đi đâu? (Hạ Long, Sapa, Đà Nẵng...)"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="btn-search">Tìm Kiếm</button>
          </form>

          {/* Bộ lọc giá */}
          <div className="price-filters">
            <button className={priceFilter === 'all' ? 'active' : ''} onClick={() => { setPriceFilter('all'); setPage(1); }}>
              Tất Cả Giá
            </button>
            <button className={priceFilter === 'under-3m' ? 'active' : ''} onClick={() => { setPriceFilter('under-3m'); setPage(1); }}>
              Dưới 3 Triệu
            </button>
            <button className={priceFilter === '3m-4m' ? 'active' : ''} onClick={() => { setPriceFilter('3m-4m'); setPage(1); }}>
              3 - 4 Triệu
            </button>
            <button className={priceFilter === 'above-4m' ? 'active' : ''} onClick={() => { setPriceFilter('above-4m'); setPage(1); }}>
              Trên 4 Triệu
            </button>
          </div>
        </div>
      </section>

      {/* Danh sách Tour */}
      <main className="main-content">
        <div className="section-header">
          <h2>Danh Sách Tour Nổi Bật ({totalTours})</h2>
        </div>

        {loading ? (
          <div className="loading-spinner">⏳ Đang tải danh sách tour...</div>
        ) : tours.length === 0 ? (
          <div className="empty-tours">Không tìm thấy tour phù hợp!</div>
        ) : (
          <div className="tours-grid">
            {tours.map(tour => (
              <div key={tour._id} className="tour-card">
                <div className="tour-card-img-wrap" onClick={() => setSelectedTourForDetail(tour)}>
                  <img src={tour.imageCover || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600'} alt={tour.title} />
                  <span className="tour-badge-seats">Còn {tour.maxGroupSize !== undefined ? tour.maxGroupSize : 20} chỗ</span>
                </div>

                <div className="tour-card-body">
                  <h3 className="tour-title" onClick={() => setSelectedTourForDetail(tour)}>
                    {tour.title}
                  </h3>
                  <p className="tour-desc">{tour.description}</p>

                  <div className="tour-bottom-row">
                    <div className="tour-price">
                      <span className="price-num">{tour.price?.toLocaleString('vi-VN')} đ</span>
                      <span className="price-unit">/ khách</span>
                    </div>

                    <div className="tour-actions">
                      <button 
                        className="btn-book-tour"
                        onClick={() => {
                          if (!user) {
                            setShowAuthModal(true);
                          } else {
                            setSelectedTourForBooking(tour);
                          }
                        }}
                      >
                        Đặt Tour
                      </button>
                    </div>
                  </div>

                  {/* Sửa / Xóa cho Admin */}
                  {user && user.role === 'admin' && (
                    <div className="admin-card-actions">
                      <button className="btn-edit" onClick={() => setEditingTour(tour)}>✏️ Sửa</button>
                      <button className="btn-delete" onClick={() => handleDeleteTour(tour._id, tour.title)}>🗑️ Xóa</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Phân trang */}
        {totalPages > 1 && (
          <div className="pagination">
            <button disabled={page === 1} onClick={() => setPage(page - 1)}>← Trước</button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i + 1} className={page === i + 1 ? 'active' : ''} onClick={() => setPage(i + 1)}>
                {i + 1}
              </button>
            ))}
            <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Sau →</button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>© 2026 Viet Travel. Hệ thống đặt vé tour du lịch thông minh.</p>
      </footer>

      {/* Modals */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onLoginSuccess={(u) => setUser(u)} />
      <TourDetailModal isOpen={Boolean(selectedTourForDetail)} tour={selectedTourForDetail} onClose={() => setSelectedTourForDetail(null)} onBookTour={(t) => setSelectedTourForBooking(t)} />
      <BookingModal isOpen={Boolean(selectedTourForBooking)} tour={selectedTourForBooking} onClose={() => setSelectedTourForBooking(null)} />
      <MyBookingsModal isOpen={showMyBookings} onClose={() => setShowMyBookings(false)} />
      <AddTourModal isOpen={showAddTour} onClose={() => setShowAddTour(false)} onTourAdded={fetchTours} />
      <EditTourModal isOpen={Boolean(editingTour)} tour={editingTour} onClose={() => setEditingTour(null)} onTourUpdated={fetchTours} />
      <AdminBookingsModal isOpen={showAdminBookings} onClose={() => setShowAdminBookings(false)} />
      <TrashModal isOpen={showTrashModal} onClose={() => setShowTrashModal(false)} onRestoreSuccess={fetchTours} />
    </div>
  );
}

export default App;
