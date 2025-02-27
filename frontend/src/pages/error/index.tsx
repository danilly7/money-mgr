import { Link } from "react-router-dom";
import { useState } from "react";

const ErrorPage = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-black text-center p-8">
      <div
        className={`relative inline-block border-4 border-black rounded-lg transition-all duration-300 ${hovered ? "bg-personalizedOrange" : "bg-personalizedPurple"
          }`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: "80vw",
          height: "40vh",
          maxWidth: "600px",
          maxHeight: "400px",
        }}
      >
        <div className="text-center items-center justify-center flex flex-col h-full">
          <span className="relative z-10 text-6xl sm:text-7xl lg:text-8xl font-bold">
            {hovered ? "DRAMA" : "404"}
          </span>
          <p className="text-lg sm:text-xl lg:text-2xl mt-4">
            {hovered ? "Looks like you're lost in the void." : "Oops! Page not found."}
          </p>
        </div>
      </div>
      <Link
        to="/"
        className="mt-6 px-6 py-3 text-lg font-semibold text-black bg-personalizedPink border-4 border-black rounded-lg transition-all duration-300 hover:bg-personalizedGreen hover:text-black sm:px-4 sm:py-2"
      >
        Take Me Home
      </Link>
    </div>
  );
};

export default ErrorPage;