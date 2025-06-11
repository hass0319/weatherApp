const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".city-input");
const btn = document.querySelector(".btn");
const currentCont = document.querySelector(".current-container");
const current = document.querySelector(".current");
const currentTemp = document.querySelector(".current-temp");
const currentCond = document.querySelector(".current-condition");
const bot = document.querySelector(".bot");
const cards = document.querySelector(".cards");
const error = document.querySelector(".error");

const apiKey = "W54YENYQ46FSDWASHUV2HUYST";
// const  = document.querySelector(".");

weatherForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const city = cityInput.value;

  if (city) {
    console.log("City entered:", city);

    try {
      const weatherData = await getWeatherData(city);
      displayWeatherInfoCurrent(weatherData);
      displayWeatherInfoHourly(weatherData);
    } catch {
      console.log(error);
      displayError(error);
    }
  } else {
    console.log("City not entered");
    displayError("Please Enter City.");
  }
});

async function getWeatherData(city) {
  const apiUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${[
    city,
  ]}/?key=${apiKey}`;

  const response = await fetch(apiUrl);

  console.log(response);

  if (!response.ok) {
    throw new Error("Enter the correct city");
  }
  return await response.json();
}

function displayWeatherInfoCurrent(data) {
  console.log(data);

  currentCont.style.display = "flex";
  bot.style.display = "flex";

  const {
    address: city,
    currentConditions: {
      temp,
      humidity,
      feelslike,
      icon,
      conditions,
      windspeed,
      precip,
      // resolvedAddress,
    },
    latitude,
    longitude,
  } = data;

  // currentCont.innerHTML = "";
  currentTemp.innerHTML = "";
  currentCond.innerHTML = "";

  const location = document.createElement("h2");
  const temperature = document.createElement("h1");
  const weatherCondition = document.createElement("h3");
  const windSpeed = document.createElement("h3");
  const humid = document.createElement("h3");
  const precipitation = document.createElement("h3");

  location.classList.add("location");
  location.textContent = `${
    city.trim().charAt(0).toUpperCase() + city.slice(1)
  } ${latitude}, ${longitude}`;

  temperature.classList.add("temperature");
  temperature.textContent = `${temp} °F`;

  weatherCondition.classList.add("conditions");
  weatherCondition.textContent = conditions;

  windSpeed.classList.add("wind-speed");
  windSpeed.textContent = `Wind Speed: ${windspeed} km/h`;

  humid.classList.add("humid");
  humid.textContent = `Humidity: ${humidity}%`;

  precipitation.classList.add("precipitation");
  // checks for null and undefined
  precipitation.textContent = `Precipitation: ${precip ?? 0}%`;

  currentCont.prepend(location);
  currentTemp.append(temperature, weatherCondition);
  currentCond.append(windSpeed, humid, precipitation);

  console.log(location);
  console.log(temperature);
  console.log(weatherCondition);
  console.log(windSpeed);
  console.log(humid);
  console.log(precipitation);
}

function displayWeatherInfoHourly(data) {
  console.log(data);
  const {
    datetime,
    currentConditions: { temp, humidity, icon, conditions },
  } = data;

  const time = document.createElement("h5");
  const temperature = document.createElement("h3");
  const weatherCondition = document.createElement("h5");

  time.classList.add("time");
  time.textContent = `${datetime}%`;

  temperature.classList.add("temperature");
  temperature.textContent = `${data.currentConditions.temp} ˚F `;

  weatherCondition.classList.add("conditions");
  weatherCondition.textContent = conditions;
}

function getWeatherEmoji(weatherId) {}

function displayError(message) {
  error.innerHTML = "";

  const errorDisplay = document.createElement("p");
  errorDisplay.textContent = message;
  errorDisplay.classList.add("errorDisplay");

  error.textContent = "";
  error.style.display = "flex";
  error.appendChild(errorDisplay);

  setTimeout(() => {
    error.style.display = "none";
  }, 3000);
}
