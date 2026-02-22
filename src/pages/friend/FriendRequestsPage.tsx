import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FriendRequest } from '../../types';
import { friendshipApi } from '../../api/friendship';
import { Loading } from '../../components/common/Loading';
import styles from './FriendRequestsPage.module.css';

export function FriendRequestsPage() {
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await friendshipApi.getReceivedRequests();
        setRequests(data);
      } catch (error) {
        console.error('Failed to fetch friend requests:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleAccept = async (requestId: number) => {
    try {
      await friendshipApi.acceptFriendRequest(requestId);
      setRequests(requests.filter(r => r.id !== requestId));
      alert('친구 요청을 수락했습니다.');
    } catch {
      alert('요청 수락에 실패했습니다.');
    }
  };

  const handleReject = async (requestId: number) => {
    try {
      await friendshipApi.rejectFriendRequest(requestId);
      setRequests(requests.filter(r => r.id !== requestId));
    } catch {
      alert('요청 거절에 실패했습니다.');
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className={styles.container}>
      <h2>받은 친구 요청</h2>

      {requests.length === 0 ? (
        <p className={styles.noRequests}>받은 친구 요청이 없습니다.</p>
      ) : (
        <div className={styles.requestList}>
          {requests.map((request) => (
            <div key={request.id} className={styles.requestCard}>
              <Link to={`/profile/${request.fromMember.id}`} className={styles.userInfo}>
                <img
                  src={request.fromMember.avatarUrl || '/images/profile-image.jpg'}
                  alt={request.fromMember.nickname}
                  className={styles.avatar}
                />
                <div className={styles.userDetails}>
                  <span className={styles.nickname}>{request.fromMember.nickname}</span>
                  <span className={styles.date}>
                    {new Date(request.createdTime).toLocaleDateString('ko-KR')}
                  </span>
                </div>
              </Link>

              <div className={styles.actions}>
                <button
                  onClick={() => handleAccept(request.id)}
                  className={styles.acceptBtn}
                >
                  수락
                </button>
                <button
                  onClick={() => handleReject(request.id)}
                  className={styles.rejectBtn}
                >
                  거절
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
