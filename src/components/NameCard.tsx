import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IgalaName } from "@/types/names";
import { Volume2, Share2, Heart, Bookmark } from "lucide-react";
import { useNameActions } from "@/hooks/useNameActions";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface NameCardProps {
  name: IgalaName;
  onSelect: (name: IgalaName) => void;
}

const categoryColors: Record<string, string> = {
  spiritual: "bg-igala-gold/20 text-igala-amber border-igala-gold/30",
  circumstantial: "bg-igala-coral/20 text-igala-coral border-igala-coral/30",
  virtue: "bg-igala-olive/20 text-igala-olive border-igala-olive/30",
  strength: "bg-igala-brown/20 text-igala-brown border-igala-brown/30",
  leadership: "bg-igala-amber/20 text-igala-amber border-igala-amber/30",
  family: "bg-igala-salmon/20 text-igala-salmon border-igala-salmon/30",
  wisdom: "bg-igala-yellow/20 text-igala-brown border-igala-yellow/30",
  prosperity: "bg-igala-gold/20 text-igala-gold border-igala-gold/30",
  "day-born": "bg-igala-coral/20 text-igala-red border-igala-coral/30",
  occupational: "bg-igala-olive/20 text-igala-brown border-igala-olive/30",
  descriptive: "bg-igala-tan/20 text-igala-brown border-igala-tan/30",
};

const genderIcons: Record<string, string> = {
  male: "♂",
  female: "♀",
  unisex: "⚥",
};

const NameCard = ({ name, onSelect }: NameCardProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLiked, isFavorited, toggleLike, toggleFavorite } = useNameActions(name.id);

  const speakName = () => {
    const utterance = new SpeechSynthesisUtterance(name.name);
    utterance.lang = "en-NG";
    utterance.rate = 0.7;
    speechSynthesis.speak(utterance);
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      navigate("/auth");
      return;
    }
    await toggleLike();
  };

  const handleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      navigate("/auth");
      return;
    }
    await toggleFavorite();
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareData = {
      title: name.name,
      text: `${name.name} means "${name.meaning}". An Ìgálá name.`,
      url: window.location.origin,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(
        `${name.name} - "${name.meaning}". ${name.origin_story}`
      );
      toast({ title: "Copied to clipboard!" });
    }
  };

  return (
    <Card 
      className="group cursor-pointer hover:shadow-xl hover:-translate-y-1 border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden"
      onClick={() => onSelect(name)}
    >
      {/* Accent Bar */}
      <div className="h-1.5 bg-gradient-to-r from-igala-gold via-igala-amber to-igala-coral" />
      
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs px-2 py-0.5 rounded-full border ${categoryColors[name.category] || "bg-muted text-muted-foreground"}`}>
                {name.category}
              </span>
              <span className="text-sm text-muted-foreground">{genderIcons[name.gender]}</span>
            </div>
            <h3 className="font-display text-3xl font-bold text-foreground group-hover:text-igala-coral transition-colors">
              {name.name}
            </h3>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-muted-foreground hover:text-igala-gold"
            onClick={(e) => {
              e.stopPropagation();
              speakName();
            }}
          >
            <Volume2 className="w-5 h-5" />
          </Button>
        </div>

        {/* Pronunciation */}
        <p className="text-sm text-muted-foreground italic mb-3">
          /{name.pronunciation}/
        </p>

        {/* Meaning */}
        <p className="text-lg font-medium text-foreground/90 mb-4">
          "{name.meaning}"
        </p>

        {/* Origin Story Preview */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {name.origin_story}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm"
              className={isLiked ? "text-igala-coral" : "text-muted-foreground hover:text-igala-coral"}
              onClick={handleLike}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className={isFavorited ? "text-igala-gold" : "text-muted-foreground hover:text-igala-gold"}
              onClick={handleFavorite}
            >
              <Bookmark className={`w-4 h-4 ${isFavorited ? "fill-current" : ""}`} />
            </Button>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-muted-foreground hover:text-igala-olive"
            onClick={handleShare}
          >
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NameCard;
