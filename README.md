# IForms 📝

A modern form management system built with React, TypeScript, and Firebase. Create, share, and manage forms with real-time updates and interactive features.

## ✨ Features

- 📋 Create and manage dynamic form templates
- 🔄 Real-time updates for comments and likes
- 👥 User authentication with email and Google sign-in
- 👮‍♂️ Admin management system
- 💬 Interactive comments on forms
- ❤️ Like/Unlike functionality
- 🔍 Search functionality for templates
- 🎨 Modern UI with Tailwind CSS
- 📱 Fully responsive design
- 🔒 Secure data handling with Firebase
- 🔄 Live like counter system

## 🛠️ Tech Stack

- **Frontend**:
  - React 19
  - TypeScript
  - Tailwind CSS for styling
  - React Router DOM for navigation

- **Backend & Services**:
  - Firebase
    - Authentication (Email & Google)
    - Firestore Database
    - Real-time updates

- **Build Tools**:
  - Vite
  - PostCSS
  - ESLint

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/iforms.git
cd iforms
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory and add your configuration:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. Start the development server
```bash
npm run dev
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Comments.tsx    # Comments component
│   ├── Header.tsx      # Navigation header
│   └── AdminManagement.tsx  # Admin management
├── pages/              # Page components
│   ├── Home.tsx        # Home page
│   ├── Login.tsx       # Authentication pages
│   └── templatePages/  # Template-related pages
├── services/           # Firebase services
│   ├── firebase-users.ts    # User-related operations
│   └── firebase-templates.ts # Template operations
├── types/             # TypeScript type definitions
├── context/           # React Context providers
└── assets/           # Static assets
```

## 🔥 Features in Detail

### Authentication
- Email/Password sign up and login
- Google authentication
- Email verification
- Protected routes
- Persistent login state

### Form Management
- Create dynamic forms with multiple question types:
  - Single line text
  - Multi-line text
  - Multiple choice
  - Checkboxes
  - Dropdown
- Form preview
- Cover image upload
- Real-time form updates

### Admin Features
- Add/remove admin users
- Real-time admin list updates
- Manage form permissions
- View form submissions

### Social Features
- Comment on forms
- Like/Unlike forms
- Real-time comment updates
- User avatars in comments

### Search & Discovery
- Search forms by title and description
- View popular forms
- Browse user's created forms

### Live Like Counter
- Updates instantly when users like/unlike forms
- Uses Firebase Realtime Database for live updates
- Shows the current like count without page refresh
- Provides visual feedback for user interactions
- Prevents multiple likes from the same user

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Firebase](https://firebase.google.com/)
- [Tailwind CSS](https://tailwindcss.com/)
