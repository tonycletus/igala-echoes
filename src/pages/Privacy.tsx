import { Link } from "react-router-dom";
import { Shield, Eye, Cookie, Server, Heart } from "lucide-react";
import Footer from "@/components/Footer";

const Privacy = () => {
  return (
    <main className="min-h-screen bg-background">
      {/* Back Link - Top Left */}
      <div className="container mx-auto max-w-3xl px-0 sm:px-4 py-6">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-igala-coral hover:text-igala-coral/80 font-medium transition-colors px-4"
        >
          ← Back to Names Explorer
        </Link>
      </div>
      
      {/* Hero */}
      <section 
        className="relative py-16 px-0 sm:px-4"
        style={{ background: 'linear-gradient(135deg, hsl(78, 52%, 32%) 0%, hsl(32, 85%, 52%) 100%)' }}
      >
        <div className="absolute inset-0 bg-black/10" />
        <div className="container mx-auto max-w-3xl relative z-10 text-center px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-6">
            <Shield className="w-4 h-4 text-white" />
            <span className="text-white/90 text-sm font-medium">Privacy First</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            No Surveillance. Pure Culture.
          </h1>
          <p className="text-white/90 max-w-xl mx-auto">
            We believe cultural preservation should be free from corporate tracking and data harvesting.
          </p>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="py-10 px-0 sm:px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="bg-card rounded-2xl p-4 md:p-8 shadow-elegant border border-border/50 space-y-8">
            
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-xl bg-igala-olive/10 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-igala-olive" />
                </div>
              </div>
              <div>
                <h2 className="font-display text-lg md:text-xl font-bold text-foreground mb-1">No Tracking</h2>
                <p className="text-muted-foreground text-sm md:text-base">
                  We do not track your browsing behavior, clicks, or interactions. Your exploration of Igala names 
                  is entirely private. No analytics scripts, no user profiling, no behavioral data collection.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-xl bg-igala-gold/10 flex items-center justify-center">
                  <Cookie className="w-5 h-5 text-igala-gold" />
                </div>
              </div>
              <div>
                <h2 className="font-display text-lg md:text-xl font-bold text-foreground mb-1">No Cookies</h2>
                <p className="text-muted-foreground text-sm md:text-base">
                  This application does not use cookies, not for tracking, not for advertising, not for anything. 
                  Your browser remains free from our digital fingerprints.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-xl bg-igala-coral/10 flex items-center justify-center">
                  <Server className="w-5 h-5 text-igala-coral" />
                </div>
              </div>
              <div>
                <h2 className="font-display text-lg md:text-xl font-bold text-foreground mb-1">No Data Storage</h2>
                <p className="text-muted-foreground text-sm md:text-base">
                  When you submit a name contribution, the form generates a JSON snippet on your device. 
                  Nothing is sent to our servers. Nothing is stored in databases. The data stays with you until 
                  you choose to share it.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-xl bg-igala-tan/20 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-igala-brown" />
                </div>
              </div>
              <div>
                <h2 className="font-display text-lg md:text-xl font-bold text-foreground mb-1">Cultural Philosophy</h2>
                <p className="text-muted-foreground text-sm md:text-base">
                  Igala Echoes is built on a "no surveillance" philosophy. We believe that cultural preservation 
                  should honor the trust our ancestors placed in knowledge sharing open, honest, and free from 
                  exploitation. This app exists to serve the Igala community, not to monetize it.
                </p>
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <p className="text-muted-foreground text-xs md:text-sm text-center">
                This privacy policy is effective as of { new Date().getFullYear()  } and applies to all users of Igala Echoes. 
                We reserve the right to update this policy, but our core commitment to privacy will never change. 
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default Privacy;
