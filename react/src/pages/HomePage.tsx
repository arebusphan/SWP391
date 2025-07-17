import AboutSection from "../components/AboutSection";
import Banner from "../components/forhp/Banner";
import News from "../components/forhp/News";
import ViewBlog from "./ViewBlog";

const HomePage = () => {
    return (
       
        <div className="relative min-h-screen overflow-hidden bg-gray-100">
        
            <div
                className="
          pointer-events-none absolute inset-0
          bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))]
          from-white/60 via-gray-100/80 to-gray-300/90
          shadow-[inset_0_-30px_60px_-10px_rgba(0,0,0,0.15)]
        "
            />

          
            <div className="h-[96px]" />

          
            <div className="relative z-10">
                <div className="min-h-40 mb-20 bg-blue-50             
    border-4 border-blue-300 
    rounded-2xl shadow-xl  ">
                    <Banner />
                </div>

              
                <div
                    className="
    bg-blue-50             
    border-4 border-blue-300 
    rounded-2xl shadow-xl  
mb-20
  
  
  "
                >
                    <div>   <AboutSection />  </div>
                </div>
                <div
                    className="
    bg-blue-50             
    border-4 border-blue-300 
    rounded-2xl shadow-xl  
mb-20
  
  
  "
                >
                    <h2 className="text-4xl font-bold py-10 px-5 text-blue-900 drop-shadow-md text-center">
                        Blog
                    </h2>
                    <div className="min-h-100 w-full">
                        <ViewBlog /> 
                    </div>
                  
                </div>
                <div
                    className="
    bg-blue-50             
    border-4 border-blue-300 
    rounded-2xl shadow-xl  

  "
                >
                <h2 className="text-4xl font-bold py-10 px-5 text-blue-900 drop-shadow-md text-center">
                    News
                </h2>
                <div className="min-h-100 w-full">
                    <News />
                </div>
            </div>
            </div>
            <div className="h-24" />
        </div>
    );
};

export default HomePage;
