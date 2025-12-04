import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { Heart, Bookmark, FileText, User, Settings } from "lucide-react";
import namesData from "@/data/names.json";
import { IgalaName } from "@/types/names";

interface Submission {
  id: string;
  name: string;
  meaning: string;
  status: string;
  created_at: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-500",
  accepted: "bg-green-500/10 text-green-500",
  rejected: "bg-red-500/10 text-red-500",
};

const Dashboard = () => {
  const { user, profile, isLoading } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [likes, setLikes] = useState<string[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

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
        .select("id, name, meaning, status, created_at")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false }),
    ]);

    setFavorites(favRes.data?.map((f) => f.name_id) || []);
    setLikes(likeRes.data?.map((l) => l.name_id) || []);
    setSubmissions(subRes.data || []);
    setIsDataLoading(false);
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
                          className="p-4 rounded-lg border border-border bg-card"
                        >
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
                          className="p-4 rounded-lg border border-border bg-card"
                        >
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
                          <div>
                            <h3 className="font-semibold">{sub.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {sub.meaning}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge className={statusColors[sub.status]}>
                              {sub.status}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(sub.created_at).toLocaleDateString()}
                            </p>
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
    </div>
  );
};

export default Dashboard;
