import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Search, Shield, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface UserWithRole {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
  role?: string;
}

const roleColors: Record<string, string> = {
  admin: "bg-igala-gold/10 text-igala-gold border-igala-gold/30",
  reviewer: "bg-igala-olive/10 text-igala-olive border-igala-olive/30",
  user: "bg-muted text-muted-foreground border-border",
};

const AdminUsers = () => {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserFirstName, setNewUserFirstName] = useState("");
  const [newUserLastName, setNewUserLastName] = useState("");
  const [newUserRole, setNewUserRole] = useState<"admin" | "reviewer" | "user">("user");
  const { toast } = useToast();
  const { user: currentUser } = useAuth();

  const fetchUsers = async () => {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (profiles) {
      const usersWithRoles = await Promise.all(
        profiles.map(async (profile) => {
          const { data: roles } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", profile.user_id)
            .limit(1)
            .maybeSingle();

          return {
            ...profile,
            role: roles?.role || "user",
          };
        })
      );
      setUsers(usersWithRoles);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUpdateRole = async (userId: string, newRole: string) => {
    // Delete existing role
    await supabase.from("user_roles").delete().eq("user_id", userId);

    // Insert new role
    const { error } = await supabase
      .from("user_roles")
      .insert({ user_id: userId, role: newRole as any });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "User role updated",
      });
      fetchUsers();
    }
  };

  const handleAddUser = async () => {
    if (!newUserEmail || !newUserPassword || !newUserFirstName || !newUserLastName) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    // Note: Creating users should be done through the auth signup flow
    // This is a simplified version - in production you'd use admin API
    toast({
      title: "Info",
      description: "New users should register through the sign-up page. Use the role assignment to promote existing users.",
    });
    setIsAddDialogOpen(false);
  };

  const handleDeleteUser = async (userId: string) => {
    if (userId === currentUser?.id) {
      toast({
        title: "Error",
        description: "You cannot delete your own account",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Info",
      description: "User deletion requires backend admin access. Contact the system administrator.",
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Users</h1>
          <p className="text-muted-foreground mt-1">
            Manage user accounts and roles
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="cultural" className="gap-2">
              <UserPlus className="w-4 h-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input
                    value={newUserFirstName}
                    onChange={(e) => setNewUserFirstName(e.target.value)}
                    placeholder="First name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input
                    value={newUserLastName}
                    onChange={(e) => setNewUserLastName(e.target.value)}
                    placeholder="Last name"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="user@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input
                  type="password"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={newUserRole} onValueChange={(v: any) => setNewUserRole(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="reviewer">Reviewer</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddUser} className="w-full">
                Create User
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Users ({users.length})</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="w-8 h-8 border-4 border-igala-gold/30 border-t-igala-gold rounded-full animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.first_name} {user.last_name}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge className={roleColors[user.role || "user"]}>
                          {user.role || "user"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Select
                            value={user.role}
                            onValueChange={(value) => handleUpdateRole(user.user_id, value)}
                          >
                            <SelectTrigger className="w-28">
                              <Shield className="w-3 h-3 mr-1" />
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="reviewer">Reviewer</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => handleDeleteUser(user.user_id)}
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
    </div>
  );
};

export default AdminUsers;
