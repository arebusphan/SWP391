import Banner from "../components/forhp/Banner";
import News from "../components/forhp/News";

const HomePage = () => {
    return (
        <div
            className="relative bg-cover bg-center bg-no-repeat bg-fixed min-h-screen"
            style={{
                backgroundImage: "url('/back.png')",
            }}
        >
          
            <div className="relative z-10 ">
                <div className="min-h-40">
                    <Banner />
                </div>

                <h2 className="text-4xl font-bold py-10 px-5 text-black drop-shadow-lg">
                    News
                </h2>

                <div className="min-h-100 w-full">
                    <News />
                </div>
            </div>
        </div>
    );
};

export default HomePage;
