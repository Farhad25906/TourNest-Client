"use client"

import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  CheckCircle, 
  Loader2 
} from 'lucide-react';

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

interface SubscriptionPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
  selectedPlan: SubscriptionPlan | null;
  isSubmitting: boolean;
}

export default function SubscriptionPlanModal({
  isOpen,
  onClose,
  onSubmit,
  selectedPlan,
  isSubmitting
}: SubscriptionPlanModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: selectedPlan?.name || '',
    description: selectedPlan?.description || '',
    price: selectedPlan?.price || 0,
    duration: selectedPlan?.duration || 12,
    tourLimit: selectedPlan?.tourLimit || 0,
    blogLimit: selectedPlan?.blogLimit || null,
    features: selectedPlan?.features ? [...selectedPlan.features] : [],
    isActive: selectedPlan?.isActive ?? true
  });
  const [featureInput, setFeatureInput] = useState('');

  // Update form data when selectedPlan changes
  React.useEffect(() => {
    if (selectedPlan) {
      setFormData({
        name: selectedPlan.name,
        description: selectedPlan.description,
        price: selectedPlan.price,
        duration: selectedPlan.duration,
        tourLimit: selectedPlan.tourLimit,
        blogLimit: selectedPlan.blogLimit,
        features: [...selectedPlan.features],
        isActive: selectedPlan.isActive
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: 0,
        duration: 12,
        tourLimit: 0,
        blogLimit: null,
        features: [],
        isActive: true
      });
    }
    setFeatureInput('');
  }, [selectedPlan, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === 'number') {
      const numValue = value === '' ? 0 : parseFloat(value);
      setFormData(prev => ({ ...prev, [name]: numValue }));
    } else if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, featureInput.trim()]
      }));
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    await onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {selectedPlan ? 'Edit Subscription Plan' : 'Create New Subscription Plan'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plan Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price ($) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (months) *
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tour Limit (per year) *
                </label>
                <input
                  type="number"
                  name="tourLimit"
                  value={formData.tourLimit}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blog Limit
                </label>
                <input
                  type="number"
                  name="blogLimit"
                  value={formData.blogLimit === null ? '' : formData.blogLimit}
                  onChange={(e) => {
                    const value = e.target.value === '' ? null : parseInt(e.target.value);
                    setFormData(prev => ({ ...prev, blogLimit: value }));
                  }}
                  min="0"
                  placeholder="Leave empty for unlimited"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500 mt-1">Set to 0 or leave empty for unlimited</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Features *
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddFeature();
                    }
                  }}
                  placeholder="Add a feature..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  disabled={isSubmitting || !featureInput.trim()}
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-2">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="flex-1 text-sm">{feature}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(index)}
                      className="text-red-600 hover:text-red-700 disabled:opacity-50"
                      disabled={isSubmitting}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {formData.features.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-2">No features added yet</p>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                disabled={isSubmitting}
              />
              <label className="ml-2 text-sm font-medium text-gray-700">
                Plan is active
              </label>
            </div>
          </div>

          <div className="flex gap-3 mt-6 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {selectedPlan ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                selectedPlan ? 'Save Changes' : 'Create Plan'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}