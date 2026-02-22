import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Friendship } from '../../types';
import { friendshipApi } from '../../api/friendship';
import { useAuthStore } from '../../store/authStore';
import { Loading } from '../../components/common/Loading';
import styles from './FriendListPage.module.css';

export function FriendListPage() {
  const { memberId } = useParams<{ memberId: string }>();
  const [friends, setFriends] = useState<Friendship[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useAuthStore();
  const isOwner = user && user.id === Number(memberId);

  useEffect(() => {
    const fetchFriends = async () => {
      if (!memberId) return;

      try {
        const data = await friendshipApi.getFriends(Number(memberId));
        setFriends(data);
      } catch (error) {
        console.error('Failed to fetch friends:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFriends();
  }, [memberId]);

  const handleRemoveFriend = async (friendshipId: number) => {
    if (!confirm('친구를 삭제하시겠습니까?')) return;

    try {
      await friendshipApi.removeFriend(friendshipId);
      setFriends(friends.filter(f => f.id !== friendshipId));
    } catch {
      alert('친구 삭제에 실패했습니다.');
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className={styles.container}>
      <h2>친구 목록</h2>

      {friends.length === 0 ? (
        <p className={styles.noFriends}>친구가 없습니다.</p>
      ) : (
        <div className={styles.friendList}>
          {friends.map((friend) => (
            <div key={friend.id} className={styles.friendCard}>
              <Link to={`/profile/${friend.toMember.id}`} className={styles.friendInfo}>
                <img
                  src={friend.toMember.avatarUrl || '/images/profile-image.jpg'}
                  alt={friend.toMember.nickname}
                  className={styles.avatar}
                />
                <span className={styles.nickname}>{friend.toMember.nickname}</span>
              </Link>

              {isOwner && (
                <button
                  onClick={() => handleRemoveFriend(friend.id)}
                  className={styles.removeBtn}
                >
                  삭제
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
