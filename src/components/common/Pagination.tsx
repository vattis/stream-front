import styles from './Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i);

  return (
    <div className={styles.pagination}>
      {currentPage > 0 && (
        <button
          onClick={() => onPageChange(currentPage - 1)}
          className={styles.pageBtn}
        >
          &laquo; 이전
        </button>
      )}

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`${styles.pageBtn} ${page === currentPage ? styles.active : ''}`}
        >
          {page + 1}
        </button>
      ))}

      {currentPage < totalPages - 1 && (
        <button
          onClick={() => onPageChange(currentPage + 1)}
          className={styles.pageBtn}
        >
          다음 &raquo;
        </button>
      )}
    </div>
  );
}
