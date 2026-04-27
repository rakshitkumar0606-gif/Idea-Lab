import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useTacticalData } from "@/lib/useTacticalData";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, User, Users, Building2, Heart, Loader2, Check } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/team-management")({
  component: TeamManagement,
});

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "ngo" | "government";
  joined_at: string;
}

function TeamManagement() {
  const { effectiveRole, user, profile } = useAuth();
  const navigate = useNavigate();
  const { teams } = useTacticalData();

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [newTeam, setNewTeam] = useState({ name: "", type: "ngo" as "ngo" | "government" });
  const [showNewTeamDialog, setShowNewTeamDialog] = useState(false);
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [memberEmail, setMemberEmail] = useState("");
  const [memberRole, setMemberRole] = useState<"ngo" | "government">("ngo");
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (effectiveRole && effectiveRole !== "admin") navigate({ to: "/dashboard" });
  }, [effectiveRole, navigate]);

  useEffect(() => {
    loadTeamMembers();
  }, [selectedTeam]);

  async function loadTeamMembers() {
    if (!selectedTeam) return;
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, email, role, created_at")
        .eq("team_id", selectedTeam)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTeamMembers(
        (data || []).map((m: any) => ({
          id: m.id,
          name: m.name,
          email: m.email,
          role: m.role,
          joined_at: m.created_at,
        }))
      );
    } catch (err) {
      toast.error("Failed to load team members");
      console.error(err);
    }
  }

  async function handleCreateTeam() {
    if (!newTeam.name.trim()) {
      toast.error("Team name is required");
      return;
    }
    setCreating(true);
    try {
      const { data, error } = await supabase
        .from("teams")
        .insert([
          {
            name: newTeam.name,
            type: newTeam.type,
            availability_status: "available",
            lat: 0,
            lng: 0,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      toast.success("Team created successfully");
      setNewTeam({ name: "", type: "ngo" });
      setShowNewTeamDialog(false);
    } catch (err) {
      toast.error("Failed to create team");
      console.error(err);
    } finally {
      setCreating(false);
    }
  }

  async function handleAddMember() {
    if (!selectedTeam || !memberEmail.trim()) {
      toast.error("Please select a team and enter email");
      return;
    }

    setLoading(true);
    try {
      // Find user by email
      const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
      const targetUser = authData.users.find(u => u.email === memberEmail);

      if (!targetUser) {
        toast.error("User not found. User must sign up first.");
        setLoading(false);
        return;
      }

      // Update profile with team_id
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ team_id: selectedTeam })
        .eq("id", targetUser.id);

      if (updateError) throw updateError;

      toast.success(`${memberEmail} added to team`);
      setMemberEmail("");
      setShowAddMemberDialog(false);
      await loadTeamMembers();
    } catch (err) {
      toast.error("Failed to add member");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleRemoveMember(memberId: string) {
    if (!window.confirm("Remove this member from the team?")) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ team_id: null })
        .eq("id", memberId);

      if (error) throw error;
      toast.success("Member removed from team");
      await loadTeamMembers();
    } catch (err) {
      toast.error("Failed to remove member");
      console.error(err);
    }
  }

  return (
    <div className="space-y-6">
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-display font-bold">Team Management</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Create teams and link NGO & Government agency members to coordinate disaster relief operations.
        </p>
      </div>

      <Tabs defaultValue="teams" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>

        {/* Teams Tab */}
        <TabsContent value="teams" className="space-y-4 mt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Active Teams</h2>
            <Button onClick={() => setShowNewTeamDialog(true)} className="gap-2">
              <Plus className="h-4 w-4" /> Create Team
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teams.length === 0 ? (
              <div className="col-span-full text-center p-8 text-muted-foreground">
                No teams created yet. Create one to get started.
              </div>
            ) : (
              teams.map(team => {
                const memberCount = teamMembers.filter(m => m.id).length || 0;
                return (
                  <Card
                    key={team.id}
                    className="p-5 space-y-3 cursor-pointer hover:border-primary/50 transition-colors animate-scale-in"
                    onClick={() => {
                      setSelectedTeam(team.id);
                      document.querySelector('[data-value="members"]')?.click();
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {team.type === "ngo" ? (
                          <Heart className="h-5 w-5 text-primary" />
                        ) : (
                          <Building2 className="h-5 w-5 text-blue-500" />
                        )}
                        <div>
                          <h3 className="font-semibold">{team.name}</h3>
                          <Badge variant="outline" className="text-xs mt-1 capitalize">
                            {team.type}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-border/40 space-y-1 text-sm">
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" /> Members
                        </span>
                        <span className="font-semibold">{memberCount}</span>
                      </div>
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span>Status</span>
                        <Badge
                          variant={team.availability_status === "available" ? "secondary" : "outline"}
                          className="text-xs capitalize"
                        >
                          {team.availability_status}
                        </Badge>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full gap-2"
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedTeam(team.id);
                        setShowAddMemberDialog(true);
                      }}
                    >
                      <Plus className="h-3.5 w-3.5" /> Add Member
                    </Button>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>

        {/* Members Tab */}
        <TabsContent value="members" className="space-y-4 mt-6">
          {!selectedTeam ? (
            <div className="text-center p-8 text-muted-foreground">
              Select a team from the Teams tab to manage members.
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">
                  {teams.find(t => t.id === selectedTeam)?.name || "Team"} Members
                </h2>
                <Button onClick={() => setShowAddMemberDialog(true)} size="sm" className="gap-2">
                  <Plus className="h-4 w-4" /> Add Member
                </Button>
              </div>

              <div className="space-y-3">
                {teamMembers.length === 0 ? (
                  <div className="text-center p-8 text-muted-foreground border border-dashed rounded-lg">
                    No members in this team yet.
                  </div>
                ) : (
                  teamMembers.map(member => (
                    <Card key={member.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-semibold">{member.name}</div>
                          <div className="text-sm text-muted-foreground">{member.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="capitalize">
                          {member.role}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveMember(member.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Create Team Dialog */}
      <Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Team</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="team-name">Team Name</Label>
              <Input
                id="team-name"
                placeholder="e.g., Red Cross Chapter - North"
                value={newTeam.name}
                onChange={e => setNewTeam({ ...newTeam, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="team-type">Team Type</Label>
              <Select value={newTeam.type} onValueChange={v => setNewTeam({ ...newTeam, type: v as "ngo" | "government" })}>
                <SelectTrigger id="team-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ngo">NGO</SelectItem>
                  <SelectItem value="government">Government Agency</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewTeamDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTeam} disabled={creating}>
              {creating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Check className="h-4 w-4 mr-2" />}
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Member Dialog */}
      <Dialog open={showAddMemberDialog} onOpenChange={setShowAddMemberDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 text-sm">
              <p className="text-blue-900 dark:text-blue-100">
                ℹ️ Member must sign up first before you can add them to the team. They'll join as their registered role (NGO or Government).
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="member-email">Member Email</Label>
              <Input
                id="member-email"
                type="email"
                placeholder="member@organization.com"
                value={memberEmail}
                onChange={e => setMemberEmail(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddMemberDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddMember} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Check className="h-4 w-4 mr-2" />}
              Add Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
