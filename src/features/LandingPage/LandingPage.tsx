import { useEffect, useRef, useState } from "react";
import Navbar from "./components/Navbar";
import SectionNav from "./components/SectionNav";
import SectionHero from "./components/SectionHero";
import SectionBenefits from "./components/SectionBenefits";
import SectionGuide from "./components/SectionGuide";
import SectionFAQ from "./components/SectionFAQ";
import JoinBadge from "./components/JoinBadge";

export default function LandingPage() {
    const sections = ["hero", "benefits", "guide", "faq"];
    const [activeSection, setActiveSection] = useState(0);
    const sectionRefs = useRef<(HTMLElement | null)[]>([]);
    const isScrolling = useRef(false);

    const handleScroll = (e: WheelEvent) => {
        e.preventDefault();
        if (isScrolling.current) return;
        const delta = Math.sign(e.deltaY);
        const nextIndex = Math.min(Math.max(activeSection + delta, 0), sections.length - 1);

        if (nextIndex !== activeSection) {
            isScrolling.current = true;
            setActiveSection(nextIndex);
            sectionRefs.current[nextIndex]?.scrollIntoView({ behavior: "smooth" });
            setTimeout(() => (isScrolling.current = false), 1000);
        }
    };

    useEffect(() => {
        window.addEventListener("wheel", handleScroll, { passive: false });
        return () => window.removeEventListener("wheel", handleScroll);
    });

    return (
        <div className="relative overflow-hidden bg-white text-gray-900 font-[Manrope]">
            {/* 🌊 Background loang màu xanh nhẹ */}
            <div
                className="absolute inset-0 -z-10"
                style={{
                    background: `
            radial-gradient(600px at 20% 30%, rgba(186, 230, 253, 0.35), transparent 70%),
            radial-gradient(800px at 80% 40%, rgba(191, 219, 254, 0.3), transparent 70%),
            radial-gradient(700px at 40% 80%, rgba(219, 234, 254, 0.25), transparent 70%),
            #ffffff
          `,
                }}
            />

            <Navbar
                onNavigate={(i) => {
                    setActiveSection(i);
                    sectionRefs.current[i]?.scrollIntoView({ behavior: "smooth" });
                }}
            />

            <SectionNav
                sections={sections}
                activeSection={activeSection}
                onNavigate={(i) => {
                    setActiveSection(i);
                    sectionRefs.current[i]?.scrollIntoView({ behavior: "smooth" });
                }}
            />

            <SectionHero ref={(el) => (sectionRefs.current[0] = el)} />
            <SectionBenefits ref={(el) => (sectionRefs.current[1] = el)} />
            <SectionGuide ref={(el) => (sectionRefs.current[2] = el)} />
            <SectionFAQ ref={(el) => (sectionRefs.current[3] = el)} />

            <JoinBadge />
        </div>
    );
}
