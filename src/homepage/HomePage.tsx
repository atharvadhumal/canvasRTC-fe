import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CreateRoomModal } from "../dashboard/CreateRoomModal";
import { JoinRoomModal } from "../dashboard/JoinRoomModal";
import Features from "./hero/Features";
import Footer from "./hero/Footer";
import Hero from "./hero/Hero";
import HowItWorks from "./hero/HowItWorks";
import Navbar from "./navbar/Navbar";

const HomePage = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  useEffect(() => {
    if (isLoading || !isAuthenticated) return;

    const action = searchParams.get("action");
    if (action !== "create" && action !== "join") return;

    if (action === "create") setShowCreateModal(true);
    if (action === "join") setShowJoinModal(true);
    setSearchParams({}, { replace: true });
  }, [isAuthenticated, isLoading, searchParams, setSearchParams]);

  const requireAuthThen = (action: "create" | "join") => {
    if (isLoading) return;

    if (isAuthenticated) {
      if (action === "create") setShowCreateModal(true);
      else setShowJoinModal(true);
      return;
    }

    navigate(`/login?next=${encodeURIComponent(`/?action=${action}`)}`);
  };

  return (
    <div
      className="min-h-screen overflow-x-hidden bg-cover bg-top bg-scroll md:bg-fixed"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.9)), url('/home-bg.jpg')",
      }}
    >
      <div>
        <Navbar />
        <Hero
          onCreateRoom={() => requireAuthThen("create")}
          onJoinRoom={() => requireAuthThen("join")}
        />
        <Features />
        <HowItWorks />
        <Footer />
      </div>

      <CreateRoomModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />
      <JoinRoomModal isOpen={showJoinModal} onClose={() => setShowJoinModal(false)} />
    </div>
  );
};

export default HomePage;
