import { Badge, Box, Button, Flex } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWonSign } from "@fortawesome/free-solid-svg-icons";
import PaymentComp from "../../component/PaymentComp";
import { useNavigate } from "react-router-dom";

function PurchasePage() {
  const navigate = useNavigate();

  return (
    <Flex
      m={"0px auto"}
      w={"950px"}
      h={"500px"}
      justifyContent={"space-between"}
    >
      <Box
        w={"300px"}
        h="100%"
        border={"1px solid"}
        position={"relative"}
        borderRadius={"10px"}
        _hover={{ borderColor: "skyblue " }}
      >
        <Box ml={"20px"} mt={"30px"}>
          TRIAL
        </Box>
        <Flex alignItems={"baseline"} ml={"20px"} mt={"20px"}>
          <Badge h={"20px"} bg={"none"}>
            <FontAwesomeIcon icon={faWonSign} />
          </Badge>
          <Box fontSize={"3rem"}>0</Box>
          <Badge h={"20px"} bg={"none"}>
            won
          </Badge>
        </Flex>
        <Box ml={"20px"} mt={"50px"} fontSize={"1.5rem"}>
          Free for you. <br /> But only allowed <br /> 3 boards on you.
        </Box>
        {!localStorage.getItem("email") && (
          <Button
            position={"absolute"}
            left={5}
            bottom={10}
            onClick={() => navigate("/signup")}
          >
            Get started
          </Button>
        )}
      </Box>
      <Box
        w={"300px"}
        h="100%"
        border={"1px solid"}
        position={"relative"}
        borderRadius={"10px"}
        _hover={{ borderColor: "skyblue " }}
      >
        <Box ml={"20px"} mt={"30px"}>
          COMMON
        </Box>
        <Flex alignItems={"baseline"} ml={"20px"} mt={"20px"}>
          <Badge h={"20px"} bg={"none"}>
            <FontAwesomeIcon icon={faWonSign} />
          </Badge>
          <Box fontSize={"3rem"}>10,000</Box>
          <Badge h={"20px"} bg={"none"}>
            won
          </Badge>
        </Flex>
        <Box ml={"20px"} mt={"50px"} fontSize={"1.5rem"}>
          Purchase this!!! <br /> Can use two more than before. <br /> And take
          a silver badge!!!
        </Box>
        <Badge bg={"silver"} ml={"200px"}>
          take me :)
        </Badge>
        {!localStorage.getItem("email") && (
          <Button
            position={"absolute"}
            left={5}
            bottom={10}
            onClick={() => {
              navigate("/signup");
              localStorage.setItem("amount", 10000);
              localStorage.setItem("purchase", "COMMON");
            }}
          >
            Sign up now
          </Button>
        )}
        {localStorage.getItem("email") &&
          localStorage.getItem("role") !== "COMMON" && (
            <PaymentComp amount={10000} role={"COMMON"} />
          )}
      </Box>
      <Box
        w={"300px"}
        h="100%"
        border={"1px solid"}
        position={"relative"}
        borderRadius={"10px"}
        _hover={{ borderColor: "skyblue " }}
      >
        <Box ml={"20px"} mt={"30px"}>
          PREMIUM
        </Box>
        <Flex alignItems={"baseline"} ml={"20px"} mt={"20px"}>
          <Badge h={"20px"} bg={"none"}>
            <FontAwesomeIcon icon={faWonSign} />
          </Badge>
          <Box fontSize={"3rem"}>50,000</Box>
          <Badge h={"20px"} bg={"none"}>
            won
          </Badge>
        </Flex>
        <Box ml={"20px"} mt={"50px"} fontSize={"1.5rem"}>
          Ultimate Chance!!!!!! <br /> Unlimmited boards!!!!!!! <br /> Finally
          you'll get a golden badge!!!!!
        </Box>
        <Badge bg={"#e5c569"} ml={"190px"}>
          come on 🤩
        </Badge>
        {!localStorage.getItem("email") && (
          <Button
            position={"absolute"}
            left={5}
            bottom={10}
            onClick={() => {
              navigate("/signup");
              localStorage.setItem("amount", 50000);
              localStorage.setItem("purchase", "PREMIUM");
            }}
          >
            Never miss this chance
          </Button>
        )}
        {localStorage.getItem("email") && (
          <PaymentComp amount={50000} role={"PREMIUM"} />
        )}
      </Box>
    </Flex>
  );
}

export default PurchasePage;
