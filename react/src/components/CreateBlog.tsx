import { useState } from "react"
import axios from "axios"
import Tiptap from "./TIptap"

const CreateBlogForm = () => {
  const [title, setTitle] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState("")
  const [editorHtml, setEditorHtml] = useState("")
  const [loading, setLoading] = useState(false)

  const uploadImageToCloudinary = async (file: File) => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", "swp391")
    formData.append("cloud_name", "demmylzob")

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/demmylzob/image/upload", {
        method: "POST",
        body: formData,
      })

      const uploaded = await res.json()
      return uploaded.secure_url
    } catch (err) {
      console.error("Lỗi upload ảnh:", err)
      throw err
    }
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)

      let uploadedUrl = imageUrl
      if (imageFile) {
        uploadedUrl = await uploadImageToCloudinary(imageFile)
      }

      const payload = {
        title,  
        imageUrl: uploadedUrl,
        htmlContent: editorHtml,
        createdAt: new Date().toISOString(),
      }

      await axios.post("https://localhost:7195/api/article/post", payload)
      alert("✅ Tạo bài viết thành công!")
      setTitle("")
      setImageFile(null)
      setImageUrl("")
      setEditorHtml("")
    } catch (err) {
      console.error("❌ Lỗi tạo bài viết:", err)
      alert("Tạo thất bại!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto w-full space-y-4">
      <input
        type="text"
        placeholder="Tiêu đề bài viết"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0] || null
          setImageFile(file)
        }}
        className="block"
      />

      <div className="prose max-w-none w-full break-words whitespace-normal border p-4 rounded-md min-h-[50vh] overflow-auto [&_img]:max-w-full [&_img]:h-auto">
        <Tiptap onChange={(html) => setEditorHtml(html)} />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {loading ? "Đang gửi..." : "Đăng bài viết"}
      </button>
    </div>
  )
}

export default CreateBlogForm
