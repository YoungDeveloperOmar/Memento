import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const links = [
    { to: "/", label: "Home" },
    { to: "/download", label: "Download" },
    { to: "/patient-dashboard", label: "Patient Portal" },
    { to: "/caregiver-dashboard", label: "Caregiver Portal" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b">
      <div className="container mx-auto flex items-center justify-between py-4 px-4 md:px-8">
        <Link to="/" className="flex items-center gap-2 text-2xl font-heading font-bold text-primary">
          <Heart className="w-7 h-7 fill-primary text-primary" />
          Memento
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-lg font-medium transition-colors hover:text-primary ${
                location.pathname === link.to ? "text-primary" : "text-foreground/70"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="lg" asChild>
            <Link to="/auth">Sign In</Link>
          </Button>
          <Button size="lg" asChild>
            <Link to="/auth?mode=signup">Get Started</Link>
          </Button>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-muted"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden border-t bg-background px-4 pb-6 pt-2">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setIsOpen(false)}
              className="block py-3 text-lg font-medium text-foreground/80 hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-4 flex flex-col gap-3">
            <Button variant="outline" size="lg" asChild>
              <Link to="/auth" onClick={() => setIsOpen(false)}>Sign In</Link>
            </Button>
            <Button size="lg" asChild>
              <Link to="/auth?mode=signup" onClick={() => setIsOpen(false)}>Get Started</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
