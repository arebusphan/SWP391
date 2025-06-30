import { useState } from "react"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import CreateBlogForm from "../components/CreateBlog"
import { useAuth } from "../context/AuthContext";
import ViewBlog from "./ViewBlog";


const BlogPage = () => {
    const [open, setOpen] = useState(false)
    const { user } = useAuth();

    return (
        <>
            {user?.Role === "Manager" ? (
                <div className="p-4">
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button
                                onClick={() => setOpen(true)}
                                className="bg-green-600 hover:bg-green-700 text-white"
                            >
                                ➕ Create Blog
                            </Button>
                        </DialogTrigger>

                        <DialogContent className="!w-full !max-w-[1000px] mx-auto p-6 overflow-y-auto max-h-[90vh]">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-bold">Tạo bài viết mới</DialogTitle>
                            </DialogHeader>

                            <CreateBlogForm />
                        </DialogContent>
                    </Dialog>
                </div>
            ) : (
                <div className="text-center text-gray-500 mt-10"></div>
            )}

            <div>   <ViewBlog /> </div>
        </>
    );
};

export default BlogPage;
