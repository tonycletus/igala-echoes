import { Button } from "@/components/ui/button";
import { Search, Sparkles } from "lucide-react";
import igalaPattern from "@/assets/igala-pattern.png";

interface HeroProps {
  onExploreClick: () => void;
}

const Hero = ({ onExploreClick }: HeroProps) => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(25, 40%, 10%) 0%, hsl(20, 35%, 18%) 100%)' }}>
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-igala-gold/10 blur-3xl animate-float" />
      <div className="absolute bottom-32 right-20 w-40 h-40 rounded-full bg-igala-coral/10 blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      <div className="absolute top-1/2 left-1/4 w-24 h-24 rounded-full bg-igala-olive/10 blur-2xl animate-float" style={{ animationDelay: "4s" }} />
      
      {/* Cultural Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `url(${igalaPattern})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="container relative z-10 px-4 text-center">
        {/* Cultural Badge */}
        <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-igala-gold/10 border border-igala-gold/30 animate-fade-up">
          <Sparkles className="w-4 h-4 text-igala-gold" />
          <span className="text-sm font-medium text-igala-cream/90">Preserving Igala Heritage</span>
        </div>

        {/* Main Title */}
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-igala-cream mb-6 animate-fade-up" style={{ animationDelay: "0.2s" }}>
          Igala{" "}
          <span className="relative inline-block">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-igala-gold via-igala-amber to-igala-coral">
              Echoes
            </span>
            <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-igala-gold via-igala-amber to-igala-coral rounded-full" />
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-igala-cream/70 max-w-2xl mx-auto mb-4 font-light animate-fade-up" style={{ animationDelay: "0.3s" }}>
          Where Every Name Carries a Story
        </p>
        
        <p className="text-base md:text-lg text-igala-cream/50 max-w-xl mx-auto mb-12 animate-fade-up" style={{ animationDelay: "0.4s" }}>
          Discover the profound meanings, rich histories, and sacred origins of Igala names. 
          Your ancestors speak through the names they gave.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-up" style={{ animationDelay: "0.5s" }}>
          <Button 
            variant="cultural" 
            size="xl"
            onClick={onExploreClick}
            className="group"
          >
            <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Explore Names
          </Button>
        </div>

        {/* Stats */}
        {/* <div className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto animate-fade-up" style={{ animationDelay: "0.6s" }}>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-display font-bold text-igala-gold">9+</div>
            <div className="text-sm text-igala-cream/50">Sacred Names</div>
          </div>
          <div className="text-center border-x border-igala-cream/10">
            <div className="text-3xl md:text-4xl font-display font-bold text-igala-coral">5</div>
            <div className="text-sm text-igala-cream/50">Categories</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-display font-bold text-igala-olive">∞</div>
            <div className="text-sm text-igala-cream/50">Stories</div>
          </div>
        </div> */}
      </div>

      {/* Scroll Indicator */}
      {/* <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-igala-cream/30 flex justify-center pt-2">
          <div className="w-1 h-2 rounded-full bg-igala-gold animate-pulse" />
        </div>
      </div> */}
    </section>
  );
};

export default Hero;