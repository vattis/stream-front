import { Link } from 'react-router-dom';
import { SimpleProduct } from '../../types';
import styles from './GameCard.module.css';

interface GameCardProps {
  game: SimpleProduct;
  showDiscount?: boolean;
}

export function GameCard({ game, showDiscount = false }: GameCardProps) {
  const hasDiscount = game.discountId != null && game.discountRate != null;
  const imageUrl = game.imageUrl || '/images/game-image.jpeg';

  return (
    <Link to={`/product/${game.id}`} className={styles.card}>
      <img src={imageUrl} alt={game.name} className={styles.image} />
      <div className={styles.info}>
        <div className={styles.title}>{game.name}</div>
        <div className={styles.price}>
          {showDiscount && hasDiscount ? (
            <>
              <span className={styles.originalPrice}>₩ {game.price.toLocaleString()}</span>
              <span className={styles.discountedPrice}>
                ₩ {game.discountPrice?.toLocaleString()}
              </span>
              <span className={styles.discountRate}>(-{game.discountRate}%)</span>
            </>
          ) : (
            <span>₩ {game.price.toLocaleString()}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
