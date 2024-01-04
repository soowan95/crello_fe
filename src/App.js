import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import WelcomePage from "./page/WelcomePage";
import Navbar from "./component/Navbar";
import LoginPage from "./page/LoginPage";
import SignUp from "./page/SignUp";
import WorkSpacePage from "./page/WorkSpacePage";

const routes = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path={"/"} element={<WelcomePage />}>
        <Route index element={<Navbar />} />
      </Route>
      <Route path={"/login"} element={<LoginPage />} />
      <Route path={"/signup"} element={<SignUp />} />
      <Route path={"/u"} element={<WorkSpacePage />}>
        <Route index element={<Navbar />} />
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
