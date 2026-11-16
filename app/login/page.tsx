import { login } from "./_actions";

export default function LoginPage() {
  return (
    <form action={login}>
      <input type="text" name="email" placeholder="이메일" required />
      <input type="password" name="password" placeholder="비밀번호" required />
      <button type="submit">로그인</button>
    </form>
  );
}
