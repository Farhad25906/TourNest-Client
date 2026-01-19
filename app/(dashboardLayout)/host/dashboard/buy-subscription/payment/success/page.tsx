// app/subscription/payment/cancel/page.tsx
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { XCircle, Home, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function SubscriptionPaymentCancel() {
  const searchParams = useSearchParams();
  const subscriptionId = searchParams.get('subscription_id');

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 p-4 rounded-full">
            <XCircle className="h-16 w-16 text-red-600" />
          </div>
        </div>

        {/* Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Payment Cancelled
        </h1>
        <p className="text-gray-600 mb-6">
          Your payment was not completed. Your subscription remains pending until payment is made.
        </p>

        {/* Subscription Info */}
        {subscriptionId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">
              Subscription ID: <span className="font-mono text-xs">{subscriptionId}</span>
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            href="/dashboard/host/subscription"
            className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            <Home className="mr-2 h-5 w-5" />
            Return to Subscriptions
          </Link>
          
          <button
            onClick={() => window.location.reload()}
            className="w-full inline-flex items-center justify-center px-6 py-3 border border-red-600 text-base font-medium rounded-lg text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            <RefreshCw className="mr-2 h-5 w-5" />
            Try Again
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-sm text-gray-500">
          <p className="mb-2">Having trouble with payment?</p>
          <ul className="text-left space-y-1">
            <li>• Check your payment method details</li>
            <li>• Ensure you have sufficient funds</li>
            <li>• Try a different payment method</li>
          </ul>
          <p className="mt-4">
            Need help?{' '}
            <Link href="/contact" className="text-red-600 hover:text-red-700">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}