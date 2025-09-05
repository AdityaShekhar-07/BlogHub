# BlogHub - Modern Blog Platform

A comprehensive blog platform built with React, Firebase, and modern web technologies. Features include user authentication, real-time notifications, community management, and a responsive design.

## Features

- 🔐 Google OAuth Authentication
- 📝 Create and manage blog posts
- 💬 Real-time commenting system
- 🔔 Notification system for comments
- 🏘️ Community creation and management
- 🏷️ Category-based post organization
- 🔍 Search functionality
- 🌙 Dark/Light theme toggle
- 📱 Responsive design
- ⚡ Real-time updates with Firebase

## Tech Stack

- **Frontend**: React 19, Vite
- **Backend**: Firebase (Firestore, Authentication)
- **Styling**: CSS3 with modern animations
- **Routing**: React Router DOM
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase project

### Installation

1. Clone the repository:
```bash
git clone https://github.com/AdityaShekhar-07/BlogHub.git
cd BlogHub
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your Firebase configuration values

4. Start the development server:
```bash
npm run dev
```

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_FIREBASE_MEASUREMENT_ID`
4. Deploy!

## Firebase Setup

1. Create a Firebase project
2. Enable Authentication with Google provider
3. Create Firestore database
4. Set up the following collections:
   - `posts`
   - `comments`
   - `communities`
   - `categories`
   - `notifications`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details