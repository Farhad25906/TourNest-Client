/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { createTour } from "@/services/tour/tour.service";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CATEGORIES, DIFFICULTIES } from "@/types/tour.interface";
import { Plus, Trash2, GripVertical, Calendar, X } from "lucide-react";
import { useRouter } from "next/navigation";

// Define the expected error state interface
interface ErrorState {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  [key: string]: any;
}

// Type guard to check if state has errors
const hasErrors = (state: any): state is ErrorState => {
  return (
    state &&
    typeof state === "object" &&
    "errors" in state &&
    state.errors !== null &&
    typeof state.errors === "object"
  );
};

// Helper function to get field errors
const getFieldErrors = (state: any, field: string): string[] => {
  if (!hasErrors(state)) return [];

  const fieldErrors = state.errors?.[field]; // Optional chaining
  if (Array.isArray(fieldErrors)) {
    return fieldErrors.filter(
      (error): error is string => typeof error === "string"
    );
  }

  return [];
};

export default function CreateTourForm() {
  const [state, formAction, isPending] = useActionState(createTour, null);
  const [includedItems, setIncludedItems] = useState<string[]>([""]);
  const [excludedItems, setExcludedItems] = useState<string[]>([""]);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const router = useRouter();

  // Improved itinerary state
  const [itinerary, setItinerary] = useState<
    Array<{
      day: number;
      title: string;
      description: string;
      activities: string[];
      accommodation?: string;
      meals?: string;
      notes?: string;
    }>
  >([
    {
      day: 1,
      title: "Day 1",
      description: "",
      activities: [""],
      accommodation: "",
      meals: "",
      notes: "",
    },
  ]);

  useEffect(() => {
    if (!state) return; // Skip initial mount

    if (!state.success && state.message) {
      toast.error(state.message);
    } else if (state.success) {
      toast.success(state.message);

      // Use requestAnimationFrame to batch updates
      requestAnimationFrame(() => {
        setIncludedItems([""]);
        setExcludedItems([""]);
        setImage(null);
        setImagePreview(null);
        setItinerary([
          {
            day: 1,
            title: "Day 1",
            description: "",
            activities: [""],
            accommodation: "",
            meals: "",
            notes: "",
          },
        ]);
      });
      setTimeout(() => {
        router.push("/host/dashboard/tours");
      }, 1000);
    }
  }, [state]);

  // Itinerary functions
  const addItineraryItem = () => {
    const lastDay =
      itinerary.length > 0 ? Math.max(...itinerary.map((i) => i.day)) : 0;
    setItinerary([
      ...itinerary,
      {
        day: lastDay + 1,
        title: `Day ${lastDay + 1}`,
        description: "",
        activities: [""],
        accommodation: "",
        meals: "",
        notes: "",
      },
    ]);
  };

  const removeItineraryItem = (index: number) => {
    if (itinerary.length > 1) {
      const newItinerary = itinerary.filter((_, i) => i !== index);
      // Reorder days sequentially
      const reorderedItinerary = newItinerary.map((item, idx) => ({
        ...item,
        day: idx + 1,
        title: `Day ${idx + 1}`,
      }));
      setItinerary(reorderedItinerary);
    }
  };

  const updateItineraryField = (
    index: number,
    field: string,
    value: string
  ) => {
    const newItinerary = [...itinerary];
    newItinerary[index] = { ...newItinerary[index], [field]: value };
    setItinerary(newItinerary);
  };

  const addActivity = (dayIndex: number) => {
    const newItinerary = [...itinerary];
    newItinerary[dayIndex].activities.push("");
    setItinerary(newItinerary);
  };

  const removeActivity = (dayIndex: number, activityIndex: number) => {
    const newItinerary = [...itinerary];
    if (newItinerary[dayIndex].activities.length > 1) {
      newItinerary[dayIndex].activities = newItinerary[
        dayIndex
      ].activities.filter((_, i) => i !== activityIndex);
      setItinerary(newItinerary);
    }
  };

  const updateActivity = (
    dayIndex: number,
    activityIndex: number,
    value: string
  ) => {
    const newItinerary = [...itinerary];
    newItinerary[dayIndex].activities[activityIndex] = value;
    setItinerary(newItinerary);
  };

  const moveDayUp = (index: number) => {
    if (index > 0) {
      const newItinerary = [...itinerary];
      [newItinerary[index], newItinerary[index - 1]] = [
        newItinerary[index - 1],
        newItinerary[index],
      ];
      // Update day numbers
      const updatedItinerary = newItinerary.map((item, idx) => ({
        ...item,
        day: idx + 1,
        title: `Day ${idx + 1}`,
      }));
      setItinerary(updatedItinerary);
    }
  };

  const moveDayDown = (index: number) => {
    if (index < itinerary.length - 1) {
      const newItinerary = [...itinerary];
      [newItinerary[index], newItinerary[index + 1]] = [
        newItinerary[index + 1],
        newItinerary[index],
      ];
      // Update day numbers
      const updatedItinerary = newItinerary.map((item, idx) => ({
        ...item,
        day: idx + 1,
        title: `Day ${idx + 1}`,
      }));
      setItinerary(updatedItinerary);
    }
  };

  // Existing functions for included/excluded items
  const addIncludedItem = () => {
    setIncludedItems([...includedItems, ""]);
  };

  const removeIncludedItem = (index: number) => {
    const newItems = includedItems.filter((_, i) => i !== index);
    setIncludedItems(newItems);
  };

  const updateIncludedItem = (index: number, value: string) => {
    const newItems = [...includedItems];
    newItems[index] = value;
    setIncludedItems(newItems);
  };

  const addExcludedItem = () => {
    setExcludedItems([...excludedItems, ""]);
  };

  const removeExcludedItem = (index: number) => {
    const newItems = excludedItems.filter((_, i) => i !== index);
    setExcludedItems(newItems);
  };

  const updateExcludedItem = (index: number, value: string) => {
    const newItems = [...excludedItems];
    newItems[index] = value;
    setExcludedItems(newItems);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  return (
    <form action={formAction} className="space-y-6">
      {/* Hidden input for itinerary JSON */}
      <input
        type="hidden"
        name="itinerary"
        value={JSON.stringify(
          itinerary.map((day) => ({
            day: day.day,
            activities: day.activities.filter(
              (activity) => activity.trim() !== ""
            ),
            title: day.title,
            description: day.description,
            accommodation: day.accommodation,
            meals: day.meals,
            notes: day.notes,
          }))
        )}
      />

      <FieldGroup>
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Field>
            <FieldLabel htmlFor="title">Tour Title *</FieldLabel>
            <Input
              id="title"
              name="title"
              type="text"
              placeholder="Amazing Bali Adventure"
              required
            />
            {hasErrors(state) &&
              getFieldErrors(state, "title").map((error, index) => (
                <p key={index} className="text-sm text-red-500 mt-1">
                  {error}
                </p>
              ))}
          </Field>

          <Field>
            <FieldLabel htmlFor="destination">Destination *</FieldLabel>
            <Input
              id="destination"
              name="destination"
              type="text"
              placeholder="Bali, Indonesia"
              required
            />
            {hasErrors(state) &&
              getFieldErrors(state, "destination").map((error, index) => (
                <p key={index} className="text-sm text-red-500 mt-1">
                  {error}
                </p>
              ))}
          </Field>

          <Field>
            <FieldLabel htmlFor="city">City *</FieldLabel>
            <Input
              id="city"
              name="city"
              type="text"
              placeholder="Ubud"
              required
            />
            {hasErrors(state) &&
              getFieldErrors(state, "city").map((error, index) => (
                <p key={index} className="text-sm text-red-500 mt-1">
                  {error}
                </p>
              ))}
          </Field>

          <Field>
            <FieldLabel htmlFor="country">Country *</FieldLabel>
            <Input
              id="country"
              name="country"
              type="text"
              placeholder="Indonesia"
              required
            />
            {hasErrors(state) &&
              getFieldErrors(state, "country").map((error, index) => (
                <p key={index} className="text-sm text-red-500 mt-1">
                  {error}
                </p>
              ))}
          </Field>
        </div>

        {/* Description */}
        <Field className="md:col-span-2">
          <FieldLabel htmlFor="description">Description *</FieldLabel>
          <Textarea
            id="description"
            name="description"
            placeholder="Describe your tour in detail..."
            rows={4}
            required
          />
          {hasErrors(state) &&
            getFieldErrors(state, "description").map((error, index) => (
              <p key={index} className="text-sm text-red-500 mt-1">
                {error}
              </p>
            ))}
        </Field>

        {/* Dates and Duration */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Field>
            <FieldLabel htmlFor="startDate">Start Date *</FieldLabel>
            <Input
              id="startDate"
              name="startDate"
              type="datetime-local"
              required
            />
            {hasErrors(state) &&
              getFieldErrors(state, "startDate").map((error, index) => (
                <p key={index} className="text-sm text-red-500 mt-1">
                  {error}
                </p>
              ))}
          </Field>

          <Field>
            <FieldLabel htmlFor="endDate">End Date *</FieldLabel>
            <Input id="endDate" name="endDate" type="datetime-local" required />
            {hasErrors(state) &&
              getFieldErrors(state, "endDate").map((error, index) => (
                <p key={index} className="text-sm text-red-500 mt-1">
                  {error}
                </p>
              ))}
          </Field>

          <Field>
            <FieldLabel htmlFor="duration">Duration (days) *</FieldLabel>
            <Input
              id="duration"
              name="duration"
              type="number"
              min="1"
              placeholder="7"
              required
            />
            {hasErrors(state) &&
              getFieldErrors(state, "duration").map((error, index) => (
                <p key={index} className="text-sm text-red-500 mt-1">
                  {error}
                </p>
              ))}
          </Field>
        </div>

        {/* Pricing and Group */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Field>
            <FieldLabel htmlFor="price">Price ($) *</FieldLabel>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              placeholder="999.99"
              required
            />
            {hasErrors(state) &&
              getFieldErrors(state, "price").map((error, index) => (
                <p key={index} className="text-sm text-red-500 mt-1">
                  {error}
                </p>
              ))}
          </Field>

          <Field>
            <FieldLabel htmlFor="maxGroupSize">Maximum Group Size *</FieldLabel>
            <Input
              id="maxGroupSize"
              name="maxGroupSize"
              type="number"
              min="1"
              placeholder="20"
              required
            />
            {hasErrors(state) &&
              getFieldErrors(state, "maxGroupSize").map((error, index) => (
                <p key={index} className="text-sm text-red-500 mt-1">
                  {error}
                </p>
              ))}
          </Field>
        </div>

        {/* Category and Difficulty */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Field>
            <FieldLabel htmlFor="category">Category *</FieldLabel>
            <Select name="category" required>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0) + category.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasErrors(state) &&
              getFieldErrors(state, "category").map((error, index) => (
                <p key={index} className="text-sm text-red-500 mt-1">
                  {error}
                </p>
              ))}
          </Field>

          <Field>
            <FieldLabel htmlFor="difficulty">Difficulty Level *</FieldLabel>
            <Select name="difficulty" required>
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                {DIFFICULTIES.map((difficulty) => (
                  <SelectItem key={difficulty} value={difficulty}>
                    {difficulty.charAt(0) + difficulty.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasErrors(state) &&
              getFieldErrors(state, "difficulty").map((error, index) => (
                <p key={index} className="text-sm text-red-500 mt-1">
                  {error}
                </p>
              ))}
          </Field>
        </div>

        {/* Included Items */}
        <Field>
          <FieldLabel>What's Included</FieldLabel>
          <FieldDescription>Add items included in the tour</FieldDescription>
          <div className="space-y-2">
            {includedItems.map((item, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  name="included"
                  value={item}
                  onChange={(e) => updateIncludedItem(index, e.target.value)}
                  placeholder={`Included item ${index + 1}`}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeIncludedItem(index)}
                  disabled={includedItems.length === 1}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addIncludedItem}>
              Add Included Item
            </Button>
          </div>
          {hasErrors(state) &&
            getFieldErrors(state, "included").map((error, index) => (
              <p key={index} className="text-sm text-red-500 mt-1">
                {error}
              </p>
            ))}
        </Field>

        {/* Excluded Items */}
        <Field>
          <FieldLabel>What's Excluded</FieldLabel>
          <FieldDescription>
            Add items not included in the tour
          </FieldDescription>
          <div className="space-y-2">
            {excludedItems.map((item, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  name="excluded"
                  value={item}
                  onChange={(e) => updateExcludedItem(index, e.target.value)}
                  placeholder={`Excluded item ${index + 1}`}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeExcludedItem(index)}
                  disabled={excludedItems.length === 1}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addExcludedItem}>
              Add Excluded Item
            </Button>
          </div>
          {hasErrors(state) &&
            getFieldErrors(state, "excluded").map((error, index) => (
              <p key={index} className="text-sm text-red-500 mt-1">
                {error}
              </p>
            ))}
        </Field>

        {/* Meeting Point */}
        <Field>
          <FieldLabel htmlFor="meetingPoint">Meeting Point *</FieldLabel>
          <Textarea
            id="meetingPoint"
            name="meetingPoint"
            placeholder="Exact location where participants should meet"
            rows={2}
            required
          />
          {hasErrors(state) &&
            getFieldErrors(state, "meetingPoint").map((error, index) => (
              <p key={index} className="text-sm text-red-500 mt-1">
                {error}
              </p>
            ))}
        </Field>

        {/* Enhanced Itinerary Section */}
        <Field>
          <FieldLabel>Daily Itinerary *</FieldLabel>
          <FieldDescription>
            Plan your tour day by day. Add activities, accommodations, and notes
            for each day.
          </FieldDescription>
          <div className="space-y-6">
            {itinerary.map((item, index) => (
              <div
                key={index}
                className="border rounded-xl p-5 bg-white shadow-sm"
              >
                <div className="flex items-start justify-between mb-4 pb-3 border-b">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-primary-foreground font-bold">
                        {item.day}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Day {item.day}</h3>
                      <div className="flex items-center gap-4 mt-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => moveDayUp(index)}
                          disabled={index === 0}
                          className="h-7 px-2 text-xs"
                        >
                          ↑ Move Up
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => moveDayDown(index)}
                          disabled={index === itinerary.length - 1}
                          className="h-7 px-2 text-xs"
                        >
                          ↓ Move Down
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItineraryItem(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="">
                  <div className="space-y-4">
                    <div>
                      <Label className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4" />
                        Activities
                      </Label>
                      <div className="space-y-3">
                        {item.activities.map((activity, activityIndex) => (
                          <div
                            key={activityIndex}
                            className="flex items-center gap-2"
                          >
                            <div className="flex-1 flex items-center gap-3">
                              <div className="h-2 w-2 rounded-full bg-primary"></div>
                              <Input
                                value={activity}
                                onChange={(e) =>
                                  updateActivity(
                                    index,
                                    activityIndex,
                                    e.target.value
                                  )
                                }
                                placeholder={`Activity ${activityIndex + 1}`}
                                className="border-l-2 border-l-primary pl-3"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                removeActivity(index, activityIndex)
                              }
                              disabled={item.activities.length === 1}
                              className="text-gray-500 hover:text-red-500"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addActivity(index)}
                          className="mt-2"
                        >
                          <Plus className="h-3.5 w-3.5 mr-2" />
                          Add Activity
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              className="w-full py-6 border-2 border-dashed hover:border-solid"
              onClick={addItineraryItem}
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Another Day
            </Button>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>Total days: {itinerary.length}</p>
          </div>
          {hasErrors(state) &&
            getFieldErrors(state, "itinerary").map((error, index) => (
              <p key={index} className="text-sm text-red-500 mt-1">
                {error}
              </p>
            ))}
        </Field>

        {/* Single Image Upload */}
        <Field>
          <FieldLabel htmlFor="images">Tour Image *</FieldLabel>
          <FieldDescription>
            Upload a single image for your tour (max 5MB)
          </FieldDescription>
          <div className="space-y-4">
            <Input
              id="images"
              name="images"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />

            {imagePreview && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Preview:</p>
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-64 h-64 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-8 w-8 p-0 rounded-full"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-600 mt-2">{image?.name}</p>
              </div>
            )}
          </div>
          {hasErrors(state) &&
            getFieldErrors(state, "images").map((error, index) => (
              <p key={index} className="text-sm text-red-500 mt-1">
                {error}
              </p>
            ))}
        </Field>

        {/* Checkboxes */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <input type="hidden" name="isActive" value="true" />
            <Checkbox
              id="isActive"
              name="isActive"
              checked
              disabled
              className="opacity-50 cursor-not-allowed"
              tabIndex={-1}
            />
            <Label htmlFor="isActive" className="text-gray-500">
              Active Tour
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="isFeatured" name="isFeatured" value="true" />
            <Label htmlFor="isFeatured">Featured Tour</Label>
          </div>
        </div>
      </FieldGroup>

      {/* Submit Button */}
      <Field>
        <Button
          type="submit"
          disabled={isPending}
          className="w-full py-6 text-lg"
        >
          {isPending ? "Creating Tour..." : "Create Tour"}
        </Button>
      </Field>
    </form>
  );
}
