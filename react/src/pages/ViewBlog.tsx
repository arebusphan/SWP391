import { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { apiser } from "../service/apiser";

interface Blog {
    id: number;
    title: string;
    imageUrl: string;
    htmlContent: string;
    createdAt: string;
}

const ITEMS_PER_PAGE = 6;

const ViewBlog = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await apiser.get("/article/get");
                setBlogs(res.data);
            } catch (err) {
                console.error("❌ Lỗi khi tải blog:", err);
            }
        };

        fetchBlogs();
    }, []);

    const totalPages = Math.ceil(blogs.length / ITEMS_PER_PAGE);
    const currentBlogs = blogs.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className=" py-8 px-4 min-h-150">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
                {currentBlogs.map((blog) => (
                    <Link to={`/blogs/${blog.id}`} key={blog.id} className="flex justify-center">
                        <div className="w-[300px] h-[300px] border rounded shadow-md p-4 bg-white hover:shadow-lg transition cursor-pointer flex flex-col">
                            <img
                                src={blog.imageUrl}
                                alt={blog.title}
                                className="w-full h-36 object-cover rounded mb-3"
                            />
                            <h2 className="text-[17px] font-bold text-gray-900 line-clamp-2 mb-2">
                                {blog.title}
                            </h2>

                            
                            

                            <p className="text-xs text-gray-500 mt-3">
                                {new Date(blog.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-10 gap-4">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300"
                >
                    Prev
                </button>
                <span className="flex items-center text-gray-700">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default ViewBlog;
