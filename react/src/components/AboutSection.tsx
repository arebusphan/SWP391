const AboutSection = () => {
    return (
        <section className="my-24 px-4 md:px-8 lg:px-16">
            <div className="flex flex-col md:flex-row items-center gap-10">
                
                <div className="
      bg-blue-50 rounded-2xl
      shadow-md px-6 py-10 text-center animate-fade-in
      border-4 border-blue-400    
      overflow-y-auto
md:w-1/2
    ">
                    <h3 className="text-4xl font-bold mb-6 text-blue-900">About&nbsp;Us</h3>

                    <p className="text-gray-700 text-lg leading-relaxed mb-4">
                        At <strong>EduHealth Connect</strong>, we believe that every child deserves to learn in a safe, healthy environment — and that modern technology can be a powerful ally in making this a reality.
                    </p>

                    <p className="text-gray-700 text-lg leading-relaxed mb-4">
                        Our journey began in early 2024 with a simple but important question: "Why do schools still use paper to track student health, while everything else is digital?" From that idea, our multidisciplinary team of developers, nurses, and educators came together to build a solution.
                    </p>

                    <p className="text-gray-700 text-lg leading-relaxed mb-4">
                        EduHealth Connect is a school health management platform designed to centralize and simplify the way health information is shared between parents, school nurses, and administrators. From daily symptom check-ins to emergency incident reports, from vaccination tracking to medicine management, we make it easy, secure, and real-time.
                    </p>

                    <p className="text-gray-700 text-lg leading-relaxed mb-4">
                        Our platform has been built with real-world constraints in mind. Not every school has perfect internet or dedicated IT staff, so we made EduHealth lightweight and mobile-friendly. Whether you're a school nurse logging an incident, a teacher reporting symptoms, or a parent checking updates, the system works intuitively across any device.
                    </p>

                    <p className="text-gray-700 text-lg leading-relaxed mb-4">
                        Security and privacy are central to our mission. We use encrypted data storage, role-based access control, and clear parental consent mechanisms to ensure that every student’s health information is handled with care and responsibility.
                    </p>

                    <p className="text-gray-700 text-lg leading-relaxed mb-4">
                        Since our initial pilot, EduHealth has been successfully implemented in over 15 schools across Vietnam, serving more than 12,000 students. These schools have reported faster response times to health issues, reduced paperwork, and improved communication between school and home.
                    </p>

                   
                </div>


               
                <div className="w-full md:w-1/2 animate-fade-in delay-150">
                    <img
                        src="Blue and White Geometric Health Medical Services Banner Landscape.png"
                        alt="Team working together"
                        className="rounded-2xl shadow-xl object-cover w-full  md:h-[450px]"
                    />
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
