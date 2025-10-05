interface SectionNavProps {
  sections: string[];
  activeSection: number;
  onNavigate: (index: number) => void;
}

export default function SectionNav({ sections, activeSection, onNavigate }: SectionNavProps) {
  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-40">
      {sections.map((_, i) => (
        <div
          key={i}
          onClick={() => onNavigate(i)}
          className={`transition-all duration-300 rounded-full cursor-pointer ${
            activeSection === i ? "w-3 h-10 bg-indigo-500" : "w-3 h-3 bg-gray-400/50 hover:bg-indigo-300"
          }`}
        />
      ))}
    </div>
  );
}
