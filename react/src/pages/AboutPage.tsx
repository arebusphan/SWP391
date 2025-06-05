const AboutPage = () => {
    return (

        <div className="bg-background text-foreground min-h-screen flex flex-col items-center justify-center px-6 py-12">
            <div className="text-center max-w-3xl space-y-6">
             
                <h2 className="text-lg text-primary font-medium">About Us</h2>
                <h1 className="text-4xl font-bold">Chào mừng bạn đến với hệ thống Y tế học đường</h1>
                <p className="text-muted-foreground text-base">
                    Chúng tôi cung cấp nền tảng số hiện đại giúp nhà trường dễ dàng quản lý thông tin sức khỏe học sinh, theo dõi khám bệnh, lịch tiêm chủng và bệnh học đường. Hệ thống còn hỗ trợ báo cáo định kỳ và đồng bộ với cơ quan y tế.
                </p>
                <button className="mt-4 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-green-600 transition">
                    Tìm hiểu thêm
                </button>
            </div>

        
            <div className="mt-10 w-full max-w-xl">
                <img
                    src="/public/school-health-illustration.png" 
                    alt="School Health Illustration"
                    className="w-full h-auto rounded-lg shadow-md"
                />
            </div>
        </div>
    );
};

export default AboutPage;
