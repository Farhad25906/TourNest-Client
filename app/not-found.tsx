'use client';

import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-[500px] mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-9xl font-bold tracking-tighter text-foreground/90">
            404
          </h1>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground">
            Oops! Page not found.
          </h2>
          <p className="text-lg text-muted-foreground">
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full sm:w-auto gap-2"
            >
              <Home className="h-4 w-4" />
              Home
            </Button>
          </Link>
          
          <Button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;