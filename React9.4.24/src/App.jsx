// import { useEffect, useState } from "react";
// import "./App.css";

// const API_KEY = "13aa144c7d7629d1314f3ea9cc3656c9";

// function App() {
//   const [weather, setWeather] = useState(null);
//   const [city, setCity] = useState("Stockholm");

//   useEffect(() => {
//     fetchWeatherData();
//   }, [city]);

//   function fetchWeatherData() {
//     fetch(
//       `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}&lang=sv-SE`
//     )
//       .then((res) => {
//         if (!res.ok) {
//           throw new Error("Network response was not ok");
//         }
//         return res.json();
//       })
//       .then((json) => {
//         console.log(json);
//         setWeather(json);
//       })
//       .catch((err) => console.error(err));
//   }

//   function handleSubmit(e) {
//     e.preventDefault();
//     fetchWeatherData();
//   }

//   return (
//     <main>
//       <h1>{city}</h1>
//       <form onSubmit={handleSubmit}>
//         <span>Sök stad</span>
//         <input
//           type="text"
//           value={city}
//           onChange={(e) => setCity(e.target.value)}
//         />
//         <button type="submit">Sök stad</button>
//       </form>
//       {weather && (
//         <section>
//           <div className="icon">
//             <img
//               src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
//               style={{ backgroundColor: "#f7f7f7" }}
//             />
//           </div>
//           <span> Dagens väder: {weather.main && weather.main.temp}°C</span>
//           <br />
//           <span>Vind {weather.wind.speed}/ms</span>
//         </section>
//       )}
//     </main>
//   );
// }

// export default App


