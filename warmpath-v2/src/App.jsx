import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import HomePage from "./pages/HomePage";
import AppLayout from "./components/AppLayout";
import Home from "./pages/Home";
import Paths from "./pages/Paths";
import Requests from "./pages/Requests";
import MyRequests from "./pages/MyRequests";
import Profile from "./pages/Profile";
import IntroOutcome from "./pages/IntroOutcome";

export default function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={<HomePage />} />
          <Route element={<AppLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/paths" element={<Paths />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/my-requests" element={<MyRequests />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/intro/:id" element={<IntroOutcome />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}
