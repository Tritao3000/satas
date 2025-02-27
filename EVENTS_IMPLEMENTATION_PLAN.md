# Events Implementation Plan

This document outlines the plan for implementing events functionality in our platform, similar to the jobs feature.

## Database Schema Updates

✅ Added `eventImagePath` field to the events table in the schema.

## Backend API Endpoints

Need to create the following API endpoints:

1. `/api/events` - GET (list all events), POST (create a new event)
2. `/api/events/[id]` - GET (event details), PUT (update event), DELETE (remove event)
3. `/api/events/register` - POST (register for an event)
4. `/api/events/unregister` - POST (unregister from an event)

## Storage

1. Create a Supabase storage bucket for event images
2. Implement upload functionality for event images
3. Ensure proper security rules for the bucket

## Frontend Components

1. **Event Form Component**: For creating and editing events
   - Title, description, location, date, time fields
   - Image upload functionality
2. **Event Card Component**: For displaying event previews

   - Display event image, title, date, location
   - Registration button
   - Edit/delete options for startup owners

3. **Event Detail Page**: For viewing full event information
   - All event details
   - Registration functionality
   - Show registered users (for startups)

## Pages to Create

1. Public Event Browsing Page: `/events`
   - List all upcoming events
   - Filter by date, location, etc.
2. Event Detail Page: `/events/[id]`

   - Show full event details
   - Allow registration/unregistration

3. Event Management Page: `/menu/events`
   - For startups to manage their events
   - Create, edit, delete functionality
4. Event Creation Page: `/menu/events/create`

   - Form for creating new events

5. Event Edit Page: `/menu/events/edit/[id]`

   - Form for editing existing events

6. My Events Page: `/menu/my-events`
   - For individuals to see events they've registered for

## API Hooks

Create the following custom hooks:

1. `useEvents` - Fetch and manage events data
2. `useEvent` - Fetch and manage a single event
3. `useEventRegistrations` - Manage event registrations

## Implementation Process

1. Update the database schema ✅
2. Create the API endpoints
3. Implement frontend components
4. Create the pages
5. Test all functionality
6. Add proper error handling and loading states

## Security Considerations

1. Only startups can create/edit/delete events
2. All users can view events
3. Only individuals can register for events
4. Startups can view registrations for their own events
