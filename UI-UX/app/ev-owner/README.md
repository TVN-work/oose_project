# Carbon Credit Marketplace - Listings Management (React)

This is a React.js conversion of the HTML listings management page for the Carbon Credit Marketplace.

## Files Created

- `ListingsManagement.jsx` - Main React component
- `ListingsManagement.css` - All styles from the original HTML
- `main.jsx` - React entry point
- `index.html` - HTML template
- `package.json` - Dependencies and scripts
- `vite.config.js` - Vite configuration

## Setup Instructions

1. **Install dependencies:**
   ```bash
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

## Features Converted

✅ All HTML structure converted to JSX
✅ All CSS styles preserved in separate file
✅ All JavaScript functionality converted to React hooks:
   - Form state management with `useState`
   - Auto price calculation
   - Profit prediction
   - Form submission and validation
   - History table with dynamic updates
   - Sidebar toggle for mobile
   - Notification system

## Key React Features Used

- **useState** - For managing form inputs and UI state
- **useEffect** - For auto-calculating prices and handling click outside events
- **Conditional Rendering** - For profit prediction display
- **Event Handlers** - For form interactions
- **State Management** - For history table updates

## Component Structure

The component includes:
- Sidebar navigation
- Listing form with validation
- Auto price calculation
- Profit prediction
- Market prices reference card
- Vehicle factors reference card
- History table
- Verification process information

All functionality from the original HTML file has been preserved and converted to React patterns.

