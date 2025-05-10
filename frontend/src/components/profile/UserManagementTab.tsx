
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, PlusCircle, Trash2, Mail, Edit } from "lucide-react";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  jobTitle: string;
  profileImage?: string;
  role: 'analyst';
}

const UserManagementTab = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@bizertaresort.com',
      jobTitle: 'Marketing Analyst',
      role: 'analyst',
      profileImage: 'https://images.unsplash.com/photo-1501286353178-1ec881214838?auto=format&fit=crop&w=120&h=120'
    },
    {
      id: '2',
      name: 'Michael Roberts',
      email: 'michael@bizertaresort.com',
      jobTitle: 'Data Analyst',
      role: 'analyst',
      profileImage: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=120&h=120'
    }
  ]);

  const [isCreateUserDialogOpen, setIsCreateUserDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    jobTitle: '',
    password: '',
  });

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  };

  const handleCreateUser = () => {
    // Validate inputs
    if (!newUser.name || !newUser.email || !newUser.jobTitle || !newUser.password) {
      toast.error("All fields are required");
      return;
    }

    // Create new user
    const newUserId = Date.now().toString();
    setUsers([
      ...users,
      {
        id: newUserId,
        name: newUser.name,
        email: newUser.email,
        jobTitle: newUser.jobTitle,
        role: 'analyst',
      }
    ]);

    // Reset form and close dialog
    setNewUser({ name: '', email: '', jobTitle: '', password: '' });
    setIsCreateUserDialogOpen(false);
    
    // Notify success
    toast.success("Analyst account created successfully");
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(user => user.id !== id));
    toast.success("User removed successfully");
  };

  const handleSendCredentials = (email: string) => {
    // In a real app, this would send an email with credentials
    toast.success(`Credentials sent to ${email}`);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              Create and manage analyst accounts
            </CardDescription>
          </div>
          <Dialog open={isCreateUserDialogOpen} onOpenChange={setIsCreateUserDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Analyst
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create Analyst Account</DialogTitle>
                <DialogDescription>
                  Add a new analyst to access the dashboard
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input 
                    id="jobTitle"
                    value={newUser.jobTitle}
                    onChange={(e) => setNewUser({...newUser, jobTitle: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Initial Password</Label>
                  <Input 
                    id="password" 
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateUserDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateUser}>
                  Create Account
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            {users.map((user) => (
              <div key={user.id} className="p-4 border rounded-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.profileImage} />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.jobTitle}</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleSendCredentials(user.email)}>
                    <Mail className="h-4 w-4 mr-2" />
                    Send Credentials
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-500 hover:text-red-600" onClick={() => handleDeleteUser(user.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            {users.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-10 w-10 mx-auto text-muted-foreground opacity-40 mb-3" />
                <p className="text-muted-foreground">No analysts added yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Click the "Add Analyst" button to create accounts for your team
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default UserManagementTab;
