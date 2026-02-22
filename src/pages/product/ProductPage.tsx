import { useEffect, useState, FormEvent } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DetailProduct, ProductComment } from '../../types';
import { productApi } from '../../api/product';
import { useAuthStore } from '../../store/authStore';
import { StarRating } from '../../components/common/StarRating';
import { Loading } from '../../components/common/Loading';
import styles from './ProductPage.module.css';

export function ProductPage() {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<DetailProduct | null>(null);
  const [comments, setComments] = useState<ProductComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [reviewContent, setReviewContent] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      try {
        const data = await productApi.getProduct(Number(productId));
        setProduct(data.product);
        setComments(data.comments.content);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      await productApi.addToCart(product.id);
      alert('장바구니에 추가되었습니다.');
    } catch {
      alert('장바구니 추가에 실패했습니다.');
    }
  };

  const handleSubmitReview = async (e: FormEvent) => {
    e.preventDefault();
    if (!product || !reviewContent || reviewRating === 0) return;

    setIsSubmitting(true);
    try {
      await productApi.addProductComment(product.id, reviewContent, reviewRating);
      // Refresh comments
      const data = await productApi.getProduct(product.id);
      setComments(data.comments.content);
      setReviewContent('');
      setReviewRating(0);
    } catch {
      alert('리뷰 작성에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm('리뷰를 삭제하시겠습니까?')) return;

    try {
      await productApi.deleteProductComment(commentId);
      setComments(comments.filter((c) => c.id !== commentId));
    } catch {
      alert('삭제에 실패했습니다.');
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!product) {
    return <div className={styles.container}>상품을 찾을 수 없습니다.</div>;
  }

  const imageUrl = product.imageUrl || '/images/game-image.jpeg';
  const hasDiscount = product.discountDto?.isActive?.();
  const displayPrice = hasDiscount ? product.discountPrice : product.price;

  return (
    <div className={styles.container}>
      <div className={styles.gameHeader}>
        <img src={imageUrl} alt={product.name} className={styles.gameImage} />
        <div className={styles.gameInfo}>
          <h1>{product.name}</h1>

          <div className={styles.rating}>
            <strong>평점:</strong>{' '}
            <StarRating value={Math.round(product.rate || 0)} readOnly size="medium" />
            <span>{product.rate?.toFixed(1) || 0}/5</span>
          </div>

          <div className={styles.purchaseSection}>
            <div className={styles.priceBox}>
              {hasDiscount && (
                <span className={styles.originalPrice}>₩ {product.price?.toLocaleString()}</span>
              )}
              <span className={styles.discountedPrice}>₩ {displayPrice?.toLocaleString()}</span>
            </div>

            <div className={styles.purchaseButton}>
              {isAuthenticated ? (
                <button onClick={handleAddToCart} className={styles.cartBtn}>
                  장바구니에 담기
                </button>
              ) : (
                <Link to="/login" className={styles.loginLink}>
                  로그인 후 구매하기
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 리뷰 섹션 */}
      <div className={styles.reviewSection}>
        <h2>유저 리뷰</h2>

        {isAuthenticated ? (
          <form onSubmit={handleSubmitReview} className={styles.reviewForm}>
            <div className={styles.ratingGroup}>
              <StarRating value={reviewRating} onChange={setReviewRating} size="large" />
            </div>
            <textarea
              value={reviewContent}
              onChange={(e) => setReviewContent(e.target.value)}
              placeholder="리뷰를 입력하세요..."
              maxLength={500}
              required
              className={styles.textarea}
            />
            <button
              type="submit"
              disabled={isSubmitting || reviewRating === 0}
              className={styles.submitBtn}
            >
              {isSubmitting ? '작성 중...' : '리뷰 작성'}
            </button>
          </form>
        ) : (
          <div className={styles.reviewForm}>
            <Link to="/login" className={styles.loginLink}>
              로그인 후 리뷰 작성
            </Link>
          </div>
        )}

        <div className={styles.reviewList}>
          {comments.length === 0 ? (
            <p className={styles.noReviews}>등록된 리뷰가 없습니다.</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className={styles.reviewItem}>
                <div className={styles.reviewMeta}>
                  <div className={styles.reviewUser}>
                    <span className={styles.userName}>{comment.member.nickname}</span>
                    <span className={styles.reviewDate}>
                      {new Date(comment.createdTime).toLocaleString('ko-KR')}
                    </span>
                  </div>
                  {user && user.id === comment.member.id && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className={styles.deleteBtn}
                    >
                      삭제
                    </button>
                  )}
                </div>
                {comment.rating && (
                  <div className={styles.reviewStars}>
                    <StarRating value={comment.rating} readOnly size="small" />
                  </div>
                )}
                <p className={styles.reviewContent}>{comment.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
