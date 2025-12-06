import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, Users, FileText, CheckCircle, Clock, XCircle } from "lucide-react";
import namesData from "@/data/names.json";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingSubmissions: 0,
    acceptedSubmissions: 0,
    rejectedSubmissions: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [usersRes, submissionsRes] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("name_submissions").select("status"),
      ]);

      const submissions = submissionsRes.data || [];
      setStats({
        totalUsers: usersRes.count || 0,
        pendingSubmissions: submissions.filter((s) => s.status === "pending").length,
        acceptedSubmissions: submissions.filter((s) => s.status === "accepted").length,
        rejectedSubmissions: submissions.filter((s) => s.status === "rejected").length,
      });
      setIsLoading(false);
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Names",
      value: namesData.names.length,
      icon: BookOpen,
      color: "text-igala-gold",
      bg: "bg-igala-gold/10",
    },
    {
      title: "Registered Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-igala-olive",
      bg: "bg-igala-olive/10",
    },
    {
      title: "Pending Submissions",
      value: stats.pendingSubmissions,
      icon: Clock,
      color: "text-igala-amber",
      bg: "bg-igala-amber/10",
    },
    {
      title: "Accepted",
      value: stats.acceptedSubmissions,
      icon: CheckCircle,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      title: "Rejected",
      value: stats.rejectedSubmissions,
      icon: XCircle,
      color: "text-igala-coral",
      bg: "bg-igala-coral/10",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of Igala Echoes platform
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-igala-gold/30 border-t-igala-gold rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {statCards.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