import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [dailyWeather, setDailyWeather] = useState([]);
  const [todayForecast, setTodayForecast] = useState([]);
  const [locationName, setLocationName] = useState('');
  const [temperatureUnit, setTemperatureUnit] = useState('metric');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(gatherWeatherData, () => {
        console.error("Access to location was denied");
      });
    }
  }, []);

  const obtainWeatherByCoordinates = async (latitude, longitude, units) => {
    const apiKey = import.meta.env.VITE_APP_API_KEY;
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${units}&appid=${apiKey}`;
    try {
      const response = await fetch(weatherUrl);
      const data = await response.json();
      setCurrentWeather(data);
    } catch (error) {
      console.error("Error fetching weather data", error);
    }
  };

  const obtainForecastByCoordinates = async (latitude, longitude, units) => {
    const apiKey = import.meta.env.VITE_APP_API_KEY;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=${units}&appid=${apiKey}`;
    try {
      const response = await fetch(forecastUrl);
      const data = await response.json();
      const now = new Date();
      const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

      let hourlyForecast = data.list.filter(item => {
        const forecastTime = new Date(item.dt * 1000);
        return forecastTime >= now && forecastTime < endOfToday;
      }).slice(0, 8);
      // hourlyForecast= hourlyForecast.concat(hourlyForecast);
      setTodayForecast(hourlyForecast);

      const dailyForecast = data.list.filter((forecast, index) => index % 8 === 0).slice(0, 3);
      setDailyWeather(dailyForecast);
    } catch (error) {
      console.error("Error fetching forecast", error);
    }
  };

  const gatherWeatherData = (position) => {
    obtainWeatherByCoordinates(position.coords.latitude, position.coords.longitude, temperatureUnit);
    obtainForecastByCoordinates(position.coords.latitude, position.coords.longitude, temperatureUnit);
  };

  const handleLocationSearch = () => {
    if (!locationName.trim()) {
      alert("Enter a valid city name.");
    } else {
      searchWeather(locationName);
    }
  };

  const searchWeather = async (city) => {
    const apiKey = import.meta.env.VITE_APP_API_KEY;
    const cityWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${temperatureUnit}&appid=${apiKey}`;
    try {
      const response = await fetch(cityWeatherUrl);
      if (response.ok) {
        const data = await response.json();
        setCurrentWeather(data);
        if (data.coord) {
          obtainForecastByCoordinates(data.coord.lat, data.coord.lon, temperatureUnit);
        }
      } else if (response.status === 404) {
        alert("City not found. Please try again.");
      } else {
        throw new Error('Weather data fetch failed');
      }
    } catch (error) {
      console.error("Weather data fetch error", error);
      alert(error.message);
    }
  };

  const switchTemperatureUnit = () => {
    const newUnit = temperatureUnit === 'metric' ? 'imperial' : 'metric';
    setTemperatureUnit(newUnit);
    if (currentWeather && currentWeather.coord) {
      obtainWeatherByCoordinates(currentWeather.coord.lat, currentWeather.coord.lon, newUnit);
      obtainForecastByCoordinates(currentWeather.coord.lat, currentWeather.coord.lon, newUnit);
    }
  };

  return (
    <body className="min-h-screen bg-[url('/clouds.jpg')] py-12 px-4 sm:px-6 lg:px-8">
      <div class="flex-1 bg-hero bg-cover bg-center bg-no-repeat">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-8 text-white">Weather Tracker</h1>
      <div className="flex items-center justify-center space-x-2 mb-6">
        <input
          type="text"
          value={locationName}
          onChange={(e) => setLocationName(e.target.value)}
          placeholder="Search by city"
          className="py-2 px-4 border border-gray-300 rounded-md w-64 sm:w-96 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleLocationSearch}
          className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Search Weather
        </button>
      </div>
      <button
  onClick={switchTemperatureUnit}
  className="py-2 px-4 bg-gray-800 text-white rounded-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-800 mb-6 block mx-auto"
>
  Switch Units
</button>

      {currentWeather && (
        <div className="flex flex-col space-y-4 items-center">
          <div className="flex flex-col max-w-96 items-center justify-center text-justify space-x-2 mb-6 border border-white p-4 rounded-md bg-sky-100">
          <p><strong>Location:</strong> {currentWeather.name}</p>
          <p><strong>Temperature:</strong> {currentWeather.main.temp} {temperatureUnit === 'metric' ? '°C' : '°F'}</p>
          <p><strong>Conditions:</strong> {currentWeather.weather[0].description}</p>
          <p><strong>Wind:</strong> {currentWeather.wind.speed} {temperatureUnit === 'metric' ? 'm/s' : 'mph'}</p>
          <p><strong>Humidity:</strong> {currentWeather.main.humidity}%</p>
          <p><strong>Sunrise:</strong> {new Date(currentWeather.sys.sunrise * 1000).toLocaleTimeString()}</p>
          <p><strong>Sunset:</strong> {new Date(currentWeather.sys.sunset * 1000).toLocaleTimeString()}</p>
          </div>
          <h2 className="text-2xl font-semibold text-center text-white">Today's Hourly Forecast</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* grid grid-cols-2 sm:grid-cols-4 gap-4 */}
            {todayForecast.map((item, index) => (
              <div key={index} className="border border-gray-200 p-4 rounded-md bg-sky-100">
                <p><strong>Time:</strong> {new Date(item.dt * 1000).toLocaleTimeString()}</p>
                <p><strong>Temp:</strong> {item.main.temp} {temperatureUnit === 'metric' ? '°C' : '°F'}</p>
                <p><strong>Weather:</strong> {item.weather[0].description}</p>
                <img src={`http://openweathermap.org/img/wn/${item.weather[0].icon}.png`} alt="Weather icon" />
              </div>
            ))}
          </div>
          <h2 className="text-2xl font-semibold text-center text-white">3-Day Weather Forecast</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {dailyWeather.map((forecast, index) => (
              <div key={index} className="border border-gray-200 p-4 rounded-md bg-sky-100">
                <p><strong>Date:</strong> {new Date(forecast.dt * 1000).toLocaleDateString()}</p>
                <p><strong>Temp:</strong> {forecast.main.temp} {temperatureUnit === 'metric' ? '°C' : '°F'}</p>
                <p><strong>Weather:</strong> {forecast.weather[0].description}</p>
                <img src={`http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`} alt="Weather icon" />
              </div>
            ))}
          </div>
        </div>
      )}
      </div>
    </body>
  );
  
  
}

export default App; 