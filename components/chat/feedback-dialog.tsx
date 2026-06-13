"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rating: "up" | "down";
  onSubmit: (categories: string[], comment: string) => void;
  onSkip: () => void;
}

const positiveCategories = [
  "Helpful",
  "Accurate",
  "Clear",
  "Useful Sources",
  "Easy To Understand",
];

const negativeCategories = [
  "Hallucination",
  "Irrelevant",
  "Incomplete",
  "Confusing",
  "Poor Sources",
  "Other",
];

export function FeedbackDialog({
  open,
  onOpenChange,
  rating,
  onSubmit,
  onSkip,
}: FeedbackDialogProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [comment, setComment] = useState("");

  const categories =
    rating === "up" ? positiveCategories : negativeCategories;

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSubmit = () => {
    onSubmit(selectedCategories, comment);
    setSelectedCategories([]);
    setComment("");
  };

  const handleSkip = () => {
    onSkip();
    setSelectedCategories([]);
    setComment("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
            <DialogTitle>Feedback</DialogTitle>
            <DialogDescription>
                Help us improve Psycophia by sharing feedback.
            </DialogDescription>
            </DialogHeader>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              type="button"
              variant={
                selectedCategories.includes(category)
                  ? "default"
                  : "outline"
              }
              onClick={() => toggleCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        <Textarea
          placeholder="Optional comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleSkip}>
            Skip
          </Button>

          <Button onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}