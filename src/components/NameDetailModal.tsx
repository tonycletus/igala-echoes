import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IgalaName } from "@/types/names";
import { Volume2, Share2, Heart, Bookmark, X, Quote } from "lucide-react";
import { useState } from "react";

interface NameDetailModalProps {
  name: IgalaName | null;
  isOpen: boolean;
  onClose: () => void;
}

const categoryColors: Record<string, string> = {
  spiritual: "bg-igala-gold/20 text-igala-amber border-igala-gold/30",
  circumstantial: "bg-igala-coral/20 text-igala-coral border-igala-coral/30",
  virtue: "bg-igala-olive/20 text-igala-olive border-igala-olive/30",
  strength: "bg-igala-brown/20 text-igala-brown border-igala-brown/30",
  leadership: "bg-igala-amber/20 text-igala-amber border-igala-amber/30",
};

const NameDetailModal = ({ name, isOpen, onClose }: NameDetailModalProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  if (!name) return null;

  const speakName = () => {
    const utterance = new SpeechSynthesisUtterance(name.name);
    utterance.lang = "en-NG";
    utterance.rate = 0.7;
    speechSynthesis.speak(utterance);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card border-border/50 p-0 overflow-hidden">
        {/* Header with gradient */}
        <div className="relative p-8 pb-12" style={{ background: 'linear-gradient(135deg, hsl(25, 40%, 10%) 0%, hsl(20, 35%, 18%) 100%)' }}>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-4 right-4 text-igala-cream/70 hover:text-igala-cream hover:bg-igala-cream/10"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center gap-2 mb-4">
            <span className={`text-xs px-3 py-1 rounded-full border ${categoryColors[name.category] || "bg-muted"}`}>
              {name.category}
            </span>
            <span className="text-igala-cream/60">
              {name.gender === "male" ? "♂ Male" : name.gender === "female" ? "♀ Female" : "⚥ Unisex"}
            </span>
          </div>
          
          <DialogHeader>
            <DialogTitle className="font-display text-5xl md:text-6xl font-bold text-igala-cream">
              {name.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex items-center gap-4 mt-4">
            <p className="text-igala-cream/70 italic">/{name.pronunciation}/</p>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-igala-gold hover:text-igala-gold hover:bg-igala-gold/10"
              onClick={speakName}
            >
              <Volume2 className="w-4 h-4 mr-2" />
              Listen
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Meaning */}
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Meaning
            </h4>
            <p className="text-2xl font-display font-semibold text-foreground">
              "{name.meaning}"
            </p>
          </div>

          {/* Origin Story */}
          <div className="relative">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Origin Story
            </h4>
            <div className="relative pl-6 border-l-2 border-igala-gold/30">
              <p className="text-foreground/80 leading-relaxed">
                {name.origin_story}
              </p>
            </div>
          </div>

          {/* Proverb */}
          <div className="relative bg-igala-gold/5 rounded-xl p-6 border border-igala-gold/20">
            <Quote className="absolute top-4 left-4 w-8 h-8 text-igala-gold/30" />
            <div className="pl-8">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Related Proverb
              </h4>
              <p className="text-lg font-display italic text-foreground/90">
                "{name.related_proverb}"
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <div className="flex items-center gap-2">
              <Button 
                variant={isLiked ? "accent" : "outline"}
                size="sm"
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                {isLiked ? "Loved" : "Love"}
              </Button>
              <Button 
                variant={isSaved ? "default" : "outline"}
                size="sm"
                onClick={() => setIsSaved(!isSaved)}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
                {isSaved ? "Saved" : "Save"}
              </Button>
            </div>
            <Button 
              variant="cultural"
              size="sm"
              onClick={() => {
                navigator.share?.({
                  title: name.name,
                  text: `${name.name} means "${name.meaning}". ${name.origin_story}`,
                });
              }}
            >
              <Share2 className="w-4 h-4" />
              Share Name Card
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NameDetailModal;