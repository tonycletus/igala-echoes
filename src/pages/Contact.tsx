import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Copy, Check, Users, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [generatedJSON, setGeneratedJSON] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "All fields required",
        description: "Please fill in all fields.",
        variant: "destructive"
      });
      return;
    }

    const jsonOutput = {
      type: "contact_inquiry",
      timestamp: new Date().toISOString(),
      name: formData.name,
      email: formData.email,
      message: formData.message
    };

    setGeneratedJSON(JSON.stringify(jsonOutput, null, 2));
    toast({
      title: "Message prepared!",
      description: "Copy the JSON and send it via email."
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

  return (
    <main className="min-h-screen bg-background">
      {/* Back Link - Top Left */}
      <div className="container mx-auto max-w-3xl px-4 py-6">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-igala-coral hover:text-igala-coral/80 font-medium transition-colors"
        >
          ← Back to Names Explorer
        </Link>
      </div>
      
      {/* Hero */}
      <section 
        className="relative py-16 px-4"
        style={{ background: 'linear-gradient(135deg, hsl(15, 79%, 55%) 0%, hsl(38, 91%, 55%) 100%)' }}
      >
        <div className="absolute inset-0 bg-black/10" />
        <div className="container mx-auto max-w-3xl relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-6">
            <Mail className="w-4 h-4 text-white" />
            <span className="text-white/90 text-sm font-medium">Get in Touch</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Let's Collaborate
          </h1>
          <p className="text-white/90 max-w-xl mx-auto">
            Whether you're a researcher, cultural advocate, or simply passionate about Ìgálá heritage, we'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-2xl">
          {/* Collaboration Note */}
          <div className="bg-igala-gold/10 rounded-xl p-6 mb-8 border border-igala-gold/20">
            <div className="flex gap-4">
              <Users className="w-6 h-6 text-igala-gold flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Cultural Collaboration</h3>
                <p className="text-muted-foreground text-sm">
                  We welcome partnerships with universities, cultural organizations, linguists, and anyone 
                  committed to preserving Ìgálá heritage. Reach out for research collaborations, content 
                  contributions, or community initiatives.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-8 shadow-elegant border border-border/50 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name *</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                placeholder="Tell us about your interest, collaboration idea, or question..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={5}
                required
              />
            </div>

            <Button type="submit" variant="cultural" size="lg" className="w-full">
              <Sparkles className="w-5 h-5 mr-2" />
              Prepare Message
            </Button>
          </form>

          {/* Generated JSON Output */}
          {generatedJSON && (
            <div className="mt-8 bg-card rounded-2xl p-6 shadow-elegant border border-border/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-lg font-semibold text-foreground">Your Message</h3>
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
              <pre className="bg-muted rounded-lg p-4 overflow-x-auto text-sm text-foreground">
                {generatedJSON}
              </pre>
              <p className="text-muted-foreground text-sm mt-4">
                Copy this message and send it to the project maintainers via your preferred communication channel.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Contact;
