export function generateTimeSlots() {
  const slots = [];
  const start = 9 * 60; // 9:00 AM in minutes
  const end = 18 * 60; // 6:00 PM in minutes
  const interval = 30; // 30 min

  for (let mins = start; mins < end; mins += interval) {
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    const hh = String(hours).padStart(2, "0");
    const mm = String(minutes).padStart(2, "0");
    slots.push(`${hh}:${mm}`);
  }
  return slots;
}
