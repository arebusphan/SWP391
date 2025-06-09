import { useEffect, useState } from "react";
import { getBanners, postBanner } from "../../service/serviceauth";
import { useAuth } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Upload, Image as ImageIcon } from "lucide-react";

interface BannerItem {
    id: number;
    title: string;
    imageUrl: string;
}

function Banner() {
    const { user } = useAuth();
    const [banners, setBanners] = useState<BannerItem[]>([]);
    const [title, setTitle] = useState("");
    const [image, setImage] = useState("");
    const [loadingUpload, setLoadingUpload] = useState(false);
    const [loadingPost, setLoadingPost] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const [isSwipeDragging, setIsSwipeDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [currentX, setCurrentX] = useState(0);
    const [dragOffset, setDragOffset] = useState(0);

    const handleFileUpload = async (file: File) => {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "swp391");
        data.append("cloud_name", "demmylzob");

        try {
            setLoadingUpload(true);
            setError(null);
            const res = await fetch("https://api.cloudinary.com/v1_1/demmylzob/image/upload", {
                method: "POST",
                body: data,
            });
            if (!res.ok) throw new Error("Upload ảnh thất bại");
            const uploaded = await res.json();
            setImage(uploaded.secure_url);
        } catch (err) {
            setError("Lỗi khi upload ảnh");
            console.error(err);
        } finally {
            setLoadingUpload(false);
        }
    };

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        await handleFileUpload(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);

        const files = e.dataTransfer.files;
        if (files && files[0]) {
            const file = files[0];

            // Kiểm tra loại file
            if (!file.type.startsWith('image/')) {
                setError("Vui lòng chỉ tải lên file ảnh");
                return;
            }

            await handleFileUpload(file);
        }
    };

    // Swipe/Drag handlers for banner navigation
    const handleSwipeStart = (e: React.MouseEvent | React.TouchEvent) => {
        setIsSwipeDragging(true);
        setIsPaused(true);
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        setStartX(clientX);
        setCurrentX(clientX);
    };

    const handleSwipeMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isSwipeDragging) return;

        e.preventDefault();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        setCurrentX(clientX);
        const diff = clientX - startX;
        setDragOffset(diff);
    };

    const handleSwipeEnd = () => {
        if (!isSwipeDragging) return;

        const diff = currentX - startX;
        const threshold = 50;

        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
               
                setCurrentIndex((prev) =>
                    prev === 0 ? Math.min(latestBanners.length, 5) - 1 : prev - 1
                );
            } else {
               
                setCurrentIndex((prev) =>
                    prev === Math.min(latestBanners.length, 5) - 1 ? 0 : prev + 1
                );
            }
        }

        setIsSwipeDragging(false);
        setDragOffset(0);
        setIsPaused(false);
    };

    const nextBanner = () => {
        setCurrentIndex((prev) =>
            prev === Math.min(latestBanners.length, 5) - 1 ? 0 : prev + 1
        );
    };

    const prevBanner = () => {
        setCurrentIndex((prev) =>
            prev === 0 ? Math.min(latestBanners.length, 5) - 1 : prev - 1
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !image) {
            setError("Bạn cần nhập đủ tiêu đề và tải ảnh lên");
            return;
        }

        try {
            setLoadingPost(true);
            setError(null);
            setSuccess(false);
            await postBanner(title, image);
            setSuccess(true);
            setTitle("");
            setImage("");
            fetchBanners();
        } catch (err) {
            setError("Lỗi khi gửi banner lên server");
            console.error(err);
        } finally {
            setLoadingPost(false);
        }
    };

    const fetchBanners = async () => {
        try {
            const data = await getBanners();
            setBanners(data);
        } catch (error) {
            console.error("Lỗi khi lấy banner:", error);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    useEffect(() => {
        if (banners.length === 0 || isPaused) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) =>
                prev === Math.min(banners.length, 5) - 1 ? 0 : prev + 1
            );
        }, 3000);

        return () => clearInterval(timer);
    }, [banners, isPaused]);

    const latestBanners = banners.slice(-5);

    return (
        <div className="w-full">
            {user?.Role === "Manager" && (
                <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                    <div className="flex gap-4 items-center">
                        <label className="w-20">Title:</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="flex-1"
                            required
                        />
                    </div>

                   
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">Upload Banner:</label>
                        <div
                            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${isDragOver
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-300 hover:border-gray-400'
                                } ${loadingUpload ? 'opacity-50 pointer-events-none' : ''}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => document.getElementById('file-input')?.click()}
                        >
                            <input
                                id="file-input"
                                type="file"
                                accept="image/*"
                                onChange={handleUpload}
                                className="hidden"
                            />

                            {loadingUpload ? (
                                <div className="flex flex-col items-center space-y-2">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                    <p className="text-gray-600">Đang tải lên...</p>
                                </div>
                            ) : image ? (
                                <div className="flex flex-col items-center space-y-2">
                                    <img
                                        src={image}
                                        alt="Preview"
                                        className="max-h-32 rounded-lg shadow-md"
                                    />
                                    <p className="text-green-600 font-medium">✓ Ảnh đã được tải lên</p>
                                    <p className="text-sm text-gray-500">Click hoặc kéo thả để thay đổi</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center space-y-2">
                                    <Upload className="h-12 w-12 text-gray-400" />
                                    <div>
                                        <p className="text-lg font-medium text-gray-700">
                                            Kéo thả ảnh vào đây
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            hoặc click để chọn file
                                        </p>
                                    </div>
                                    <p className="text-xs text-gray-400">
                                        Hỗ trợ: JPG, PNG, GIF
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <Button type="submit" disabled={loadingUpload || loadingPost}>
                        {loadingPost ? "Đang gửi banner..." : "Gửi Banner"}
                    </Button>
                    {error && <p className="text-red-500">{error}</p>}
                    {success && <p className="text-green-600">Gửi banner thành công!</p>}
                </form>
            )}

            {latestBanners.length > 0 && (
                <div
                    className="relative w-full aspect-[3/1] overflow-hidden select-none group"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    onMouseDown={handleSwipeStart}
                    onMouseMove={handleSwipeMove}
                    onMouseUp={handleSwipeEnd}
                    onMouseLeave={handleSwipeEnd}
                    onTouchStart={handleSwipeStart}
                    onTouchMove={handleSwipeMove}
                    onTouchEnd={handleSwipeEnd}
                    style={{ cursor: isSwipeDragging ? 'grabbing' : 'grab' }}
                >
                    <div
                        className="w-full h-full relative p-0 transition-transform duration-200 ease-out"
                        style={{
                            transform: isSwipeDragging ? `translateX(${dragOffset}px)` : 'translateX(0)',
                        }}
                    >
                        {latestBanners.map((banner, index) => (
                            <img
                                key={banner.id}
                                src={banner.imageUrl}
                                alt={banner.title}
                                className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                                    }`}
                                draggable={false}
                            />
                        ))}
                        <div className="absolute bottom-0 w-full text-center bg-black/50 text-white py-2 text-lg font-semibold">
                            {latestBanners[currentIndex]?.title}
                        </div>
                    </div>

                 
                    <button
                        onClick={prevBanner}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={nextBanner}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>
            )}

            {latestBanners.length > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  
                    {latestBanners.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-200 ${index === currentIndex
                                    ? 'bg-blue-500 scale-110'
                                    : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Banner;