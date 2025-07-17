import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Highlight } from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import Image from '@tiptap/extension-image'
import ImageResize from 'tiptap-extension-resize-image';
import Color from '@tiptap/extension-color'
// UI components
import { TextAlignButton } from './tiptap-ui/text-align-button'
import { ColorHighlightPopover } from './tiptap-ui/color-highlight-popover'
import { ImageUploadButton } from '@/components/tiptap-ui/image-upload-button'
import TextStyle from '@tiptap/extension-text-style'
// Tailwind hoặc CSS tùy bạn, nhưng đoạn này có thể bỏ nếu không dùng SCSS
// import '@/components/tiptap-node/image-node/image-node.scss'
import '@/components/tiptap-node/code-block-node/code-block-node.scss'
import { ImageUploadNode } from './tiptap-node/image-upload-node'
import { MAX_FILE_SIZE } from '../lib/tiptap-utils'
import '@/components/tiptap-node/paragraph-node/paragraph-node.scss'

// Upload lên Cloudinary

export async function handleImageUpload(file: File): Promise<string> {
    const data = new FormData()
    data.append('file', file)
    data.append('upload_preset', 'swp391')
    data.append('cloud_name', 'demmylzob')

    try {
        const res = await fetch('https://api.cloudinary.com/v1_1/demmylzob/image/upload', {
            method: 'POST',
            body: data,
        })

        if (!res.ok) throw new Error('Upload ảnh thất bại')

        const uploaded = await res.json()
        return uploaded.secure_url
    } catch (err) {
        console.error('Lỗi khi upload ảnh:', err)
        throw err
    }
}
const colors = [
    "#000000", "#FF0000", "#FFA500", "#FFFF00",
    "#008000", "#0000FF", "#4B0082", "#800080",
    "#FFFFFF", "#808080", "#00FFFF", "#FFC0CB"
]
const extensions = [
    StarterKit.configure({
        heading: {
            levels: [1, 2, 3, 4, 5, 6],
        },
    }),
    TextStyle,
    Color,
    TextAlign.configure({
        types: ['heading', 'paragraph'],
    }),
    Highlight.configure({ multicolor: true }),
    Image,
    ImageResize,
    ImageUploadNode.configure({
        accept: 'image/*',
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
        onError: (error) => console.error('Upload failed:', error),
    }),
]
interface TiptapProps {
    onChange?: (html: string) => void
}const Tiptap = ({ onChange }: TiptapProps) => {
    const editor = useEditor({
        extensions,
        content: '',
        onUpdate: ({ editor }) => {
            onChange?.(editor.getHTML())
        }
    })

    if (!editor) return null

    return (
        <div 
            className="p-4 space-y-4">
            <div className="flex gap-2 flex-wrap">
                <TextAlignButton align="left" editor={editor} />
                <TextAlignButton align="center" editor={editor} />
                <TextAlignButton align="right" editor={editor} />
                <ColorHighlightPopover editor={editor} />
                <ImageUploadButton editor={editor} text="Add Image" />
                <button
                    onClick={() => editor.chain().focus().toggleNode('heading', 'paragraph', { level: 1 }).run()}
                >
                    H1
                </button>
                <div className="flex flex-wrap gap-1">
                    {colors.map((color) => (
                        <button
                            key={color}
                            className="w-6 h-6 rounded"
                            style={{ backgroundColor: color }}
                            onClick={() => {
                                editor?.chain().focus().setColor(color).run()
                            }}
                        />
                    ))}
                    <button
                        className="w-6 h-6 border rounded text-xs"
                        onClick={() => editor?.chain().focus().unsetColor().run()}
                    >
                        ×
                    </button>

                </div>
             
            </div>
            
            <div
                className="w-full max-w-full border p-4 rounded min-h-[40vh] overflow-auto break-words whitespace-normal
             [&_img]:max-w-full [&_img]:h-auto [&_*]:!break-words [&_*]:!whitespace-normal"
            >
                <EditorContent
                    className="tiptap ProseMirror"
                    editor={editor}
                    
                    style={{
                        width: '100%',
                        maxWidth: '100%',
                        wordBreak: 'break-word',
                        overflowWrap: 'anywhere',
                        whiteSpace: 'normal',

                    }}
                />
            </div>
            
        </div>  
    )
}

export default Tiptap
