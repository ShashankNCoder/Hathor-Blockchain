# HathorChat Frontend

## Overview

HathorChat Frontend is a modern, responsive web application that provides a user interface for the HathorChat ecosystem. Built with React, TypeScript, and Tailwind CSS, it offers a seamless experience for users to interact with the Hathor blockchain, manage wallets, send/receive tokens, and participate in tokenized communities.

## Tech Stack

- **React**: UI library for building component-based interfaces
- **TypeScript**: Type-safe JavaScript for better developer experience
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **WalletConnect**: For connecting to blockchain wallets
- **Tanstack React Query**: Data fetching and state management
- **Wouter**: Lightweight routing solution
- **Radix UI**: Accessible UI component primitives
- **Express**: Backend server for API endpoints and serving the application

## Project Structure

```
frontend/
├── client/                 # Frontend client code
│   ├── src/                # Source code
│   │   ├── assets/         # Static assets (images, fonts)
│   │   ├── components/     # Reusable UI components
│   │   │   ├── ui/         # Base UI components
│   │   │   └── wallet/     # Wallet-specific components
│   │   ├── context/        # React context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions and libraries
│   │   ├── pages/          # Page components
│   │   └── types/          # TypeScript type definitions
│   └── index.html          # HTML entry point
├── server/                 # Backend server code
├── shared/                 # Shared code between client and server
├── package.json            # Project dependencies and scripts
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
├── components.json         # UI components configuration
└── README.md               # Project documentation
```

## Features

### Wallet Management
- Connect to Hathor wallets via WalletConnect
- View wallet balance and transaction history
- Send and receive tokens
- Create custom tokens

### User Interface
- Responsive design that works on mobile and desktop
- Dark and light mode support
- Animated transitions and loading states
- Toast notifications for user feedback

### Pages
- **Welcome Page**: Initial landing page with wallet connection
- **Home Page**: Dashboard with activity feed and quick actions
- **Wallet Page**: Detailed wallet information and transaction history
- **Rewards Page**: View and claim rewards and badges
- **Profile Page**: User profile and settings
- **Create Token Page**: Interface for creating custom tokens

### Components
- **WalletConnect**: Component for connecting to blockchain wallets
- **BottomNavigation**: Mobile navigation bar
- **ActionPanel**: Quick action buttons for common tasks
- **SendTokenModal**: Interface for sending tokens
- **ReceiveTokenModal**: Interface for receiving tokens
- **TokenDetailsModal**: Detailed token information

## Setup and Installation

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Installation Steps

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   VITE_API_BASE=http://localhost:5000/api
   VITE_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id
   ```
4. Start the development server:
   ```
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:5000` to see the application.
   or else use(to run):
   ```
   npx tsx server/index.ts
   ```
## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Run production server
- `npm run check` - Run TypeScript type checking
- `npm run db:push` - Update database schema (if using Drizzle ORM)

## Development

### Folder Structure

The project follows a modular structure with clear separation of concerns:

- **components/**: Reusable UI components
- **pages/**: Page-level components that represent routes
- **context/**: React context providers for state management
- **hooks/**: Custom React hooks for shared logic
- **lib/**: Utility functions and API clients

### Styling

The project uses Tailwind CSS for styling with custom theme configuration:

- Custom color palette with Hathor branding colors
- Responsive design utilities
- Animation classes for transitions and effects

### State Management

- React Context API for global state (wallet connection, authentication)
- React Query for server state and data fetching
- Local component state for UI-specific state

## Integration with Backend

The frontend communicates with the HathorChat backend API for:
- Wallet operations
- Transaction history
- Token management
- User authentication

## Wallet Connection

The application uses WalletConnect to interact with the Hathor blockchain:
- Secure connection to user wallets
- Transaction signing
- Balance checking
- Custom token operations

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software.
