import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  defaultTag?: string;
  defaultWord?: string;
  onSearch?: (tag: string, word: string) => void;
}

export function SearchBar({ defaultTag = 'name', defaultWord = '', onSearch }: SearchBarProps) {
  const [searchTag, setSearchTag] = useState(defaultTag);
  const [searchWord, setSearchWord] = useState(defaultWord);
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTag, searchWord);
    } else {
      navigate(`/product/search?tag=${searchTag}&searchWord=${encodeURIComponent(searchWord)}`);
    }
  };

  return (
    <div className={styles.searchBar}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <select
          value={searchTag}
          onChange={(e) => setSearchTag(e.target.value)}
          className={styles.select}
        >
          <option value="name">이름</option>
          <option value="company">회사</option>
          <option value="tag">태그</option>
        </select>
        <input
          type="text"
          value={searchWord}
          onChange={(e) => setSearchWord(e.target.value)}
          placeholder="검색어 입력..."
          className={styles.input}
        />
        <button type="submit" className={styles.button}>
          검색
        </button>
      </form>
    </div>
  );
}
