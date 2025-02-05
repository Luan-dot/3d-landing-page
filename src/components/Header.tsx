interface HeaderProps {
  onSectionChange: (section: "projects" | "about" | "contact") => void;
  currentSection: "projects" | "about" | "contact";
}

export default function Header({
  onSectionChange,
  currentSection,
}: HeaderProps) {
  return (
    <header className="absolute top-0 left-0 right-0 z-10 p-4">
      <nav className="flex justify-between items-center max-w-6xl mx-auto">
        <div className="flex items-center">
          <span className="text-2xl font-bold">Brumi</span>
        </div>
        <ul className="flex space-x-6">
          <li>
            <button
              onClick={() => onSectionChange("projects")}
              className={`hover:text-green-300 ${
                currentSection === "projects" ? "text-green-300" : ""
              }`}
            >
              Projects
            </button>
          </li>
          <li>
            <button
              onClick={() => onSectionChange("about")}
              className={`hover:text-green-300 ${
                currentSection === "about" ? "text-green-300" : ""
              }`}
            >
              About Us
            </button>
          </li>
          <li>
            <button
              onClick={() => onSectionChange("contact")}
              className={`hover:text-green-300 ${
                currentSection === "contact" ? "text-green-300" : ""
              }`}
            >
              Contact
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
