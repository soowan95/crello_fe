import {
  Box,
  Button,
  Divider,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  Image,
  Input,
  Modal,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import {
  faAddressCard,
  faCamera,
  faCloudArrowUp,
  faEnvelopeCircleCheck,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import "../../css/Photo.css";
import { instance } from "../../modules/axios_interceptor";

function ManageAccount() {
  const currentPhoto =
    localStorage.getItem("photo") === "null"
      ? "https://practice12323asdf.s3.ap-northeast-2.amazonaws.com/crello/user/user.png"
      : localStorage.getItem("photo");

  const [preparePhotoUpload, setPreparePhotoUpload] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isPhotoSelected, setIsPhotoSelected] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(currentPhoto);
  const [nickName, setNickName] = useState(localStorage.getItem("nickname"));

  const { onOpen, isOpen, onClose } = useDisclosure();

  const freader = new FileReader();

  const handleDrageStart = () => setIsDragActive(true);

  const handleDragEnd = () => setIsDragActive(false);

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e) => {
    e.preventDefault();

    freader.readAsDataURL(e.dataTransfer.files[0]);
    freader.onload = (e) => {
      setPhotoPreview(e.target.result);
    };
    setPhoto(e.dataTransfer.files[0]);
    setIsDragActive(false);
  };

  const handleNickName = (nickname) => {
    instance
      .put("/api/v1/user/update", {
        email: localStorage.getItem("email"),
        nickname: nickname,
      })
      .then(({ data }) => localStorage.setItem("nickname", data.nickname));
  };

  return (
    <Box w={"500px"} h={"700px"} m={"100px auto"} border={"1px solid"}>
      <Box
        w={"100%"}
        h={"200px"}
        border={"1px solid"}
        borderRadius={"20px"}
        position={"relative"}
      >
        <Flex w={"100%"} justifyContent={"space-evenly"}>
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
            <Image w={"100%"} h={"100%"} src={photoPreview} />
          </Box>
          {preparePhotoUpload && (
            <Box
              textAlign={"center"}
              w={"40px"}
              h={"40px"}
              position={"absolute"}
              top={"80px"}
              left={"78px"}
              fontSize={"1.5rem"}
              onMouseOver={() => setPreparePhotoUpload(true)}
              onMouseLeave={() => setPreparePhotoUpload(false)}
              _hover={{ background: "rgba(255,255,255,0.25)" }}
              cursor={"pointer"}
              borderRadius={"5px"}
              onClick={() => {
                onOpen();
                setPhoto(null);
                setPhotoPreview(null);
              }}
              color={"rgba(0,0,0,0.48)"}
            >
              <FontAwesomeIcon icon={faCamera} />
            </Box>
          )}
          <Box w={"300px"} h={"200px"} border={"1px solid"}>
            <Box>
              <FontAwesomeIcon icon={faEnvelopeCircleCheck} />
            </Box>
            <Box ml={2} fontSize={"1.2rem"}>
              {localStorage.getItem("email")}
            </Box>
            <Box>
              <FontAwesomeIcon icon={faAddressCard} />
            </Box>
            <Editable
              w={"fit-content"}
              h={"30px"}
              ml={2}
              fontSize={"1.2rem"}
              value={nickName}
              borderRadius={"10px"}
              onChange={(e) => {
                setNickName(e);
              }}
              onSubmit={(e) => {
                if (e === "") setNickName(localStorage.getItem("nickname"));
                else if (nickName !== localStorage.getItem("nickname"))
                  handleNickName(nickName);
              }}
            >
              <EditablePreview />
              <EditableInput />
            </Editable>
          </Box>
        </Flex>
        <Modal
          isOpen={isOpen}
          onClose={() => {
            onClose();
            if (photoPreview === null) setPhotoPreview(currentPhoto);
            setIsPhotoSelected(false);
          }}
        >
          <ModalOverlay />
          <ModalContent>
            {photo === null && (
              <label
                className={`preview${isDragActive ? " active" : ""}`}
                onDragEnter={handleDrageStart}
                onDragOver={handleDragOver}
                onDragLeave={handleDragEnd}
                onDrop={handleDrop}
              >
                <Box
                  w={"162px"}
                  h={"162px"}
                  fontSize={"8rem"}
                  lineHeight={"162px"}
                >
                  <FontAwesomeIcon icon={faCloudArrowUp} />
                </Box>
                <Input
                  type="file"
                  className="file"
                  onChange={(e) => {
                    freader.readAsDataURL(e.target.files[0]);
                    freader.onload = (e) => {
                      setPhotoPreview(e.target.result);
                    };
                    setPhoto(e.target.files[0]);
                  }}
                />
                <Box className="preview_msg">
                  클릭 혹은 파일을 이곳에 드롭하세요.
                </Box>
                <Box className="preview_desc">파일당 최대 3MB</Box>
              </label>
            )}
            {photo !== null && (
              <Box m={"0 auto"} position={"relative"}>
                <Box fontSize={"1.2rem"} my={"20px"} textAlign={"center"}>
                  Preview your profile
                </Box>
                <Box
                  w={"162px"}
                  h={"162px"}
                  borderRadius={"100%"}
                  border={"1px solid"}
                  overflow={"hidden"}
                  my={"20px"}
                >
                  <Image w={"100%"} h={"100%"} src={photoPreview} />
                </Box>
                {!isPhotoSelected && (
                  <Flex my={"10px"}>
                    <Button
                      size={"sm"}
                      colorScheme={"blue"}
                      onClick={() => {
                        setIsPhotoSelected(true);
                        onClose();
                      }}
                    >
                      Save
                    </Button>
                    <Button
                      ml={1}
                      size={"sm"}
                      onClick={() => {
                        setPhotoPreview(null);
                        setPhoto(null);
                      }}
                    >
                      <FontAwesomeIcon icon={faX} />
                    </Button>
                  </Flex>
                )}
              </Box>
            )}
            <Divider />
          </ModalContent>
        </Modal>
      </Box>
    </Box>
  );
}

export default ManageAccount;
