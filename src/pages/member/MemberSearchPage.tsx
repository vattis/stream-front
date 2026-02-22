import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { SimpleMember } from '../../types';
import { memberApi } from '../../api/member';
import { friendshipApi } from '../../api/friendship';
import { useAuthStore } from '../../store/authStore';
import { Pagination } from '../../components/common/Pagination';
import { Loading } from '../../components/common/Loading';
import styles from './MemberSearchPage.module.css';

export function MemberSearchPage() {
  const [searchTag, setSearchTag] = useState('nickname');
  const [searchWord, setSearchWord] = useState('');
  const [members, setMembers] = useState<SimpleMember[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const { user } = useAuthStore();

  const handleSearch = async (e?: FormEvent) => {
    e?.preventDefault();
    setIsLoading(true);
    setHasSearched(true);

    try {
      const data = await memberApi.searchMembers(searchTag, searchWord, currentPage);
      setMembers(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Failed to search members:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
    setIsLoading(true);

    try {
      const data = await memberApi.searchMembers(searchTag, searchWord, page);
      setMembers(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Failed to search members:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendFriendRequest = async (memberId: number) => {
    try {
      await friendshipApi.sendFriendRequest(memberId);
      // Update local state
      setMembers(members.map((m) => (m.id === memberId ? { ...m, friendState: 'PENDING' } : m)));
      alert('친구 요청을 보냈습니다.');
    } catch {
      alert('친구 요청에 실패했습니다.');
    }
  };

  return (
    <div className={styles.container}>
      <h2>회원 검색</h2>

      <form onSubmit={handleSearch} className={styles.searchForm}>
        <select
          value={searchTag}
          onChange={(e) => setSearchTag(e.target.value)}
          className={styles.select}
        >
          <option value="nickname">닉네임</option>
          <option value="email">이메일</option>
        </select>
        <input
          type="text"
          value={searchWord}
          onChange={(e) => setSearchWord(e.target.value)}
          placeholder="검색어 입력..."
          className={styles.input}
        />
        <button type="submit" className={styles.searchBtn}>
          검색
        </button>
      </form>

      {isLoading ? (
        <Loading />
      ) : hasSearched && members.length === 0 ? (
        <p className={styles.noResults}>검색 결과가 없습니다.</p>
      ) : (
        <>
          <div className={styles.memberList}>
            {members.map((member) => (
              <div key={member.id} className={styles.memberCard}>
                <Link to={`/profile/${member.id}`} className={styles.memberInfo}>
                  <img
                    src={member.avatarUrl || '/images/profile-image.jpg'}
                    alt={member.nickname}
                    className={styles.avatar}
                  />
                  <span className={styles.nickname}>{member.nickname}</span>
                </Link>

                {user && user.id !== member.id && (
                  <div className={styles.actions}>
                    {member.friendState === 'FRIEND' ? (
                      <span className={styles.friendBadge}>친구</span>
                    ) : member.friendState === 'PENDING' ? (
                      <span className={styles.pendingBadge}>요청 대기중</span>
                    ) : (
                      <button
                        onClick={() => handleSendFriendRequest(member.id)}
                        className={styles.addFriendBtn}
                      >
                        친구 추가
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
