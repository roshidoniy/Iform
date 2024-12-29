# IForms

A modern form management system built with React, TypeScript, and Firebase.

## Features

- 📝 Create and manage dynamic forms
- 👥 User authentication with email and Google sign-in
- 👮‍♂️ Admin management system
- 🔒 Secure data handling with Firebase
- 🎨 Modern UI with Tailwind CSS
- 📱 Fully responsive design

## Tech Stack

- **Frontend**: React + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Backend**: Firebase
  - Authentication
  - Firestore Database
- **Routing**: React Router DOM

## Getting Started

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

3. Create a `.env` file in the root directory and add your Firebase configuration:
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

### Building for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/        # Reusable components
├── pages/            # Page components
├── services/         # Firebase and other services
├── types/           # TypeScript type definitions
└── assets/          # Static assets
```

## Features in Detail

### Authentication
- Email/Password sign up and login
- Google authentication
- Protected routes

### Form Management
- Create dynamic forms
- Multiple question types
- Required field validation
- Form preview

### Admin Features
- Add/remove admin users
- Manage form permissions
- View form submissions

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Firebase](https://firebase.google.com/)
- [Tailwind CSS](https://tailwindcss.com/)
