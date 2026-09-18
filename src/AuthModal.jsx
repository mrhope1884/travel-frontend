import React, { useState } from 'react';
import axios from 'axios';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  // QUAN TRỌNG NHẤT: Nếu chưa bấm mở thì không được vẽ ra HTML
  if (!isOpen) return null;

  const [isLoginTab, setIsLoginTab] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLoginTab) {
        // Gửi yêu cầu Đăng Nhập
        const res = await axios.post('https://travel-4trh.onrender.com/api/auth/login', { 
          email: email.trim(), 
          password 
        });

        // Lưu Token và User
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));

        if (onLoginSuccess) {
          onLoginSuccess(res.data.user);
        }

        alert('🎉 Đăng nhập thành công!');
        onClose();
      } else {
        // Gửi yêu cầu Đăng Ký
        await axios.post('https://travel-4trh.onrender.com/api/auth/register', { 
          name: name.trim(), 
          email: email.trim(), 
          password 
        });

        alert('🎉 Đăng ký tài khoản thành công! Mời bạn đăng nhập.');
        setIsLoginTab(true); // Tự chuyển về tab đăng nhập
      }
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Thất bại! Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close" onClick={onClose}>✕</button>

        {/* Tab chuyển đổi Đăng Nhập / Đăng Ký */}
        <div className="modal-tabs">
          <button
            type="button"
            className={`tab-item ${isLoginTab ? 'active' : ''}`}
            onClick={() => { setIsLoginTab(true); setError(''); }}
          >
            Đăng Nhập
          </button>
          <button
            type="button"
            className={`tab-item ${!isLoginTab ? 'active' : ''}`}
            onClick={() => { setIsLoginTab(false); setError(''); }}
          >
            Đăng Ký
          </button>
        </div>

        {error && <div className="modal-error">⚠️ {error}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          {!isLoginTab && (
            <div className="form-group">
              <label>Họ và tên:</label>
              <input
                type="text"
                placeholder="Ví dụ: Nguyễn Văn A"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div className="form-group">
            <label>Địa chỉ Email:</label>
            <input
              type="email"
              placeholder="example@gmail.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Mật khẩu:</label>
            <input
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-submit-auth" disabled={loading}>
            {loading ? '⏳ Đang kết nối máy chủ...' : (isLoginTab ? 'Đăng Nhập' : 'Tạo Tài Khoản')}
          </button>
        </form>
      </div>
    </div>
  );
}
