import { useMemo, useState } from "react";
import ReactQuill from "react-quill";

function Editor() {
  const [values, setValues] = useState(null);

  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          [{ size: ["small", false, "large", "huge"] }],
          [{ align: [] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          [
            {
              color: [],
            },
            { background: [] },
          ],
        ],
      },
    };
  }, []);

  return (
    <ReactQuill
      theme="snow"
      modules={modules}
      formats={formats}
      onChange={setValues}
    />
  );
}

export default Editor;
