import React from "react";
import { useTheme } from "../hooks/useTheme";

function Footer() {
  const { theme } = useTheme();
  const bgClass = theme === "dark" ? "bg-sky-600" : "bg-sky-500";

  return (
    <footer className={`footer sm:footer-horizontal footer-center ${bgClass} text-base-content p-4 `}>
      <aside>

        <p className="text-xs">
          Product of Visal Gunarathne
        </p>
      </aside>
    </footer>
  );
}

export default Footer;
