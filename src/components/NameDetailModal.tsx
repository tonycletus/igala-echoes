import { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IgalaName } from "@/types/names";
import { Volume2, Share2, Heart, Bookmark, X, Quote, Download, Loader2 } from "lucide-react";
import { useNameActions } from "@/hooks/useNameActions";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { toPng } from "html-to-image";
import NameImageCard from "./NameImageCard";

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
  family: "bg-igala-salmon/20 text-igala-salmon border-igala-salmon/30",
  wisdom: "bg-igala-yellow/20 text-igala-brown border-igala-yellow/30",
  prosperity: "bg-igala-gold/20 text-igala-gold border-igala-gold/30",
  "day-born": "bg-igala-coral/20 text-igala-red border-igala-coral/30",
  occupational: "bg-igala-olive/20 text-igala-brown border-igala-olive/30",
  descriptive: "bg-igala-tan/20 text-igala-brown border-igala-tan/30",
};

const NameDetailModal = ({ name, isOpen, onClose }: NameDetailModalProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const imageCardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const { isLiked, isFavorited, toggleLike, toggleFavorite } = useNameActions(
    name?.id || ""
  );

  if (!name) return null;

  const speakName = () => {
    const utterance = new SpeechSynthesisUtterance(name.name);
    utterance.lang = "en-NG";
    utterance.rate = 0.7;
    speechSynthesis.speak(utterance);
  };

  const handleLike = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    await toggleLike();
  };

  const handleFavorite = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    await toggleFavorite();
  };

  const handleShare = async () => {
    const shareData = {
      title: name.name,
      text: `${name.name} means "${name.meaning}". ${name.origin_story}`,
      url: window.location.origin,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(
        `${name.name} - "${name.meaning}". ${name.origin_story}`
      );
      toast({ title: "Copied to clipboard!" });
    }
  };

  const handleDownloadImage = async () => {
    if (!imageCardRef.current) return;

    setIsDownloading(true);
    try {
      const dataUrl = await toPng(imageCardRef.current, {
        quality: 1,
        pixelRatio: 2,
      });

      const link = document.createElement("a");
      link.download = `${name.name.toLowerCase()}-igala-name.png`;
      link.href = dataUrl;
      link.click();

      toast({ title: "Image downloaded!" });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-lg w-full h-[85vh] sm:h-[90vh] mx-auto bg-card border-border/50 p-0 overflow-hidden flex flex-col">
        {/* Header with gradient */}
        <div
          className="relative p-4 pb-8 sm:p-6 sm:pb-10 flex-shrink-0"
          style={{
            background:
              "linear-gradient(135deg, hsl(25, 40%, 10%) 0%, hsl(20, 35%, 18%) 100%)",
          }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-igala-cream/70 hover:text-igala-cream hover:bg-igala-cream/10"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>

          <div className="flex items-center gap-2 mb-4">
            <span
              className={`text-xs px-3 py-1 rounded-full border ${
                categoryColors[name.category] || "bg-muted"
              }`}
            >
              {name.category}
            </span>
            <span className="text-igala-cream/60">
              {name.gender === "male"
                ? "♂ Male"
                : name.gender === "female"
                ? "♀ Female"
                : "⚥ Unisex"}
            </span>
          </div>

          <DialogHeader>
            <DialogTitle className="font-display text-4xl md:text-5xl font-bold text-igala-cream">
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
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto flex-grow">
          {/* Meaning */}
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Meaning
            </h4>
            <p className="text-xl sm:text-2xl font-display font-semibold text-foreground">
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
          <div className="relative bg-igala-gold/5 rounded-xl p-4 sm:p-6 border border-igala-gold/20">
            <Quote className="absolute top-4 left-4 w-6 h-6 sm:w-8 sm:h-8 text-igala-gold/30" />
            <div className="pl-8">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Related Proverb
              </h4>
              <p className="text-base sm:text-lg font-display italic text-foreground/90">
                "{name.related_proverb}"
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-3 sm:gap-4 pt-4 border-t border-border/50 flex-shrink-0">
            <div className="flex items-center gap-2">
              <Button
                variant={isLiked ? "accent" : "outline"}
                size="sm"
                onClick={handleLike}
              >
                <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                {isLiked ? "Loved" : "Love"}
              </Button>
              <Button
                variant={isFavorited ? "default" : "outline"}
                size="sm"
                onClick={handleFavorite}
              >
                <Bookmark
                  className={`w-4 h-4 ${isFavorited ? "fill-current" : ""}`}
                />
                {isFavorited ? "Saved" : "Save"}
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadImage}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                Download
              </Button>
              <Button variant="cultural" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
          </div>
        </div>

        {/* Hidden Image Card for Download */}
        <div className="absolute -left-[9999px] top-0">
          <NameImageCard ref={imageCardRef} name={name} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NameDetailModal;
