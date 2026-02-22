import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import styles from './Navbar.module.css';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContent}>
        <Link to="/" className={styles.logo}>
          <h1>Steam</h1>
        </Link>

        <div className={styles.menuRight}>
          <Link to="/shop" className={styles.navLink}>
            상점
          </Link>

          {isAuthenticated && user && (
            <Link to={`/library/${user.id}`} className={styles.navLink}>
              라이브러리
            </Link>
          )}

          <Link to="/galleries" className={styles.navLink}>
            커뮤니티
          </Link>

          {isAuthenticated && (
            <Link to="/cart" className={styles.navLink}>
              장바구니
            </Link>
          )}

          {!isAuthenticated ? (
            <div className={styles.authLinks}>
              <Link to="/login" className={styles.loginLink}>
                로그인
              </Link>
              <Link to="/signup" className={styles.signupLink}>
                회원가입
              </Link>
            </div>
          ) : (
            <div className={styles.userMenu}>
              <div
                className={styles.nickWrap}
                onMouseEnter={() => setShowDropdown(true)}
                onMouseLeave={() => setShowDropdown(false)}
              >
                <Link to={`/profile/${user?.id}`} className={styles.userNick}>
                  {user?.nickName}
                </Link>

                {showDropdown && (
                  <div className={styles.dropdown}>
                    <Link to={`/friends/${user?.id}`} className={styles.dropdownLink}>
                      친구 목록
                    </Link>
                    <Link to="/members/search" className={styles.dropdownLink}>
                      회원 검색
                    </Link>
                    <Link to="/friend-requests" className={styles.dropdownLink}>
                      받은 초대
                    </Link>
                  </div>
                )}
              </div>

              <button onClick={handleLogout} className={styles.logoutBtn}>
                로그아웃
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
