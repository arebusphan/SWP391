// src/components/BlogDetail.tsx
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"

interface Blog {
    id: number
    title: string
    imageUrl: string
    htmlContent: string
    createdAt: string
}

const BlogDetail = () => {
    const { id } = useParams()
    const [blog, setBlog] = useState<Blog | null>(null)

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await axios.get(`https://localhost:7195/api/article/get${id}`)
                setBlog(res.data)
            } catch (err) {
                console.error("❌ Lỗi khi tải blog:", err)
            }
        }

        fetchBlog()
    }, [id])

    if (!blog) return <div>Đang tải nội dung...</div>

    return (
        <div className="max-w-3xl mx-auto py-8 space-y-4">
            <div
                className="prose max-w-none w-full break-words whitespace-normal [&_img]:max-w-full [&_img]:h-auto"
                style={{
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                }}
                dangerouslySetInnerHTML={{ __html: blog.htmlContent }}
            />
        </div>
    )
}

export default BlogDetail
