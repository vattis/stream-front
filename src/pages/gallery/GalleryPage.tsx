import { useEffect, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { Gallery, Article } from '../../types';
import { galleryApi } from '../../api/gallery';
import { useAuthStore } from '../../store/authStore';
import { Pagination } from '../../components/common/Pagination';
import { Loading } from '../../components/common/Loading';
import styles from './GalleryPage.module.css';

export function GalleryPage() {
  const { galleryId } = useParams<{ galleryId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [gallery, setGallery] = useState<Gallery | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const { isAuthenticated } = useAuthStore();
  const pageNo = Number(searchParams.get('pageNo')) || 0;

  useEffect(() => {
    const fetchData = async () => {
      if (!galleryId) return;

      setIsLoading(true);
      try {
        const [galleryData, articlesData] = await Promise.all([
          galleryApi.getGallery(Number(galleryId)),
          galleryApi.getGalleryArticles(Number(galleryId), pageNo),
        ]);
        setGallery(galleryData);
        setArticles(articlesData.content);
        setTotalPages(articlesData.totalPages);
      } catch (error) {
        console.error('Failed to fetch gallery:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [galleryId, pageNo]);

  const handlePageChange = (page: number) => {
    setSearchParams({ pageNo: page.toString() });
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!gallery) {
    return <div className={styles.container}>갤러리를 찾을 수 없습니다.</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2>{gallery.name}</h2>
          {gallery.description && <p className={styles.description}>{gallery.description}</p>}
        </div>
        {isAuthenticated && (
          <Link to={`/gallery/${galleryId}/write`} className={styles.writeBtn}>
            글쓰기
          </Link>
        )}
      </div>

      {articles.length === 0 ? (
        <p className={styles.noArticles}>게시글이 없습니다.</p>
      ) : (
        <>
          <div className={styles.articleList}>
            <div className={styles.articleHeader}>
              <span className={styles.colTitle}>제목</span>
              <span className={styles.colAuthor}>작성자</span>
              <span className={styles.colDate}>날짜</span>
              <span className={styles.colViews}>조회</span>
            </div>
            {articles.map((article) => (
              <Link
                key={article.id}
                to={`/article/${article.id}`}
                className={styles.articleRow}
              >
                <span className={styles.colTitle}>{article.title}</span>
                <span className={styles.colAuthor}>{article.authorNickname}</span>
                <span className={styles.colDate}>
                  {new Date(article.createdTime).toLocaleDateString('ko-KR')}
                </span>
                <span className={styles.colViews}>{article.viewCount}</span>
              </Link>
            ))}
          </div>

          <Pagination
            currentPage={pageNo}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
