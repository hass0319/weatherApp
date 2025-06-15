const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".city-input");
const btn = document.querySelector(".btn");
const currentCont = document.querySelector(".current-container");
const bot = document.querySelector(".bot");
const scroll = document.querySelector(".scroll");
const error = document.querySelector(".error");

const apiKey = "W54YENYQ46FSDWASHUV2HUYST";
// const  = document.querySelector(".");

weatherForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const city = cityInput.value.trim();

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
  currentCont.innerHTML = "";
  // console.log(data);

  currentCont.style.display = "flex";

  const {
    currentConditions: {
      temp,
      humidity,
      conditions,
      windspeed,
      precip,
      iconSet,
      icon,
    },
    resolvedAddress,
    latitude,
    longitude,
  } = data;

  let myAddress = getLocationName(resolvedAddress, latitude, longitude);

  // Creating Location

  const location = document.createElement("p");
  location.classList.add("location");
  const locationIcon = document.createElement("i");
  locationIcon.classList.add("bi", "bi-geo-alt");
  location.appendChild(locationIcon);
  location.appendChild(document.createTextNode(`${myAddress}`));

  currentCont.appendChild(location);

  // Creating the DIV current, contains :
  // div
  //  temp
  //  conditions
  // div
  //  windspeed
  //  humidity
  //  precipitation

  const current = document.createElement("div");
  current.classList.add("current");

  // Creating the DIV current-temp

  const currentTemp = document.createElement("div");
  currentTemp.classList.add("current-temp");

  // Creating temperature

  const temperature = document.createElement("p");
  temperature.classList.add("temperature");
  temperature.setAttribute("id", "currTemp");
  temperature.textContent = `${((temp - 32) * (5 / 9)).toFixed(1)} °C`;
  currentTemp.appendChild(temperature);

  // Creating weatherCondition

  const weatherCondition = document.createElement("p");
  weatherCondition.classList.add("conditions");
  weatherCondition.id = "currCond";
  const weatherIcon = getIcon(icon, conditions);
  console.log(`weatherIcon: ${weatherIcon}`);

  weatherCondition.append(
    weatherIcon,
    document.createTextNode(` ${conditions}`)
  );
  // weatherCondition.appendChild(weatherIcon);
  // weatherCondition.appendChild(document.createTextNode(` ${conditions}`));

  currentTemp.appendChild(weatherCondition);

  current.appendChild(currentTemp);

  // Creating the DIV current-condition

  const currentCondition = document.createElement("div");
  currentCondition.classList.add("current-condition");

  // Creating windSpeed

  const windSpeed = document.createElement("p");
  windSpeed.classList.add("wind-speed");
  windSpeed.id = "windSpeed";
  const windIcon = document.createElement("i");
  windIcon.classList.add("bi", "bi-wind");
  windSpeed.appendChild(windIcon);
  windSpeed.appendChild(
    document.createTextNode(
      `Wind Speed: ${(windspeed * 1.60934).toFixed(2)} km/h`
    )
  );
  currentCondition.appendChild(windSpeed);

  // Creating humidity

  const humid = document.createElement("p");
  humid.classList.add("humid");
  const humidIcon = document.createElement("i");
  humidIcon.classList.add("bi", "bi-moisture");
  humid.appendChild(humidIcon);
  humid.appendChild(document.createTextNode(`Humidity: ${humidity}%`));
  currentCondition.appendChild(humid);

  // Creating precipitation

  const precipitation = document.createElement("p");
  precipitation.classList.add("precipitation");
  const precipIcon = document.createElement("i");
  precipIcon.classList.add("bi", "bi-cloud");
  precipitation.appendChild(precipIcon);
  // checks for null and undefined
  precipitation.appendChild(
    document.createTextNode(`Precipitation: ${precip ?? 0}%`)
  );
  currentCondition.appendChild(precipitation);

  current.appendChild(currentCondition);

  currentCont.appendChild(current);
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
    // weatherCondition.textContent = conditions;
    const weatherIcon = getIcon(hour.icon, conditions);
    weatherCondition.appendChild(weatherIcon);
    weatherCondition.appendChild(document.createTextNode(conditions));

    const cards = document.createElement("div");
    cards.classList.add("cards");
    cards.append(time, temperature, weatherCondition);
    scroll.append(cards);
  });

  bot.style.display = "flex";
}

function getLocation() {
  console.log("getting location");

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;

        try {
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

function getLocationName(address, lat, long) {
  const coordPattern = /^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/;
  const coords = `${lat.toFixed(4)}, ${long.toFixed(4)}`;
  const addressConversion = address
    .split(",")
    .map((coord) => parseFloat(coord.trim()).toFixed(4))
    .join(", ");

  if (address && coordPattern.test(address)) {
    return (address = addressConversion);
  } else {
    return (address = address || coords);
  }
}

// Helper function to build and return an <img> for a weather icon
function getIcon(iconName, altText = "") {
  const iconMap = {
    "clear-day": "bi-brightness-high",
    "clear-night": "bi-moon",
    "partly-cloudy-day": "bi-cloud-sun",
    "partly-cloudy-night": "bi-cloud-moon",
    cloudy: "bi-cloud",
    rain: "bi-cloud-rain",
    snow: "bi-snow",
    wind: "bi-wind",
    fog: "bi-cloud-fog",
    thunderstorm: "bi-lightning",
  };

  // Default icon for unknown conditions
  const iconClass = iconMap[iconName] || "bi-cloud";

  const iconElement = document.createElement("i");
  iconElement.classList.add("bi", iconClass);
  // iconElement.style.fontSize = "1.5rem";
  // iconElement.style.marginRight = "0.5rem";
  return iconElement;
}

function displayError(message) {
  error.innerHTML = "";

  const errorDisplay = document.createElement("p");
  errorDisplay.textContent = message;
  errorDisplay.classList.add("errorDisplay");

  error.textContent = "";
  error.style.display = "block";
  error.appendChild(errorDisplay);

  // setTimeout(() => {
  //   error.style.display = "none";
  // }, 3000);
}
