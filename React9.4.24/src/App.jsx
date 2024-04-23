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

// import { useState, useEffect } from 'react';
// import './App.css';

// function App() {
//   const [weather, setWeather] = useState(null);
//   const [forecast, setForecast] = useState([]);  
//   const [hourlyForecast, setHourlyForecast] = useState([]); 
//   const [city, setCity] = useState('');
//   const [unit, setUnit] = useState('metric');

//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(position => {
//         updateWeatherAndForecast(position.coords.latitude, position.coords.longitude);
//       }, () => {
//         console.error("Permission to access location was denied");
//       });
//     }
//   }, []);

//   const fetchWeatherByCoords = async (lat, lon, unit) => {
//     const apiKey = import.meta.env.VITE_APP_API_KEY;
//     const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey}`;
//     try {
//       const response = await fetch(url);
//       const data = await response.json();
//       setWeather(data);
//     } catch (error) {
//       console.error("Failed to fetch weather by coordinates", error);
//     }
//   };

//   const fetchForecastByCoords = async (lat, lon, unit) => {
//     const apiKey = import.meta.env.VITE_APP_API_KEY;
//     const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey}`;
//     try {
//       const response = await fetch(url);
//       const data = await response.json();
//       const now = new Date();
//       const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
//       const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      
//       const hourlyForecasts = data.list.filter(item => {
//         const itemDate = new Date(item.dt * 1000);
//         return itemDate >= now && itemDate < tomorrow;
//       }).slice(0, 8); 
//       setHourlyForecast(hourlyForecasts);
      
//       const dailyForecasts = data.list.filter((item, index) => index % 8 === 0).slice(0, 5); 
//       setForecast(dailyForecasts);
//     } catch (error) {
//       console.error("Failed to fetch forecast", error);
//     }
//   };

//   const updateWeatherAndForecast = (lat, lon) => {
//     fetchWeatherByCoords(lat, lon, unit);
//     fetchForecastByCoords(lat, lon, unit);
//   };

//   const handleSearch = () => {
//     if (city.trim() === "") { 
//       alert("Please enter a city name to get the weather."); 
//     } else {
//       fetchWeather(city);
//     }
//   };
//   const fetchWeather = async (city) => {
//     const apiKey = import.meta.env.VITE_APP_API_KEY;
//     const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${apiKey}`;
//     try {
//       const response = await fetch(url);
//       if (response.ok) {
//         const data = await response.json();
//         setWeather(data);
//         if (data.coord) {
//           fetchForecastByCoords(data.coord.lat, data.coord.lon, unit);
//         }
//       } else if (response.status === 404) {
//         alert("City not found. Please check the city name and try again.");
//       } else {
//         throw new Error('Failed to fetch weather');
//       }
//     } catch (error) {
//       console.error("Failed to fetch weather", error);
//       alert(error.message);
//     }
//   };
  

//   const toggleUnit = () => {
//     const newUnit = unit === 'metric' ? 'imperial' : 'metric';
//     setUnit(newUnit);
//     if (weather && weather.coord) {
//       fetchWeatherByCoords(weather.coord.lat, weather.coord.lon, newUnit);
//       fetchForecastByCoords(weather.coord.lat, weather.coord.lon, newUnit);
//     }
//   };

//   return (
//     <div className="app">
//       <h1>Weather App</h1>
//       <div className="search">
//         <input
//           type="text"
//           value={city}
//           onChange={(e) => setCity(e.target.value)}
//           placeholder="Enter a city name"
//         />
//         <button onClick={handleSearch}>Get Weather</button>
//       </div>
//       <button onClick={toggleUnit}>Switch to {unit === 'metric' ? 'Fahrenheit' : 'Celsius'}</button>
//       {weather && (
//         <div className="weather-info">
//           <p><strong>City:</strong> {weather.name}</p>
//           <p className="temperature"><strong>Temperature:</strong> {weather.main.temp} {unit === 'metric' ? '°C' : '°F'}</p>
//           <p><strong>Weather:</strong> {weather.weather[0].description}</p>
//           <p><strong>Wind Speed:</strong> {weather.wind.speed} {unit === 'metric' ? 'm/s' : 'mph'}</p>
//           <p><strong>Humidity:</strong> {weather.main.humidity}%</p>
//           <p><strong>Sunrise:</strong> {new Date(weather.sys.sunrise * 1000).toLocaleTimeString()}</p>
//           <p><strong>Sunset:</strong> {new Date(weather.sys.sunset * 1000).toLocaleTimeString()}</p>
//           <h2>Hourly Forecast for Today</h2>
//           <div className="hourly-forecast">
//             {hourlyForecast.map((item, index) => (
//               <div key={index} className="forecast-item">
//                 <p><strong>Time:</strong> {new Date(item.dt * 1000).toLocaleTimeString()}</p>
//                 <p><strong>Temperature:</strong> {item.main.temp} {unit === 'metric' ? '°C' : '°F'}</p>
//                 <p><strong>Weather:</strong> {item.weather[0].description}</p>
//                 <img src={`http://openweathermap.org/img/wn/${item.weather[0].icon}.png`} alt="Weather icon" />
//               </div>
//             ))}
//           </div>
//           <h2>5 Day Forecast</h2>
//           <div className="forecast-section">
//             {forecast.map((item, index) => (
//               <div key={index} className="forecast-item">
//                 <p><strong>Date:</strong> {new Date(item.dt * 1000).toLocaleDateString()}</p>
//                 <p><strong>Temperature:</strong> {item.main.temp} {unit === 'metric' ? '°C' : '°F'}</p>
//                 <p><strong>Weather:</strong> {item.weather[0].description}</p>
//                 <img src={`http://openweathermap.org/img/wn/${item.weather[0].icon}.png`} alt="Weather icon" />
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;









