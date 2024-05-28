# Weather App

This is a full-stack weather application that fetches and displays current weather data and forecasts for various locations around the world. The application consists of a client-side React application and a server-side Node.js Express application.

## Features

- Select from a list of pre-defined locations or use your current location (desktop only)
- Display current weather conditions, including temperature, wind speed, precipitation, and a description
- Show hourly weather forecasts for the next 12 hours
- Display daily weather forecasts for the next 7 days
- Interactive 3D cube animation showcasing weather icons

## Technologies Used

### Client

- React
- TypeScript
- Axios (for making API requests)
- date-fns (for date formatting)

### Server

- Node.js
- Express
- Axios (for making API requests)
- CORS (for handling cross-origin resource sharing)
- dotenv (for loading environment variables)

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine
- API key from [WeatherAPI.com](https://www.weatherapi.com/) (free plan is available)

### Installation

1. Clone the repository:

```
git clone https://github.com/your-username/weather-app.git
```

2. Navigate to the project directory:

```
cd weather-app
```

3. Install client dependencies:

```
cd client
npm install
```

4. Install server dependencies:

```
cd ../server
npm install
```

5. Create a `.env` file in the `server` directory and add your API key:

```
WEATHER_API_KEY=your_api_key_here
```

### Running the Application

1. Start the server:

```
cd server
npm start
```

2. In a new terminal window, start the client:

```
cd client
npm start
```

3. The client application should open automatically in your default browser at `http://localhost:5173`. If not, you can manually open the URL in your browser.

## Usage

1. Select a location from the dropdown or choose "Your location" (desktop only) to fetch weather data for your current location.
2. The app will display the current weather conditions, hourly forecasts, and daily forecasts for the selected location.
3. Interact with the 3D cube animation by hovering over or clicking on it.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

