import batteryIcon from '../assets/login/status-battery.svg'
import signalIcon from '../assets/login/status-signal.svg'
import wifiIcon from '../assets/login/status-wifi.svg'

type StatusBarProps = {
  time?: string
}

// iOS 상태 표시줄 (디자인 목업용)
export default function StatusBar({ time = '9:41' }: StatusBarProps) {
  return (
    <div className="flex h-[47px] items-start justify-between px-[19px]">
      <p className="mt-[15px] w-[54px] text-center font-sf text-[16px] leading-[21px] font-semibold tracking-[-0.32px] text-black">
        {time}
      </p>
      <div className="mt-[19px] flex items-center gap-[7.5px]">
        <img src={signalIcon} alt="" width={18} height={12} className="mt-px" />
        <img src={wifiIcon} alt="" width={17} height={11.834} className="mt-px" />
        <img src={batteryIcon} alt="" width={27.401} height={13} />
      </div>
    </div>
  )
}
