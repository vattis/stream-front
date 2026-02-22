import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../api/auth';
import styles from './SignupPage.module.css';

export function SignupPage() {
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const [authCode, setAuthCode] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [showAuthSection, setShowAuthSection] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [emailSuccess, setEmailSuccess] = useState('');
  const [authError, setAuthError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const sendAuthEmail = async () => {
    if (!email) {
      setEmailError('이메일을 입력해주세요.');
      setEmailSuccess('');
      return;
    }

    setIsSending(true);
    setEmailError('');

    try {
      await authApi.sendAuthEmail(email);
      setEmailSuccess('인증번호가 전송되었습니다.');
      setShowAuthSection(true);
    } catch {
      setEmailError('인증번호 전송에 실패했습니다.');
    } finally {
      setIsSending(false);
    }
  };

  const verifyAuthCode = async () => {
    if (!authCode || authCode.length !== 6) {
      setAuthError('6자리 인증번호를 입력해주세요.');
      return;
    }

    setIsVerifying(true);
    setAuthError('');

    try {
      const isValid = await authApi.checkAuthCode(email, authCode);
      if (isValid) {
        setIsEmailVerified(true);
        setShowAuthSection(false);
        setEmailSuccess('');
      } else {
        setAuthError('인증번호가 일치하지 않습니다.');
      }
    } catch {
      setAuthError('인증 확인에 실패했습니다.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!isEmailVerified) {
      alert('이메일 인증을 완료해주세요.');
      return;
    }

    if (password !== passwordConfirm) {
      setPasswordError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setPasswordError('');
    setIsSubmitting(true);

    try {
      await authApi.signUp({ email, password, passwordConfirm, nickname });
      navigate('/login');
    } catch {
      alert('회원가입에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = isEmailVerified && password && passwordConfirm && nickname;

  return (
    <div className={styles.container}>
      <div className={styles.signupBox}>
        <h2>회원가입</h2>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">이메일</label>
          <div className={styles.inputRow}>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isEmailVerified}
              className={styles.input}
            />
            {!isEmailVerified && (
              <button
                type="button"
                onClick={sendAuthEmail}
                disabled={isSending}
                className={styles.btnSmall}
              >
                {isSending ? '전송 중...' : showAuthSection ? '재전송' : '인증하기'}
              </button>
            )}
          </div>
          {emailError && <span className={styles.errorMessage}>{emailError}</span>}
          {emailSuccess && <span className={styles.successMessage}>{emailSuccess}</span>}
          {isEmailVerified && <div className={styles.verifiedBadge}>✓ 이메일 인증 완료</div>}

          {showAuthSection && (
            <div className={styles.authSection}>
              <label htmlFor="authCode">인증번호</label>
              <div className={styles.inputRow}>
                <input
                  type="text"
                  id="authCode"
                  value={authCode}
                  onChange={(e) => setAuthCode(e.target.value)}
                  placeholder="6자리 인증번호 입력"
                  maxLength={6}
                  className={styles.input}
                />
                <button
                  type="button"
                  onClick={verifyAuthCode}
                  disabled={isVerifying}
                  className={styles.btnSmall}
                >
                  {isVerifying ? '확인 중...' : '확인'}
                </button>
              </div>
              {authError && <span className={styles.errorMessage}>{authError}</span>}
            </div>
          )}

          <label htmlFor="nickname">닉네임</label>
          <input
            type="text"
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
            className={styles.input}
          />

          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
          />

          <label htmlFor="passwordConfirm">비밀번호 확인</label>
          <input
            type="password"
            id="passwordConfirm"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            required
            className={styles.input}
          />
          {passwordError && <span className={styles.errorMessage}>{passwordError}</span>}

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? '가입 중...' : '가입하기'}
          </button>
        </form>

        <div className={styles.loginLink}>
          이미 계정이 있으신가요? <Link to="/login">로그인</Link>
        </div>
      </div>
    </div>
  );
}
