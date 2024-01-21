import {
  Box,
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  FormControl,
  FormErrorMessage,
  Image,
  Input,
  Modal,
  ModalContent,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  faAddressCard,
  faCamera,
  faCloudArrowUp,
  faEnvelopeCircleCheck,
  faPenToSquare,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import "../../css/Photo.css";
import { instance } from "../../modules/axios_interceptor";
import { useNavigate } from "react-router-dom";

function ManageAccount() {
  const currentPhoto =
    localStorage.getItem("photo") === "null"
      ? "https://practice12323asdf.s3.ap-northeast-2.amazonaws.com/crello/user/user.png"
      : localStorage.getItem("photo");

  const [preparePhotoUpload, setPreparePhotoUpload] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isPhotoSelected, setIsPhotoSelected] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isCancleMemberShip, setIsCancleMemberShip] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(currentPhoto);
  const [nickName, setNickName] = useState(localStorage.getItem("nickname"));
  const [password, setPassword] = useState(null);
  const [checkPassword, setCheckPassword] = useState(null);
  const [checkCancle, setCheckCancle] = useState(null);

  const { onOpen, isOpen, onClose } = useDisclosure();

  const navigate = useNavigate();

  const toast = useToast();

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
      .putForm("/api/v1/user/update", {
        email: localStorage.getItem("email"),
        nickname: nickname,
      })
      .then(({ data }) => localStorage.setItem("nickname", data.nickname));
  };

  const handleChanges = () => {
    instance
      .putForm("/api/v1/user/update", {
        email: localStorage.getItem("email"),
        password: password,
        photo: photo === "" ? null : photo,
        toBaseImg: photo === "" ? true : false,
      })
      .then(({ data }) => {
        localStorage.setItem("photo", data.photo);
        window.location.reload();
      });
  };

  const handleCancle = () => {
    instance
      .delete(
        "/api/v1/user/delete?password=" +
          password +
          "&email=" +
          localStorage.getItem("email"),
      )
      .then(() => {
        navigate("/");
        localStorage.clear();
      })
      .catch((err) => {
        toast({
          description: err.response.data.msg,
          status: "error",
        });
      });
  };

  return (
    <Box w={"500px"} h={"500px"} m={"200px auto"}>
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
          <Box w={"300px"} h={"200px"}>
            <Box mt={"35px"}>
              <FontAwesomeIcon icon={faEnvelopeCircleCheck} />
            </Box>
            <Box ml={2} fontSize={"1.2rem"}>
              {localStorage.getItem("email")}
            </Box>
            <Box mt={"25px"}>
              <FontAwesomeIcon icon={faAddressCard} />
            </Box>
            <Flex justifyContent={"space-between"}>
              <Editable
                w={"80%"}
                h={"30px"}
                ml={2}
                fontSize={"1.2rem"}
                value={nickName}
                borderRadius={"10px"}
                onChange={(e) => {
                  e = e.replace(" ", "");
                  setNickName(e);
                }}
                onSubmit={(e) => {
                  if (e === "") setNickName(localStorage.getItem("nickname"));
                  else if (nickName !== localStorage.getItem("nickname"))
                    handleNickName(nickName);
                }}
              >
                <EditablePreview w={"80%"} />
                <EditableInput />
              </Editable>
              <Box h={"30px"} lineHeight={"40px"} mr={"10px"}>
                <FontAwesomeIcon icon={faPenToSquare} />
              </Box>
            </Flex>
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
              <Box>
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
                      if (e.target.files[0].size > 3 * 1024 * 1024) {
                        toast({
                          description: "파일 최대 용량을 초과했습니다.",
                          status: "warning",
                        });
                      } else {
                        freader.readAsDataURL(e.target.files[0]);
                        freader.onload = (e) => {
                          setPhotoPreview(e.target.result);
                        };
                        setPhoto(e.target.files[0]);
                      }
                    }}
                  />
                  <Box className="preview_msg">
                    클릭 혹은 파일을 이곳에 드롭하세요.
                  </Box>
                  <Box className="preview_desc">파일당 최대 3MB</Box>
                </label>
                <Button
                  size={"sm"}
                  w={"120px"}
                  ml={"160px"}
                  mb={"20px"}
                  onClick={() => {
                    setPhoto("");
                    setPhotoPreview(
                      "https://practice12323asdf.s3.ap-northeast-2.amazonaws.com/crello/user/user.png",
                    );
                  }}
                >
                  Use base image
                </Button>
              </Box>
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
          </ModalContent>
        </Modal>
      </Box>
      {!isChangingPassword && !isCancleMemberShip && (
        <Button
          w={"450px"}
          m={"20px 25px"}
          mt={"100px"}
          onClick={() => setIsChangingPassword(true)}
        >
          Click to change your password
        </Button>
      )}
      {isChangingPassword && (
        <FormControl
          isInvalid={password !== checkPassword}
          w={"450px"}
          ml={"25px"}
          mt={"80px"}
        >
          <Input
            id={"password"}
            my={"20px"}
            type={"password"}
            placeholder={"Password"}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            id={"checkPassword"}
            my={"20px"}
            type={"password"}
            placeholder={"CheckPassword"}
            onChange={(e) => setCheckPassword(e.target.value)}
          />
          <FormErrorMessage>Check your password.</FormErrorMessage>
        </FormControl>
      )}
      {!isChangingPassword && !isCancleMemberShip && (
        <Button
          w={"450px"}
          m={"20px 25px"}
          onClick={() => setIsCancleMemberShip(true)}
        >
          Click to cancle your membership
        </Button>
      )}
      {isCancleMemberShip && (
        <FormControl
          isInvalid={password === null || checkCancle !== "Cancle membership"}
          w={"450px"}
          ml={"25px"}
          mt={"80px"}
        >
          <Input
            my={"20px"}
            type={"password"}
            placeholder={"Password"}
            onChange={(e) => {
              if (e.target.value === "") setPassword(null);
              else setPassword(e.target.value);
            }}
          />
          <Input
            my={"20px"}
            placeholder={"Cancle membership"}
            onChange={(e) => setCheckCancle(e.target.value)}
          />
          <FormErrorMessage>
            {password === null
              ? "Input password"
              : 'Input "Cancle membership" on second box'}
          </FormErrorMessage>
        </FormControl>
      )}
      {!isCancleMemberShip && (
        <Flex justifyContent={"right"}>
          {isChangingPassword && (
            <Button
              size={"sm"}
              mr={"10px"}
              my={"20px"}
              onClick={() => {
                setIsChangingPassword(false);
                setPassword(null);
                setCheckPassword(null);
              }}
            >
              <FontAwesomeIcon icon={faX} />
            </Button>
          )}
          <Button
            size={"sm"}
            colorScheme={"blue"}
            mr={"25px"}
            my={"20px"}
            onClick={handleChanges}
            isDisabled={photo === null && password === null}
          >
            Save changes
          </Button>
        </Flex>
      )}
      {isCancleMemberShip && (
        <Button
          size={"sm"}
          colorScheme={"red"}
          ml={"325px"}
          my={"20px"}
          isDisabled={checkCancle !== "Cancle membership" || password === null}
          onClick={handleCancle}
        >
          Cancle membership
        </Button>
      )}
    </Box>
  );
}

export default ManageAccount;
