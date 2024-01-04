import { Box } from "@chakra-ui/react";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";

function WorkSpacePage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) navigate("/login");
  }, [navigate]);

  return (
    <Box>
      <Outlet />
    </Box>
  );
}

export default WorkSpacePage;