// import { useState, useEffect } from 'react';
// import './App.css';

// function App() {
//   const [currentWeather, setCurrentWeather] = useState(null);
//   const [dailyForecast, setDailyForecast] = useState([]);
//   const [hourlyForecast, setHourlyForecast] = useState([]);
//   const [cityName, setCityName] = useState('');
//   const [temperatureUnit, setTemperatureUnit] = useState('metric');

//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         position => {
//           fetchWeatherAndForecast(position.coords.latitude, position.coords.longitude);
//         },
//         () => {
//           console.error("Permission to access location was denied");
//         }
//       );
//     }
//   }, []);

//   const fetchWeatherByCoordinates = async (latitude, longitude, unit) => {
//     const apiKey = import.meta.env.VITE_APP_API_KEY;
//     const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${unit}&appid=${apiKey}`;
    
//     try {
//       const response = await fetch(url);
//       const data = await response.json();
//       setCurrentWeather(data);
//     } catch (error) {
//       console.error("Failed to fetch weather by coordinates", error);
//     }
//   };

//   const fetchForecastByCoordinates = async (latitude, longitude, unit) => {
//     const apiKey = import.meta.env.VITE_APP_API_KEY;
//     const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=${unit}&appid=${apiKey}`;
    
//     try {
//       const response = await fetch(url);
//       const data = await response.json();

//       const now = new Date();
//       const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      
//       const hourlyForecasts = data.list.filter(item => {
//         const itemDate = new Date(item.dt * 1000);
//         return itemDate < tomorrow;
//       }).slice(0, 8);
      
//       setHourlyForecast(hourlyForecasts);
      
//       const dailyForecasts = data.list.filter((item, index) => index % 8 === 0).slice(0, 5);
//       setDailyForecast(dailyForecasts);
//     } catch (error) {
//       console.error("Failed to fetch forecast", error);
//     }
//   };

//   const fetchWeatherAndForecast = (latitude, longitude) => {
//     fetchWeatherByCoordinates(latitude, longitude, temperatureUnit);
//     fetchForecastByCoordinates(latitude, longitude, temperatureUnit);
//   };

//   const handleSearch = () => {
//     if (cityName.trim() === "") {
//       alert("Please enter a city name to get the weather.");
//     } else {
//       fetchWeather(cityName);
//     }
//   };

//   const fetchWeather = async (city) => {
//     const apiKey = import.meta.env.VITE_APP_API_KEY;
//     const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${temperatureUnit}&appid=${apiKey}`;
    
//     try {
//       const response = await fetch(url);
      
//       if (response.ok) {
//         const data = await response.json();
//         setCurrentWeather(data);
        
//         if (data.coord) {
//           fetchForecastByCoordinates(data.coord.lat, data.coord.lon, temperatureUnit);
//         }
//       } else if (response.status === 404) {
//         alert("City not found. Please check the city name and try again.");
//       } else {
//         throw new Error('Failed to fetch weather');
//       }
//     } catch (error) {
//       console.error("Failed to fetch weather", error);
//       alert(error.message);
//     }
//   };

//   const toggleUnit = () => {
//     const newUnit = temperatureUnit === 'metric' ? 'imperial' : 'metric';
//     setTemperatureUnit(newUnit);
    
//     if (currentWeather && currentWeather.coord) {
//       fetchWeatherByCoordinates(currentWeather.coord.lat, currentWeather.coord.lon, newUnit);
//       fetchForecastByCoordinates(currentWeather.coord.lat, currentWeather.coord.lon, newUnit);
//     }
//   };

//   return (
//     <div className="app">
//       <h1>Weather App</h1>
      
//       <div className="search">
//         <input
//           type="text"
//           value={cityName}
//           onChange={(e) => setCityName(e.target.value)}
//           placeholder="Enter a city name"
//         />
//         <button onClick={handleSearch}>Get Weather</button>
//       </div>
      
//       <button onClick={toggleUnit}>
//         Switch to {temperatureUnit === 'metric' ? 'Fahrenheit' : 'Celsius'}
//       </button>
      
