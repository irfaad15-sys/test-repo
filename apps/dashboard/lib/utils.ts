import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-IN").format(num);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    completed: "bg-green-100 text-green-800",
    in_progress: "bg-blue-100 text-blue-800",
    pending: "bg-yellow-100 text-yellow-800",
    delayed: "bg-red-100 text-red-800",
    on_hold: "bg-gray-100 text-gray-800",
    not_started: "bg-gray-100 text-gray-600",
    under_budget: "bg-green-100 text-green-800",
    on_track: "bg-blue-100 text-blue-800",
    over_budget: "bg-orange-100 text-orange-800",
    critical: "bg-red-100 text-red-800",
    pass: "bg-green-100 text-green-800",
    fail: "bg-red-100 text-red-800",
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-600",
    paid: "bg-green-100 text-green-800",
    overdue: "bg-red-100 text-red-800",
    partial: "bg-yellow-100 text-yellow-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}

export function generateId(prefix: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 6);
  return `${prefix}_${timestamp}${random}`;
}
