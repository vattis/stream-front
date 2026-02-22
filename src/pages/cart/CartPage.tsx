import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { Loading } from '../../components/common/Loading';
import styles from './CartPage.module.css';

export function CartPage() {
  const { items, isLoading, fetchCart, removeFromCart, checkout } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleRemove = async (cartItemId: number) => {
    try {
      await removeFromCart(cartItemId);
    } catch {
      alert('삭제에 실패했습니다.');
    }
  };

  const handleCheckout = async () => {
    if (items.length === 0) {
      alert('장바구니가 비어있습니다.');
      return;
    }

    if (!confirm('결제를 진행하시겠습니까?')) return;

    try {
      await checkout();
      alert('결제가 완료되었습니다.');
      navigate('/');
    } catch {
      alert('결제에 실패했습니다.');
    }
  };

  const totalPrice = items.reduce((sum, item) => {
    return sum + item.productPrice;
  }, 0);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className={styles.container}>
      <h2>장바구니</h2>

      {items.length === 0 ? (
        <div className={styles.empty}>
          <p>장바구니가 비어있습니다.</p>
          <Link to="/shop" className={styles.shopLink}>
            상점으로 이동
          </Link>
        </div>
      ) : (
        <>
          <div className={styles.cartItems}>
            {items.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <div className={styles.productInfo}>
                  <img
                    src={item.avatarUrl || '/images/game-image.jpeg'}
                    alt={item.productName}
                    className={styles.productImage}
                  />
                  <div className={styles.productDetails}>
                    <span className={styles.productName}>{item.productName}</span>
                    <div className={styles.priceInfo}>
                      <span className={styles.price}>₩ {item.productPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <button onClick={() => handleRemove(item.id)} className={styles.removeBtn}>
                  삭제
                </button>
              </div>
            ))}
          </div>

          <div className={styles.summary}>
            <div className={styles.totalPrice}>
              <span>총 금액:</span>
              <span className={styles.totalAmount}>₩ {totalPrice.toLocaleString()}</span>
            </div>
            <button onClick={handleCheckout} className={styles.checkoutBtn}>
              결제하기
            </button>
          </div>
        </>
      )}
    </div>
  );
}
