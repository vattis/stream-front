// Member 관련 타입
export interface Member {
  id: number;
  email: string;
  nickname: string;
  avatarUrl?: string;
}

export interface SimpleMember {
  id: number;
  nickname: string;
  avatarUrl?: string;
  friendState?: 'NONE' | 'PENDING' | 'FRIEND';
}

export interface CurrentUser {
  id: number;
  email: string;
  nickName: string;
  avatarUrl?: string;
}

// Product 관련 타입
export interface SimpleProduct {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  discountId?: number;
  discountPrice?: number;
  discountRate?: number;
}

export interface DetailProduct {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  rate?: number;
  discountDto?: {
    id: number;
    discountRate: number;
    isActive: () => boolean;
  };
  discountPrice?: number;
}

export interface ProductComment {
  id: number;
  content: string;
  rating?: number;
  createdTime: string;
  member: {
    id: number;
    nickname: string;
    avatarUrl?: string;
  };
}

// MemberGame 관련 타입
export interface MemberGame {
  gameId: number;
  gameName: string;
  gameImageUrl?: string;
  playTime: number;
  lastPlayTime: string;
}

// Comment 관련 타입
export interface ProfileComment {
  id: number;
  content: string;
  memberId: number;
  nickname: string;
  avatarUrl?: string;
  createdTime: string;
}

// Friendship 관련 타입
export interface Friendship {
  id: number;
  toMember: SimpleMember;
  avatarUrl?: string;
}

export interface FriendRequest {
  id: number;
  fromMember: SimpleMember;
  createdTime: string;
}

// Profile 관련 타입
export interface ProfileDto {
  profileMember: SimpleMember;
  simpleMemberGames: MemberGame[];
  profileCommentPage: PageResponse<ProfileComment>;
  friendships: Friendship[];
}

// Gallery 관련 타입
export interface Gallery {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
}

// Article 관련 타입
export interface Article {
  id: number;
  title: string;
  content: string;
  authorId: number;
  authorNickname: string;
  createdTime: string;
  viewCount: number;
}

// ShoppingCart 관련 타입
export interface CartItem {
  id: number;
  product: SimpleProduct;
  quantity: number;
}

// 페이지네이션
export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}

// Auth 관련 타입
export interface LoginForm {
  email: string;
  password: string;
}

export interface SignUpForm {
  email: string;
  password: string;
  passwordConfirm: string;
  nickname: string;
}

// Chat 관련 타입
export interface ChatRoom {
  id: number;
  name: string;
  participants: SimpleMember[];
}

export interface ChatMessage {
  id: number;
  content: string;
  senderId: number;
  senderNickname: string;
  createdTime: string;
}
