import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useMemento } from "@/context/MementoContext";
import { resolveDashboardPath } from "@/lib/memento-api";

const Footer = () => {
  const { currentRole } = useMemento();

  return (
    <footer className="mt-20 border-t bg-secondary/50">
      <div className="container mx-auto px-4 py-16 md:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div>
            <Link to="/" className="mb-4 flex items-center gap-2 text-xl font-heading font-bold text-primary">
              <Heart className="h-6 w-6 fill-primary text-primary" />
              Memento
            </Link>
            <p className="text-muted-foreground">
              Gentle support for memory, routine, and peace of mind.
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-lg font-semibold font-heading">Navigation</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-muted-foreground transition-colors hover:text-primary">Home</Link></li>
              <li><Link to="/download" className="text-muted-foreground transition-colors hover:text-primary">Download</Link></li>
              <li><a href="/#contact" className="text-muted-foreground transition-colors hover:text-primary">Contact Support</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-lg font-semibold font-heading">Account</h4>
            <ul className="space-y-3">
              {currentRole ? (
                <li>
                  <Link
                    to={resolveDashboardPath(currentRole)}
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    Dashboard
                  </Link>
                </li>
              ) : (
                <>
                  <li><Link to="/auth" className="text-muted-foreground transition-colors hover:text-primary">Sign In</Link></li>
                  <li><Link to="/auth?mode=signup" className="text-muted-foreground transition-colors hover:text-primary">Create Caregiver Account</Link></li>
                </>
              )}
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-lg font-semibold font-heading">Policies</h4>
            <ul className="space-y-3">
              <li><Link to="/privacy-policy" className="text-muted-foreground transition-colors hover:text-primary">Privacy Policy</Link></li>
              <li><Link to="/accessibility" className="text-muted-foreground transition-colors hover:text-primary">Accessibility</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Memento. Made with care for families everywhere.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
