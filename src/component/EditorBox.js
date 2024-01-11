import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Box } from "@chakra-ui/react";

function EditorBox({ setCardContent, cardContent }) {
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
      sx={{
        ".ql-editor": {
          width: "100%",
          height: "300px",
        },
        ".ql-toolbar.ql-snow": {
          background: "white",
        },
      }}
    >
      <ReactQuill
        defaultValue={cardContent}
        theme="snow"
        modules={modules}
        formats={formats}
        onChange={(e) => {
          if (e === "" || e === "<p><br></p>") setCardContent(null);
          else setCardContent(e);
        }}
      />
    </Box>
  );
}

export default EditorBox;
