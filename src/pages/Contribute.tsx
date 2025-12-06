import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Contribute = () => {
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    meaning: "",
    pronunciation: "",
    gender: "unisex",
    category: "spiritual",
    originStory: "",
    relatedProverb: ""
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const categories = [
    { value: "spiritual", label: "Spiritual" },
    { value: "family", label: "Family" },
    { value: "wisdom", label: "Wisdom" },
    { value: "prosperity", label: "Prosperity" },
    { value: "day-born", label: "Day-Born" },
    { value: "occupational", label: "Occupational" },
    { value: "descriptive", label: "Descriptive" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.meaning.trim()) {
      toast({
        title: "Required fields missing",
        description: "Please provide at least a name and meaning.",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      navigate("/auth");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("name_submissions").insert({
        user_id: user.id,
        name: formData.name.trim(),
        meaning: formData.meaning.trim(),
        pronunciation: formData.pronunciation.trim() || `/${formData.name.toLowerCase()}/`,
        gender: formData.gender,
        category: formData.category,
        origin_story: formData.originStory.trim() || null,
        related_proverb: formData.relatedProverb.trim() || null,
        status: "pending"
      });

      if (error) throw error;

      toast({
        title: "Name submitted successfully!",
        description: "Your contribution is pending review. Thank you for preserving Igala heritage!"
      });

      // Reset form
      setFormData({
        name: "",
        meaning: "",
        pronunciation: "",
        gender: "unisex",
        category: "spiritual",
        originStory: "",
        relatedProverb: ""
      });
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Submission failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-igala-gold/30 border-t-igala-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      {/* Hero */}
      <section 
        className="relative py-16 px-0 sm:px-4 pt-28"
        style={{ background: 'linear-gradient(135deg, hsl(78, 52%, 32%) 0%, hsl(38, 91%, 55%) 100%)' }}
      >
        <div className="absolute inset-0 bg-black/10" />
        <div className="container mx-auto max-w-3xl relative z-10 text-center px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-6">
            <Heart className="w-4 h-4 text-white" />
            <span className="text-white/90 text-sm font-medium">Community Contribution</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Share an Igala Name
          </h1>
          <p className="text-white/90 max-w-xl mx-auto">
            Your knowledge helps preserve our heritage. Every name you contribute keeps Igala culture alive for future generations.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-10 px-0 sm:px-4">
        <div className="container mx-auto max-w-4xl">
          <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-6 shadow-elegant border border-border/50 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Omojo"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pronunciation">Pronunciation</Label>
                <Input
                  id="pronunciation"
                  placeholder="e.g., /oh-moh-joh/"
                  value={formData.pronunciation}
                  onChange={(e) => setFormData({ ...formData, pronunciation: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meaning">Meaning *</Label>
              <Input
                id="meaning"
                placeholder="e.g., God's child"
                value={formData.meaning}
                onChange={(e) => setFormData({ ...formData, meaning: e.target.value })}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select value={formData.gender} onValueChange={(v) => setFormData({ ...formData, gender: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="unisex">Unisex</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="originStory">Origin Story (Optional)</Label>
              <Textarea
                id="originStory"
                placeholder="Share the cultural context or story behind this name..."
                value={formData.originStory}
                onChange={(e) => setFormData({ ...formData, originStory: e.target.value })}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="proverb">Related Proverb (Optional)</Label>
              <Input
                id="proverb"
                placeholder="e.g., A child is the crown of life"
                value={formData.relatedProverb}
                onChange={(e) => setFormData({ ...formData, relatedProverb: e.target.value })}
              />
            </div>

            <Button type="submit" variant="cultural" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Name for Review
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-muted-foreground text-sm mt-4">
            Your submission will be reviewed by our team before being added to the database.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Contribute;
