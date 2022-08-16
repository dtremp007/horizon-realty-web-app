import { useEditor, EditorContent, Editor, EditorEvents } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

type Props = {
    onUpdate: (props: EditorEvents["update"]) => void
}

const Tiptap = ({onUpdate}: Props) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: '<h1># Heading 1</h1><h2>## Heading 2</h2><h3>## Heading 3</h3><p>This editor uses markup. Use # for headers, * for **<b>bold</b>** and *<i>italics.</i>* </p><p>To start a list...type "-" or "1." and <b>space.</b></p><ul><li>Item</li><li>Item</li><li>Item</li></ul>',
    onUpdate: onUpdate,
  })

  return (
    <EditorContent editor={editor} />
  )
}

export default Tiptap;
