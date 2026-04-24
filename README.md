# ReliefSync AI Coordination Platform 🚨

ReliefSync is an enterprise-grade, real-time disaster coordination and tactical management platform designed to unify government agencies and NGOs during critical response missions.

## Features ✨
- **Live Tactical Map**: High-performance mapping interface rendering concurrent NGO and Government tactical units across the region.
- **Real-Time Data Sync**: Powered by Supabase Realtime for instantaneous updates to mission assignments, unit statuses, and emergency broadcasts.
- **AI-Powered Analytics**: Dynamic resource allocation scoring and mission assignment tracking.
- **Role-Based Access Control**: Strict isolation between `admin`, `government`, and `ngo` command layers via PostgreSQL Row Level Security (RLS).
- **Premium Interface**: A stunning, high-contrast dark mode design with glassmorphic elements and dynamic micro-animations.

## Technology Stack 🛠️
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS 4
- **Routing & State**: TanStack Router, TanStack Query
- **Backend & Database**: Supabase (PostgreSQL, Auth, Realtime)
- **Deployment**: Configured for Cloudflare Pages

## Getting Started 🚀

### Prerequisites
- Node.js (v20 or higher)
- A Supabase Project

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/rakshitkumar0606-gif/Idea-Lab.git
   cd Idea-Lab
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables:
   Create a `.env` file in the root directory and add your Supabase keys:
   ```env
   VITE_SUPABASE_PROJECT_ID=your_project_id
   VITE_SUPABASE_URL=https://your_project_id.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## Database Setup 🗄️
The database schema is located in `supabase/migrations/`. You can apply these migrations directly in your Supabase SQL Editor. The migrations are fully idempotent and will set up all necessary tables (profiles, teams, disasters, assignments, resources, messages, etc.) and Row Level Security (RLS) policies.

## Deployment 🌐
This project is configured out-of-the-box for **Cloudflare Pages**. 
1. Connect your GitHub repository to Cloudflare Pages.
2. Set the build command to `npm run build`.
3. *(Optional)* Add the `NODE_VERSION` environment variable and set it to `20`.
4. Deploy!

---
*Built for rapid, coordinated disaster response.*
