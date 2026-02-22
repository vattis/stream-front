import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SimpleProduct } from '../../types';
import { productApi } from '../../api/product';
import { GameCard } from '../../components/common/GameCard';
import { Loading } from '../../components/common/Loading';
import styles from './HomePage.module.css';

export function HomePage() {
  const [products, setProducts] = useState<SimpleProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productApi.getShopProducts();
        console.log('Shop products response:', data);
        const popular = data?.popularProducts?.content || [];
        setProducts(popular);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setProducts([]);
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
    <div className={styles.home}>
      <div className={styles.banner}>
        <h2>Explore the World of Games</h2>
      </div>

      <section className={styles.gameList}>
        <div className={styles.sectionHeader}>
          <h3>인기 게임</h3>
          <Link to="/shop" className={styles.moreLink}>
            전체 보기 &raquo;
          </Link>
        </div>
        <div className={styles.gameGrid}>
          {products.map((product) => (
            <GameCard key={product.id} game={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
