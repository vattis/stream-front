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
    const price = item.product.discountPrice ?? item.product.price;
    return sum + price * item.quantity;
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
            {items.map((item) => {
              const hasDiscount = item.product.discountId != null;
              const displayPrice = item.product.discountPrice ?? item.product.price;

              return (
                <div key={item.id} className={styles.cartItem}>
                  <Link to={`/product/${item.product.id}`} className={styles.productInfo}>
                    <img
                      src={item.product.imageUrl || '/images/game-image.jpeg'}
                      alt={item.product.name}
                      className={styles.productImage}
                    />
                    <div className={styles.productDetails}>
                      <span className={styles.productName}>{item.product.name}</span>
                      <div className={styles.priceInfo}>
                        {hasDiscount && (
                          <span className={styles.originalPrice}>
                            ₩ {item.product.price.toLocaleString()}
                          </span>
                        )}
                        <span className={styles.price}>₩ {displayPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  </Link>

                  <button onClick={() => handleRemove(item.id)} className={styles.removeBtn}>
                    삭제
                  </button>
                </div>
              );
            })}
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
