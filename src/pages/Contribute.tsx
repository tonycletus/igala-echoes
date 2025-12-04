import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Copy, Download, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const Contribute = () => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    meaning: "",
    pronunciation: "",
    gender: "unisex",
    category: "spiritual",
    originStory: "",
    relatedProverb: ""
  });
  const [generatedJSON, setGeneratedJSON] = useState<string | null>(null);

  const categories = [
    { value: "spiritual", label: "Spiritual" },
    { value: "family", label: "Family" },
    { value: "wisdom", label: "Wisdom" },
    { value: "prosperity", label: "Prosperity" },
    { value: "day-born", label: "Day-Born" },
    { value: "occupational", label: "Occupational" },
    { value: "descriptive", label: "Descriptive" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.meaning) {
      toast({
        title: "Required fields missing",
        description: "Please provide at least a name and meaning.",
        variant: "destructive"
      });
      return;
    }

    const jsonOutput = {
      id: formData.name.toLowerCase().replace(/\s+/g, '-'),
      name: formData.name,
      meaning: formData.meaning,
      pronunciation: formData.pronunciation || `/${formData.name.toLowerCase()}/`,
      gender: formData.gender,
      category: formData.category,
      originStory: formData.originStory || `The name ${formData.name} carries deep significance in Ìgálá culture.`,
      relatedProverb: formData.relatedProverb || "",
      featured: false
    };

    setGeneratedJSON(JSON.stringify(jsonOutput, null, 2));
    toast({
      title: "JSON Generated!",
      description: "Copy or download your contribution below."
    });
  };

  const handleCopy = async () => {
    if (generatedJSON) {
      await navigator.clipboard.writeText(generatedJSON);
      setCopied(true);
      toast({ title: "Copied to clipboard!" });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (generatedJSON) {
      const blob = new Blob([generatedJSON], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${formData.name.toLowerCase()}-contribution.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section 
        className="relative py-16 px-4"
        style={{ background: 'linear-gradient(135deg, hsl(78, 52%, 32%) 0%, hsl(38, 91%, 55%) 100%)' }}
      >
        <div className="absolute inset-0 bg-black/10" />
        <div className="container mx-auto max-w-3xl relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-6">
            <Heart className="w-4 h-4 text-white" />
            <span className="text-white/90 text-sm font-medium">Community Contribution</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Share an Ìgálá Name
          </h1>
          <p className="text-white/90 max-w-xl mx-auto">
            Your knowledge helps preserve our heritage. Every name you contribute keeps Ìgálá culture alive for future generations.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-8 shadow-elegant border border-border/50 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
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

            <div className="grid md:grid-cols-2 gap-6">
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

            <Button type="submit" variant="cultural" size="lg" className="w-full">
              <Sparkles className="w-5 h-5 mr-2" />
              Generate JSON Contribution
            </Button>
          </form>

          {/* Generated JSON Output */}
          {generatedJSON && (
            <div className="mt-8 bg-card rounded-2xl p-6 shadow-elegant border border-border/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-lg font-semibold text-foreground">Your Contribution</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCopy}>
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownload}>
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                </div>
              </div>
              <pre className="bg-muted rounded-lg p-4 overflow-x-auto text-sm text-foreground">
                {generatedJSON}
              </pre>
              <p className="text-muted-foreground text-sm mt-4">
                Share this JSON with the project maintainers to have your name added to the database.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Back Link */}
      <div className="text-center pb-12">
        <Link to="/" className="text-igala-coral hover:text-igala-coral/80 font-medium transition-colors">
          ← Back to Names Explorer
        </Link>
      </div>
    </main>
  );
};

export default Contribute;
