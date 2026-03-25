<div align="center">

  <img src="public/profile.png" alt="Rahul's Portfolio" width="120" style="border-radius: 50%;" />

  # 🚀 Rahul's Personal Portfolio

  A modern, interactive personal portfolio website built with **React**, **Vite**, and **Tailwind CSS** — featuring a Guestbook powered by **Firebase**.

  [![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-Visit%20Portfolio-6366f1?style=for-the-badge)](https://rahullm9.github.io/my_portfolio)
  [![GitHub](https://img.shields.io/badge/GitHub-rahullm9-181717?style=for-the-badge&logo=github)](https://github.com/rahullm9/my_portfolio)

</div>

---

## ✨ Features

- 🎨 **Dark mode design** with animated gradient background
- 👤 **About section** with bio, skills, and resume download
- 🗂️ **Projects showcase** with live/GitHub links
- 💬 **Guestbook** — visitors can leave comments (powered by Firebase Firestore)
- 🔗 **Link cards** for social profiles
- 📱 **Fully responsive** with mobile hamburger navigation

---

## 🛠️ Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 19, Vite 8                    |
| Styling    | Tailwind CSS 4, Custom CSS          |
| Icons      | React Icons                         |
| Backend    | Node.js (Express)                   |
| Database   | Firebase Firestore (Guestbook)      |
| Utilities  | clsx, tailwind-merge                |

---

## 📁 Project Structure

```
My_Portfolio/
├── public/             # Static assets (profile photo, resume, icons)
├── src/
│   ├── components/     # Reusable UI components
│   ├── layouts/        # Page layout wrappers
│   ├── hooks/          # Custom React hooks
│   ├── firebase.js     # Firebase configuration
│   └── App.jsx         # Root component
├── backend/            # Express backend (Guestbook API)
├── .env.local          # Environment variables (not committed)
└── vite.config.js      # Vite configuration
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/rahullm9/my_portfolio.git
cd my_portfolio

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..
```

### Environment Setup

Create a `.env.local` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Running Locally

```bash
# Start the frontend
npm run dev

# Start the backend (in a separate terminal)
cd backend && npm start
```

The app will be available at `http://localhost:5173`

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/rahullm9">Rahul</a>
</div>
