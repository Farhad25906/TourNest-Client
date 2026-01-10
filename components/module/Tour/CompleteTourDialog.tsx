"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCheck, Loader2, Calendar, Users, PowerOff } from "lucide-react";
import { formatDate } from "@/lib/date-utils";
import { ITour } from "@/types/tour.interface";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface CompleteTourDialogProps {
  tour: ITour;
  open: boolean;
  onClose: () => void;
  onConfirm: (option: 'complete' | 'deactivate') => void; // Updated to accept option
  isCompleting: boolean;
}

export default function CompleteTourDialog({
  tour,
  open,
  onClose,
  onConfirm,
  isCompleting
}: CompleteTourDialogProps) {
  const [selectedOption, setSelectedOption] = useState<'complete' | 'deactivate'>('complete');
  
  const tourEndDate = new Date(tour.endDate);
  const currentDate = new Date();
  const hasEnded = tourEndDate <= currentDate;
  const hasConfirmedBookings = (tour.bookingCount || 0) > 0;

  const handleConfirm = () => {
    onConfirm(selectedOption);
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            {selectedOption === 'complete' ? (
              <CheckCheck className="h-5 w-5 text-amber-600" />
            ) : (
              <PowerOff className="h-5 w-5 text-blue-600" />
            )}
            {selectedOption === 'complete' ? 'Complete Tour' : 'Deactivate Tour'}
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            {/* Option Selector */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <Button
                type="button"
                variant={selectedOption === 'complete' ? "default" : "outline"}
                className={`flex flex-col items-center justify-center h-20 ${
                  selectedOption === 'complete' ? 'bg-amber-600 hover:bg-amber-700' : ''
                }`}
                onClick={() => setSelectedOption('complete')}
              >
                <CheckCheck className="h-5 w-5 mb-2" />
                <span className="text-sm font-medium">Complete Tour</span>
                <span className="text-xs opacity-80 mt-1">Mark as finished</span>
              </Button>
              
              <Button
                type="button"
                variant={selectedOption === 'deactivate' ? "default" : "outline"}
                className={`flex flex-col items-center justify-center h-20 ${
                  selectedOption === 'deactivate' ? 'bg-blue-600 hover:bg-blue-700' : ''
                }`}
                onClick={() => setSelectedOption('deactivate')}
              >
                <PowerOff className="h-5 w-5 mb-2" />
                <span className="text-sm font-medium">Just Deactivate</span>
                <span className="text-xs opacity-80 mt-1">Only disable tour</span>
              </Button>
            </div>

            {/* Tour Information */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-slate-900">{tour.title}</h4>
                  <p className="text-sm text-slate-600">
                    {tour.destination}, {tour.city}
                  </p>
                </div>
                <Badge variant={tour.isActive ? "default" : "secondary"}>
                  {tour.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <div>
                    <div className="font-medium">Dates</div>
                    <div className="text-slate-600">
                      {formatDate(tour.startDate)} - {formatDate(tour.endDate)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-slate-500" />
                  <div>
                    <div className="font-medium">Bookings</div>
                    <div className="text-slate-600">
                      {tour.bookingCount || 0} total
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Details */}
            <div className="border-t pt-3">
              {selectedOption === 'complete' ? (
                <>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-amber-800">
                          Complete Tour Action
                        </p>
                        <p className="text-xs text-amber-700">
                          This is recommended when the tour has ended and all activities are finished.
                        </p>
                      </div>
                    </div>
                  </div>

                  <h5 className="text-sm font-medium mb-2">What will happen:</h5>
                  <ul className="text-sm space-y-2 text-slate-700">
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                      <span>Tour will be marked as inactive (isActive: false)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                      <span>All confirmed bookings will be updated to COMPLETED status</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                      <span>Pending bookings will be cancelled automatically</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                      <span className="font-medium">This is the recommended action for finished tours</span>
                    </li>
                  </ul>

                  {!hasEnded && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-3">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-red-800">
                            Tour hasn't ended yet
                          </p>
                          <p className="text-xs text-red-700">
                            The tour end date ({formatDate(tour.endDate)}) hasn't passed yet. 
                            Are you sure you want to complete it early?
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-blue-800">
                          Simple Deactivation
                        </p>
                        <p className="text-xs text-blue-700">
                          This only disables the tour. Bookings will remain unchanged.
                        </p>
                      </div>
                    </div>
                  </div>

                  <h5 className="text-sm font-medium mb-2">What will happen:</h5>
                  <ul className="text-sm space-y-2 text-slate-700">
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                      <span>Tour will be marked as inactive (isActive: false)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                      <span>All existing bookings will remain in their current status</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                      <span>No new bookings can be made</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                      <span className="font-medium">Use this if you need to temporarily disable the tour</span>
                    </li>
                  </ul>

                  {hasConfirmedBookings && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-3">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-amber-800">
                            Active Bookings Exist
                          </p>
                          <p className="text-xs text-amber-700">
                            This tour has {tour.bookingCount} booking(s). Consider using "Complete Tour" 
                            instead to properly update booking statuses.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel disabled={isCompleting}>
            Cancel
          </AlertDialogCancel>
          <Button
            onClick={handleConfirm}
            disabled={isCompleting}
            className={
              selectedOption === 'complete' 
                ? "bg-amber-600 hover:bg-amber-700 text-white" 
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }
          >
            {isCompleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : selectedOption === 'complete' ? (
              <>
                <CheckCheck className="mr-2 h-4 w-4" />
                Complete Tour
              </>
            ) : (
              <>
                <PowerOff className="mr-2 h-4 w-4" />
                Deactivate Only
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}