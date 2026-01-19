// components/module/Admin/SubscriptionManagement.tsx
"use client"

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  Pencil, 
  Trash2, 
  Plus, 
  Package, 
  CheckCircle, 
  Calendar,
  Loader2 
} from 'lucide-react';
import {
  getAllSubscriptionPlans,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
  createSubscriptionPlan
} from '@/services/subscription.service';
import SubscriptionPlanModal from './SubscriptionPlanModal';

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

interface FormData {
  name: string;
  description: string;
  price: number;
  duration: number;
  tourLimit: number;
  blogLimit: number | null;
  features: string[];
  isActive: boolean;
}

export default function SubscriptionManagement() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadSubscriptionPlans = async () => {
    try {
      setLoading(true);
      const result = await getAllSubscriptionPlans();
      
      console.log("API Response:", result);
      
      if (result.success && Array.isArray(result.data)) {
        setPlans(result.data);
      } else {
        toast.error(result.message || 'Failed to load subscription plans');
        setPlans([]);
      }
    } catch (error) {
      console.error('Load data error:', error);
      toast.error('Failed to load subscription plans');
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscriptionPlans();
  }, []);

  const handleEditClick = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleCreateClick = () => {
    setSelectedPlan(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPlan(null);
    setIsSubmitting(false);
  };

  const validateForm = (formData: FormData) => {
    if (!formData.name.trim()) {
      toast.error('Plan name is required');
      return false;
    }
    if (!formData.description.trim()) {
      toast.error('Description is required');
      return false;
    }
    if (formData.price < 0) {
      toast.error('Price must be greater than or equal to 0');
      return false;
    }
    if (formData.duration < 1) {
      toast.error('Duration must be at least 1 month');
      return false;
    }
    if (formData.tourLimit < 0) {
      toast.error('Tour limit must be greater than or equal to 0');
      return false;
    }
    if (formData.blogLimit !== null && formData.blogLimit < 0) {
      toast.error('Blog limit must be greater than or equal to 0');
      return false;
    }
    if (formData.features.length === 0) {
      toast.error('At least one feature is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (formData: FormData) => {
    if (!validateForm(formData)) return;

    setIsSubmitting(true);
    try {
      if (selectedPlan) {
        // Update existing plan
        const result = await updateSubscriptionPlan(selectedPlan.id, formData);
        if (result.success) {
          toast.success(result.message || 'Subscription plan updated successfully');
          handleCloseModal();
          await loadSubscriptionPlans();
        } else {
          toast.error(result.message || 'Failed to update subscription plan');
        }
      } else {
        // Create new plan
        const result = await createSubscriptionPlan(formData);
        if (result.success) {
          toast.success(result.message || 'Subscription plan created successfully');
          handleCloseModal();
          await loadSubscriptionPlans();
        } else {
          toast.error(result.message || 'Failed to create subscription plan');
        }
      }
    } catch (error: any) {
      console.error('Submit error:', error);
      toast.error(error.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (planId: string, planName: string) => {
    if (!confirm(`Are you sure you want to delete the "${planName}" plan? This action cannot be undone.`)) {
      return;
    }

    try {
      setIsDeleting(true);
      const result = await deleteSubscriptionPlan(planId);
      if (result.success) {
        toast.success(result.message || 'Subscription plan deleted successfully');
        await loadSubscriptionPlans();
      } else {
        toast.error(result.message || 'Failed to delete subscription plan');
      }
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error(error.message || 'Failed to delete subscription plan');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Subscription Plans</h1>
            <p className="text-gray-600 mt-2">Manage subscription plans and pricing</p>
          </div>
          <button
            onClick={handleCreateClick}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            Create New Plan
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700">No subscription plans found</h3>
              <p className="text-gray-500 mt-2">Create your first subscription plan to get started</p>
            </div>
          ) : (
            plans.map((plan) => (
              <div
                key={plan.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className={`p-6 ${plan.name === 'Premium' ? 'bg-gradient-to-r from-purple-600 to-blue-600' : plan.name === 'Standard' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-gradient-to-r from-gray-500 to-gray-600'} text-white`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-bold">{plan.name}</h3>
                      <p className="text-sm mt-1 opacity-90">{plan.description}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${plan.isActive ? 'bg-green-500' : 'bg-red-500'}`}>
                      {plan.isActive ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">${plan.price.toFixed(2)}</span>
                    <span className="text-sm opacity-90">/{plan.duration} months</span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-gray-700">
                      <Package className="w-4 h-4 mr-2 text-blue-600" />
                      <span><strong>{plan.tourLimit}</strong> tours per year</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                      <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                      <span>
                        <strong>{plan.blogLimit === null ? 'Unlimited' : plan.blogLimit}</strong> blog posts
                      </span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-sm text-gray-900 mb-3">Features:</h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-2 mt-6 pt-4 border-t">
                    <button
                      onClick={() => handleEditClick(plan)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(plan.id, plan.name)}
                      disabled={isDeleting}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isDeleting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <SubscriptionPlanModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        selectedPlan={selectedPlan}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}