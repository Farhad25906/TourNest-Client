// app/admin/dashboard/subscriptions/page.tsx
import SubscriptionManagement from '@/components/module/Admin/SubscriptionManagement';


export default async function SubscriptionsPage() {
  return (
    <div className="p-6">
      {/* <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Subscription Management</h1>
        <p className="text-gray-600 mt-2">Manage all subscriptions and plans</p>
      </div> */}
      
      <SubscriptionManagement />
    </div>
  );
}