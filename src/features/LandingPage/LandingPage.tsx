import { useEffect, useRef, useState, useCallback } from "react";
import Navbar from "./components/Navbar";
import SectionNav from "./components/SectionNav";
import SectionHero from "./components/SectionHero";
import SectionBenefits from "./components/SectionBenefits";
import SectionGuide from "./components/SectionGuide";
import SectionFAQ from "./components/SectionFAQ";
import JoinBadge from "./components/JoinBadge";
import RegisterCollaboratorModal from "../../components/RegisterCollaboratorModal";

export default function LandingPage() {
  const sections = ["hero", "benefits", "guide", "faq"];
  const [activeSection, setActiveSection] = useState(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const isScrolling = useRef(false);
  const scrollTimeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Modal state + ref để tránh closure cũ
  const [isOpenRegisterCollaboratorModal, setIsOpenRegisterCollaboratorModal] = useState(false);
  const isModalOpenRef = useRef(false);
  useEffect(() => {
    isModalOpenRef.current = isOpenRegisterCollaboratorModal;
  }, [isOpenRegisterCollaboratorModal]);

  // Dùng ref để đọc activeSection hiện tại trong handler (tránh stale value)
  const activeIndexRef = useRef(activeSection);
  useEffect(() => {
    activeIndexRef.current = activeSection;
  }, [activeSection]);

  // Hàm cuộn mượt giữa các section (DÙNG REFS)
  const handleScroll = useCallback((e: WheelEvent) => {
    // Nếu modal đang mở, bỏ qua hoàn toàn (để modal tự xử lý scroll)
    if (isModalOpenRef.current) return;

    // Chặn mặc định để mình điều khiển cuộn
    e.preventDefault();
    if (isScrolling.current) return;

    const delta = Math.sign(e.deltaY);
    const current = activeIndexRef.current;
    const nextIndex = Math.min(Math.max(current + delta, 0), sections.length - 1);

    if (nextIndex !== current) {
      isScrolling.current = true;
      setActiveSection(nextIndex);

      const el = sectionRefs.current[nextIndex];
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: y, behavior: "smooth" });
      }

      // Clear timeout cũ nếu còn
      if (scrollTimeoutId.current) clearTimeout(scrollTimeoutId.current);
      // Mở khóa sau 1s (khớp animation/scroll)
      scrollTimeoutId.current = setTimeout(() => {
        isScrolling.current = false;
        scrollTimeoutId.current = null;
      }, 1000);
    }
  }, [sections.length]);

  // Gắn listener 1 lần
  useEffect(() => {
    window.addEventListener("wheel", handleScroll, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleScroll);
      if (scrollTimeoutId.current) clearTimeout(scrollTimeoutId.current);
    };
  }, [handleScroll]);

  // Khóa scroll nền khi modal mở (body lock)
  useEffect(() => {
    if (isOpenRegisterCollaboratorModal) {
      const scrollY = window.scrollY;
      const original = {
        position: document.body.style.position,
        top: document.body.style.top,
        left: document.body.style.left,
        right: document.body.style.right,
        width: document.body.style.width,
        overflow: document.body.style.overflow,
      };
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.position = original.position;
        document.body.style.top = original.top;
        document.body.style.left = original.left;
        document.body.style.right = original.right;
        document.body.style.width = original.width;
        document.body.style.overflow = original.overflow;
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpenRegisterCollaboratorModal]);

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
          const el = sectionRefs.current[i];
          if (el) {
            const y = el.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({ top: y, behavior: "smooth" });
          }
        }}
      />

      <SectionNav
        sections={sections}
        activeSection={activeSection}
        onNavigate={(i) => {
          setActiveSection(i);
          const el = sectionRefs.current[i];
          if (el) {
            const y = el.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({ top: y, behavior: "smooth" });
          }
        }}
      />

      <SectionHero ref={(el) => (sectionRefs.current[0] = el)} />
      <SectionBenefits ref={(el) => (sectionRefs.current[1] = el)} />
      <SectionGuide
        ref={(el) => (sectionRefs.current[2] = el)}
        onOpenRegister={() => setIsOpenRegisterCollaboratorModal(true)}
      />
      <SectionFAQ ref={(el) => (sectionRefs.current[3] = el)} />

      <JoinBadge />

      <RegisterCollaboratorModal
        isOpen={isOpenRegisterCollaboratorModal}
        onClose={() => setIsOpenRegisterCollaboratorModal(false)}
      />
    </div>
  );
}
