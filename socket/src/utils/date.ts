export function formatDate(date: Date): string {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const padZero = (num: number) => String(num).padStart(2, "0");

  const month = months[date.getMonth()];
  const day = padZero(date.getDate());
  const year = date.getFullYear();
  let hour = date.getHours();
  const minute = padZero(date.getMinutes());
  const second = padZero(date.getSeconds());
  const period = hour >= 12 ? "PM" : "AM";

  hour = hour % 12 || 12;

  return `${month} ${day} ${year} ${padZero(
    hour
  )}:${minute}:${second} ${period}`;
}
