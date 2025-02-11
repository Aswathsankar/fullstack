// src/App.jsx
import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [countries, setCountries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [weather, setWeather] = useState(null);

  const handleSearch = async (event) => {
    event.preventDefault();
    if (!searchQuery) return;

    try {
      const response = await axios.get(
        `https://studies.cs.helsinki.fi/restcountries/api/name/${searchQuery}`
      );
      const data = response.data;

      if (data.length > 10) {
        setMessage('Too many matches, specify another filter');
        setCountries([]);
      } else if (data.length > 1) {
        setMessage('');
        setCountries(data);
      } else {
        setMessage('');
        setCountries([data[0]]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage('No countries found');
      setCountries([]);
    }
  };

  const handleShowDetails = async (country) => {
    setSelectedCountry(country);
    setWeather(null); // Reset weather data

    try {
      const capital = country.capital[0];
      const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY;
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${apiKey}&units=metric`
      );
      setWeather(weatherResponse.data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setWeather(null);
    }
  };

  return (
    <div>
      <h2>Country Information</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for a country"
        />
        <button type="submit">Search</button>
      </form>
      {message && <p>{message}</p>}
      {countries.length > 1 && (
        <ul>
          {countries.map((country) => (
            <li key={country.name}>
              {country.name}
              <button onClick={() => handleShowDetails(country)}>Show</button>
            </li>
          ))}
        </ul>
      )}
      {countries.length === 1 && (
        <div>
          <h3>{countries[0].name}</h3>
          <p>Capital: {countries[0].capital}</p>
          <p>Area: {countries[0].area} km²</p>
          <img
            src={countries[0].flags[0]}
            alt={`Flag of ${countries[0].name}`}
            width="100"
          />
          <h4>Languages:</h4>
          <ul>
            {countries[0].languages.map((language) => (
              <li key={language.name}>{language.name}</li>
            ))}
          </ul>
        </div>
      )}
      {selectedCountry && weather && (
        <div>
          <h3>Weather in {selectedCountry.capital[0]}</h3>
          <p>Temperature: {weather.main.temp}°C</p>
          <p>Weather: {weather.weather[0].description}</p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
            alt={weather.weather[0].description}
          />
        </div>
      )}
    </div>
  );
};

export default App;
