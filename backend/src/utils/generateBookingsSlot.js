export function generateBookingSlots(date, startTime, endTime) {
  const slots = [];

  // Parse the start and end times
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  // Create Date objects for start and end
  const startDateTime = new Date(`${date}T${startTime}:00`);
  const endDateTime = new Date(`${date}T${endTime}:00`);

  // Validate inputs
  if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
    throw new Error("Invalid date or time format");
  }

  if (startDateTime >= endDateTime) {
    throw new Error("Start time must be before end time");
  }

  // Generate 30-minute slots
  let currentSlot = new Date(startDateTime);

  while (currentSlot < endDateTime) {
    slots.push(new Date(currentSlot));

    // Add 30 minutes for next slot
    currentSlot = new Date(currentSlot.getTime() + 30 * 60000);
  }

  return slots;
}
