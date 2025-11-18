# EV Owner Dashboard - React Application

This is a React.js conversion of the EV Owner Dashboard HTML file for the Carbon Credit Marketplace.

## Project Structure

```
EV_Owner/
├── components/
│   ├── Sidebar.jsx          # Navigation sidebar
│   ├── Header.jsx           # Page header with title
│   ├── LoadingIndicator.jsx # Loading spinner
│   └── Notification.jsx     # Toast notifications
├── pages/
│   ├── Overview.jsx         # Dashboard overview
│   ├── UploadData.jsx       # Upload trip data
│   ├── CarbonWallet.jsx     # Carbon credit wallet
│   ├── ListCredits.jsx      # List credits for sale
│   ├── Transactions.jsx     # Transaction history
│   ├── Reports.jsx          # Reports and analytics
│   └── Settings.jsx         # User settings
├── App.jsx                  # Main app component with routing
├── App.css                  # Custom styles
├── main.jsx                 # React entry point
├── index.html               # HTML template
├── package.json             # Dependencies
└── vite.config.js           # Vite configuration
```

## Features

✅ **React Router** - Client-side routing for all pages
✅ **Component-based Architecture** - Reusable components
✅ **State Management** - React hooks for state
✅ **Responsive Design** - Mobile-friendly sidebar
✅ **All Original Functionality** - Preserved from HTML version

## Setup Instructions

1. **Install dependencies:**
   ```bash
   cd UI-UX/app/EV_Owner
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## Pages

- **/** - Overview/Dashboard
- **/upload-data** - Upload trip data to generate carbon credits
- **/carbon-wallet** - View and manage carbon credits
- **/list-credits** - List credits for sale (uses ListingsManagement component)
- **/transactions** - View transaction history
- **/reports** - View reports and analytics
- **/settings** - User and vehicle settings

## Key React Features Used

- **React Router** - For navigation between pages
- **useState** - For component state management
- **useEffect** - For side effects and lifecycle
- **useRef** - For file input references
- **Custom Hooks** - For reusable logic
- **Component Composition** - Breaking UI into smaller components

## Notes

- The ListCredits page uses the existing `ListingsManagement` component from the `ev-owner` folder
- Tailwind CSS is loaded via CDN in `index.html`
- All animations and styles from the original HTML are preserved
- Mobile responsive sidebar with overlay

