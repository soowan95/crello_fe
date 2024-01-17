import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import WelcomePage from "./page/welcome/WelcomePage";
import Navbar from "./component/Navbar";
import LoginPage from "./page/welcome/LoginPage";
import SignUp from "./page/welcome/SignUp";
import WorkSpacePage from "./page/workSapce/WorkSpacePage";
import Board from "./page/workSapce/Board";
import List from "./page/workSapce/List";
import ManageAccount from "./page/workSapce/ManageAccount";
import ChangePassword from "./page/welcome/ChangePassword";
import KakaoLogin from "./page/welcome/KakaoLogin";
import PurchasePage from "./page/welcome/PurchasePage";

const routes = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<WelcomePage />}>
        <Route index element={<Navbar />} />
        <Route path="/kakaoLogin" element={<KakaoLogin />} />
      </Route>
      <Route path="login" element={<LoginPage />} />
      <Route path="signup" element={<SignUp />} />
      <Route path="cpw" element={<ChangePassword />} />
      <Route path="u" element={<WorkSpacePage />}>
        <Route path="board" element={<Board />} />
        <Route path="list" element={<List />} />
        <Route path="manage" element={<ManageAccount />} />
      </Route>
    </Route>,
  ),
);

function App() {
  return (
    <>
      <RouterProvider router={routes} />
    </>
  );
}

export default App;
