import { useEditor, EditorContent, Editor, EditorEvents } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

type Props = {
    value: string;
    onChange: (e: string) => void
}

const Tiptap = ({value, onChange}: Props) => {
    function handleChange({editor}: EditorEvents["update"]) {
        onChange(editor.getHTML())
    }

  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: value,
    onUpdate: handleChange,
  })

  return (
    <EditorContent editor={editor} />
  )
}

export default Tiptap;
