import type { ReactNode } from 'react'

type LoginButtonProps = {
  label: string
  icon?: ReactNode
  className?: string
  labelClassName?: string
  onClick?: () => void
}

// 290 x 55 로그인 버튼. 아이콘은 왼쪽, 라벨은 버튼 중앙에 위치한다.
export default function LoginButton({
  label,
  icon,
  className = '',
  labelClassName = 'text-black',
  onClick,
}: LoginButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex h-[55px] w-[290px] shrink-0 cursor-pointer items-center rounded-[10px] transition-[filter] hover:brightness-95 active:brightness-90 ${className}`}
    >
      {icon}
      <span
        className={`pointer-events-none absolute inset-x-0 text-center font-spoqa text-[14.751px] font-medium ${labelClassName}`}
      >
        {label}
      </span>
    </button>
  )
}
