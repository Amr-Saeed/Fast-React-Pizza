import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./Ui/AppLayout";
import Cart from "./Features/Cart/Cart";
import Home from "./Ui/Home";
import Menu from "./Features/menu/Menu";
import { loader as menuLoader } from "./Features/menu/Menu";
import Error from "./Ui/Error";
import CreateOrder, {
  action as createOrderAction,
} from "./Features/Order/CreateOrder";
import Order from "./Features/Order/Order";
import { loader as orderLoader } from "./Features/Order/Order";
import { action as updateOrderAction } from "./Features/Order/UpdateOrder";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/menu",
        element: <Menu />,
        loader: menuLoader,
        errorElement: <Error />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/order/new",
        element: <CreateOrder />,
        action: createOrderAction,
      },
      {
        path: "/order/:orderId",
        element: <Order />,
        loader: orderLoader,
        errorElement: <Error />,
        action: updateOrderAction,
      },
    ],
  },
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
