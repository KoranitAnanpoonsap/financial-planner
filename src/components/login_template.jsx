import logo from "../assets/TFPA_logo.png"
import wallpaper from "../assets/login_wallpaper.jpg"

export default function LoginTemplate({ children }) {
  return (
    <div className="relative w-full h-screen bg-[#003375] overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white drop-shadow-2xl z-10">
        <div
          className="w-[306.67px] h-[65px] bg-no-repeat bg-contain"
          style={{ backgroundImage: `url(${logo})` }}
        />
      </header>

      {/* Background Image */}
      <div
        className="absolute top-110 w-full h-full bg-cover bg-center opacity-35 z-0"
        style={{
          backgroundImage: `url(${wallpaper})`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        {children} {/* This allows the component to render custom content */}
      </div>
    </div>
  )
}
