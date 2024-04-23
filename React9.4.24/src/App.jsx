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

      const hourlyForecast = data.list.filter(item => {
        const forecastTime = new Date(item.dt * 1000);
        return forecastTime >= now && forecastTime < endOfToday;
      }).slice(0, 8);
      setTodayForecast(hourlyForecast);

      const dailyForecast = data.list.filter((item, index) => index % 8 === 0).slice(0, 5);
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

  // const switchTemperatureUnit = () => {
  //   const newUnit = temperatureUnit === 'metric' ? 'imperial' : 'metric';
  //   setTemperatureUnit(newUnit);
  //   if (currentWeather && currentWeather.coord) {
  //     obtainWeatherByCoordinates(currentWeather.coord.lat, currentWeather.coord.lon, newUnit);
  //     obtainForecastByCoordinates(currentWeather.coord.lat, currentWeather.coord.lon, newUnit);
  //   }
  // };

  // return (
  //   <div className="weather-app">
  //     <h1>Weather Tracker</h1>
  //     <div className="search-bar">
  //       <input
  //         type="text"
  //         value={locationName}
  //         onChange={(e) => setLocationName(e.target.value)}
  //         placeholder="Search by city"
  //       />
  //       <button onClick={handleLocationSearch}>Search Weather</button>
  //     </div>
  //     <button onClick={switchTemperatureUnit}>Switch Units</button>
  //     {currentWeather && (
  //       <div className="current-weather">
  //         <p><strong>Location:</strong> {currentWeather.name}</p>
  //         <p><strong>Temperature:</strong> {currentWeather.main.temp} {temperatureUnit === 'metric' ? '°C' : '°F'}</p>
  //         <p><strong>Conditions:</strong> {currentWeather.weather[0].description}</p>
  //         <p><strong>Wind:</strong> {currentWeather.wind.speed} {temperatureUnit === 'metric' ? 'm/s' : 'mph'}</p>
  //         <p><strong>Humidity:</strong> {currentWeather.main.humidity}%</p>
  //         <p><strong>Sunrise:</strong> {new Date(currentWeather.sys.sunrise * 1000).toLocaleTimeString()}</p>
  //         <p><strong>Sunset:</strong> {new Date(currentWeather.sys.sunset * 1000).toLocaleTimeString()}</p>
  //         <h2>Today's Hourly Forecast</h2>
  //         <div className="forecast">
  //           {todayForecast.map((item, index) => (
  //             <div key={index} className="forecast-entry">
  //               <p><strong>Time:</strong> {new Date(item.dt * 1000).toLocaleTimeString()}</p>
  //               <p><strong>Temp:</strong> {item.main.temp} {temperatureUnit === 'metric' ? '°C' : '°F'}</p>
  //               <p><strong>Weather:</strong> {item.weather[0].description}</p>
  //               <img src={`http://openweathermap.org/img/wn/${item.weather[0].icon}.png`} alt="Weather icon" />
  //             </div>
  //           ))}
  //         </div>
  //         <h2>5-Day Weather Forecast</h2>
  //         <div className="forecast-list">
  //           {dailyWeather.map((forecast, index) => (
  //             <div key={index} className="forecast-entry">
  //               <p><strong>Date:</strong> {new Date(forecast.dt * 1000).toLocaleDateString()}</p>
  //               <p><strong>Temp:</strong> {forecast.main.temp} {temperatureUnit === 'metric' ? '°C' : '°F'}</p>
  //               <p><strong>Weather:</strong> {forecast.weather[0].description}</p>
  //               <img src={`http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`} alt="Weather icon" />
  //             </div>
  //           ))}
  //         </div>
  //       </div>
  //     )}
  //   </div>
  // );
}

export default App; 