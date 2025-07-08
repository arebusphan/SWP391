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
      {/* Padding top để tránh bị Navbar che */}
      <div className="h-[96px]" />

      <div className="relative z-10">
        <div className="min-h-40 mb-20">
          <Banner />
        </div>

        <h2 className="text-4xl font-bold py-10 px-5 text-black drop-shadow-lg text-center">
          News
        </h2>

        <div className="min-h-100 w-full">
          <News />
        </div>
      </div>

      {/* ✅ Khoảng trắng để tạo cách biệt với footer */}
      <div className="h-24" />
    </div>
  );
};

export default HomePage;
