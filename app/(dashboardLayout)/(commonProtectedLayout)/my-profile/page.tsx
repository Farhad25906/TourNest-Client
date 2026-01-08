import MyProfile from "@/components/module/MyProfile/MyProfile";
import { getUserInfo } from "@/services/auth/user.services";

const MyProfilePage = async () => {
  const userInfo = await getUserInfo();
  
  if (!userInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">User information not found</h1>
          <p className="text-gray-600 mt-2">Please try logging in again.</p>
        </div>
      </div>
    );
  }
  
  return <MyProfile userInfo={userInfo} />;
};

export default MyProfilePage;