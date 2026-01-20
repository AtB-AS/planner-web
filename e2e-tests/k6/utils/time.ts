// Get date for first weekday of next month (Sunday = 0, ...)
export function getDateForNextMonth(targetWeekday: number): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1; // next month
  const date = new Date(year, month, 1);

  const currentDay = date.getDay();

  const daysToAdd = (7 + targetWeekday - currentDay) % 7;
  date.setDate(date.getDate() + daysToAdd);

  return formatLocalDate(date);
}

function formatLocalDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Format date into e.g. '27th December'
export function formatDateWithOrdinal(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate();
  const suffix = getOrdinalSuffix(day);

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const month = monthNames[date.getMonth()];

  return `${day}${suffix} ${month}`;
}

function getOrdinalSuffix(day: number): string {
  if (day >= 11 && day <= 13) return 'th'; // special case
  switch (day % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}

// Compare two times on format HH:MM
export function isTimeEqualOrAfter(time: string, compareTo: string): boolean {
  const toMinutes = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };

  return toMinutes(time) >= toMinutes(compareTo);
}

// Compare two times on format HH:MM
export function isTimeEqualOrBefore(time: string, compareTo: string): boolean {
  const toMinutes = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };

  return toMinutes(time) <= toMinutes(compareTo);
}
