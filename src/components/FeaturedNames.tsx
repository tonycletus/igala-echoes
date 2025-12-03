import { IgalaName } from "@/types/names";
import { Card } from "@/components/ui/card";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FeaturedNamesProps {
  names: IgalaName[];
  onSelectName: (name: IgalaName) => void;
}

const FeaturedNames = ({ names, onSelectName }: FeaturedNamesProps) => {
  // Pick 3 featured names
  const featuredNames = names.slice(0, 3);

  return (
    <section className="py-20 bg-gradient-to-b from-background via-igala-cream/30 to-background">
      <div className="container px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-igala-gold/10 border border-igala-gold/30">
            <Sparkles className="w-4 h-4 text-igala-gold" />
            <span className="text-sm font-medium text-igala-amber">Featured This Week</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Names That{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-igala-gold to-igala-coral">
              Resonate
            </span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Handpicked names carrying powerful meanings and timeless stories from our elders.
          </p>
        </div>

        {/* Featured Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {featuredNames.map((name, index) => (
            <Card
              key={name.id}
              className="group relative overflow-hidden cursor-pointer border-0 bg-transparent hover:scale-[1.02] transition-all duration-500"
              onClick={() => onSelectName(name)}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 rounded-2xl" style={{ background: 'linear-gradient(135deg, hsl(25, 40%, 10%) 0%, hsl(20, 35%, 18%) 100%)' }} />
              <div className="absolute inset-0 opacity-10 pattern-igala rounded-2xl" />
              
              {/* Content */}
              <div className="relative p-8 min-h-[320px] flex flex-col justify-between">
                {/* Number Badge */}
                <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-igala-gold/20 flex items-center justify-center">
                  <span className="font-display text-xl font-bold text-igala-gold">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div>
                  <p className="text-igala-cream/50 text-sm mb-2 italic">
                    /{name.pronunciation}/
                  </p>
                  <h3 className="font-display text-4xl font-bold text-igala-cream mb-3 group-hover:text-igala-gold transition-colors">
                    {name.name}
                  </h3>
                  <p className="text-xl text-igala-gold font-medium mb-4">
                    "{name.meaning}"
                  </p>
                  <p className="text-igala-cream/60 text-sm line-clamp-3">
                    {name.origin_story}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-igala-cream/10">
                  <span className="text-xs text-igala-cream/40 uppercase tracking-wider">
                    {name.category}
                  </span>
                  <ArrowRight className="w-5 h-5 text-igala-gold group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Hover Glow */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none shadow-glow" />
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button variant="outline" size="lg" className="rounded-full">
            Explore All Names
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedNames;