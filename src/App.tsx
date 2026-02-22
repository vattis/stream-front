import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './store/authStore';
import { Layout } from './components/layout/Layout';
import { Loading } from './components/common/Loading';

// Pages
import { HomePage } from './pages/home/HomePage';
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import { ShopPage } from './pages/shop/ShopPage';
import { ProductPage } from './pages/product/ProductPage';
import { ProductSearchPage } from './pages/product/ProductSearchPage';
import { ProfilePage } from './pages/member/ProfilePage';
import { LibraryPage } from './pages/member/LibraryPage';
import { MemberSearchPage } from './pages/member/MemberSearchPage';
import { FriendListPage } from './pages/friend/FriendListPage';
import { FriendRequestsPage } from './pages/friend/FriendRequestsPage';
import { CartPage } from './pages/cart/CartPage';
import { GalleryListPage } from './pages/gallery/GalleryListPage';
import { GalleryPage } from './pages/gallery/GalleryPage';
import { ArticlePage } from './pages/article/ArticlePage';
import { WriteArticlePage } from './pages/article/WriteArticlePage';

import './styles/global.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Protected Route 컴포넌트
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Auth Route 컴포넌트 (이미 로그인한 사용자 리다이렉트)
function AuthRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <Loading />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function AppContent() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Layout>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/product/:productId" element={<ProductPage />} />
        <Route path="/product/search" element={<ProductSearchPage />} />
        <Route path="/profile/:memberId" element={<ProfilePage />} />
        <Route path="/galleries" element={<GalleryListPage />} />
        <Route path="/gallery/:galleryId" element={<GalleryPage />} />
        <Route path="/article/:articleId" element={<ArticlePage />} />
        <Route path="/friends/:memberId" element={<FriendListPage />} />

        {/* Auth Routes (redirect if already logged in) */}
        <Route
          path="/login"
          element={
            <AuthRoute>
              <LoginPage />
            </AuthRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <AuthRoute>
              <SignupPage />
            </AuthRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/library/:memberId"
          element={
            <ProtectedRoute>
              <LibraryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/library/:memberId/:selectedGameId"
          element={
            <ProtectedRoute>
              <LibraryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/members/search"
          element={
            <ProtectedRoute>
              <MemberSearchPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/friend-requests"
          element={
            <ProtectedRoute>
              <FriendRequestsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gallery/:galleryId/write"
          element={
            <ProtectedRoute>
              <WriteArticlePage />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
