import { Editable, EditableInput, EditablePreview } from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";

function ListTitleComp({ title, id }) {
  const [listTitle, setListTitle] = useState(title);

  const handleTitle = (title) => {
    localStorage.setItem("boardTitle", title);
    axios.put(
      "/api/v1/list/update",
      {
        title: title,
        id: id,
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
      },
    );
  };

  return (
    <Editable
      w={"fit-content"}
      h={"30px"}
      value={listTitle}
      borderRadius={"10px"}
      onChange={(e) => {
        setListTitle(e);
      }}
      onSubmit={(e) => {
        if (e === "") setListTitle(title);
        else if (listTitle !== title) handleTitle(listTitle);
      }}
    >
      <EditablePreview />
      <EditableInput />
    </Editable>
  );
}

export default ListTitleComp;
