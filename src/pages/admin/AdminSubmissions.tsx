import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Eye, Trash2 } from "lucide-react";

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
  reviewer_notes: string | null;
  created_at: string;
  user_id: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
  accepted: "bg-green-500/10 text-green-500 border-green-500/30",
  rejected: "bg-red-500/10 text-red-500 border-red-500/30",
};

const AdminSubmissions = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchSubmissions = async () => {
    const { data, error } = await supabase
      .from("name_submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setSubmissions(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleUpdateStatus = async (id: string, status: "accepted" | "rejected") => {
    const { error } = await supabase
      .from("name_submissions")
      .update({
        status,
        reviewer_notes: reviewNotes || null,
        reviewed_by: user?.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update submission status",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: `Submission ${status}`,
      });
      setSelectedSubmission(null);
      setReviewNotes("");
      fetchSubmissions();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("name_submissions")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete submission",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Deleted",
        description: "Submission has been removed",
      });
      fetchSubmissions();
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Submissions</h1>
        <p className="text-muted-foreground mt-1">
          Review user-submitted names
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Submissions ({submissions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="w-8 h-8 border-4 border-igala-gold/30 border-t-igala-gold rounded-full animate-spin" />
            </div>
          ) : submissions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No submissions yet
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Meaning</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">{submission.name}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {submission.meaning}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[submission.status]}>
                          {submission.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(submission.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedSubmission(submission);
                              setReviewNotes(submission.reviewer_notes || "");
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => handleDelete(submission.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Review Submission</DialogTitle>
          </DialogHeader>

          {selectedSubmission && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-semibold">{selectedSubmission.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pronunciation</p>
                  <p>{selectedSubmission.pronunciation || "—"}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Meaning</p>
                <p>{selectedSubmission.meaning}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Gender</p>
                  <p className="capitalize">{selectedSubmission.gender || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="capitalize">{selectedSubmission.category || "—"}</p>
                </div>
              </div>

              {selectedSubmission.origin_story && (
                <div>
                  <p className="text-sm text-muted-foreground">Origin Story</p>
                  <p className="text-sm">{selectedSubmission.origin_story}</p>
                </div>
              )}

              {selectedSubmission.related_proverb && (
                <div>
                  <p className="text-sm text-muted-foreground">Related Proverb</p>
                  <p className="text-sm italic">{selectedSubmission.related_proverb}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-muted-foreground mb-2">Reviewer Notes</p>
                <Textarea
                  placeholder="Add notes for the submitter..."
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1 gap-2 text-green-500 hover:text-green-600"
                  onClick={() => handleUpdateStatus(selectedSubmission.id, "accepted")}
                >
                  <CheckCircle className="w-4 h-4" />
                  Accept
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 gap-2 text-red-500 hover:text-red-600"
                  onClick={() => handleUpdateStatus(selectedSubmission.id, "rejected")}
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSubmissions;
