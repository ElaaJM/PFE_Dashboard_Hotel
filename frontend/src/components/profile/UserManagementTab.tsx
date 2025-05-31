import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, PlusCircle, Trash2, Mail } from "lucide-react";
import { toast } from "sonner";

interface User {
  _id: string;
  username: string;
  email?: string;
  profileImage?: string;
  role: "analyst" | "admin";  // or simply string
}


const UserManagementTab = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isCreateUserDialogOpen, setIsCreateUserDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({ username: "", password: "" });
const currentUserRole = localStorage.getItem('role')
console.log("Current user role:", currentUserRole);

  useEffect(() => {
    // Fetch analysts from the backend
    const fetchAnalysts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/analysts", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch analysts");
        }
        setUsers(data); // Update the state with the list of analysts
      } catch (error) {
        toast.error("Failed to fetch analysts");
      }
    };

    fetchAnalysts();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  const getInitials = (username: string) =>
    username
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();

  const handleCreateUser = async () => {
    const { username, password } = newUser;

    if (!username || !password) {
      toast.error("Username and password are required");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("User is not authenticated");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/create-analyst",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create analyst");
      }

      const newUserId = data._id; // Assuming the backend responds with _id for the new user
      setUsers([
        ...users,
        {
          _id: newUserId, // Store the _id instead of id
          username,
          role: "analyst",
        },
      ]);

      setNewUser({ username: "", password: "" });
      setIsCreateUserDialogOpen(false);
      toast.success("Analyst account created successfully");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDeleteUser = async (_id: string) => { // Use _id here as well
    if (!_id) {
      toast.error("User ID is missing");
      return;
    }
  
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("User is not authenticated");
      return;
    }
  
    try {
      // Call the API to delete the user using _id
      const response = await fetch(`http://localhost:5000/api/auth/analysts/${_id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
  
      // Remove the user from the state using _id
      setUsers(users.filter((user) => user._id !== _id)); // Use _id here
      toast.success("User removed successfully");
    } catch (error: any) {
      toast.error(error.message || "An error occurred while deleting the user");
    }
  };
  


  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Create and manage analyst accounts</CardDescription>
        </div>
        <Dialog
          open={isCreateUserDialogOpen}
          onOpenChange={setIsCreateUserDialogOpen}
        >
{currentUserRole !== "admin" ? (
  <Button disabled className="opacity-60 cursor-not-allowed">
    <PlusCircle className="h-4 w-4 mr-2" />
    Add Analyst
  </Button>
) : (
  <DialogTrigger asChild>
    <Button>
      <PlusCircle className="h-4 w-4 mr-2" />
      Add Analyst
    </Button>
  </DialogTrigger>
)}




          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Analyst Account</DialogTitle>
              <DialogDescription>
                Add a new analyst to access the dashboard
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={newUser.username}
                  onChange={(e) =>
                    setNewUser({ ...newUser, username: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateUserDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateUser}>Create Account</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent>
        <div className="space-y-5">
          {users.map((user) => (
            <div
              key={user._id} // Use _id as the key
              className="p-4 border rounded-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.profileImage} />
                  <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user.username}</p>
                  <p className="text-sm text-muted-foreground">{user.role}</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">


<Button
  size="sm"
  variant="outline"
  className="text-red-500 hover:text-red-600"
  disabled={currentUserRole === "analyst"}
  onClick={() => currentUserRole !== "analyst" && handleDeleteUser(user._id)}
>
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
  );
};

export default UserManagementTab;
