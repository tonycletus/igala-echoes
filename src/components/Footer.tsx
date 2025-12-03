import { Heart, Sparkles } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-16 mt-20" style={{ background: 'linear-gradient(135deg, hsl(25, 40%, 10%) 0%, hsl(20, 35%, 18%) 100%)' }}>
      <div className="container px-4">
        <div className="text-center">
          {/* Logo */}
          <h3 className="font-display text-3xl font-bold text-igala-cream mb-4">
            Ìgálá{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-igala-gold to-igala-coral">
              Orúkọ
            </span>
          </h3>
          
          <p className="text-igala-cream/60 max-w-md mx-auto mb-8">
            Preserving the sacred tradition of Igala naming — one name, one story, one generation at a time.
          </p>

          {/* Decorative Element */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-20 bg-igala-gold/30" />
            <Sparkles className="w-5 h-5 text-igala-gold" />
            <div className="h-px w-20 bg-igala-gold/30" />
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-igala-cream/50 mb-8">
            <a href="#" className="hover:text-igala-gold transition-colors">About</a>
            <a href="#" className="hover:text-igala-gold transition-colors">Contribute a Name</a>
            <a href="#" className="hover:text-igala-gold transition-colors">Privacy</a>
            <a href="#" className="hover:text-igala-gold transition-colors">Contact</a>
          </div>

          {/* Copyright */}
          <p className="text-sm text-igala-cream/40 flex items-center justify-center gap-2">
            Made with <Heart className="w-4 h-4 text-igala-coral fill-current" /> for the Igala people
          </p>
          <p className="text-xs text-igala-cream/30 mt-2">
            © {new Date().getFullYear()} Ìgálá Orúkọ. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;