
import { format, formatDistance } from "date-fns";

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return format(date, "MMM d, yyyy 'at' h:mm a");
}

export function formatShortDate(dateString: string): string {
  const date = new Date(dateString);
  return format(date, "MMM d, yyyy");
}

export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return format(date, "h:mm a");
}

export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  return formatDistance(date, new Date(), { addSuffix: true });
}

export function getDayAndMonth(dateString: string): string {
  const date = new Date(dateString);
  return format(date, "MMM d");
}
