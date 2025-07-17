// src/components/BlogDetail.tsx
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import { apiser } from "../service/apiser"

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
                const res = await apiser.get(`/article/get${id}`)
                setBlog(res.data)
            } catch (err) {
                console.error("❌ Lỗi khi tải blog:", err)
            }
        }

        fetchBlog()
    }, [id])

    if (!blog) return <div>Đang tải nội dung...</div>

    return (
        <div className="max-w-3xl mx-auto py-20 space-y-4">
            <div
                className="prose max-w-none w-full break-words whitespace-normal
             [&_h1]:uppercase [&_h2]:uppercase [&_h3]:uppercase
             [&_img]:max-w-full [&_img]:h-auto"
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
