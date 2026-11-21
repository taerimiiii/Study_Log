import type { ButtonHTMLAttributes } from 'react'
import kakaoChat from './kakao-chat.svg'
import kakaoCircle from './kakao-circle.svg'

/**
 * 카카오 로그인 버튼 (Figma: 로그인 회원가입 / 1455:77059)
 *
 * - 이 폴더(KakaoLoginButton.tsx + svg 2개)만 복사하면 동작한다.
 * - Tailwind CSS만 필요하며, 프로젝트 테마 토큰에는 의존하지 않는다.
 * - 기본 크기는 디자인 그대로 290 x 55. className으로 덮어쓸 수 있다 (예: "w-full").
 */
type KakaoLoginButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  label?: string
}

export default function KakaoLoginButton({
  label = '카카오로 로그인',
  className = '',
  type = 'button',
  ...rest
}: KakaoLoginButtonProps) {
  return (
    <button
      type={type}
      className={`relative flex h-[55px] w-[290px] shrink-0 cursor-pointer items-center rounded-[10px] bg-[#ffdc00] transition-[filter] hover:brightness-95 active:brightness-90 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...rest}
    >
      {/* 노란 원 + 말풍선 아이콘 */}
      <span aria-hidden className="relative ml-[11.5px] size-[27.658px]">
        <img src={kakaoCircle} alt="" width={27.658} height={27.658} />
        <img
          src={kakaoChat}
          alt=""
          width={17.286}
          height={15.903}
          className="absolute top-[5.53px] left-[4.84px]"
        />
      </span>

      <span className="pointer-events-none absolute inset-x-0 text-center text-[14.751px] font-medium text-black">
        {label}
      </span>
    </button>
  )
}
