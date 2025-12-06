import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Heart, Bookmark, FileText, Trash2, Edit, Loader2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import namesData from "@/data/names.json";

interface Submission {
  id: string;
  name: string;
  meaning: string;
  pronunciation: string | null;
  gender: string | null;
  category: string | null;
  origin_story: string | null;
  related_proverb: string | null;
  status: string;
  created_at: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30",
  accepted: "bg-green-500/10 text-green-600 border-green-500/30",
  rejected: "bg-red-500/10 text-red-600 border-red-500/30",
};

const Dashboard = () => {
  const { user, profile, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [likes, setLikes] = useState<string[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [editingSubmission, setEditingSubmission] = useState<Submission | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    const [favRes, likeRes, subRes] = await Promise.all([
      supabase.from("user_favorites").select("name_id").eq("user_id", user!.id),
      supabase.from("user_likes").select("name_id").eq("user_id", user!.id),
      supabase
        .from("name_submissions")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false }),
    ]);

    setFavorites(favRes.data?.map((f) => f.name_id) || []);
    setLikes(likeRes.data?.map((l) => l.name_id) || []);
    setSubmissions((subRes.data as Submission[]) || []);
    setIsDataLoading(false);
  };

  const handleRemoveFavorite = async (nameId: string) => {
    const { error } = await supabase
      .from("user_favorites")
      .delete()
      .eq("user_id", user!.id)
      .eq("name_id", nameId);

    if (!error) {
      setFavorites((prev) => prev.filter((id) => id !== nameId));
      toast({ title: "Removed from favorites" });
    }
  };

  const handleRemoveLike = async (nameId: string) => {
    const { error } = await supabase
      .from("user_likes")
      .delete()
      .eq("user_id", user!.id)
      .eq("name_id", nameId);

    if (!error) {
      setLikes((prev) => prev.filter((id) => id !== nameId));
      toast({ title: "Removed from likes" });
    }
  };

  const handleEditSubmission = (submission: Submission) => {
    if (submission.status !== "pending") {
      toast({
        title: "Cannot edit",
        description: "Only pending submissions can be edited.",
        variant: "destructive",
      });
      return;
    }
    setEditingSubmission(submission);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingSubmission) return;

    setIsSaving(true);
    const { error } = await supabase
      .from("name_submissions")
      .update({
        name: editingSubmission.name,
        meaning: editingSubmission.meaning,
        pronunciation: editingSubmission.pronunciation,
        origin_story: editingSubmission.origin_story,
        related_proverb: editingSubmission.related_proverb,
      })
      .eq("id", editingSubmission.id);

    setIsSaving(false);

    if (error) {
      toast({
        title: "Update failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } else {
      setSubmissions((prev) =>
        prev.map((s) => (s.id === editingSubmission.id ? editingSubmission : s))
      );
      setIsEditDialogOpen(false);
      setEditingSubmission(null);
      toast({ title: "Submission updated!" });
    }
  };

  const handleDeleteSubmission = async (id: string, status: string) => {
    if (status !== "pending") {
      toast({
        title: "Cannot delete",
        description: "Only pending submissions can be deleted.",
        variant: "destructive",
      });
      return;
    }

    setDeletingId(id);
    const { error } = await supabase.from("name_submissions").delete().eq("id", id);
    setDeletingId(null);

    if (error) {
      toast({
        title: "Delete failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } else {
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
      toast({ title: "Submission deleted" });
    }
  };

  const favoriteNames = namesData.names.filter((n) => favorites.includes(n.id));
  const likedNames = namesData.names.filter((n) => likes.includes(n.id));

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-igala-gold/30 border-t-igala-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-20">
        <div className="container px-4">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground">
              Welcome, {profile?.first_name || "User"}!
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your Igala names collection
            </p>
          </div>

          {/* Stats */}
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-igala-coral/10">
                    <Heart className="w-6 h-6 text-igala-coral" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{likes.length}</p>
                    <p className="text-sm text-muted-foreground">Liked Names</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-igala-gold/10">
                    <Bookmark className="w-6 h-6 text-igala-gold" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{favorites.length}</p>
                    <p className="text-sm text-muted-foreground">Favorites</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-igala-olive/10">
                    <FileText className="w-6 h-6 text-igala-olive" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{submissions.length}</p>
                    <p className="text-sm text-muted-foreground">Submissions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="favorites" className="space-y-6">
            <TabsList>
              <TabsTrigger value="favorites" className="gap-2">
                <Bookmark className="w-4 h-4" />
                Favorites
              </TabsTrigger>
              <TabsTrigger value="likes" className="gap-2">
                <Heart className="w-4 h-4" />
                Liked
              </TabsTrigger>
              <TabsTrigger value="submissions" className="gap-2">
                <FileText className="w-4 h-4" />
                Submissions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="favorites">
              <Card>
                <CardHeader>
                  <CardTitle>Favorite Names</CardTitle>
                </CardHeader>
                <CardContent>
                  {isDataLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="w-8 h-8 border-4 border-igala-gold/30 border-t-igala-gold rounded-full animate-spin" />
                    </div>
                  ) : favoriteNames.length === 0 ? (
                    <div className="text-center py-8">
                      <Bookmark className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                      <p className="text-muted-foreground">No favorites yet</p>
                      <Link to="/">
                        <Button variant="link" className="mt-2">
                          Explore names
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {favoriteNames.map((name) => (
                        <div
                          key={name.id}
                          className="p-4 rounded-lg border border-border bg-card group relative"
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                            onClick={() => handleRemoveFavorite(name.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                          <h3 className="font-display text-lg font-semibold">
                            {name.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {name.meaning}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="likes">
              <Card>
                <CardHeader>
                  <CardTitle>Liked Names</CardTitle>
                </CardHeader>
                <CardContent>
                  {isDataLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="w-8 h-8 border-4 border-igala-gold/30 border-t-igala-gold rounded-full animate-spin" />
                    </div>
                  ) : likedNames.length === 0 ? (
                    <div className="text-center py-8">
                      <Heart className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                      <p className="text-muted-foreground">No likes yet</p>
                      <Link to="/">
                        <Button variant="link" className="mt-2">
                          Explore names
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {likedNames.map((name) => (
                        <div
                          key={name.id}
                          className="p-4 rounded-lg border border-border bg-card group relative"
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                            onClick={() => handleRemoveLike(name.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                          <h3 className="font-display text-lg font-semibold">
                            {name.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {name.meaning}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="submissions">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>My Submissions</CardTitle>
                  <Link to="/contribute">
                    <Button variant="outline" size="sm">
                      Submit a Name
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {isDataLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="w-8 h-8 border-4 border-igala-gold/30 border-t-igala-gold rounded-full animate-spin" />
                    </div>
                  ) : submissions.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                      <p className="text-muted-foreground">No submissions yet</p>
                      <Link to="/contribute">
                        <Button variant="link" className="mt-2">
                          Contribute a name
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {submissions.map((sub) => (
                        <div
                          key={sub.id}
                          className="flex items-center justify-between p-4 rounded-lg border border-border"
                        >
                          <div className="flex-1">
                            <h3 className="font-semibold">{sub.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {sub.meaning}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className={`border ${statusColors[sub.status]}`}>
                              {sub.status}
                            </Badge>
                            {sub.status === "pending" && (
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEditSubmission(sub)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-destructive hover:text-destructive"
                                  onClick={() => handleDeleteSubmission(sub.id, sub.status)}
                                  disabled={deletingId === sub.id}
                                >
                                  {deletingId === sub.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="w-4 h-4" />
                                  )}
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />

      {/* Edit Submission Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Submission</DialogTitle>
          </DialogHeader>
          {editingSubmission && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={editingSubmission.name}
                  onChange={(e) =>
                    setEditingSubmission({ ...editingSubmission, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Meaning</Label>
                <Input
                  value={editingSubmission.meaning}
                  onChange={(e) =>
                    setEditingSubmission({ ...editingSubmission, meaning: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Pronunciation</Label>
                <Input
                  value={editingSubmission.pronunciation || ""}
                  onChange={(e) =>
                    setEditingSubmission({ ...editingSubmission, pronunciation: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Origin Story</Label>
                <Textarea
                  value={editingSubmission.origin_story || ""}
                  onChange={(e) =>
                    setEditingSubmission({ ...editingSubmission, origin_story: e.target.value })
                  }
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Related Proverb</Label>
                <Input
                  value={editingSubmission.related_proverb || ""}
                  onChange={(e) =>
                    setEditingSubmission({ ...editingSubmission, related_proverb: e.target.value })
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={isSaving}>
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
