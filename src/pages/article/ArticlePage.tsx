import { useEffect, useState, FormEvent } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Article } from '../../types';
import { articleApi, ArticleComment } from '../../api/article';
import { useAuthStore } from '../../store/authStore';
import { Loading } from '../../components/common/Loading';
import styles from './ArticlePage.module.css';

export function ArticlePage() {
  const { articleId } = useParams<{ articleId: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<ArticleComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [commentContent, setCommentContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const fetchArticle = async () => {
      if (!articleId) return;

      try {
        const data = await articleApi.getArticle(Number(articleId));
        setArticle(data.article);
        setComments(data.comments.content);
      } catch (error) {
        console.error('Failed to fetch article:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [articleId]);

  const handleDelete = async () => {
    if (!article || !confirm('게시글을 삭제하시겠습니까?')) return;

    try {
      await articleApi.deleteArticle(article.id, article.authorId);
      navigate(-1);
    } catch {
      alert('삭제에 실패했습니다.');
    }
  };

  const handleSubmitComment = async (e: FormEvent) => {
    e.preventDefault();
    if (!article || !commentContent.trim()) return;

    setIsSubmitting(true);
    try {
      await articleApi.addArticleComment(article.id, commentContent);
      const data = await articleApi.getArticle(article.id);
      setComments(data.comments.content);
      setCommentContent('');
    } catch {
      alert('댓글 작성에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!article || !confirm('댓글을 삭제하시겠습니까?')) return;

    try {
      await articleApi.deleteArticleComment(commentId, article.id);
      setComments(comments.filter((c) => c.id !== commentId));
    } catch {
      alert('삭제에 실패했습니다.');
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!article) {
    return <div className={styles.container}>게시글을 찾을 수 없습니다.</div>;
  }

  const isAuthor = user && user.id === article.authorId;

  return (
    <div className={styles.container}>
      <article className={styles.article}>
        <header className={styles.header}>
          <h1>{article.title}</h1>
          <div className={styles.meta}>
            <Link to={`/profile/${article.authorId}`} className={styles.author}>
              {article.authorNickname}
            </Link>
            <span className={styles.date}>
              {new Date(article.createdTime).toLocaleString('ko-KR')}
            </span>
            <span className={styles.views}>조회 {article.viewCount}</span>
          </div>
        </header>

        <div className={styles.content}>
          <p>{article.content}</p>
        </div>

        {isAuthor && (
          <div className={styles.actions}>
            <button onClick={handleDelete} className={styles.deleteBtn}>
              삭제
            </button>
          </div>
        )}
      </article>

      {/* 댓글 섹션 */}
      <section className={styles.comments}>
        <h3>댓글 ({comments.length})</h3>

        {isAuthenticated && (
          <form onSubmit={handleSubmitComment} className={styles.commentForm}>
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="댓글을 입력하세요..."
              rows={3}
              className={styles.textarea}
            />
            <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
              {isSubmitting ? '작성 중...' : '댓글 작성'}
            </button>
          </form>
        )}

        <div className={styles.commentList}>
          {comments.length === 0 ? (
            <p className={styles.noComments}>댓글이 없습니다.</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className={styles.comment}>
                <div className={styles.commentHeader}>
                  <Link to={`/profile/${comment.memberId}`} className={styles.commentAuthor}>
                    <img
                      src={comment.avatarUrl || '/images/profile-image.jpg'}
                      alt={comment.nickname}
                      className={styles.commentAvatar}
                    />
                    <span>{comment.nickname}</span>
                  </Link>
                  <span className={styles.commentDate}>
                    {new Date(comment.createdTime).toLocaleString('ko-KR')}
                  </span>
                </div>
                <p className={styles.commentContent}>{comment.content}</p>
                {user && user.id === comment.memberId && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className={styles.commentDeleteBtn}
                  >
                    삭제
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
