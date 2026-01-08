/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getInitials } from "@/lib/formatters";
import { updateProfile } from "@/services/auth/user.services";
import { UserInfo } from "@/types/user.interface";
import { Camera, Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

interface MyProfileProps {
  userInfo: UserInfo;
}

const MyProfile = ({ userInfo }: MyProfileProps) => {
  console.log("UserInfo received:", userInfo);
  
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Get role-specific data based on user role
  const getRoleData = () => {
    switch (userInfo.role) {
      case "HOST":
        return userInfo.host;
      case "ADMIN":
        return userInfo.admin;
      case "TOURIST":
      default:
        return null;
    }
  };

  const roleData = getRoleData();
  
  // Get profile photo from role-specific data
  const profilePhoto = roleData?.profilePhoto || "";
  
  
  // Get name - priority: roleData.name > userInfo.name
  const userName = roleData?.name || userInfo.name || "User";
  
  // Get email - priority: roleData.email > userInfo.email
  const userEmail = roleData?.email || userInfo.email || "";

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Create FormData from the form element
    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    // Get the file input separately and append it if it exists
    const fileInput = document.getElementById("file") as HTMLInputElement;
    if (fileInput?.files?.[0]) {
      formData.append("file", fileInput.files[0]);
    }

    startTransition(async () => {
      const result = await updateProfile(formData);

      if (result.success) {
        setSuccess(result.message || "Profile updated successfully");
        setPreviewImage(null);
        router.refresh();
      } else {
        setError(result.message || "An error occurred");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground mt-1">
          Manage your personal information
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="h-32 w-32">
                  {previewImage || profilePhoto ? (
                    <AvatarImage
                      src={previewImage || profilePhoto}
                      alt={userName}
                    />
                  ) : (
                    <AvatarFallback className="text-3xl">
                      {getInitials(userName)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <label
                  htmlFor="file"
                  className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors"
                >
                  <Camera className="h-4 w-4" />
                  <Input
                    type="file"
                    id="file"
                    name="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                    disabled={isPending}
                  />
                </label>
              </div>

              <div className="text-center">
                <p className="font-semibold text-lg">{userName}</p>
                <p className="text-sm text-muted-foreground">
                  {userEmail}
                </p>
                <p className="text-xs text-muted-foreground mt-1 capitalize">
                  {userInfo.role?.toLowerCase() || "user"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Profile Information Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-500/10 text-green-600 px-4 py-3 rounded-md text-sm">
                  {success}
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                {/* Common Fields for All Roles */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={userName}
                    required
                    disabled={isPending}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userEmail}
                    disabled
                    className="bg-muted"
                  />
                </div>

                {/* HOST-Specific Fields */}
                {userInfo.role === "HOST" && roleData && "phone" in roleData && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        defaultValue={roleData.phone || ""}
                        disabled={isPending}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <textarea
                        id="bio"
                        name="bio"
                        defaultValue={roleData.bio || ""}
                        disabled={isPending}
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hometown">Hometown</Label>
                      <Input
                        id="hometown"
                        name="hometown"
                        defaultValue={roleData.hometown || ""}
                        disabled={isPending}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="visitedLocations">Visited Locations</Label>
                      <Input
                        id="visitedLocations"
                        name="visitedLocations"
                        defaultValue={Array.isArray(roleData.visitedLocations) 
                          ? roleData.visitedLocations.join(", ") 
                          : ""}
                        placeholder="Enter locations separated by commas"
                        disabled={isPending}
                      />
                    </div>

                    {/* Read-only Host Fields */}
                    <div className="space-y-2">
                      <Label htmlFor="isVerified">Verified Status</Label>
                      <Input
                        id="isVerified"
                        value={roleData.isVerified ? "Verified" : "Not Verified"}
                        disabled
                        className="bg-muted"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tourLimit">Tour Limit</Label>
                      <Input
                        id="tourLimit"
                        value={roleData.tourLimit || 0}
                        disabled
                        className="bg-muted"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currentTourCount">Current Tours</Label>
                      <Input
                        id="currentTourCount"
                        value={roleData.currentTourCount || 0}
                        disabled
                        className="bg-muted"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="balance">Current Balance</Label>
                      <Input
                        id="balance"
                        value={`$${roleData.balance || "0"}`}
                        disabled
                        className="bg-muted"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="totalEarnings">Total Earnings</Label>
                      <Input
                        id="totalEarnings"
                        value={`$${roleData.totalEarnings || "0"}`}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                  </>
                )}

                {/* TOURIST/USER-Specific Fields */}
               {(userInfo.role === "TOURIST") && roleData && "bio" in roleData && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <textarea
                        id="bio"
                        name="bio"
                        defaultValue={(roleData as any).bio || ""}
                        disabled={isPending}
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        name="location"
                        defaultValue={(roleData as any).location || ""}
                        disabled={isPending}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="interests">Interests</Label>
                      <Input
                        id="interests"
                        name="interests"
                        defaultValue={(roleData as any).interests || ""}
                        disabled={isPending}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="visitedCountries">Visited Countries</Label>
                      <Input
                        id="visitedCountries"
                        name="visitedCountries"
                        defaultValue={(roleData as any).visitedCountries || ""}
                        disabled={isPending}
                      />
                    </div>

                    {/* Read-only Tourist Fields */}
                    <div className="space-y-2">
                      <Label htmlFor="totalSpent">Total Spent</Label>
                      <Input
                        id="totalSpent"
                        value={`$${(roleData as any).totalSpent || "0"}`}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                  </>
                )}

                {/* ADMIN-Specific Fields */}
                {userInfo.role === "ADMIN" && roleData && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="contactNumber">Contact Number</Label>
                      <Input
                        id="contactNumber"
                        name="contactNumber"
                        value={`$${(roleData as any).contactNumber || ""}`}
                        // defaultValue={roleData.contactNumber || ""}
                        disabled={isPending}
                      />
                    </div>

                    {/* Read-only Admin Fields */}
                    <div className="space-y-2">
                      <Label htmlFor="isDeleted">Deleted Status</Label>
                      <Input
                        id="isDeleted"
                        value={roleData.isDeleted ? "Deleted" : "Active"}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                  </>
                )}

                {/* Common Read-only Fields */}
                <div className="space-y-2">
                  <Label htmlFor="status">Account Status</Label>
                  <Input
                    id="status"
                    value={userInfo.status || "ACTIVE"}
                    disabled
                    className="bg-muted capitalize"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    value={userInfo.role?.toLowerCase() || "user"}
                    disabled
                    className="bg-muted capitalize"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="needPasswordChange">Password Change Required</Label>
                  <Input
                    id="needPasswordChange"
                    value={userInfo.needPasswordChange ? "Yes" : "No"}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default MyProfile;