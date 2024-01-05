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

const routes = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<WelcomePage />}>
        <Route index element={<Navbar />} />
      </Route>
      <Route path="login" element={<LoginPage />} />
      <Route path="signup" element={<SignUp />} />
      <Route path="u" element={<WorkSpacePage />}>
        <Route path="board" element={<Board />} />
        <Route path="list" element={<List />} />
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
