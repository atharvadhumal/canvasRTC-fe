import Features from "./hero/Features";
import Footer from "./hero/Footer";
import Hero from "./hero/Hero";
import HowItWorks from "./hero/HowItWorks";
import Navbar from "./navbar/Navbar";


const HomePage = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-top bg-fixed"
        style={{
    backgroundImage:
      "linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.9)), url('/home-bg.jpg')",
  }}
    >
      <div>
        <Navbar />
        <Hero />
        <Features />
        <HowItWorks />
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
