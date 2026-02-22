import { useState, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { articleApi } from '../../api/article';
import styles from './WriteArticlePage.module.css';

export function WriteArticlePage() {
  const { galleryId } = useParams<{ galleryId: string }>();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!galleryId || !title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    try {
      const articleId = await articleApi.createArticle(Number(galleryId), title, content);
      navigate(`/article/${articleId}`);
    } catch {
      alert('게시글 작성에 실패했습니다.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>글쓰기</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="title">제목</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            required
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="content">내용</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력하세요"
            rows={15}
            required
            className={styles.textarea}
          />
        </div>

        <div className={styles.actions}>
          <button type="button" onClick={() => navigate(-1)} className={styles.cancelBtn}>
            취소
          </button>
          <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
            {isSubmitting ? '작성 중...' : '작성하기'}
          </button>
        </div>
      </form>
    </div>
  );
}
