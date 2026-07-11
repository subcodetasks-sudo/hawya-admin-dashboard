"use client";

import { useState } from "react";
import { ThumbsDown, ThumbsUp, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

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
import {
  useApproveTestimonial,
  useDeleteTestimonial,
  useRejectTestimonial,
} from "@/features/testimonials/hooks/use-testimonial-mutations";
import type { Testimonial } from "@/features/testimonials/types";

type Props = {
  testimonial: Testimonial;
};

export default function TestimonialRowActions({ testimonial }: Props) {
  const t = useTranslations("Testimonials");
  const [deleteOpen, setDeleteOpen] = useState(false);

  const approveMutation = useApproveTestimonial();
  const rejectMutation = useRejectTestimonial();
  const deleteMutation = useDeleteTestimonial();

  function handleApprove() {
    approveMutation.mutate(testimonial.id, {
      onSuccess: () => toast.success(t("rowActions.approveSuccess")),
      onError: () => toast.error(t("rowActions.approveError")),
    });
  }

  function handleReject() {
    rejectMutation.mutate(testimonial.id, {
      onSuccess: () => toast.success(t("rowActions.rejectSuccess")),
      onError: () => toast.error(t("rowActions.rejectError")),
    });
  }

  function handleDelete() {
    deleteMutation.mutate(testimonial.id, {
      onSuccess: () => {
        toast.success(t("rowActions.deleteSuccess"));
        setDeleteOpen(false);
      },
      onError: () => toast.error(t("rowActions.deleteError")),
    });
  }

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={t("rowActions.delete")}
        disabled={deleteMutation.isPending}
        onClick={() => setDeleteOpen(true)}
      >
        <Trash2 />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={t("rowActions.reject")}
        disabled={testimonial.status === "rejected" || rejectMutation.isPending}
        onClick={handleReject}
      >
        <ThumbsDown />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={t("rowActions.approve")}
        disabled={testimonial.status === "approved" || approveMutation.isPending}
        onClick={handleApprove}
      >
        <ThumbsUp />
      </Button>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteDialog.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteDialog.description", { name: testimonial.displayName })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("deleteDialog.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={handleDelete}
            >
              {t("deleteDialog.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
