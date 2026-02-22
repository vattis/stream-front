import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Gallery } from '../../types';
import { galleryApi } from '../../api/gallery';
import { Pagination } from '../../components/common/Pagination';
import { Loading } from '../../components/common/Loading';
import styles from './GalleryListPage.module.css';

export function GalleryListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchWord, setSearchWord] = useState('');

  const pageNo = Number(searchParams.get('pageNo')) || 0;

  useEffect(() => {
    const fetchGalleries = async () => {
      setIsLoading(true);
      try {
        const data = await galleryApi.getGalleries(pageNo);
        setGalleries(data.content);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Failed to fetch galleries:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGalleries();
  }, [pageNo]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchWord.trim()) return;

    setIsLoading(true);
    try {
      const data = await galleryApi.searchGalleries(searchWord, 0);
      setGalleries(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Failed to search galleries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setSearchParams({ pageNo: page.toString() });
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className={styles.container}>
      <h2>커뮤니티</h2>

      <form onSubmit={handleSearch} className={styles.searchForm}>
        <input
          type="text"
          value={searchWord}
          onChange={(e) => setSearchWord(e.target.value)}
          placeholder="갤러리 검색..."
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchBtn}>
          검색
        </button>
      </form>

      {galleries.length === 0 ? (
        <p className={styles.noResults}>갤러리가 없습니다.</p>
      ) : (
        <>
          <div className={styles.galleryList}>
            {galleries.map((gallery) => (
              <Link key={gallery.id} to={`/gallery/${gallery.id}`} className={styles.galleryCard}>
                <img
                  src={gallery.imageUrl || '/images/game-image.jpeg'}
                  alt={gallery.name}
                  className={styles.galleryImage}
                />
                <div className={styles.galleryInfo}>
                  <h3>{gallery.name}</h3>
                  {gallery.description && <p>{gallery.description}</p>}
                </div>
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
