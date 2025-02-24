import { EyeClosedIcon } from '../icons/EyeClosedIcon';
import { EyeIcon } from '../icons/EyeIcon';

interface VisibilityToggleButtonProps {
    isVisible: boolean;
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
    className?: string;
}

export const VisibilityToggleButton: React.FC<VisibilityToggleButtonProps> = ({ isVisible, setIsVisible, className = '' }) => {
    return (
        <div className={`flex items-center space-x-2 ${className}`}>
            <button
                onClick={() => setIsVisible(true)}
                className={`p-3 ${isVisible ? 'bg-[#4ECDC4]' : 'bg-gray-400'} 
                        border-4 border-black rounded-full transition-all transform hover:scale-110`}
            >
                <EyeIcon className="text-black" />
            </button>
            <button
                onClick={() => setIsVisible(false)}
                className={`p-3 ${!isVisible ? 'bg-[#4ECDC4]' : 'bg-gray-400'} 
                        border-4 border-black rounded-full transition-all transform hover:scale-110`}
            >
                <EyeClosedIcon className="text-black" />
            </button>
        </div>
    );
};