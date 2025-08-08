# Scanmesite.com - Accessibility Scanning Frontend

A modern React TypeScript application for automated website accessibility scanning. Built with a professional design inspired by Monday.com.

## Features

- **Beautiful Landing Page**: Modern, responsive design with Monday.com-inspired UI
- **Accessibility Scanning**: Powered by Google Lighthouse and DOM analysis
- **Real-time Health Monitoring**: Backend API health checks
- **Professional Forms**: Advanced scheduling with immediate and scheduled scans
- **Comprehensive Reports**: Email delivery of detailed accessibility reports
- **WCAG Compliance**: Scanning against WCAG 2.1 AA standards

## Technologies Used

- **React 18** with TypeScript
- **Styled Components** for professional styling
- **React Router** for navigation
- **React Hook Form** with Yup validation
- **Axios** for API communication
- **Lucide React** for modern icons
- **React Toastify** for notifications

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/gkmohit/accessibility-check-frontend.git
cd accessibility-check-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000) (or another port if 3000 is occupied).

## Backend Integration

This frontend connects to a Flask backend API running on port 8000. Make sure your backend server is running for full functionality.

### API Endpoints

- `GET /health` - Health check
- `POST /run-once` - Immediate scans
- `POST /schedule` - Scheduled scans
- `GET /jobs` - List scheduled jobs
- `DELETE /jobs/{id}` - Remove jobs

## Available Scripts

### `npm start`

Runs the app in development mode with hot reloading.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
│   ├── Landing.tsx     # Main landing page
│   ├── Terms.tsx       # Terms and conditions
│   ├── Privacy.tsx     # Privacy policy
│   └── Support.tsx     # Support page
├── services/           # API integration
├── styles/             # Styled components and themes
└── types/              # TypeScript type definitions
```

## Design System

The application uses a Monday.com-inspired design system featuring:

- **Colors**: Purple and pink gradients (#6c5ce7 to #fd79a8)
- **Typography**: Clean, modern fonts with proper hierarchy
- **Components**: Professional cards, buttons, and forms
- **Responsive**: Mobile-first design approach

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary and confidential.
