// // components/module/Admin/SubscriptionManagement.tsx
// "use client"

// import React, { useState, useEffect } from 'react';
// import { toast } from 'sonner';
// import { Pencil, Trash2, Plus, X, DollarSign, Calendar, Package, CheckCircle, XCircle } from 'lucide-react';
// import {
//   getAllSubscriptions,
//   getSubscriptionDetails,
//   updateSubscription,
//   deleteSubscription,
//   updateSubscriptionPlan,
//   deleteSubscriptionPlan
// } from '@/services/subscription.service';
// import type {
//   ISubscription,
//   ISubscriptionAnalytics,
//   ISubscriptionPlan
// } from '@/types/subscription.interface';

// interface SubscriptionPlan {
//   id: string;
//   name: string;
//   description: string;
//   price: number;
//   duration: number;
//   tourLimit: number;
//   blogLimit: number | null;
//   features: string[];
//   isActive: boolean;
//   createdAt: string;
//   updatedAt: string;
// }

// export default function SubscriptionManagement() {
//   const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
//   const [isDeleting, setIsDeleting] = useState(false);

//   // Form state
//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     price: 0,
//     duration: 12,
//     tourLimit: 0,
//     blogLimit: null as number | null,
//     features: [] as string[],
//     isActive: true
//   });
//   const [featureInput, setFeatureInput] = useState('');

//   const loadAllData = async () => {
//     try {
//       setLoading(true);
//       const subsResult = await getAllSubscriptions();
//       console.log("Subscriptions data:", subsResult.data);

//       if (subsResult.data && Array.isArray(subsResult.data)) {
//         setPlans(subsResult.data);
//       }
//     } catch (error) {
//       console.error('Load data error:', error);
//       toast.error('Failed to load subscription plans');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadAllData();
//   }, []);

//   const handleEditClick = (plan: SubscriptionPlan) => {
//     setSelectedPlan(plan);
//     setFormData({
//       name: plan.name,
//       description: plan.description,
//       price: plan.price,
//       duration: plan.duration,
//       tourLimit: plan.tourLimit,
//       blogLimit: plan.blogLimit,
//       features: [...plan.features],
//       isActive: plan.isActive
//     });
//     setIsEditModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsEditModalOpen(false);
//     setSelectedPlan(null);
//     setFormData({
//       name: '',
//       description: '',
//       price: 0,
//       duration: 12,
//       tourLimit: 0,
//       blogLimit: null,
//       features: [],
//       isActive: true
//     });
//     setFeatureInput('');
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value, type } = e.target;

//     if (type === 'number') {
//       const numValue = value === '' ? 0 : parseFloat(value);
//       setFormData(prev => ({ ...prev, [name]: numValue }));
//     } else if (type === 'checkbox') {
//       const checked = (e.target as HTMLInputElement).checked;
//       setFormData(prev => ({ ...prev, [name]: checked }));
//     } else {
//       setFormData(prev => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleAddFeature = () => {
//     if (featureInput.trim()) {
//       setFormData(prev => ({
//         ...prev,
//         features: [...prev.features, featureInput.trim()]
//       }));
//       setFeatureInput('');
//     }
//   };

//   const handleRemoveFeature = (index: number) => {
//     setFormData(prev => ({
//       ...prev,
//       features: prev.features.filter((_, i) => i !== index)
//     }));
//   };

//   const handleSubmit = async () => {
//     if (!selectedPlan) return;

//     try {
//       await updateSubscriptionPlan(selectedPlan.id, formData);
//       toast.success('Subscription plan updated successfully');
//       handleCloseModal();
//       loadAllData();
//     } catch (error) {
//       console.error('Update error:', error);
//       toast.error('Failed to update subscription plan');
//     }
//   };

//   const handleDelete = async (planId: string, planName: string) => {
//     if (!confirm(`Are you sure you want to delete the "${planName}" plan? This action cannot be undone.`)) {
//       return;
//     }

