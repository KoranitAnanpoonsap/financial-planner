import LoginTemplate from "../components/login_template.jsx"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

const pageVariants = {
  initial: {
    opacity: 0,
  },
  in: {
    opacity: 1,
  },
  out: {
    opacity: 1,
  },
}

const pageTransition = {
  type: "tween", // Smooth tweening for more fluid motion
  ease: "easeInOut", // Easing function for a smoother transition
  duration: 0.3, // Longer duration for a more relaxed effect
}

export default function LoginSelection() {
  const navigate = useNavigate()

  return (
    <LoginTemplate>
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
      >
        <div
          className="bg-white rounded-[25px] p-10 shadow-lg max-w-md w-full text-center"
          style={{ marginTop: "-50px" }}
        >
          {/* Login Title */}
          <h1 className="text-tfpa_blue font-bold text-3xl mb-8 uppercase font-ibm">
            เข้าสู่ระบบ
          </h1>

          {/* Buttons */}
          <div className="space-y-4">
            <button
              className="w-52 py-4 bg-tfpa_gold hover:bg-tfpa_gold_hover rounded-2xl transition-colors font-ibm text-white"
              onClick={() => navigate("/client-login")}
            >
              แบบลูกค้า
            </button>
            <button
              className="w-52 py-4 bg-tfpa_gold hover:bg-tfpa_gold_hover rounded-2xl transition-colors font-ibm text-white"
              onClick={() => navigate("/planner-login")}
            >
              แบบนักวางทางการเงิน
            </button>
            <button
              className="w-52 py-4 bg-tfpa_gold hover:bg-tfpa_gold_hover rounded-2xl transition-colors font-ibm text-white"
              onClick={() => navigate("/admin-login")}
            >
              แบบแอดมิน
            </button>
          </div>
        </div>
      </motion.div>
    </LoginTemplate>
  )
}
