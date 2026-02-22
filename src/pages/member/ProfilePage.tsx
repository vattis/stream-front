import { useEffect, useState, FormEvent } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ProfileDto, ProfileComment } from '../../types';
import { memberApi } from '../../api/member';
import { useAuthStore } from '../../store/authStore';
import { Pagination } from '../../components/common/Pagination';
import { Loading } from '../../components/common/Loading';
import styles from './ProfilePage.module.css';

export function ProfilePage() {
  const { memberId } = useParams<{ memberId: string }>();
  const [profile, setProfile] = useState<ProfileDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [commentContent, setCommentContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const { user } = useAuthStore();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!memberId) return;

      setIsLoading(true);
      try {
        const data = await memberApi.getProfile(Number(memberId), currentPage);
        setProfile(data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [memberId, currentPage]);

  const handleSubmitComment = async (e: FormEvent) => {
    e.preventDefault();
    if (!profile || !commentContent.trim()) return;

    setIsSubmitting(true);
    try {
      await memberApi.addProfileComment(profile.profileMember.id, commentContent);
      // Refresh profile
      const data = await memberApi.getProfile(profile.profileMember.id, currentPage);
      setProfile(data);
      setCommentContent('');
    } catch {
      alert('댓글 작성에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!profile || !confirm('댓글을 삭제하시겠습니까?')) return;

    try {
      await memberApi.deleteProfileComment(commentId, profile.profileMember.id);
      // Refresh profile
      const data = await memberApi.getProfile(profile.profileMember.id, currentPage);
      setProfile(data);
    } catch {
      alert('삭제에 실패했습니다.');
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!profile) {
    return <div className={styles.container}>프로필을 찾을 수 없습니다.</div>;
  }

  const avatarUrl = profile.profileMember.avatarUrl || '/images/profile-image.jpg';

  return (
    <div className={styles.profileContainer}>
      {/* 프로필 헤더 */}
      <div className={styles.profileHeader}>
        <img src={avatarUrl} alt="프로필" className={styles.avatar} />
        <div className={styles.username}>{profile.profileMember.nickname}</div>
      </div>

      {/* 최근 게임 */}
      <div className={styles.recentGames}>
        <h3>최근 플레이한 게임</h3>
        {profile.simpleMemberGames.length === 0 ? (
          <p className={styles.noData}>플레이한 게임이 없습니다.</p>
        ) : (
          profile.simpleMemberGames.map((game) => (
            <div key={game.gameId} className={styles.game}>
              <Link to={`/product/${game.gameId}`} className={styles.imageLink}>
                <img src={game.gameImageUrl || '/images/game-image.jpeg'} alt={game.gameName} />
              </Link>
              <div>
                <Link to={`/product/${game.gameId}`} className={styles.link}>
                  <div className={styles.gameTitle}>{game.gameName}</div>
                </Link>
                <div className={styles.playtime}>플레이 시간: {game.playTime}시간</div>
                <div className={styles.playtime}>
                  마지막 플레이: {new Date(game.lastPlayTime).toLocaleString('ko-KR')}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 댓글 */}
      <div className={styles.comments}>
        <h3>프로필 댓글</h3>
        {profile.profileCommentPage.content.map((comment) => (
          <div key={comment.id} className={styles.commentBox}>
            <div className={styles.commentHeader}>
              <Link to={`/profile/${comment.memberId}`} className={styles.imageLink}>
                <img
                  src={comment.avatarUrl || '/images/profile-image.jpg'}
                  alt="작성자"
                  className={styles.commentAvatar}
                />
              </Link>
              <Link to={`/profile/${comment.memberId}`} className={styles.link}>
                <strong>{comment.nickname}</strong>
              </Link>
            </div>
            <p className={styles.commentContent}>{comment.content}</p>
            <div className={styles.commentMeta}>
              <small>{new Date(comment.createdTime).toLocaleString('ko-KR')}</small>
              {user && user.id === comment.memberId && (
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className={styles.deleteBtn}
                >
                  삭제
                </button>
              )}
            </div>
          </div>
        ))}

        <Pagination
          currentPage={currentPage}
          totalPages={profile.profileCommentPage.totalPages}
          onPageChange={setCurrentPage}
        />

        {user && (
          <form onSubmit={handleSubmitComment} className={styles.commentForm}>
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="댓글을 입력하세요"
              rows={3}
              className={styles.textarea}
            />
            <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
              {isSubmitting ? '작성 중...' : '댓글 작성'}
            </button>
          </form>
        )}
      </div>

      {/* 친구 목록 */}
      <div className={styles.friendList}>
        <h3>친구 목록</h3>
        {profile.friendships.length === 0 ? (
          <p className={styles.noData}>친구가 없습니다.</p>
        ) : (
          profile.friendships.map((friend) => (
            <div key={friend.id} className={styles.friend}>
              <Link to={`/profile/${friend.toMember.id}`} className={styles.imageLink}>
                <img
                  src={friend.toMember.avatarUrl || '/images/profile-image.jpg'}
                  alt={friend.toMember.nickname}
                />
              </Link>
              <Link to={`/profile/${friend.toMember.id}`} className={styles.link}>
                <div>{friend.toMember.nickname}</div>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
