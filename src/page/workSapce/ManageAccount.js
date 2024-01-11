import {
  Box,
  Image,
  Input,
  Modal,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { faCamera, faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import "../../css/Photo.css";

function ManageAccount() {
  const [preparePhotoUpload, setPreparePhotoUpload] = useState(false);
  const [photo, setPhoto] = useState(null);

  const { onOpen, isOpen, onClose } = useDisclosure();

  return (
    <Box w={"350px"} h={"700px"} m={"100px auto"} border={"1px solid"}>
      <Box w={"100%"} h={"200px"} border={"1px solid"} position={"relative"}>
        <Box
          w={"100px"}
          h={"100px"}
          m={"50px auto"}
          borderRadius={"100%"}
          overflow={"hidden"}
          border={"2px solid"}
          onMouseOver={() => setPreparePhotoUpload(true)}
          onMouseLeave={() => setPreparePhotoUpload(false)}
        >
          <Image
            className={"image"}
            w={"100%"}
            h={"100%"}
            src={
              "https://practice12323asdf.s3.ap-northeast-2.amazonaws.com/prj2/artist/153/Teddy+Bear.jpg"
            }
          />
        </Box>
        {preparePhotoUpload && (
          <Box
            textAlign={"center"}
            w={"40px"}
            h={"40px"}
            position={"absolute"}
            top={"80px"}
            left={"153px"}
            fontSize={"1.5rem"}
            onMouseOver={() => setPreparePhotoUpload(true)}
            onMouseLeave={() => setPreparePhotoUpload(false)}
            _hover={{ background: "rgba(255,255,255,0.18)" }}
            cursor={"pointer"}
            borderRadius={"5px"}
            onClick={onOpen}
          >
            <FontAwesomeIcon icon={faCamera} />
          </Box>
        )}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <label className="preview">
              <Box
                w={"162px"}
                h={"162px"}
                // overflow={"hidden"}
                borderRadius={"100%"}
                border={"1px solid"}
              >
                <Box
                  w={"162px"}
                  h={"162px"}
                  fontSize={"8rem"}
                  lineHeight={"162px"}
                  border={"1px solid red"}
                >
                  <FontAwesomeIcon icon={faCloudArrowUp} />
                </Box>
              </Box>
              <Input
                type="file"
                className="file"
                onChange={(e) => setPhoto(e.target.files[0])}
              />
              <Box className="preview_msg">
                클릭 혹은 파일을 이곳에 드롭하세요.
              </Box>
              <Box className="preview_desc">파일당 최대 3MB</Box>
            </label>
          </ModalContent>
        </Modal>
      </Box>
    </Box>
  );
}

export default ManageAccount;
