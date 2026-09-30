import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getRiskColor(score: number): string {
  if (score < 30) return 'text-green-500';
  if (score < 55) return 'text-yellow-500';
  if (score < 75) return 'text-orange-500';
  return 'text-red-500';
}

export function getRiskBgColor(score: number): string {
  if (score < 30) return 'bg-green-500/10 text-green-600 border-green-200';
  if (score < 55) return 'bg-yellow-500/10 text-yellow-600 border-yellow-200';
  if (score < 75) return 'bg-orange-500/10 text-orange-600 border-orange-200';
  return 'bg-red-500/10 text-red-600 border-red-200';
}

export function getRiskLabel(score: number): string {
  if (score < 30) return 'LOW';
  if (score < 55) return 'MEDIUM';
  if (score < 75) return 'HIGH';
  return 'CRITICAL';
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'low': return 'bg-green-100 text-green-700 border-green-200';
    case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
    case 'critical': return 'bg-red-100 text-red-700 border-red-200';
    case 'completed': return 'bg-green-100 text-green-700 border-green-200';
    case 'active': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'stress_testing': return 'bg-purple-100 text-purple-700 border-purple-200';
    case 'draft': return 'bg-gray-100 text-gray-700 border-gray-200';
    case 'in_progress': return 'bg-amber-100 text-amber-700 border-amber-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
}

export function formatVariation(value: number, showSign = true): string {
  const sign = value > 0 ? '+' : '';
  return showSign ? `${sign}${value.toFixed(0)}%` : `${Math.abs(value).toFixed(0)}%`;
}

export function formatKg(value: number): string {
  return `${value} kg`;
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'critical': return 'bg-red-100 text-red-700 border-red-200';
    case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
    case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'low': return 'bg-green-100 text-green-700 border-green-200';
    default: return 'bg-gray-100 text-gray-700';
  }
}

export function getImpactColor(impact: string): string {
  switch (impact) {
    case 'high': return 'bg-red-100 text-red-700';
    case 'medium': return 'bg-amber-100 text-amber-700';
    case 'low': return 'bg-green-100 text-green-700';
    default: return 'bg-gray-100 text-gray-700';
  }
}
