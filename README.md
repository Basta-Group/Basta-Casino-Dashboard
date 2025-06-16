# Casino Platform Dashboard

A modern, responsive admin dashboard for managing a casino platform, built with React, TypeScript, and Material-UI.

## 🚀 Features

- Modern UI with Material-UI components
- TypeScript for type safety
- Responsive design
- User management
- Affiliate system
- Analytics dashboard
- KYC verification system
- Real-time notifications

## 📋 Prerequisites

- Node.js 20.x
- Yarn package manager
- Git

## 🛠️ Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd Dashboard
```

2. Install dependencies:
```bash
yarn install
```

3. Create a `.env` file in the root directory with the following variables:
```env
VITE_API_BASE_URL=your_api_url
VITE_API_PORT=your_port
VITE_AFFILIATE_URL=your_affiliate_url
VITE_DASHBOARD_URL=your_dashboard_url
```

## 🚀 Development

Start the development server:
```bash
yarn dev
```

The application will be available at `http://localhost:3001`

## 📦 Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn lint` - Run ESLint
- `yarn lint:fix` - Fix ESLint issues
- `yarn fm:check` - Check Prettier formatting
- `yarn fm:fix` - Fix Prettier formatting
- `yarn re:start` - Clean install and start development
- `yarn re:build` - Clean install and build for production

## 🏗️ Project Structure

```
src/
├── components/     # Reusable UI components
├── config/        # Configuration files
├── contexts/      # React contexts
├── hooks/         # Custom React hooks
├── layouts/       # Layout components
├── pages/         # Page components
├── routes/        # Routing configuration
├── sections/      # Feature-specific components
├── theme/         # Theme configuration
└── utils/         # Utility functions
```

## 🎨 UI Components

The project uses Material-UI (MUI) components with a custom theme. Key components include:

- Dashboard layout
- Data tables
- Forms
- Charts and analytics
- User management
- Affiliate management
- KYC verification

## 🔒 Security

- Environment variables for sensitive data
- TypeScript for type safety
- ESLint and Prettier for code quality
- Secure API communication

## 📝 Code Style

The project follows strict code style guidelines:

- ESLint for code linting
- Prettier for code formatting
- TypeScript for type checking
- Consistent import ordering
- Component documentation

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 👥 Authors

- minimals.cc - Initial work

## 🙏 Acknowledgments

- Material-UI for the component library
- Vite for the build tool
- React for the UI framework
- TypeScript for type safety

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-v20.x-green.svg)
![React](https://img.shields.io/badge/react-18.x-blue.svg)

## ✨ Features

- 📊 Real-time gaming statistics
- 👥 Player management system
- 📈 Match tracking and analysis
- 🎨 Customizable Material-UI theme
- 🔒 Secure authentication system
- 📱 Fully responsive design

## 🚀 Quick Start

### Prerequisites

- Node.js v20.x or higher
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/Basta-Casino/Dashboard

# Navigate to project directory
cd Basta-Casino/Dashboard

# Install dependencies
npm install
# or
yarn install

# Start development server
npm run dev
# or
yarn dev