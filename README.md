# StockSavant

A modern stock analysis platform inspired by Baseball Savant, providing comprehensive market data visualization and analysis.

## Features

- **Market Overview**: Real-time tracking of major indices and your watchlist
- **Company Analysis**: Baseball Savant-style percentile bubbles for key metrics
- **News Integration**: Latest market news with sentiment analysis
- **Multi-Source Data**: Integrates Alpha Vantage and Yahoo Finance APIs

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

3. Start the development server:
```bash
npm start
```

## API Keys

The application uses the following APIs:
- Alpha Vantage (Primary)
- Yahoo Finance (Fallback, no key required)

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
- Alpha Vantage API
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
