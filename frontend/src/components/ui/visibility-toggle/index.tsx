import { EyeClosedIcon } from '../icons/EyeClosedIcon';
import { EyeIcon } from '../icons/EyeIcon';

interface VisibilityToggleButtonProps {
    isVisible: boolean;
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const VisibilityToggleButton: React.FC<VisibilityToggleButtonProps> = ({ isVisible, setIsVisible }) => {
    return (
        <div className="flex items-center space-x-2">
            <button
                onClick={() => setIsVisible(true)}
                className={`p-2 ${isVisible ? 'bg-personalizedGreen' : 'bg-gray-300'} 
                        border-4 border-black rounded-full transition-all transform hover:scale-110`}
            >
                <EyeIcon className="text-black" />
            </button>
            <button
                onClick={() => setIsVisible(false)}
                className={`p-2 ${!isVisible ? 'bg-[#FF6B6B]' : 'bg-gray-300'} 
                        border-4 border-black rounded-full transition-all transform hover:scale-110`}
            >
                <EyeClosedIcon className="text-black" />
            </button>
        </div>
    );
};