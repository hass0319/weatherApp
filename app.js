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

function clearWeatherDisplay() {
  const prevLocation = currentCont.querySelector(".location");
  if (prevLocation) prevLocation.remove();

  currentTemp.innerHTML = "";
  currentCond.innerHTML = "";
  scroll.innerHTML = "";
}

weatherForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const city = cityInput.value.trim();

  clearWeatherDisplay();

  if (city) {
    console.log("City entered:", city);

    try {
      const weatherData = await getWeatherData(city);
      displayWeatherInfoCurrent(weatherData);
      displayWeatherInfoHourly(weatherData);

      cityInput.value = "";
    } catch (err) {
      console.log(err);
      displayError("Unable to fetch the weather for your location.");
    }
  } else {
    console.log("City not entered");
    getLocation();
  }
});

// btn.addEventListener("click", getLocation());

async function getWeatherDataByCoords(lat, long) {
  const apiUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${long}/?key=${apiKey}`;

  const response = await fetch(apiUrl);

  console.log(response);

  if (!response.ok) {
    throw new Error("Could not fetch weather data for your location");
  }
  return await response.json();
}

async function getWeatherData(city) {
  const apiUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}/?key=${apiKey}`;

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

  // const prevLocation = currentCont.querySelector(".location");
  // if (prevLocation) {
  //   prevLocation.remove();
  // }
  currentCont.querySelectorAll(".location").forEach((node) => node.remove());

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

  const weatherIcon = document.createElement("p");

  const location = document.createElement("p");
  location.classList.add("location");
  location.textContent = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
  // location.textContent = `${city.trim().charAt(0).toUpperCase() + city.slice(1)} ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;

  const temperature = document.createElement("p");
  temperature.classList.add("temperature");
  temperature.setAttribute("id", "currTemp");
  temperature.textContent = `${((temp - 32) * (5 / 9)).toFixed(1)} °C`;

  const weatherCondition = document.createElement("p");
  weatherCondition.classList.add("conditions");
  weatherCondition.id = "currCond";
  weatherCondition.textContent = conditions;

  const windSpeed = document.createElement("p");
  windSpeed.classList.add("wind-speed");
  windSpeed.id = "windSpeed";
  const windIcon = document.createElement("i");
  windIcon.className = "bi bi-wind";
  windIcon.style.marginRight = "0.5em";

  windSpeed.appendChild(windIcon);
  windSpeed.appendChild(
    document.createTextNode(
      `Wind Speed: ${(windspeed * 1.60934).toFixed(2)} km/h`
    )
  );

  const humid = document.createElement("p");
  humid.classList.add("humid");
  const humidIcon = document.createElement("i");
  humidIcon.className = "bi bi-moisture";
  humidIcon.style.marginRight = "0.5em";

  humid.appendChild(humidIcon);
  humid.appendChild(document.createTextNode(`Humidity: ${humidity}%`));

  const precipitation = document.createElement("p");
  precipitation.classList.add("precipitation");
  const precipIcon = document.createElement("i");
  precipIcon.className = "bi bi-cloud";
  precipIcon.style.marginRight = "0.5em";

  precipitation.appendChild(precipIcon);
  // checks for null and undefined
  precipitation.appendChild(
    document.createTextNode(`Precipitation: ${precip ?? 0}%`)
  );

  currentCont.prepend(location);
  currentTemp.append(temperature, weatherCondition);
  currentCond.append(windSpeed, humid, precipitation);

  // console.log(location);
  // console.log(temperature);
  // console.log(weatherCondition);
  // console.log(windSpeed);
  // console.log(humid);
  // console.log(precipitation);
}

function displayWeatherInfoHourly(data) {
  console.log(data);

  const hourlyData = data.days[0].hours;
  scroll.innerHTML = "";

  hourlyData.forEach((hour) => {
    const { temp, datetime, conditions } = hour;
    console.log(temp, datetime, conditions);

    const time = document.createElement("p");
    time.classList.add("time");
    time.textContent = `${datetime.split(":")[0]}:00`;

    const temperature = document.createElement("p");
    temperature.classList.add("temperature-bot");
    temperature.textContent = `${((temp - 32) * (5 / 9)).toFixed(1)}°C`;

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

function getLocation() {
  console.log("getting location");

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;

        try {
          console.log("trying");
          const weatherData = await getWeatherDataByCoords(lat, long);
          displayWeatherInfoCurrent(weatherData);
          displayWeatherInfoHourly(weatherData);
        } catch (err) {
          console.log(err);
          displayError("Unable to fetch the weather for your location.");
        }
      },
      () => {
        displayError("Location access denied.");
      }
    );
  } else {
    displayError("Geolocation not supported in this browser");
  }
}

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
