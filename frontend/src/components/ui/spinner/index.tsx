import Lottie from "lottie-react";
import spinnerAnimation from "../../../assets/lottie/spinnerAnimation.json";

const Spinner = () => {
    return (
        <div className="flex justify-center items-center min-h-screen w-full">
            <Lottie
                animationData={spinnerAnimation}
                loop
                className="w-48 h-48"
            />
        </div>
    );
};

export default Spinner;