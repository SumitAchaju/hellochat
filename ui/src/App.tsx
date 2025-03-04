import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Login from "./pages/Login";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProtectedRoute from "./components/ProtectedRoute";
import Signup from "./pages/Signup";
import MainChat from "./pages/MainChat";
import "swiper/css";
import { Toaster } from "react-hot-toast";
import RedirectRoute from "./pages/RedirectRoute";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import InitialLoder from "./store/initialLoder";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 3,
    },
  },
});

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/main/:roomId" element={<ProtectedRoute />}>
        <Route index element={<MainChat />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/*" element={<RedirectRoute />} />
    </>
  )
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <InitialLoder>
        <RouterProvider router={router} />
        <Toaster />
      </InitialLoder>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
