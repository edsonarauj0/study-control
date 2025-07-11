# Study Control

This is a minimal example of a study control application built with React, Vite, Tailwind CSS and shadcn-inspired components. Tasks are persisted using Firebase Firestore.

## Development

1. Install dependencies

```bash
npm install
```

2. Run the development server

```bash
npm run dev
```

Create a `.env` file with your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

With the configuration in place the application stores tasks in your Firebase project.
