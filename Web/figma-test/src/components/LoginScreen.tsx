import appleLogo from '../assets/login/apple-logo.png'
import arrowLeft from '../assets/login/arrow-left-short.svg'
import dividerLeft from '../assets/login/divider-left.svg'
import dividerRight from '../assets/login/divider-right.svg'
import googleLogo from '../assets/login/google-logo.svg'
import naverLogo from '../assets/login/naver-logo.png'
import tidLogo from '../assets/login/tid-logo.png'
import KakaoLoginButton from './kakao-login/KakaoLoginButton'
import LoginButton from './LoginButton'
import StatusBar from './StatusBar'

export type LoginProvider = 'phone' | 'tid' | 'naver' | 'google' | 'kakao' | 'apple'

type LoginScreenProps = {
  onBack?: () => void
  onSelect?: (provider: LoginProvider) => void
}

const outlined = 'border-[1.844px] border-line bg-white'

export default function LoginScreen({
  onBack,
  onSelect = (provider) => console.log(`login with ${provider}`),
}: LoginScreenProps) {
  return (
    <div className="relative h-[812px] w-[375px] overflow-hidden bg-screen">
      <StatusBar />

      <button
        type="button"
        aria-label="뒤로 가기"
        onClick={onBack}
        className="absolute top-[67px] left-[25px] cursor-pointer"
      >
        <img src={arrowLeft} alt="" width={27.32} height={27.32} />
      </button>

      <h1 className="absolute top-[127px] left-[32px] font-spoqa text-[20px] leading-[33.064px] font-bold tracking-[-0.0737px] text-black">
        가장 편한 방법으로
        <br />
        시작해 보세요!
      </h1>

      <p className="absolute top-[213.91px] left-[37.67px] font-spoqa text-[13.226px] leading-[18.894px] font-medium tracking-[-0.0737px] text-sub">
        <span className="text-brand-point">1분</span> 이면 회원가입 가능해요
      </p>

      <div className="absolute top-[264.48px] left-[43.16px] flex w-[290px] flex-col items-center gap-[20.282px]">
        <LoginButton
          label="휴대폰 번호로 계속하기"
          className="bg-brand"
          labelClassName="text-black leading-[18.438px] tracking-[-0.0719px]"
          onClick={() => onSelect('phone')}
        />

        {/* 또는 구분선 */}
        <div className="relative h-[18.438px] w-[285.269px]">
          <img
            src={dividerLeft}
            alt=""
            width={116.801}
            height={0.922}
            className="absolute top-[7.72px] left-0 rotate-[0.28deg]"
          />
          <span className="absolute left-[126.02px] font-spoqa text-[12.907px] leading-[18.438px] font-medium tracking-[-0.0719px] text-sub">
            또는
          </span>
          <img
            src={dividerRight}
            alt=""
            width={120.531}
            height={0.92}
            className="absolute top-[7.72px] left-[164.74px] rotate-[-0.28deg]"
          />
        </div>

        <LoginButton
          label="T ID로 로그인"
          className={outlined}
          onClick={() => onSelect('tid')}
          icon={
            <span className="relative ml-[12px] h-[27.6px] w-[24.02px] overflow-hidden">
              <img
                src={tidLogo}
                alt=""
                className="absolute top-[-77.26%] left-[-96.91%] h-[256.22%] w-[294.41%] max-w-none"
              />
            </span>
          }
        />

        <LoginButton
          label="Naver로 로그인"
          className="bg-naver drop-shadow-[0px_16.731px_15.536px_rgba(0,0,0,0.07)]"
          labelClassName="text-white"
          onClick={() => onSelect('naver')}
          icon={
            <span className="relative mt-[1.86px] ml-[17.52px] h-[17.517px] w-[20.282px] overflow-hidden">
              <img
                src={naverLogo}
                alt=""
                className="absolute top-[-52.63%] left-[-59.09%] h-[205.26%] w-[212.86%] max-w-none"
              />
            </span>
          }
        />

        <LoginButton
          label="Google로 로그인"
          className={outlined}
          onClick={() => onSelect('google')}
          icon={
            <span className="relative ml-[12px] size-[21.907px] bg-white">
              <img
                src={googleLogo}
                alt=""
                width={20.995}
                height={20.995}
                className="absolute top-[0.46px] left-[0.46px]"
              />
            </span>
          }
        />

        <KakaoLoginButton className="font-spoqa" onClick={() => onSelect('kakao')} />

        <LoginButton
          label="Apple로 로그인"
          className="bg-black"
          labelClassName="text-white"
          onClick={() => onSelect('apple')}
          icon={
            <span className="relative ml-[13.83px] h-[27.69px] w-[23.021px] overflow-hidden">
              <img
                src={appleLogo}
                alt=""
                className="absolute top-[-20.37%] left-[-85.63%] h-[159.25%] w-[288.45%] max-w-none"
              />
            </span>
          }
        />
      </div>
    </div>
  )
}
