import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-black text-center p-8">
      <div
        className={`relative inline-block border-4 border-black rounded-lg transition-all duration-300 ${hovered ? "bg-personalizedGreen" : "bg-personalizedPurple"
          }`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: "80vw",
          height: "auto",
          maxWidth: "800px",
        }}
      >
        <div className="text-center items-center justify-center flex flex-col h-full p-6">
          <span className="relative z-10 text-4xl sm:text-5xl font-bold my-6">
            👋 Welcome to Moneymgr!
          </span>
          <p className="text-base sm:text-lg mt-4">
            {hovered
              ? "Get ready to take control of your finances."
              : "You're all set! Here's what you can do:"}
          </p>
          <ul className="my-6 text-left text-sm sm:text-base px-4 list-none">
            <li>💵 Track income and expenses</li>
            <li>📅 View transactions by day, week, month, or year</li>
            <li>💳 Manage multiple accounts</li>
            <li>🔒 Your data is secure and private</li>
          </ul>
        </div>
      </div>
      <button
        onClick={() => navigate("/")}
        className="mt-6 px-6 py-3 text-lg font-semibold text-black bg-personalizedPink border-4 border-black rounded-lg transition-all duration-300 hover:bg-personalizedOrange hover:text-black sm:px-4 sm:py-2"
      >
        🚀 Let's Start
      </button>
    </div>
  );
};

export default Welcome;