import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useState } from "react";
import { Box } from "@chakra-ui/react";

function EditorBox() {
  const [values, setValues] = useState(null);

  const modules = {
    toolbar: {
      container: [
        [{ header: [false, 1, 2, 3, 4, 5, 6] }],
        ["bold", "italic", "underline", "strike"],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
        ],
        [{ color: [] }, { background: [] }, { align: [] }],
      ],
    },
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "align",
    "color",
    "background",
  ];

  return (
    <Box
      ml={"20px"}
      sx={{
        ".ql-editor": {
          width: "100%",
          height: "300px",
        },
      }}
    >
      <ReactQuill
        theme="snow"
        modules={modules}
        formats={formats}
        onChange={setValues}
      />
    </Box>
  );
}

export default EditorBox;
