import { MainLayout } from "@/layouts";
import {
  NotFound,
  Signing,
  Validation,
  PageDocument,
  Configuration,
} from "@/pages";
import { Arrangement } from "@/pages/arangement/Arrangement";
import { useRoutes } from "react-router-dom";

const Routers = () => {
  const routing = useRoutes([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          path: "/view/signing/:signing_token",
          element: <Signing />,
        },
        {
          path: "/view/arrangement/:signing_token",
          element: <Arrangement />,
        },
        {
          path: "/view/validation/:upload_token/show",
          element: <Validation />,
        },
        {
          path: "/view/documents/:qr",
          element: <PageDocument />,
        },
        {
          path: "/view/configuration/:bind_token",
          element: <Configuration />,
        },
        {
          path: "/view/*",
          element: <NotFound />,
        },
      ],
    },
  ]);
  return routing;
};

export default Routers;
