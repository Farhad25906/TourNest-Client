// // services/subscription.service.ts - SIMPLIFIED VERSION
// "use server"

// import { serverFetch } from "@/lib/server-fetch";

// import { 
//   ISubscription, 
//   ISubscriptionPlan,
//   ISubscriptionAnalytics,
//   ISubscriptionUpdateData
// } from "@/types/subscription.interface";
// import { revalidateTag } from "next/cache";

// // Get all subscriptions for admin
// export async function getAllSubscriptions() {
//   try {
//     const response = await serverFetch.get(`/subscriptions/plans`, {
//       next: {
//         tags: ["admin-subscriptions"],
//         revalidate: 30,
//       }
//     });
//     // console.log(response);
    
    
//     const result = await response.json();
//     console.log(result);
    
    
//     return {
//       success: result.success,
//       data: Array.isArray(result.data) ? result.data as ISubscription[] : [],
//       message: result.message
//     };
//   } catch (error: any) {
//     console.error("Get all subscriptions error:", error);
//     return {
//       success: false,
//       data: [],
//       message: `Failed to fetch subscriptions`
//     };
//   }
// }

// // Get subscription details
// export async function getSubscriptionDetails(subscriptionId: string) {
//   try {
//     const response = await serverFetch.get(`/subscription/${subscriptionId}`, {
//       next: {
//         tags: [`subscription-${subscriptionId}`],
//         revalidate: 60,
//       }
//     });
    
//     const result = await response.json();
    
//     if (result.success) {
//       return {
//         success: true,
//         data: result.data as ISubscription
//       };
//     }
    
//     return result;
//   } catch (error: any) {
//     console.error("Get subscription details error:", error);
//     return {
//       success: false,
//       message: `Failed to fetch subscription details`
//     };
//   }
// }

// // Update subscription
// export async function updateSubscription(subscriptionId: string, data: ISubscriptionUpdateData) {
//   try {
//     const response = await serverFetch.patch(`/subscription/${subscriptionId}`, {
//       body: JSON.stringify(data),
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     const result = await response.json();

//     if (result.success) {
//       revalidateTag("admin-subscriptions");
//       revalidateTag(`subscription-${subscriptionId}`);
//       revalidateTag("subscription-analytics");
      
//       return {
//         success: true,
//         data: result.data,
//         message: result.message || "Subscription updated successfully"
//       };
//     }

//     return result;
//   } catch (error: any) {
//     console.error("Update subscription error:", error);
//     return {
//       success: false,
//       message: `Failed to update subscription`
//     };
//   }
// }

// // Delete subscription
// export async function deleteSubscription(subscriptionId: string) {
//   try {
//     const response = await serverFetch.delete(`/subscription/${subscriptionId}`);
//     const result = await response.json();

//     if (result.success) {
//       revalidateTag("admin-subscriptions");
//       revalidateTag("subscription-analytics");
      
//       return {
//         success: true,
//         message: result.message || "Subscription deleted successfully",
//         data: result.data
//       };
//     }

//     return result;
//   } catch (error: any) {
//     console.error("Delete subscription error:", error);
//     return {
//       success: false,
//       message: `Failed to delete subscription`
//     };
//   }
// }

// // Get subscription analytics
// export async function getSubscriptionAnalytics() {
//   try {
//     const response = await serverFetch.get(`/subscription/analytics/overview`, {
//       next: {
//         tags: ["subscription-analytics"],
//         revalidate: 300,
//       }
//     });
    
//     const result = await response.json();
    
//     if (result.success) {
//       return {
//         success: true,
//         data: result.data as ISubscriptionAnalytics
//       };
//     }
    
//     return result;
//   } catch (error: any) {
//     console.error("Get subscription analytics error:", error);
//     return {
//       success: false,
//       message: `Failed to fetch subscription analytics`
//     };
//   }
// }

// // Get all subscription plans
// export async function getAllSubscriptionPlans() {
//   try {
//     const response = await serverFetch.get(`/subscription/plans`);
//     const result = await response.json();
    
//     return {
//       success: result.success,
//       data: Array.isArray(result.data) ? result.data as ISubscriptionPlan[] : [],
//     };
//   } catch (error: any) {
//     console.error("Get subscription plans error:", error);
//     return {
//       success: false,
//       data: [],
//       message: `Failed to fetch subscription plans`
//     };
//   }
// }

// // Create subscription plan
// export async function createSubscriptionPlan(data: Partial<ISubscriptionPlan>) {
//   try {
//     const response = await serverFetch.post(`/subscription/create-plan`, {
//       body: JSON.stringify(data),
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     const result = await response.json();

//     if (result.success) {
//       revalidateTag("subscription-plans");
      
//       return {
//         success: true,
//         data: result.data,
//         message: result.message || "Subscription plan created successfully"
//       };
//     }

//     return result;
//   } catch (error: any) {
//     console.error("Create subscription plan error:", error);
//     return {
//       success: false,
//       message: `Failed to create subscription plan`
//     };
//   }
// }

// // Update subscription plan
// export async function updateSubscriptionPlan(planId: string, data: Partial<ISubscriptionPlan>) {
//   try {
//     const response = await serverFetch.patch(`/subscription/plans/${planId}`, {
//       body: JSON.stringify(data),
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     const result = await response.json();

//     if (result.success) {
//       revalidateTag("subscription-plans");
      
//       return {
//         success: true,
//         data: result.data,
//         message: result.message || "Subscription plan updated successfully"
//       };
//     }

//     return result;
//   } catch (error: any) {
//     console.error("Update subscription plan error:", error);
//     return {
//       success: false,
//       message: `Failed to update subscription plan`
//     };
//   }
// }

// // Delete subscription plan
// export async function deleteSubscriptionPlan(planId: string) {
//   try {
//     const response = await serverFetch.delete(`/subscription/plans/${planId}`);
//     const result = await response.json();

//     if (result.success) {
//       revalidateTag("subscription-plans");
      
//       return {
//         success: true,
//         message: result.message || "Subscription plan deleted successfully",
//         data: result.data
//       };
//     }

//     return result;
//   } catch (error: any) {
//     console.error("Delete subscription plan error:", error);
//     return {
//       success: false,
//       message: `Failed to delete subscription plan`
//     };
//   }
// }