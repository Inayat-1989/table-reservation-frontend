import { Routes, Route } from "react-router-dom";

import About from "./components/layout/About";
import Chefs from "./components/layout/Chefs";
import Contact from "./components/layout/Contact";
import Gallery from "./components/layout/Gallary";
import Hero from "./components/layout/Hero";
import Menu from "./components/layout/Menu";
import MyReservations from "./components/layout/MyReservations";
import BookingFlow from "./components/layout/BookingFlow";
import WhyUs from "./components/layout/WhyUs";

import Footer from "./components/navigation/Footer";
import Header from "./components/navigation/Header";

function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <WhyUs />
      <Menu />
      <Chefs />
      <BookingFlow />
      <Gallery />
      <Contact />
    </>
  );
}

function App() {
  return (
    <>
      <Header />

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/my-reservations" element={<MyReservations />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;
