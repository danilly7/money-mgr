export const BackButton = () => {
    const goBack = () => {
        window.history.back();
    };

    return (
        <button
            onClick={goBack}
            className="absolute top-[5.5rem] left-2 w-14 h-14 bg-personalizedPink text-black font-extrabold border-4 border-black text-2xl 
        hover:bg-personalizedOrange rounded-full flex items-center justify-center transition-all duration-300 z-50"
            aria-label="Go back"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-arrow-left"
            >
                <path d="M19 12H5" />
                <path d="M12 19l-7-7 7-7" />
            </svg>
        </button>
    );
};