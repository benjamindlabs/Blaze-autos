import Navbar from "@/components/Navbar";
import ShowroomScrollSequence from "@/components/ShowroomScrollSequence";
import LogoMarquee from "@/components/LogoMarquee";
import BentoGrid from "@/components/BentoGrid";
import InteriorHero from "@/components/InteriorHero";
import Footer from "@/components/Footer";
import PrivateViewingModal from "@/components/PrivateViewingModal";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#000000",
      }}
    >
      <Navbar />
      <ShowroomScrollSequence />
      <LogoMarquee />
      <BentoGrid />
      <InteriorHero />
      <Footer />
      <PrivateViewingModal />
    </main>
  );
}
