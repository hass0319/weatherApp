const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".city-input");
const btn = document.querySelector(".btn");
const currentCont = document.querySelector(".current-container");
const current = document.querySelector(".current");
const currentTemp = document.querySelector(".current-temp");
const currentCond = document.querySelector(".current-condition");
const bot = document.querySelector(".bot");
const scroll = document.querySelector(".scroll");
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

  const {
    address: city,
    currentConditions: {
      temp,
      humidity,
      feelslike,
      weatherEmoji,
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

  const weatherIcon = document.createElement("p");

  const location = document.createElement("p");
  location.classList.add("location");
  location.textContent = `${
    city.trim().charAt(0).toUpperCase() + city.slice(1)
  } ${latitude}, ${longitude}`;

  const temperature = document.createElement("p");
  temperature.classList.add("temperature");
  temperature.textContent = `${(temp - 32 / 1.8).toFixed(1)} °C`;

  const weatherCondition = document.createElement("p");
  weatherCondition.classList.add("conditions");
  weatherCondition.textContent = conditions;

  const windSpeed = document.createElement("p");
  windSpeed.classList.add("wind-speed");
  windSpeed.textContent = `Wind Speed: ${(windspeed * 1.60934).toFixed(
    2
  )} km/h`;

  const humid = document.createElement("p");
  humid.classList.add("humid");
  humid.textContent = `Humidity: ${humidity}%`;

  const precipitation = document.createElement("p");
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

  const hourlyData = data.days[0].hours;

  hourlyData.forEach((hour) => {
    const { temp, datetime, conditions } = hour;
    console.log(temp, datetime, conditions);

    const time = document.createElement("p");
    time.classList.add("time");
    time.textContent = `${datetime.split(":")[0]}:00`;

    const temperature = document.createElement("p");
    temperature.classList.add("temperature-bot");
    temperature.textContent = `${(temp - 32 / 1.8).toFixed(1)}°C`;

    const weatherCondition = document.createElement("p");
    weatherCondition.classList.add("conditions");
    weatherCondition.textContent = conditions;

    const cards = document.createElement("div");
    cards.classList.add("cards");
    cards.append(time, temperature, weatherCondition);
    scroll.append(cards);
  });

  bot.style.display = "flex";
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
