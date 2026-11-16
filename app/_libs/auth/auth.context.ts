"use client";

import { createContext } from "react";

export type UserModel = {
  id: string;
  email: string;
  // TODO: 백엔드 응답에 맞춰 채우기
};

// 토큰은 httpOnly 쿠키에 있고 서버가 관리한다.
// 여기선 서버가 내려준 유저 정보를 클라이언트 트리에 공유하는 역할만 한다.
export const UserContext = createContext<UserModel | undefined>(undefined);
