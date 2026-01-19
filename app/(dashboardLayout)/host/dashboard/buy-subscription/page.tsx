// app/(host)/host/buy-subscription/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  CheckCircle,
  XCircle,
  Loader2,
  CreditCard,
  Shield,
  Zap,
  Users,
  FileText,
  Calendar,
  Star,
  Check,
} from "lucide-react";
import {
  getPublicSubscriptions,
  getCurrentSubscription,
  createSubscription,
  initiateSubscriptionPayment,
} from "@/services/subscription.service";

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  tourLimit: number;
  blogLimit: number | null;
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CurrentSubscription {
  id?: string;
  plan?: SubscriptionPlan;
  status?: string;
  isActive?: boolean;
  isFree?: boolean;
  tourLimit?: number;
  remainingTours?: number;
  blogLimit?: number | null;
  remainingBlogs?: number | null;
  startDate?: string;
  endDate?: string;
  message?: string;
  requiresPayment?: boolean;
  paymentId?: string;
  subscriptionId?: string;
}

export default function BuySubscriptionPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [currentSubscription, setCurrentSubscription] =
    useState<CurrentSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState<string | null>(
    null
  );

  // Load plans and current subscription
  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load available plans
      const plansResult = await getPublicSubscriptions();
      if (plansResult.success && Array.isArray(plansResult.data)) {
        setPlans(plansResult.data);
      }

      // Load current subscription
      const subscriptionResult = await getCurrentSubscription();
      if (subscriptionResult.success) {
        setCurrentSubscription(subscriptionResult.data);
        
        // If user has an active plan, select it
        if (subscriptionResult.data.plan?.id) {
          setSelectedPlan(subscriptionResult.data.plan.id);
        }
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load subscription data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle plan selection
  const handlePlanSelect = (planId: string) => {
    if (currentSubscription?.isActive && !confirm("Are you sure you want to change your subscription? Your current subscription will be cancelled.")) {
      return;
    }
    setSelectedPlan(planId);
  };

  // Handle subscription creation/payment
  const handleSubscribe = async (planId: string) => {
    if (!planId) {
      toast.error("Please select a plan");
      return;
    }

    const plan = plans.find((p) => p.id === planId);
    if (!plan) {
      toast.error("Selected plan not found");
      return;
    }

    setProcessing(true);

    try {
      // Create subscription
      const subscriptionResult = await createSubscription(planId);
      
      if (!subscriptionResult.success) {
        throw new Error(subscriptionResult.message || "Failed to create subscription");
      }

      // For free plans, activate immediately
      if (plan.price === 0) {
        toast.success("Free subscription activated successfully!");
        await loadData();
        return;
      }

      // For paid plans, initiate payment
      if (subscriptionResult.data?.subscriptionId) {
        await handlePaymentInitiation(subscriptionResult.data.subscriptionId);
      }
    } catch (error: any) {
      console.error("Subscribe error:", error);
      toast.error(error.message || "Failed to subscribe to plan");
    } finally {
      setProcessing(false);
    }
  };

  // Handle payment initiation
  const handlePaymentInitiation = async (subscriptionId: string) => {
    setPaymentProcessing(subscriptionId);

    try {
      const paymentResult = await initiateSubscriptionPayment(subscriptionId);
      
      if (paymentResult.success && paymentResult.data?.paymentUrl) {
        // Redirect to Stripe payment page
        window.location.href = paymentResult.data.paymentUrl;
      } else {
        throw new Error("Failed to initiate payment");
      }
    } catch (error: any) {
      console.error("Payment initiation error:", error);
      toast.error(error.message || "Failed to initiate payment");
      setPaymentProcessing(null);
    }
  };

  // Render plan card
  const renderPlanCard = (plan: SubscriptionPlan) => {
    const isSelected = selectedPlan === plan.id;
    const isCurrentPlan = currentSubscription?.plan?.id === plan.id;
    const isProcessingPayment = paymentProcessing === plan.id;
    const isRecommended = plan.name === "Standard";

    return (
      <div
        key={plan.id}
        className={`relative rounded-2xl border-2 transition-all duration-300 ${
          isSelected
            ? "border-blue-600 bg-blue-50 shadow-lg"
            : "border-gray-200 bg-white"
        } ${isRecommended ? "ring-2 ring-blue-300 ring-offset-2" : ""}`}
      >
        {isRecommended && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span className="bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
              MOST POPULAR
            </span>
          </div>
        )}

        <div className="p-8">
          {/* Plan Header */}
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {plan.name}
            </h3>
            <p className="text-gray-600 text-sm">{plan.description}</p>
          </div>

          {/* Price */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center">
              <span className="text-5xl font-bold text-gray-900">
                ${plan.price}
              </span>
              <span className="text-gray-500 ml-2">
                /{plan.duration} months
              </span>
            </div>
            {plan.price === 0 && (
              <p className="text-green-600 font-medium mt-2">Forever free!</p>
            )}
          </div>

          {/* Current Plan Badge */}
          {isCurrentPlan && (
            <div className="mb-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                <CheckCircle className="w-4 h-4" />
                Current Plan
              </div>
            </div>
          )}

          {/* Limits */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Tour Limit</span>
              </div>
              <span className="font-bold text-gray-900">{plan.tourLimit}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Blog Posts</span>
              </div>
              <span className="font-bold text-gray-900">
                {plan.blogLimit === null ? "Unlimited" : plan.blogLimit}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Duration</span>
              </div>
              <span className="font-bold text-gray-900">{plan.duration} months</span>
            </div>
          </div>

          {/* Features */}
          <div className="mb-8">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Features included:
            </h4>
            <ul className="space-y-3">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Button */}
          <button
            onClick={() => {
              if (isCurrentPlan && currentSubscription?.isActive) {
                toast.info("You are already on this plan");
                return;
              }
              handlePlanSelect(plan.id);
              handleSubscribe(plan.id);
            }}
            disabled={
              processing ||
              (isCurrentPlan && currentSubscription?.isActive) ||
              isProcessingPayment
            }
            className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
              isCurrentPlan && currentSubscription?.isActive
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : isSelected
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
            }`}
          >
            {isProcessingPayment ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : isCurrentPlan && currentSubscription?.isActive ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Current Plan
              </>
            ) : plan.price === 0 ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Activate Free Plan
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                {isCurrentPlan ? "Upgrade Now" : "Get Started"}
              </>
            )}
          </button>

          {/* Free plan note */}
          {plan.price === 0 && (
            <p className="text-center text-gray-500 text-sm mt-4">
              No payment required
            </p>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading subscription plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Choose Your Plan
              </h1>
              <p className="text-gray-600 mt-2">
                Select the perfect subscription plan for your hosting needs
              </p>
            </div>

            {/* Current Plan Info */}
            {currentSubscription && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Current Plan:{" "}
                      {currentSubscription.plan?.name || "Free Plan"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {currentSubscription.isActive
                        ? `Active until ${new Date(
                            currentSubscription.endDate || ""
                          ).toLocaleDateString()}`
                        : "Inactive or pending payment"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">
                  Grow Your Business
                </h3>
                <p className="text-gray-600">
                  Increase your tour visibility and reach more travelers
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-start gap-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">
                  Priority Support
                </h3>
                <p className="text-gray-600">
                  Get dedicated support and faster response times
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-start gap-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">
                  Featured Listings
                </h3>
                <p className="text-gray-600">
                  Your tours get premium placement in search results
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {plans
            .filter((plan) => plan.isActive)
            .map((plan) => renderPlanCard(plan))}
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-sm border p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-gray-900 mb-2">
                How does payment work?
              </h3>
              <p className="text-gray-600">
                Payments are processed securely through Stripe. You'll be
                redirected to a secure payment page to complete your purchase.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">
                Can I change my plan later?
              </h3>
              <p className="text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time. The
                change will take effect at the start of your next billing cycle.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-600">
                We offer a free plan with basic features. Paid plans start with
                a full-featured trial period as indicated in each plan.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">
                What happens if I cancel?
              </h3>
              <p className="text-gray-600">
                You can cancel anytime. You'll keep access to premium features
                until the end of your current billing period.
              </p>
            </div>
          </div>
        </div>

        {/* Payment Security Info */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-4 text-gray-600">
            <Shield className="w-5 h-5 text-green-600" />
            <span>Secure payment processed by Stripe</span>
            <Shield className="w-5 h-5 text-green-600" />
            <span>256-bit SSL encryption</span>
            <Shield className="w-5 h-5 text-green-600" />
            <span>PCI DSS compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
}