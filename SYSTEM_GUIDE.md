# ReliefSync - Disaster Relief Task Coordination System

## System Overview

ReliefSync Connect is a comprehensive disaster relief coordination platform that enables administrators to assign rescue and relief tasks to NGO and Government agency teams, track task progress in real-time, and receive notifications when tasks are updated.

## Key Features Implemented

### 1. **Multi-Role Account System**
- **Admin (Central Authority)**: Creates incidents, assigns tasks, manages teams, monitors progress
- **NGO Teams**: Join organization, receive task assignments, update task status
- **Government Agencies**: Same as NGO teams, separate categorization

### 2. **Team Management System**
Admin can:
- Create NGO and Government agency teams
- Link team members (users) to specific teams
- Manage team composition and responsibilities
- View team status and workload

**Location**: `/team-management` route

### 3. **Task Assignment & Workflow**
The complete workflow:

```
Admin creates disaster incident
    ↓
Admin views assignments page and selects incident
    ↓
Admin assigns best-fit team (AI-suggested based on distance, availability, workload)
    ↓
Team receives notification: "New Task Assignment: [Incident Title]"
    ↓
Team members see task in their "My Tasks" page
    ↓
Team clicks "Start Task" when beginning work
    ↓
Admin receives notification: "Task Started"
    ↓
Team clicks "Mark Complete" when finished
    ↓
Admin receives notification: "Task Completed"
    ↓
Admin can view completion details in Task Tracking dashboard
```

### 4. **Real-Time Notifications System**
Team members receive notifications when:
- A task is assigned to their team
- The admin acknowledges their progress

Admin receives notifications when:
- A team starts working on a task
- A team completes a task

**Features**:
- Notification bell icon in top-right of app
- Unread count badge
- Real-time updates via Supabase subscriptions
- Toast notifications for critical updates
- Notification history with read/unread status

### 5. **Task Tracking Dashboard (Admin Only)**
**Location**: `/task-tracking`

Provides real-time analytics:
- Total tasks assigned
- Tasks pending (awaiting team to start)
- Tasks in progress (team currently working)
- Tasks completed
- Overall completion rate
- Detailed task card showing:
  - Disaster details (title, location, severity)
  - Team assigned
  - Current status
  - Time started and completed
  - Duration of work

### 6. **Team Task Management (Team Members)**
**Location**: `/tasks`

Team members can:
- View only tasks assigned to their team
- See task details (location, disaster severity, notes)
- Click "Start Task" when beginning work
- Click "Mark Complete" when finished
- View task statistics (pending, active, completed)
- Filter tasks by status

## Database Schema

### Key Tables

#### `profiles`
- Stores user information with team association
- `team_id`: Links user to their team

#### `teams`
- NGO and Government agency teams
- Tracks availability status and workload
- Geographic location (for distance-based assignment)

#### `disasters`
- Disaster incidents requiring response
- Status: pending → in_progress → completed
- Severity levels for prioritization

#### `assignments`
- Links teams to disasters
- Tracks status: assigned → started → completed
- Timestamps for assignment, start, and completion

#### `notifications`
- Stores all notifications for users
- Type field indicates notification category (assignment, update, message)
- Read/unread status for user tracking

#### `messages`
- Communication between admin and teams
- Supports broadcasts to all or specific teams

## How to Use the System

### For Admins

1. **Create Teams** (one-time setup)
   - Go to Team Management
   - Click "Create Team"
   - Enter team name and type (NGO or Government)

2. **Add Team Members**
   - Go to Team Management
   - Select a team
   - Click "Add Member"
   - Enter member's email (they must sign up first)

3. **Create Disaster Incidents**
   - Go to Dashboard or Map
   - Create new incident with location and details
   - Set severity level

4. **Assign Teams**
   - Go to Assignments page
   - Select the incident
   - Review AI-recommended teams (sorted by distance, availability, workload)
   - Click "Assign" on best-fit team
   - Team members receive notification immediately

5. **Monitor Progress**
   - Go to Task Tracking dashboard
   - View real-time status of all assignments
   - Click notification bell to see updates
   - See when teams start and complete tasks

### For Team Members

1. **Sign Up**
   - Sign up with your organization email
   - Select your role (NGO or Government)

2. **Join Team**
   - Wait for admin to add you to a team via Team Management

3. **View Tasks**
   - Go to "My Tasks" page
   - See all tasks assigned to your team

4. **Update Task Status**
   - When starting work: Click "Start Task"
   - When finished: Click "Mark Complete"
   - Admin will see your updates in real-time

## Real-Time Features

- **Live Notifications**: Powered by Supabase Realtime
- **Automatic Status Updates**: Tasks automatically sync across all user sessions
- **Toast Notifications**: Immediate alerts for important events
- **Notification History**: All notifications stored and accessible

## Data Flow Architecture

```
Admin Action (assigns team)
    ↓
Database Update (assignments table + disaster status)
    ↓
Trigger Notifications (insert into notifications table)
    ↓
Supabase Realtime (broadcast to team members' sessions)
    ↓
Team Members See:
  - Toast notification
  - Notification bell badge
  - Task appears in My Tasks
    ↓
Team Member Update (clicks "Start Task")
    ↓
Database Update + Admin Notification
    ↓
Admin See in Dashboard + Toast alert
```

## Key Components

- `TeamManagement.tsx`: Admin interface for team management
- `NotificationsPanel.tsx`: Notification display component
- `notificationContext.tsx`: Notification state management
- `TaskTracking.tsx`: Admin analytics dashboard
- `tasks.tsx`: Team task management interface
- `AppLayout.tsx`: Navigation and notification bell
- `useTacticalData.tsx`: Data fetching and real-time subscriptions

## Security Notes

- Row Level Security (RLS) enabled on all tables
- Users can only see teams and tasks they have access to
- Admin-only routes protected by role checks
- Notifications scoped to user ID

## Future Enhancements

Potential additions:
- SMS/Email notifications
- Task templates for common disaster scenarios
- Resource allocation per task
- Team member location tracking (GPS)
- Performance analytics per team
- Historical reporting and trends
- Document/photo attachments for tasks
- Estimated time completion prediction

## Troubleshooting

### Team members don't see tasks
- Verify admin added them to the team via Team Management
- Check their user email matches the one added
- Ensure they've refreshed the page (Ctrl+R)

### Notifications not appearing
- Check notification bell for unread count
- Look in notification panel
- Ensure real-time subscriptions are enabled
- Check browser permissions for notifications

### Tasks not updating in real-time
- Verify browser has active connection
- Check Supabase status
- Try refreshing the page
- Check browser console for errors