//     try {
//       setIsDeleting(true);
//       await deleteSubscriptionPlan(planId);
//       toast.success('Subscription plan deleted successfully');
//       loadAllData();
//     } catch (error) {
//       console.error('Delete error:', error);
//       toast.error('Failed to delete subscription plan');
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <div className="max-w-7xl mx-auto">

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {plans.map((plan) => (
//             <div
//               key={plan.id}
//               className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
//             >
//               <div className={`p-6 ${plan.name === 'Premium' ? 'bg-gradient-to-r from-purple-600 to-blue-600' : plan.name === 'Standard' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-gradient-to-r from-gray-500 to-gray-600'} text-white`}>
//                 <div className="flex items-start justify-between">
//                   <div>
//                     <h3 className="text-2xl font-bold">{plan.name}</h3>
//                     <p className="text-sm mt-1 opacity-90">{plan.description}</p>
//                   </div>
//                   <div className={`px-3 py-1 rounded-full text-xs font-semibold ${plan.isActive ? 'bg-green-500' : 'bg-red-500'}`}>
//                     {plan.isActive ? 'Active' : 'Inactive'}
//                   </div>
//                 </div>
//                 <div className="mt-4">
//                   <span className="text-4xl font-bold">${plan.price}</span>
//                   <span className="text-sm opacity-90">/{plan.duration} months</span>
//                 </div>
//               </div>

//               <div className="p-6">
//                 <div className="space-y-3 mb-4">
//                   <div className="flex items-center text-sm text-gray-700">
//                     <Package className="w-4 h-4 mr-2 text-blue-600" />
//                     <span><strong>{plan.tourLimit}</strong> tours per year</span>
//                   </div>
//                   <div className="flex items-center text-sm text-gray-700">
//                     <Calendar className="w-4 h-4 mr-2 text-blue-600" />
//                     <span><strong>{plan.blogLimit === null ? 'Unlimited' : plan.blogLimit}</strong> blog posts</span>
//                   </div>
//                 </div>

//                 <div className="border-t pt-4">
//                   <h4 className="font-semibold text-sm text-gray-900 mb-3">Features:</h4>
//                   <ul className="space-y-2">
//                     {plan.features.map((feature, idx) => (
//                       <li key={idx} className="flex items-start text-sm text-gray-600">
//                         <CheckCircle className="w-4 h-4 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
//                         <span>{feature}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>

//                 <div className="flex gap-2 mt-6 pt-4 border-t">
//                   <button
//                     onClick={() => handleEditClick(plan)}
//                     className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
//                   >
//                     <Pencil className="w-4 h-4" />
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => handleDelete(plan.id, plan.name)}
//                     disabled={isDeleting}
//                     className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     <Trash2 className="w-4 h-4" />
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Edit Modal */}
//       {isEditModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
//               <h2 className="text-2xl font-bold text-gray-900">Edit Subscription Plan</h2>
//               <button
//                 onClick={handleCloseModal}
//                 className="text-gray-400 hover:text-gray-600 transition-colors"
//               >
//                 <X className="w-6 h-6" />
//               </button>
//             </div>

//             <div className="p-6">
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Plan Name
//                   </label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Description
//                   </label>
//                   <textarea
//                     name="description"
//                     value={formData.description}
//                     onChange={handleInputChange}
//                     rows={3}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     required
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Price ($)
//                     </label>
//                     <input
//                       type="number"
//                       name="price"
//                       value={formData.price}
//                       onChange={handleInputChange}
//                       step="0.01"
//                       min="0"
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Duration (months)
//                     </label>
//                     <input
//                       type="number"
//                       name="duration"
//                       value={formData.duration}
//                       onChange={handleInputChange}
//                       min="1"
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Tour Limit (per year)
//                     </label>
//                     <input
//                       type="number"
//                       name="tourLimit"
//                       value={formData.tourLimit}
//                       onChange={handleInputChange}
//                       min="0"
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Blog Limit (null = unlimited)
//                     </label>
//                     <input
//                       type="number"
//                       name="blogLimit"
//                       value={formData.blogLimit ?? ''}
//                       onChange={(e) => {
//                         const value = e.target.value === '' ? null : parseInt(e.target.value);
//                         setFormData(prev => ({ ...prev, blogLimit: value }));
//                       }}
//                       min="0"
//                       placeholder="Leave empty for unlimited"
//                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Features
//                   </label>
//                   <div className="flex gap-2 mb-3">
//                     <input
//                       type="text"
//                       value={featureInput}
//                       onChange={(e) => setFeatureInput(e.target.value)}
//                       onKeyPress={(e) => {
//                         if (e.key === 'Enter') {
//                           e.preventDefault();
//                           handleAddFeature();
//                         }
//                       }}
//                       placeholder="Add a feature..."
//                       className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                     <button
//                       type="button"
//                       onClick={handleAddFeature}
//                       className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//                     >
//                       <Plus className="w-5 h-5" />
//                     </button>
//                   </div>
//                   <div className="space-y-2">
//                     {formData.features.map((feature, index) => (
//                       <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
//                         <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
//                         <span className="flex-1 text-sm">{feature}</span>
//                         <button
//                           type="button"
//                           onClick={() => handleRemoveFeature(index)}
//                           className="text-red-600 hover:text-red-700"
//                         >
//                           <X className="w-4 h-4" />
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="flex items-center">
//                   <input
//                     type="checkbox"
//                     name="isActive"
//                     checked={formData.isActive}
//                     onChange={handleInputChange}
//                     className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                   />
//                   <label className="ml-2 text-sm font-medium text-gray-700">
//                     Plan is active
//                   </label>
//                 </div>
//               </div>

//               <div className="flex gap-3 mt-6 pt-6 border-t">
//                 <button
//                   type="button"
//                   onClick={handleCloseModal}
//                   className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="button"
//                   onClick={handleSubmit}
//                   className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
//                 >
//                   Save Changes
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertCircle,
  Calendar,
  Clock,
  Download,
  Eye,
  RefreshCw,
  TrendingUp,
} from "lucide-react";

const SubscriptionManagement = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
     

      {/* Coming Soon Box */}
      <Card className="border-dashed border-2">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Calendar className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Coming Soon</CardTitle>
          <CardDescription>
            This feature is currently under development
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>Feature in development</span>
          </div>
          <p className="text-muted-foreground max-w-md mx-auto">
            We're working hard to bring you subscription management
            capabilities. This will include billing, plan management, and
            subscription analytics.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 max-w-lg mx-auto">
            <div className="text-center p-3 rounded-lg border bg-card">
              <TrendingUp className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-medium">Analytics</p>
            </div>
            <div className="text-center p-3 rounded-lg border bg-card">
              <Eye className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-medium">Overview</p>
            </div>
            <div className="text-center p-3 rounded-lg border bg-card">
              <Download className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-medium">Reports</p>
            </div>
            <div className="text-center p-3 rounded-lg border bg-card">
              <RefreshCw className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-medium">Automation</p>
            </div>
          </div>

          <div className="pt-4 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 inline mr-1" />
            <span>Expected launch: Q2 2024</span>
          </div>
        </CardContent>
      </Card>

      {/* Placeholder content */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="opacity-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Active Subscriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">
              Currently unavailable
            </p>
          </CardContent>
        </Card>
        <Card className="opacity-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$--.--</div>
            <p className="text-xs text-muted-foreground">
              Currently unavailable
            </p>
          </CardContent>
        </Card>
        <Card className="opacity-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Renewals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">
              Currently unavailable
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubscriptionManagement;
