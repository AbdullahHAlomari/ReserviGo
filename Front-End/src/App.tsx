import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home/Home";
import Profile from "./pages/Profile/Profile";
import Reservations from "./pages/Reservations/Reservations";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SignUp/SignUp";
import AddTicket from "./pages/Tickets/AddTicket";
import Ticket from "./pages/Tickets/Ticket";
import Tickets from "./pages/Tickets/Tickets";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/tickets",
    element: <Tickets />,
  },
  {
    path: "/tickets/:id",
    element: <Ticket />,
  },
  {
    path: "/reservations",
    element: <Reservations />,
  },
  {
    path: "/signin",
    element: <SignIn />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/addTicket",
    element: <AddTicket />,
  },
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
