# Aight Gas Delivery Service

A modern web application for managing gas delivery services, built with React, TypeScript, and Tailwind CSS.

## Features

- User Authentication
- Dashboard with Analytics
- User Management
- Reports Generation
- Settings Management
- Dark/Light Mode
- Responsive Design

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- Redux Toolkit
- React Router
- React Query
- Firebase
- Recharts
- HeadlessUI
- Heroicons

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/aight-gas-delivery.git
cd aight-gas-delivery
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Building for Production

To create a production build:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Project Structure

```
src/
├── components/     # Reusable components
├── layouts/        # Layout components
├── pages/         # Page components
├── hooks/         # Custom hooks
├── utils/         # Utility functions
├── services/      # API services
├── store/         # Redux store
├── types/         # TypeScript types
├── styles/        # Global styles
└── assets/        # Static assets
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 