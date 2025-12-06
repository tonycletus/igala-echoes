import { Link } from "react-router-dom";
import { Heart, BookOpen, Users, Globe, Sparkles } from "lucide-react";

const About = () => {
  return (
    <main className="min-h-screen bg-background">
      {/* Back Link - Top Left */}
      <div className="container mx-auto max-w-4xl px-4 py-6">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-igala-coral hover:text-igala-coral/80 font-medium transition-colors"
        >
          ← Back to Names Explorer
        </Link>
      </div>
      
      {/* Hero Section */}
      <section 
        className="relative py-20 px-4"
        style={{ background: 'linear-gradient(135deg, hsl(38, 91%, 55%) 0%, hsl(32, 85%, 52%) 50%, hsl(15, 79%, 55%) 100%)' }}
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto max-w-4xl relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-6">
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-white/90 text-sm font-medium">Our Mission</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Preserving the Soul of Igala
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Every name carries a story. Every story carries a people.
          </p>
        </div>
      </section>

      {/* Mission Content */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <div className="bg-card rounded-2xl p-8 md:p-12 shadow-elegant border border-border/50 mb-12">
              <h2 className="font-display text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                <Heart className="w-8 h-8 text-igala-coral" />
                Why Names Matter
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                In Igala culture, a name is not merely an identifier, it is a prophecy, a prayer, a piece of ancestral wisdom 
                passed down through generations. When an Igala elder names a child, they speak destiny into existence.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                <strong className="text-foreground">Igala Echoes</strong> exists to ensure these sacred traditions survive 
                the test of time. As our world rapidly digitizes, we believe oral heritage must find its place in the 
                digital archive accessible to every Igala person, wherever they may be.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-card rounded-2xl p-8 shadow-elegant border border-border/50">
                <BookOpen className="w-10 h-10 text-igala-olive mb-4" />
                <h3 className="font-display text-xl font-bold text-foreground mb-3">Oral Heritage</h3>
                <p className="text-muted-foreground">
                  For centuries, Igala wisdom was passed from mouth to ear, elder to child, generation to generation. 
                  We honor this tradition while ensuring it endures in new forms.
                </p>
              </div>

              <div className="bg-card rounded-2xl p-8 shadow-elegant border border-border/50">
                <Globe className="w-10 h-10 text-igala-gold mb-4" />
                <h3 className="font-display text-xl font-bold text-foreground mb-3">Digital Preservation</h3>
                <p className="text-muted-foreground">
                  By documenting names, meanings, pronunciations, and stories, we create a living archive that 
                  connects the Igala diaspora to their roots.
                </p>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-8 md:p-12 shadow-elegant border border-border/50">
              <h2 className="font-display text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                <Users className="w-8 h-8 text-igala-gold" />
                Join the Movement
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                This is more than an app, it is a movement. Every name you explore, share, or contribute helps 
                preserve Igala identity for future generations. Whether you're naming a child, reconnecting with 
                your heritage, or simply curious about this rich culture, you are part of something larger.
              </p>
              <blockquote className="border-l-4 border-igala-gold pl-6 italic text-foreground text-xl">
                "A good name is worth more than gold and silver"
                <footer className="text-muted-foreground text-base mt-2 not-italic">
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;
