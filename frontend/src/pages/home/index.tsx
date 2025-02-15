const Home = () => {
    const loremText = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque, sint nisi consequatur error eveniet, similique temporibus, eius accusamus est voluptas quos velit laboriosam modi ut expedita doloribus incidunt veritatis. Veritatis.";

    const repeatCount = 40;

    const repeatedText = new Array(repeatCount).fill(loremText);

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <h1 className="text-4xl font-bold">Welcome to Money Manager</h1>

            <p className="text-lg">Manage your money in a simple way</p>
            
            {repeatedText.map((text, index) => (
                <p key={index}>{text}</p>
            ))}
        </div>
    );
};

export default Home;