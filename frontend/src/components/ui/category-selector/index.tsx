import React, { useState, useEffect, useRef } from "react";
import { useCategories } from "../../../context/categories-context";
import { Category, CategoryType } from "../../categories/interface-category";

interface CategorySelectorProps {
    selectedCategoryId: number | null;
    onCategoryChange: (categoryId: number) => void;
    type: CategoryType;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
    selectedCategoryId,
    onCategoryChange,
    type
}) => {
    const { categories, loading, error } = useCategories();
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const categorySelectorRef = useRef<HTMLDivElement | null>(null);

    const filteredCategories = categories.filter((category) => category.type === type);

    useEffect(() => {
        const category = filteredCategories.find((c) => c.id === selectedCategoryId) || null;
        setSelectedCategory(category);
    }, [selectedCategoryId, filteredCategories]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (categorySelectorRef.current && !categorySelectorRef.current.contains(event.target as Node)) {
                setIsEditing(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleClick = () => {
        setIsEditing((prev) => !prev);
    };

    const handleCategorySelect = (category: Category) => {
        setSelectedCategory(category);
        onCategoryChange(category.id);
        setIsEditing(false);
    };

    return (
        <div className="relative flex flex-col items-center" ref={categorySelectorRef}>
            <button
                className="w-full sm:w-[28rem] h-20 bg-[#4ECDC4] border-4 border-black rounded-2xl text-black font-bold text-lg flex items-center justify-center cursor-pointer hover:scale-105 transition-all overflow-hidden"
                onClick={handleClick}
            >
                {selectedCategory ? (
                <>
                    <span className="mr-6 text-xl">Category:</span> 
                    <span className="text-black text-4xl">{selectedCategory.name}</span>
                </>
            ) : (
                <span className="text-xl">Choose a category</span>
            )}
            </button>

            {isEditing && (
                <div className="absolute top-14 left-1/2 transform -translate-x-1/2 w-full sm:w-56 bg-white border-4 border-black rounded-lg shadow-lg max-h-60 overflow-y-auto z-20">
                    {loading ? (
                        <p className="text-center p-4">Loading categories...</p>
                    ) : error ? (
                        <p className="text-center p-4 text-red-500">Error loading categories.</p>
                    ) : filteredCategories.length > 0 ? (
                        filteredCategories.map((category) => (
                            <div
                                key={category.id}
                                className="flex items-center gap-4 p-3 hover:bg-gray-200 cursor-pointer"
                                onClick={() => handleCategorySelect(category)}
                            >
                                <category.icon className="w-6 h-6" />
                                <span className="text-lg font-semibold">{category.name}</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-center p-4">No categories found.</p>
                    )}
                </div>
            )}
        </div>
    );
};