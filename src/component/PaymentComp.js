import { Button, useToast } from "@chakra-ui/react";
import { useEffect } from "react";
import axios from "axios";
import { instance } from "../modules/axios_interceptor";
import { useNavigate } from "react-router-dom";

function PaymentComp({ amount, role }) {
  const toast = useToast();

  const navigate = useNavigate();

  useEffect(() => {
    const jquery = document.createElement("script");
    jquery.src = "https://code.jquery.com/jquery-1.12.4.min.js";
    const iamport = document.createElement("script");
    iamport.src = "https://cdn.iamport.kr/js/iamport.payment-1.1.8.js";
    document.head.appendChild(jquery);
    document.head.appendChild(iamport);

    return () => {
      document.head.removeChild(jquery);
      document.head.removeChild(iamport);
    };
  }, []);

  const handlePayment = () => {
    const IMP = window.IMP;
    IMP.init(`${process.env.REACT_APP_IMP_API_KEY}`);
    IMP.request_pay(
      {
        pg: "TC0ONETIME",
        pay_method: "card",
        merchant_uid: `mid_${new Date().getTime()}`,
        name: "테스트 상점",
        amount: amount,
        buyer_name: localStorage.getItem("nickname"),
        buyer_email: localStorage.getItem("email"),
      },
      async (res) => {
        try {
          const { data } = await axios.post(
            "/api/v1/iamport/verify/" + res.imp_uid,
          );
          if (res.paid_amount === data.response.amount) {
            toast({
              description: "결제 성공",
              status: "success",
            });
            if (localStorage.getItem("email")) {
              instance
                .put("/api/v1/user/roleUpdate", {
                  email: localStorage.getItem("email"),
                  role: role,
                })
                .then(() => localStorage.setItem("role", role));
            } else {
              navigate("/singup");
              localStorage.setItem("role", role);
            }
          } else if (data.response.failReason.indexOf("취소") !== 1) {
            toast({
              description: "결제 취소",
              status: "warning",
            });
          } else {
            toast({
              description: "결제 실패",
              status: "error",
            });
          }
        } catch (err) {
          console.error("Error while verifying payment: ", err);
          toast({
            description: "결제 실패",
            status: "error",
          });
        }
      },
    );
  };

  return (
    <Button position={"absolute"} left={5} bottom={10} onClick={handlePayment}>
      Purchase
    </Button>
  );
}

export default PaymentComp;
