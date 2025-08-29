/**
 * Utility functions for date and time formatting
 */

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-AU', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

export const formatTime = (timeString: string): string => {
  const time = new Date(`1970-01-01T${timeString}`);
  return time.toLocaleTimeString('en-AU', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

export const formatDateTimeRange = (dateString: string, startTime: string, endTime: string): string => {
  return `${formatDate(dateString)} \nFrom ${formatTime(startTime)} - ${formatTime(endTime)}`;
};