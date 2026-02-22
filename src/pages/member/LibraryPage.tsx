import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MemberGame } from '../../types';
import { memberApi } from '../../api/member';
import { useAuthStore } from '../../store/authStore';
import { Loading } from '../../components/common/Loading';
import styles from './LibraryPage.module.css';

export function LibraryPage() {
  const { memberId, selectedGameId } = useParams<{ memberId: string; selectedGameId?: string }>();
  const [games, setGames] = useState<MemberGame[]>([]);
  const [selectedGame, setSelectedGame] = useState<MemberGame | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useAuthStore();

  useEffect(() => {
    const fetchLibrary = async () => {
      if (!memberId) return;

      // 본인의 라이브러리만 접근 가능
      if (user && user.id !== Number(memberId)) {
        setIsLoading(false);
        return;
      }

      try {
        const libraryGames = await memberApi.getLibrary(Number(memberId));
        setGames(libraryGames);

        if (selectedGameId) {
          const game = await memberApi.getLibraryGame(Number(memberId), Number(selectedGameId));
          setSelectedGame(game);
        }
      } catch (error) {
        console.error('Failed to fetch library:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLibrary();
  }, [memberId, selectedGameId, user]);

  if (isLoading) {
    return <Loading />;
  }

  if (user && user.id !== Number(memberId)) {
    return (
      <div className={styles.container}>
        <p>접근 권한이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className={styles.library}>
      {/* 게임 목록 사이드바 */}
      <div className={styles.sidebar}>
        <h3>내 게임</h3>
        {games.length === 0 ? (
          <p className={styles.noGames}>보유한 게임이 없습니다.</p>
        ) : (
          <ul className={styles.gameList}>
            {games.map((game) => (
              <li key={game.gameId}>
                <Link
                  to={`/library/${memberId}/${game.gameId}`}
                  className={`${styles.gameItem} ${
                    selectedGame?.gameId === game.gameId ? styles.active : ''
                  }`}
                >
                  <img
                    src={game.gameImageUrl || '/images/game-image.jpeg'}
                    alt={game.gameName}
                  />
                  <span>{game.gameName}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 선택된 게임 상세 */}
      <div className={styles.content}>
        {selectedGame ? (
          <div className={styles.gameDetail}>
            <img
              src={selectedGame.gameImageUrl || '/images/game-image.jpeg'}
              alt={selectedGame.gameName}
              className={styles.gameImage}
            />
            <div className={styles.gameInfo}>
              <h2>{selectedGame.gameName}</h2>
              <p className={styles.stat}>
                <strong>플레이 시간:</strong> {selectedGame.playTime}시간
              </p>
              <p className={styles.stat}>
                <strong>마지막 플레이:</strong>{' '}
                {new Date(selectedGame.lastPlayTime).toLocaleString('ko-KR')}
              </p>
              <Link to={`/product/${selectedGame.gameId}`} className={styles.storeLink}>
                상점 페이지로 이동
              </Link>
            </div>
          </div>
        ) : (
          <div className={styles.placeholder}>
            <p>왼쪽에서 게임을 선택하세요.</p>
          </div>
        )}
      </div>
    </div>
  );
}
