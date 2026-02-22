import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SimpleProduct } from '../../types';
import { productApi } from '../../api/product';
import { GameCard } from '../../components/common/GameCard';
import { SearchBar } from '../../components/common/SearchBar';
import { Pagination } from '../../components/common/Pagination';
import { Loading } from '../../components/common/Loading';
import styles from './ProductSearchPage.module.css';

export function ProductSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<SimpleProduct[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const searchTag = searchParams.get('tag') || 'name';
  const searchWord = searchParams.get('searchWord') || '';
  const pageNo = Number(searchParams.get('pageNo')) || 0;

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const data = await productApi.searchProducts(searchTag, searchWord, pageNo);
        setProducts(data.content);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Failed to search products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [searchTag, searchWord, pageNo]);

  const handleSearch = (tag: string, word: string) => {
    setSearchParams({ tag, searchWord: word, pageNo: '0' });
  };

  const handlePageChange = (page: number) => {
    setSearchParams({ tag: searchTag, searchWord, pageNo: page.toString() });
  };

  return (
    <div className={styles.searchPage}>
      <SearchBar
        defaultTag={searchTag}
        defaultWord={searchWord}
        onSearch={handleSearch}
      />

      <div className={styles.container}>
        <h2>
          검색 결과 {searchWord && <span>: "{searchWord}"</span>}
        </h2>

        {isLoading ? (
          <Loading />
        ) : products.length === 0 ? (
          <p className={styles.noResults}>검색 결과가 없습니다.</p>
        ) : (
          <>
            <div className={styles.gameGrid}>
              {products.map((product) => (
                <GameCard key={product.id} game={product} showDiscount />
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
    </div>
  );
}
