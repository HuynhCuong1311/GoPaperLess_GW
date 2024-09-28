// import Backdrop from "@mui/material/Backdrop";
// import CircularProgress from "@mui/material/CircularProgress";
// import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import Routers from "./routers/Routers";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppProvider } from "@/Context/AppContext";

function App() {
  // const isFetching = useIsFetching();
  // const isMutating = useIsMutating();
  return (
    <>
      <ToastContainer position="bottom-right" />
      <AppProvider>
        <BrowserRouter>
          <Routers />
        </BrowserRouter>
      </AppProvider>
    </>
  );
}

export default App;