//       {currentWeather && (
//         <div className="weather-info">
//           <p><strong>City:</strong> {currentWeather.name}</p>
//           <p className="temperature">
//             <strong>Temperature:</strong> {currentWeather.main.temp} {temperatureUnit === 'metric' ? '°C' : '°F'}
//           </p>
//           <p><strong>Weather:</strong> {currentWeather.weather[0].description}</p>
//           <p><strong>Wind Speed:</strong> {currentWeather.wind.speed} {temperatureUnit === 'metric' ? 'm/s' : 'mph'}</p>
//           <p><strong>Humidity:</strong> {currentWeather.main.humidity}%</p>
//           <p><strong>Sunrise:</strong> {new Date(currentWeather.sys.sunrise * 1000).toLocaleTimeString()}</p>
//           <p><strong>Sunset:</strong> {new Date(currentWeather.sys.sunset * 1000).toLocaleTimeString()}</p>
          
//           <h2>Hourly Forecast for Today</h2>
//           <div className="hourly-forecast">
//             {hourlyForecast.map((item, index) => (
//               <div key={index} className="forecast-item">
//                 <p><strong>Time:</strong> {new Date(item.dt * 1000).toLocaleTimeString()}</p>
//                 <p><strong>Temperature:</strong> {item.main.temp} {temperatureUnit === 'metric' ? '°C' : '°F'}</p>
//                 <p><strong>Weather:</strong> {item.weather[0].description}</p>
//                 <img src={`http://openweathermap.org/img/wn/${item.weather[0].icon}.png`} alt="Weather icon" />
//               </div>
//             ))}
//           </div>
          
//           <h2>5 Day Forecast</h2>
//           <div className="forecast-section">
//             {dailyForecast.map((item, index) => (
//               <div key={index} className="forecast-item">
//                 <p><strong>Date:</strong> {new Date(item.dt * 1000).toLocaleDateString()}</p>
//                 <p><strong>Temperature:</strong> {item.main.temp} {temperatureUnit === 'metric' ? '°C' : '°F'}</p>
//                 <p><strong>Weather:</strong> {item.weather[0].description}</p>
//                 <img src={`http://openweathermap.org/img/wn/${item.weather[0].icon}.png`} alt="Weather icon" />
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//       </div>

//       );
//             }

//   export default App;



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

  const switchTemperatureUnit = () => {
    const newUnit = temperatureUnit === 'metric' ? 'imperial' : 'metric';
    setTemperatureUnit(newUnit);
    if (currentWeather && currentWeather.coord) {
      obtainWeatherByCoordinates(currentWeather.coord.lat, currentWeather.coord.lon, newUnit);
      obtainForecastByCoordinates(currentWeather.coord.lat, currentWeather.coord.lon, newUnit);
    }
  };

  return (
    <div className="weather-app">
      <h1>Weather Tracker</h1>
      <div className="search-bar">
        <input
          type="text"
          value={locationName}
          onChange={(e) => setLocationName(e.target.value)}
          placeholder="Search by city"
        />
        <button onClick={handleLocationSearch}>Search Weather</button>
      </div>
      <button onClick={switchTemperatureUnit}>Switch Units</button>
      {currentWeather && (
        <div className="current-weather">
          <p><strong>Location:</strong> {currentWeather.name}</p>
          <p><strong>Temperature:</strong> {currentWeather.main.temp} {temperatureUnit === 'metric' ? '°C' : '°F'}</p>
          <p><strong>Conditions:</strong> {currentWeather.weather[0].description}</p>
          <p><strong>Wind:</strong> {currentWeather.wind.speed} {temperatureUnit === 'metric' ? 'm/s' : 'mph'}</p>
          <p><strong>Humidity:</strong> {currentWeather.main.humidity}%</p>
          <p><strong>Sunrise:</strong> {new Date(currentWeather.sys.sunrise * 1000).toLocaleTimeString()}</p>
          <p><strong>Sunset:</strong> {new Date(currentWeather.sys.sunset * 1000).toLocaleTimeString()}</p>
          <h2>Today's Hourly Forecast</h2>
          <div className="forecast">
            {todayForecast.map((item, index) => (
              <div key={index} className="forecast-entry">
                <p><strong>Time:</strong> {new Date(item.dt * 1000).toLocaleTimeString()}</p>
                <p><strong>Temp:</strong> {item.main.temp} {temperatureUnit === 'metric' ? '°C' : '°F'}</p>
                <p><strong>Weather:</strong> {item.weather[0].description}</p>
                <img src={`http://openweathermap.org/img/wn/${item.weather[0].icon}.png`} alt="Weather icon" />
              </div>
            ))}
          </div>
          <h2>5-Day Weather Forecast</h2>
          <div className="forecast-list">
            {dailyWeather.map((forecast, index) => (
              <div key={index} className="forecast-entry">
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
  );
}

export default App;