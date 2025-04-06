# StockSavant

A modern stock analysis platform inspired by Baseball Savant, providing comprehensive market data visualization and analysis.

## Features

- **Market Overview**: Real-time tracking of major indices and your watchlist
- **Company Analysis**: Baseball Savant-style percentile bubbles for key metrics
- **News Integration**: Latest market news with sentiment analysis
- **Multi-Source Data**: Integrates Polygon.io and Yahoo Finance APIs

## Setup

1. Clone the repository:
```bash
git clone [your-repo-url]
cd savant
```

2. Install dependencies:
```bash
npm install
```

3. Configure API Keys:
   - Create or edit the `.env` file in the project root
   - Add your Polygon.io API key (see API Keys section below)

4. Start the development server:
```bash
npm start
```

## API Keys

The application uses the following APIs:
- **Polygon.io (Primary)**: Requires an API key
  - Sign up at [Polygon.io](https://polygon.io/)
  - Get your API key from the dashboard
  - Add to `.env` file as `REACT_APP_POLYGON_API_KEY=your_api_key_here`
  - Free tier has limited requests per minute
- **Yahoo Finance (Fallback)**: No key required

### Fixing API Errors

If you see errors like "Failed to fetch market status" or "You've exceeded the maximum requests per minute":

1. Check that your Polygon.io API key is correctly set in the `.env` file
2. Restart the development server after updating the API key
3. Consider upgrading your Polygon.io plan if you consistently hit rate limits
4. The app will use Yahoo Finance as a fallback for some endpoints

## Project Structure

```
src/
├── components/      # Reusable UI components
├── pages/          # Page components
├── services/       # API services
└── utils/          # Utility functions
```

## Technologies Used

- React
- Material-UI
- TanStack Query (React Query)
- Polygon.io API
- Yahoo Finance API

## Development

To continue development on another machine:

1. Clone the repository
2. Install dependencies with `npm install`
3. Start development server with `npm start`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
