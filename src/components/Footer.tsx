import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

const Footer = () => (
  <footer className="bg-secondary/50 border-t mt-20">
    <div className="container mx-auto px-4 md:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <Link to="/" className="flex items-center gap-2 text-xl font-heading font-bold text-primary mb-4">
            <Heart className="w-6 h-6 fill-primary text-primary" />
            Memento
          </Link>
          <p className="text-muted-foreground">
            Gentle support for memory, routine, and peace of mind.
          </p>
        </div>
        <div>
          <h4 className="font-heading text-lg font-semibold mb-4">Navigation</h4>
          <ul className="space-y-3">
            <li><Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
            <li><Link to="/download" className="text-muted-foreground hover:text-primary transition-colors">Download</Link></li>
            <li><Link to="/auth" className="text-muted-foreground hover:text-primary transition-colors">Sign In</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-heading text-lg font-semibold mb-4">Portals</h4>
          <ul className="space-y-3">
            <li><Link to="/patient-dashboard" className="text-muted-foreground hover:text-primary transition-colors">Patient Portal</Link></li>
            <li><Link to="/caregiver-dashboard" className="text-muted-foreground hover:text-primary transition-colors">Caregiver Portal</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-heading text-lg font-semibold mb-4">Support</h4>
          <ul className="space-y-3">
            <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Accessibility</a></li>
            <li><a href="mailto:support@memento.app" className="text-muted-foreground hover:text-primary transition-colors">Contact Us</a></li>
          </ul>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Memento. Made with care for families everywhere.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
