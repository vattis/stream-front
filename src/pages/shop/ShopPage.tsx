import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SimpleProduct } from '../../types';
import { productApi } from '../../api/product';
import { GameCard } from '../../components/common/GameCard';
import { SearchBar } from '../../components/common/SearchBar';
import { Loading } from '../../components/common/Loading';
import styles from './ShopPage.module.css';

export function ShopPage() {
  const [discountProducts, setDiscountProducts] = useState<SimpleProduct[]>([]);
  const [popularProducts, setPopularProducts] = useState<SimpleProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productApi.getShopProducts();
        setDiscountProducts(data.discountProducts.content);
        setPopularProducts(data.popularProducts.content);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className={styles.shop}>
      <SearchBar />

      {/* 할인 게임 */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <h2>할인 중인 게임</h2>
            <Link to="/shop?filter=discount" className={styles.moreLink}>
              전체 보기 &raquo;
            </Link>
          </div>
          <div className={styles.gameGrid}>
            {discountProducts.map((game) => (
              <GameCard key={game.id} game={game} showDiscount />
            ))}
          </div>
        </div>
      </section>

      {/* 인기 게임 */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <h2>인기 게임</h2>
            <Link to="/shop?filter=popular" className={styles.moreLink}>
              전체 보기 &raquo;
            </Link>
          </div>
          <div className={styles.gameGrid}>
            {popularProducts.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
