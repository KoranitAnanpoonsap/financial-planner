import logo from "../assets/TFPA_logo.png"

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 bg-white drop-shadow-md z-10">
      <div
        className="w-[306.67px] h-[65px] bg-no-repeat bg-contain"
        style={{ backgroundImage: `url(${logo})` }}
      />
    </header>
  )
}
