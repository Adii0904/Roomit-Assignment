# RoomIt - Meeting Room Booking System

## Project Overview

RoomIt is a meeting room booking application built using Next.js, Node.js, Express.js, MongoDB, and Mongoose.

The system allows users to:

* View available meeting rooms
* Check room availability by date
* Create bookings for one or more time slots
* Prevent double bookings
* View their bookings
* Cancel bookings with refund eligibility
* Reschedule bookings
* Support room buffer time after meetings

---

## Tech Stack

### Frontend

* Next.js 16
* React
* Axios

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas
* Mongoose

---

## Features Implemented

### Core Requirements

#### GET /api/rooms

Returns all available rooms.

#### GET /api/rooms/:id/availability?date=YYYY-MM-DD

Returns room availability for a specific date.

#### POST /api/rooms/bookings

Creates a booking for one or more consecutive slots.

#### GET /api/rooms/bookings?email=...

Returns all bookings for a user.

#### PATCH /api/rooms/bookings/:id/cancel

Cancels a booking and computes refund eligibility server-side.

---

## Extended Requirements Implemented

### 4.3 Buffer Time Between Bookings

Each room has a configurable buffer time.

Example:

Booking: 10:00 - 11:00
Buffer: 10 minutes

The room remains unavailable immediately after the booking ends.

Buffer slots are:

* Displayed as unavailable in the availability grid.
* Enforced on the backend during booking creation.

---

### 4.4 Reschedule with Re-validation

Users can reschedule an existing booking.

Features:

* Full conflict validation performed again.
* Existing slots are released.
* New slots are reserved.
* Optimistic locking implemented using a version field.
* Prevents overwriting stale booking data.

---

## Database Design

### Room

Fields:

* name
* floor
* capacity
* bufferMinutes

### Booking

Fields:

* roomId
* title
* bookedBy
* startDateTime
* endDateTime
* status
* version

### BookingSlot

Fields:

* roomId
* bookingId
* slotStart

---

## Double Booking Prevention Strategy

The most important requirement of the assignment is preventing double booking.

This is enforced using a MongoDB compound unique index:

(roomId, slotStart)

Example:

Room A
10:00 AM slot

If two users try to reserve the same slot simultaneously:

* The first request succeeds.
* The second request fails with a duplicate key error.

This guarantees database-level protection against double booking even under concurrent requests.

---

## Local Setup

### Backend

Install dependencies

npm install

Run server

npm run dev

Environment Variables

PORT=5000

MONGODB_URI=your_mongodb_connection_string

---

### Frontend

Install dependencies

npm install

Create:

.env.local

NEXT_PUBLIC_API_URL=https://roomit-assignment.onrender.com

Run:

npm run dev

---

## Deployment

Frontend:
https://roomit-frontend-48zulmun9-aditya-s-dev.vercel.app/

Backend:
https://roomit-assignment.onrender.com
=https://roomit-assignment.onrender.com/api/rooms
---

## Future Improvements

* User authentication
* Waitlist support
* Recurring bookings
* Email notifications
* Admin dashboard
* Calendar integration

---

## Author

Aditya Prakash
