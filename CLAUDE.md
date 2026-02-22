# Steam Frontend

Steam을 클론한 게임 스토어 프론트엔드 프로젝트.

## Tech Stack

- **Framework**: React 19 + TypeScript 5.9
- **Build**: Vite 7.3 (port 5173)
- **Routing**: React Router DOM 7
- **State**: Zustand 5 (`src/store/`)
- **API Client**: Axios (`src/api/client.ts`, base URL: `VITE_API_URL`)
- **Data Fetching**: TanStack React Query 5
- **Styling**: CSS Modules (`.module.css`)
- **Lint**: ESLint 9

## Commands

- `npm run dev` - 개발 서버 실행 (port 5173)
- `npm run build` - TypeScript 컴파일 + Vite 빌드
- `npm run lint` - ESLint 실행
- `npm run preview` - 빌드 결과 프리뷰

## Project Structure

```
src/
├── api/          # API 호출 함수 (도메인별 분리)
│   ├── client.ts # Axios 인스턴스 (인터셉터, 401 처리)
│   ├── auth.ts   # 로그인, 회원가입, 이메일 인증
│   ├── product.ts
│   ├── cart.ts
│   ├── member.ts
│   ├── friendship.ts
│   ├── gallery.ts
│   └── article.ts
├── components/
│   ├── common/   # GameCard, Loading, Pagination, SearchBar, StarRating
│   └── layout/   # Layout, Navbar
├── pages/        # 페이지 컴포넌트 (도메인별 폴더)
├── store/        # Zustand 스토어 (authStore, cartStore)
├── styles/       # global.css
├── types/        # TypeScript 타입 정의
└── App.tsx       # 라우팅 설정 (Public/Auth/Protected routes)
```

## Key Patterns

- **API**: Axios + withCredentials (쿠키 기반 세션). 일부 엔드포인트는 `application/x-www-form-urlencoded` 사용
- **Auth**: `useAuthStore`로 인증 상태 관리. `ProtectedRoute`/`AuthRoute` 래퍼 컴포넌트로 라우트 보호
- **Proxy**: Vite dev server에서 `/api`, `/sign-in`, `/sign-up`, `/log-out`, `/auth` 등을 백엔드(localhost:8080)로 프록시
- **삭제 API**: 일부 삭제는 POST + `_method=delete` 패턴 사용 (productComment, profileComment)

## Backend API Base Paths

- Auth: `/sign-in`, `/sign-up`, `/log-out`, `/auth`, `/api/me`
- Product: `/api/shop/products`, `/api/product/{id}`, `/api/product/search`
- Cart: `/api/shoppingCart`, `/api/order/checkout`
- Member: `/api/profile/{id}`, `/api/library/{id}`, `/api/members`
- Friendship: `/api/friendships/{id}`, `/api/friendships/request`, `/api/friendships/accept`, `/api/friendships/reject`
- Gallery: `/api/galleries`, `/api/gallery/{id}`
- Article: `/api/article/{id}`, `/api/article/search`
- Comments: `/productComment/{id}`, `/profileComment`, `/api/article/{id}/comment`
