const temp = document.getElementById("temp"),
  date = document.getElementById("date-time"),
  condition = document.getElementById("condition"),
  rain = document.getElementById("rain"),
  mainIcon = document.getElementById("icon"),
  currentLocation = document.getElementById("location"),
  uvIndex = document.querySelector(".uv-index"),
  uvText = document.querySelector(".uv-text"),
  windSpeed = document.querySelector(".wind-speed"),
  sunRise = document.querySelector(".sun-rise"),
  sunSet = document.querySelector(".sun-set"),
  humidity = document.querySelector(".humidity"),
  visibilty = document.querySelector(".visibilty"),
  humidityStatus = document.querySelector(".humidity-status"),
  airQuality = document.querySelector(".air-quality"),
  airQualityStatus = document.querySelector(".air-quality-status"),
  visibilityStatus = document.querySelector(".visibilty-status"),
  searchForm = document.querySelector("#search"),
  search = document.querySelector("#query"),
  celciusBtn = document.querySelector(".celcius"),
  fahrenheitBtn = document.querySelector(".fahrenheit"),
  tempUnit = document.querySelectorAll(".temp-unit"),
  hourlyBtn = document.querySelector(".hourly"),
  weekBtn = document.querySelector(".week"),
  weatherCards = document.querySelector("#weather-cards");

const preloader = document.getElementById("preloader");

window.addEventListener("load", () => {
  setTimeout(() => {
    if (preloader) {
      preloader.style.opacity = "0";
      preloader.style.pointerEvents = "none";
      setTimeout(() => (preloader.style.display = "none"), 500);
    }
  }, 1500); y
});
let weatherAudio = new Audio();
weatherAudio.loop = true;
let soundEnabled = false;
let lastSoundPlayed = "";
let soundToggleBtn = document.getElementById("sound-toggle");
if (!soundToggleBtn) {
  soundToggleBtn = document.createElement("button");
  soundToggleBtn.id = "sound-toggle";
  soundToggleBtn.className = "sound-toggle";
  soundToggleBtn.innerHTML = "🔇 Sound OFF";
  document.querySelector(".app-main").appendChild(soundToggleBtn);
}

soundToggleBtn.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  soundToggleBtn.innerHTML = soundEnabled ? "🔊 Sound ON" : "🔇 Sound OFF";
  
  if (!soundEnabled) {
    weatherAudio.pause();
    lastSoundPlayed = "";
  } else {

    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const isNightTime = currentHour >= 18 || currentHour < 6;
    playWeatherSound(condition.innerText.toLowerCase(), isNightTime);
  }
});

function isNightTime() {
  const now = new Date();
  const currentHour = now.getHours();
  return currentHour >= 18 || currentHour < 6;
}

function isMorning() {
  const now = new Date();
  const currentHour = now.getHours();
  return currentHour >= 6 && currentHour < 12;
}

function playWeatherSound(condition, isNight) {
  if (!soundEnabled) return;
  
  let soundSrc = "";
  const conditionLower = condition.toLowerCase();
  if (conditionLower.includes("thunder") || conditionLower.includes("storm")) {
    soundSrc = "sounds/rain-heavy.wav";
  }
  else if (conditionLower.includes("heavy rain") || 
           conditionLower.includes("heavy-rain") ||
           conditionLower.includes("rain") && conditionLower.includes("heavy")) {
    soundSrc = "sounds/heavy-rain.wav";
  }
  else if (conditionLower.includes("rain") || conditionLower.includes("drizzle")) {
    if (isNight) {
      soundSrc = "sounds/rain.mp3.wav";
    } else if (isMorning()) {
      soundSrc = "sounds/rain.mp3.wav";
    } else {
      soundSrc = "sounds/rain.mp3.wav";
    }
  }

  else if (conditionLower.includes("snow")) {
    soundSrc = "sounds/snow.wav";
  }

  else if (conditionLower.includes("clear")) {
    if (isNight) {
      soundSrc = "sounds/Night.wav";
    } else if (isMorning()) {
      soundSrc = "sounds/carm.wav";
    } else {
      soundSrc = "sounds/carm.wav";
    }
  }
  else if (conditionLower.includes("cloud") || conditionLower.includes("overcast")) {
    if (isNight) {
      soundSrc = "sounds/Night.wav";
    } else if (isMorning()) {
      soundSrc = "sounds/carm.wav";
    } else {
      soundSrc = "sounds/snow.wav";
    }
  }
  else if (conditionLower.includes("fog") || conditionLower.includes("mist")) {
    if (isNight) {
      soundSrc = "sounds/Night.wav";
    } else if (isMorning()) {
      soundSrc = "sounds/Night.wav";
    } else {
      soundSrc = "sounds/Night.wav";
    }
  }
  else {
    if (isNight) {
      soundSrc = "sounds/Night.wav";
    } else if (isMorning()) {
      soundSrc = "sounds/carm.wav";
    } else {
      soundSrc = "sounds/carm.wav";
    }
  }
  
  if (soundSrc && soundSrc !== lastSoundPlayed) {
    weatherAudio.pause();
    weatherAudio.src = soundSrc;
    weatherAudio.volume = 0.5; 
    weatherAudio.play().catch(err => {
      console.log("Audio play failed:", err);
      if (soundSrc.includes("night")) {
        weatherAudio.src = "sounds/carm.wav";
      } else if (soundSrc.includes("morning")) {
        weatherAudio.src = "sounds/carm.wav";
      }
      weatherAudio.play().catch(() => {});
    });
    lastSoundPlayed = soundSrc;
  }
}


let currentCity = "";
let currentUnit = "c";
let hourlyorWeek = "week";


function getDateTime() {
  let now = new Date(),
    hour = now.getHours(),
    minute = now.getMinutes();

  let days = [
    "Sunday","Monday","Tuesday","Wednesday",
    "Thursday","Friday","Saturday",
  ];

  hour = hour % 12 || 12;
  hour = hour < 10 ? "0" + hour : hour;
  minute = minute < 10 ? "0" + minute : minute;

  return `${days[now.getDay()]}, ${hour}:${minute}`;
}

date.innerText = getDateTime();
setInterval(() => {
  date.innerText = getDateTime();
}, 1000);


function getPublicIp() {
  fetch("https://geolocation-db.com/json/")
    .then((res) => res.json())
    .then((data) => {
      currentCity = data.city;
      getWeatherData(currentCity, currentUnit, hourlyorWeek);
    })
    .catch(console.error);
}

getPublicIp();


function getWeatherData(city, unit, hourlyorWeek) {
  fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=EJ6UBL2JEQGYB3AA4ENASN62J&contentType=json`
  )
    .then((res) => res.json())
    .then((data) => {
      const today = data.currentConditions;

      temp.innerText =
        unit === "c" ? today.temp : celciusToFahrenheit(today.temp);

      currentLocation.innerText = data.resolvedAddress;
      condition.innerText = today.conditions;
      rain.innerText = "Perc - " + today.precip + "%";
      uvIndex.innerText = today.uvindex;
      windSpeed.innerText = today.windspeed;

      measureUvIndex(today.uvindex);
      mainIcon.src = getIcon(today.icon);
      changeBackground(today.icon);

      humidity.innerText = today.humidity + "%";
      updateHumidityStatus(today.humidity);

      visibilty.innerText = today.visibility;
      updateVisibiltyStatus(today.visibility);

      airQuality.innerText = today.winddir;
      updateAirQualityStatus(today.winddir);

      sunRise.innerText = covertTimeTo12HourFormat(today.sunrise);
      sunSet.innerText = covertTimeTo12HourFormat(today.sunset);

      // 🔊 PLAY ENHANCED WEATHER SOUND
      const isNight = isNightTime();
      playWeatherSound(today.conditions, isNight);

      if (hourlyorWeek === "hourly") {
        updateForecast(data.days[0].hours, unit, "day");
      } else {
        updateForecast(data.days, unit, "week");
      }
    })
    .catch(() => alert("City not found ! Please try again."));
}

//function to update Forecast
function updateForecast(data, unit, type) {
  weatherCards.innerHTML = "";
  let day = 0;
  let numCards = 0;
  if (type === "day") {
    numCards = 24;
  } else {
    numCards = 7;
  }
  for (let i = 0; i < numCards; i++) {
    let card = document.createElement("div");
    card.classList.add("card");
    let dayName = getHour(data[day].datetime);
    if (type === "week") {
      dayName = getDayName(data[day].datetime);
    }
    let dayTemp = data[day].temp;
    if (unit === "f") {
      dayTemp = celciusToFahrenheit(data[day].temp);
    }
    let iconCondition = data[day].icon;
    let iconSrc = getIcon(iconCondition);
    let tempUnit = "°C";
    if (unit === "f") {
      tempUnit = "°F";
    }
    card.innerHTML = `
                <h2 class="day-name">${dayName}</h2>
            <div class="card-icon">
              <img src="${iconSrc}" class="day-icon" alt="" />
            </div>
            <div class="day-temp">
              <h2 class="temp">${dayTemp}</h2>
              <span class="temp-unit">${tempUnit}</span>
            </div>
  `;
    weatherCards.appendChild(card);
    day++;
  }
}

function getIcon(condition) {
  if (condition === "partly-cloudy-day") {
    return "https://i.ibb.co/PZQXH8V/27.png";
  } else if (condition === "partly-cloudy-night") {
    return "https://i.ibb.co/Kzkk59k/15.png";
  } else if (condition === "rain") {
    return "https://i.ibb.co/kBd2NTS/39.png";
  } else if (condition === "clear-day") {
    return "https://i.ibb.co/rb4rrJL/26.png";
  } else if (condition === "clear-night") {
    return "https://i.ibb.co/1nxNGHL/10.png";
  } else if (condition === "snow") {
    return "https://i.ibb.co/vBmPfC4/18.png";
  } else if (condition === "thunder-rain" || condition.includes("thunder")) {
    return "https://i.ibb.co/D4LZyq1/37.png";
  } else {
    return "https://i.ibb.co/rb4rrJL/26.png";
  }
}

function changeBackground(condition) {
  const body = document.querySelector("body");
  let bg = "";
  if (condition === "partly-cloudy-day") {
    bg = "https://i.ibb.co/qNv7NxZ/pc.webp";
  } else if (condition === "partly-cloudy-night") {
    bg = "https://i.ibb.co/RDfPqXz/pcn.jpg";
  } else if (condition === "rain") {
    bg = "https://i.ibb.co/h2p6Yhd/rain.webp";
  } else if (condition === "clear-day") {
    bg = "https://i.ibb.co/WGry01m/cd.jpg";
  } else if (condition === "clear-night") {
    bg = "https://i.ibb.co/kqtZ1Gx/cn.jpg";
  } else if (condition.includes("thunder")) {
    bg = "https://i.ibb.co/VvSYnSM/thunderstorm.jpg";
  } else if (condition === "snow") {
    bg = "https://i.ibb.co/SRKzkdf/snow.jpg";
  } else {
    bg = "https://i.ibb.co/qNv7NxZ/pc.webp";
  }
  body.style.backgroundImage = `linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ),url(${bg})`;
}

function getHour(time) {
  let hour = time.split(":")[0];
  let min = time.split(":")[1];
  if (hour > 12) {
    hour = hour - 12;
    return `${hour}:${min} PM`;
  } else {
    return `${hour}:${min} AM`;
  }
}

function covertTimeTo12HourFormat(time) {
  let hour = time.split(":")[0];
  let minute = time.split(":")[1];
  let ampm = hour >= 12 ? "pm" : "am";
  hour = hour % 12;
  hour = hour ? hour : 12; 
  hour = hour < 10 ? "0" + hour : hour;
  minute = minute < 10 ? "0" + minute : minute;
  let strTime = hour + ":" + minute + " " + ampm;
  return strTime;
}

function getDayName(date) {
  let day = new Date(date);
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[day.getDay()];
}

function measureUvIndex(uvIndex) {
  if (uvIndex <= 2) {
    uvText.innerText = "Low";
  } else if (uvIndex <= 5) {
    uvText.innerText = "Moderate";
  } else if (uvIndex <= 7) {
    uvText.innerText = "High";
  } else if (uvIndex <= 10) {
    uvText.innerText = "Very High";
  } else {
    uvText.innerText = "Extreme";
  }
}

function updateHumidityStatus(humidity) {
  if (humidity <= 30) {
    humidityStatus.innerText = "Low";
  } else if (humidity <= 60) {
    humidityStatus.innerText = "Moderate";
  } else {
    humidityStatus.innerText = "High";
  }
}

function updateVisibiltyStatus(visibility) {
  if (visibility <= 0.03) {
    visibilityStatus.innerText = "Dense Fog";
  } else if (visibility <= 0.16) {
    visibilityStatus.innerText = "Moderate Fog";
  } else if (visibility <= 0.35) {
    visibilityStatus.innerText = "Light Fog";
  } else if (visibility <= 1.13) {
    visibilityStatus.innerText = "Very Light Fog";
  } else if (visibility <= 2.16) {
    visibilityStatus.innerText = "Light Mist";
  } else if (visibility <= 5.4) {
    visibilityStatus.innerText = "Very Light Mist";
  } else if (visibility <= 10.8) {
    visibilityStatus.innerText = "Clear Air";
  } else {
    visibilityStatus.innerText = "Very Clear Air";
  }
}

function updateAirQualityStatus(airquality) {
  if (airquality <= 50) {
    airQualityStatus.innerText = "Good👌";
  } else if (airquality <= 100) {
    airQualityStatus.innerText = "Moderate😐";
  } else if (airquality <= 150) {
    airQualityStatus.innerText = "Unhealthy for Sensitive Groups😷";
  } else if (airquality <= 200) {
    airQualityStatus.innerText = "Unhealthy😷";
  } else if (airquality <= 250) {
    airQualityStatus.innerText = "Very Unhealthy😨";
  } else {
    airQualityStatus.innerText = "Hazardous😱";
  }
}

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let location = search.value;
  if (location) {
    currentCity = location;
    getWeatherData(location, currentUnit, hourlyorWeek);
  }
});

function celciusToFahrenheit(temp) {
  return ((temp * 9) / 5 + 32).toFixed(1);
}

var currentFocus;
search.addEventListener("input", function (e) {
  removeSuggestions();
  var a,
    b,
    i,
    val = this.value;
  if (!val) {
    return false;
  }
  currentFocus = -1;

  a = document.createElement("ul");
  a.setAttribute("id", "suggestions");

  this.parentNode.appendChild(a);

  for (i = 0; i < cities.length; i++) {
    if (
      cities[i].name.substr(0, val.length).toUpperCase() == val.toUpperCase()
    ) {
      b = document.createElement("li");
      b.innerHTML =
        "<strong>" + cities[i].name.substr(0, val.length) + "</strong>";
      b.innerHTML += cities[i].name.substr(val.length);
      b.innerHTML += "<input type='hidden' value='" + cities[i].name + "'>";
      b.addEventListener("click", function (e) {
        search.value = this.getElementsByTagName("input")[0].value;
        removeSuggestions();
      });

      a.appendChild(b);
    }
  }
});
search.addEventListener("keydown", function (e) {
  var x = document.getElementById("suggestions");
  if (x) x = x.getElementsByTagName("li");
  if (e.keyCode == 40) {
    currentFocus++;
    addActive(x);
  } else if (e.keyCode == 38) {
    currentFocus--;
    addActive(x);
  }
  if (e.keyCode == 13) {
    e.preventDefault();
    if (currentFocus > -1) {
      if (x) x[currentFocus].click();
    }
  }
});
function addActive(x) {
  if (!x) return false;
  removeActive(x);
  if (currentFocus >= x.length) currentFocus = 0;
  if (currentFocus < 0) currentFocus = x.length - 1;
  x[currentFocus].classList.add("active");
}
function removeActive(x) {
  for (var i = 0; i < x.length; i++) {
    x[i].classList.remove("active");
  }
}

function removeSuggestions() {
  var x = document.getElementById("suggestions");
  if (x) x.parentNode.removeChild(x);
}

fahrenheitBtn.addEventListener("click", () => {
  changeUnit("f");
});
celciusBtn.addEventListener("click", () => {
  changeUnit("c");
});
function changeUnit(unit) {
  if (currentUnit !== unit) {
    currentUnit = unit;
    tempUnit.forEach((elem) => {
      elem.innerText = `°${unit.toUpperCase()}`;
    });
    if (unit === "c") {
      celciusBtn.classList.add("active");
      fahrenheitBtn.classList.remove("active");
    } else {
      celciusBtn.classList.remove("active");
      fahrenheitBtn.classList.add("active");
    }
    getWeatherData(currentCity, currentUnit, hourlyorWeek);
  }
}

hourlyBtn.addEventListener("click", () => {
  changeTimeSpan("hourly");
});
weekBtn.addEventListener("click", () => {
  changeTimeSpan("week");
});

function changeTimeSpan(unit) {
  if (hourlyorWeek !== unit) {
    hourlyorWeek = unit;
    if (unit === "hourly") {
      hourlyBtn.classList.add("active");
      weekBtn.classList.remove("active");
    } else {
      hourlyBtn.classList.remove("active");
      weekBtn.classList.add("active");
    }
    getWeatherData(currentCity, currentUnit, hourlyorWeek);
  }
}

cities = [
    {
    country: "NP",
    name: "Kathmandu",
    lat: "27.7172",
    lng: "85.3240",
  },
  {
    country: "NP",
    name: "Pokhara",
    lat: "28.2096",
    lng: "83.9856",
  },
  {
    country: "NP",
    name: "Lalitpur",
    lat: "27.6667",
    lng: "85.3167",
  },
  {
    country: "NP",
    name: "Bharatpur",
    lat: "27.6833",
    lng: "84.4333",
  },
  {
    country: "NP",
    name: "Biratnagar",
    lat: "26.4833",
    lng: "87.2833",
  },
  {
    country: "NP",
    name: "Birgunj",
    lat: "27.0000",
    lng: "84.8667",
  },
  {
    country: "NP",
    name: "Dharan",
    lat: "26.8167",
    lng: "87.2833",
  },
  {
    country: "NP",
    name: "Bhimdatta",
    lat: "28.7667",
    lng: "80.5833",
  },
  {
    country: "NP",
    name: "Butwal",
    lat: "27.7000",
    lng: "83.4500",
  },
  {
    country: "NP",
    name: "Hetauda",
    lat: "27.4167",
    lng: "85.0333",
  },
  {
    country: "NP",
    name: "Dhankuta",
    lat: "26.9833",
    lng: "87.3333",
  },
  {
    country: "NP",
    name: "Baglung",
    lat: "28.2667",
    lng: "83.6000",
  },
  {
    country: "NP",
    name: "Tansen",
    lat: "27.8667",
    lng: "83.5500",
  },
  {
    country: "NP",
    name: "Rajbiraj",
    lat: "26.5333",
    lng: "86.7500",
  },
  {
    country: "NP",
    name: "Lahan",
    lat: "26.7167",
    lng: "86.4833",
  },
  {
    country: "NP",
    name: "Patan",
    lat: "27.6767",
    lng: "85.3256",
  },
  {
    country: "NP",
    name: "Tikapur",
    lat: "28.5333",
    lng: "81.1167",
  },
  {
    country: "NP",
    name: "Kirtipur",
    lat: "27.6667",
    lng: "85.2833",
  },
  {
    country: "NP",
    name: "Tulsipur",
    lat: "28.1300",
    lng: "82.3000",
  },
  {
    country: "NP",
    name: "Bhadrapur",
    lat: "26.5333",
    lng: "88.0833",
  },
  {
    country: "NP",
    name: "Dhangadhi",
    lat: "28.7000",
    lng: "80.6000",
  },
  {
    country: "NP",
    name: "Nepalgunj",
    lat: "28.0500",
    lng: "81.6167",
  },
  {
    country: "NP",
    name: "Birendranagar",
    lat: "28.6000",
    lng: "81.6333",
  },
  {
    country: "NP",
    name: "Itahari",
    lat: "26.6667",
    lng: "87.2833",
  },
  {
    country: "NP",
    name: "Triyuga",
    lat: "26.7833",
    lng: "86.7000",
  },
  {
    country: "NP",
    name: "Siddharthanagar",
    lat: "27.5000",
    lng: "83.4500",
  },
  {
    country: "NP",
    name: "Gaur",
    lat: "26.7667",
    lng: "85.2833",
  },
  {
    country: "NP",
    name: "Jaleshwar",
    lat: "26.6500",
    lng: "85.8000",
  },
  {
    country: "NP",
    name: "Kalaiya",
    lat: "27.0333",
    lng: "85.0167",
  },
  {
    country: "NP",
    name: "Mechinagar",
    lat: "26.6667",
    lng: "88.1167",
  },
  {
    country: "NP",
    name: "Bardibas",
    lat: "26.9833",
    lng: "85.9000",
  },
  {
    country: "NP",
    name: "Siraha",
    lat: "26.6500",
    lng: "86.2000",
  },
  {
    country: "NP",
    name: "Janakpur",
    lat: "26.7000",
    lng: "85.9167",
  },
  {
    country: "NP",
    name: "Kapilavastu",
    lat: "27.5333",
    lng: "83.0500",
  },
  {
    country: "NP",
    name: "Taulihawa",
    lat: "27.5167",
    lng: "83.0500",
  },
  {
    country: "NP",
    name: "Ramgram",
    lat: "27.5167",
    lng: "83.6667",
  },
  {
    country: "NP",
    name: "Tilottama",
    lat: "27.6667",
    lng: "83.4333",
  },
  {
    country: "NP",
    name: "Gulariya",
    lat: "28.2333",
    lng: "81.3333",
  },
  {
    country: "NP",
    name: "Waling",
    lat: "27.9833",
    lng: "83.7667",
  },
  {
    country: "NP",
    name: "Beni",
    lat: "28.3500",
    lng: "83.5667",
  },
  {
    country: "NP",
    name: "Bagdula",
    lat: "26.9000",
    lng: "87.9167",
  },
  {
    country: "NP",
    name: "Darchula",
    lat: "29.8500",
    lng: "80.5500",
  },
  {
    country: "NP",
    name: "Dadeldhura",
    lat: "29.3000",
    lng: "80.5833",
  },
  {
    country: "NP",
    name: "Dhangadi",
    lat: "28.7000",
    lng: "80.6000",
  },
  {
    country: "NP",
    name: "Dipayal",
    lat: "29.2333",
    lng: "80.9333",
  },
  {
    country: "NP",
    name: "Jumla",
    lat: "29.2833",
    lng: "82.1667",
  },
  {
    country: "NP",
    name: "Dailekh",
    lat: "28.8333",
    lng: "81.7167",
  },
  {
    country: "NP",
    name: "Narayan",
    lat: "28.0833",
    lng: "81.6167",
  },
  {
    country: "NP",
    name: "Salyan",
    lat: "28.3833",
    lng: "82.1667",
  },
  {
    country: "NP",
    name: "Surkhet",
    lat: "28.6000",
    lng: "81.6333",
  },
  {
    country: "NP",
    name: "Jajarkot",
    lat: "28.7000",
    lng: "82.2333",
  },
  {
    country: "NP",
    name: "Dolpa",
    lat: "28.9833",
    lng: "82.9167",
  },
  {
    country: "NP",
    name: "Jomsom",
    lat: "28.7833",
    lng: "83.7333",
  },
  {
    country: "NP",
    name: "Mustang",
    lat: "29.1667",
    lng: "83.9667",
  },
  {
    country: "NP",
    name: "Manang",
    lat: "28.6667",
    lng: "84.0167",
  },
  {
    country: "NP",
    name: "Gorkha",
    lat: "28.0000",
    lng: "84.6333",
  },
  {
    country: "NP",
    name: "Lamjung",
    lat: "28.2333",
    lng: "84.3833",
  },
  {
    country: "NP",
    name: "Kaski",
    lat: "28.3000",
    lng: "83.9833",
  },
  {
    country: "NP",
    name: "Tanahun",
    lat: "27.9167",
    lng: "84.2500",
  },
  {
    country: "NP",
    name: "Syangja",
    lat: "28.0833",
    lng: "83.8333",
  },
  {
    country: "NP",
    name: "Palpa",
    lat: "27.8667",
    lng: "83.5500",
  },
  {
    country: "NP",
    name: "Rupandehi",
    lat: "27.5000",
    lng: "83.4500",
  },
  {
    country: "NP",
    name: "Nawalparasi",
    lat: "27.6667",
    lng: "83.9167",
  },
  {
    country: "NP",
    name: "Kapilvastu",
    lat: "27.5333",
    lng: "83.0500",
  },
  {
    country: "NP",
    name: "Arghakhanchi",
    lat: "27.9000",
    lng: "83.1500",
  },
  {
    country: "NP",
    name: "Gulmi",
    lat: "28.0833",
    lng: "83.3000",
  },
  {
    country: "NP",
    name: "Rukum",
    lat: "28.6333",
    lng: "82.5333",
  },
  {
    country: "NP",
    name: "Rolpa",
    lat: "28.3667",
    lng: "82.5500",
  },
  {
    country: "NP",
    name: "Pyuthan",
    lat: "28.0833",
    lng: "82.8667",
  },
  {
    country: "NP",
    name: "Dang",
    lat: "27.9833",
    lng: "82.5167",
  },
  {
    country: "NP",
    name: "Banke",
    lat: "28.0500",
    lng: "81.6167",
  },
  {
    country: "NP",
    name: "Bardiya",
    lat: "28.2333",
    lng: "81.3333",
  },
  {
    country: "NP",
    name: "Kailali",
    lat: "28.7000",
    lng: "80.6000",
  },
  {
    country: "NP",
    name: "Kanchanpur",
    lat: "28.7667",
    lng: "80.5833",
  },
  {
    country: "NP",
    name: "Doti",
    lat: "29.2333",
    lng: "80.9333",
  },
  {
    country: "NP",
    name: "Achham",
    lat: "29.0667",
    lng: "81.3000",
  },
  {
    country: "NP",
    name: "Bajura",
    lat: "29.5167",
    lng: "81.5000",
  },
  {
    country: "NP",
    name: "Bajhang",
    lat: "29.5500",
    lng: "81.2333",
  },
  {
    country: "NP",
    name: "Darchula",
    lat: "29.8500",
    lng: "80.5500",
  },
  {
    country: "NP",
    name: "Baitadi",
    lat: "29.5500",
    lng: "80.4167",
  },
  {
    country: "NP",
    name: "Dadeldhura",
    lat: "29.3000",
    lng: "80.5833",
  },
  {
    country: "NP",
    name: "Doti",
    lat: "29.2333",
    lng: "80.9333",
  },
  {
    country: "NP",
    name: "Kailali",
    lat: "28.7000",
    lng: "80.6000",
  },
  {
    country: "NP",
    name: "Kanchanpur",
    lat: "28.7667",
    lng: "80.5833",
  },
  {
    country: "NP",
    name: "Bhaktapur",
    lat: "27.6722",
    lng: "85.4278",
  },
  {
    country: "NP",
    name: "Madhyapur Thimi",
    lat: "27.6810",
    lng: "85.3850",
  },
  {
    country: "NP",
    name: "Kirtipur",
    lat: "27.6667",
    lng: "85.2833",
  },
  {
    country: "NP",
    name: "Banepa",
    lat: "27.6296",
    lng: "85.5214",
  },
  {
    country: "NP",
    name: "Panauti",
    lat: "27.5833",
    lng: "85.5167",
  },
  {
    country: "NP",
    name: "Dhankuta",
    lat: "26.9833",
    lng: "87.3333",
  },
  {
    country: "NP",
    name: "Ilam",
    lat: "26.9083",
    lng: "87.9264",
  },
  {
    country: "NP",
    name: "Phidim",
    lat: "27.1500",
    lng: "87.7667",
  },
  {
    country: "NP",
    name: "Bhojpur",
    lat: "27.1700",
    lng: "87.0500",
  },
  {
    country: "NP",
    name: "Dhankuta",
    lat: "26.9833",
    lng: "87.3333",
  },
  {
    country: "NP",
    name: "Terhathum",
    lat: "27.1333",
    lng: "87.5000",
  },
  {
    country: "NP",
    name: "Taplejung",
    lat: "27.3500",
    lng: "87.6667",
  },
  {
    country: "NP",
    name: "Panchthar",
    lat: "27.1333",
    lng: "87.7667",
  },
  {
    country: "NP",
    name: "Sankhuwasabha",
    lat: "27.4500",
    lng: "87.2833",
  },
  {
    country: "NP",
    name: "Solukhumbu",
    lat: "27.7000",
    lng: "86.7167",
  },
  {
    country: "NP",
    name: "Okhaldhunga",
    lat: "27.3167",
    lng: "86.5000",
  },
  {
    country: "NP",
    name: "Khotang",
    lat: "27.2000",
    lng: "86.7833",
  },
  {
    country: "NP",
    name: "Udayapur",
    lat: "26.9000",
    lng: "86.6667",
  },
  {
    country: "NP",
    name: "Saptari",
    lat: "26.5333",
    lng: "86.7500",
  },
  {
    country: "NP",
    name: "Siraha",
    lat: "26.6500",
    lng: "86.2000",
  },
  {
    country: "NP",
    name: "Dhanusha",
    lat: "26.7000",
    lng: "85.9167",
  },
  {
    country: "NP",
    name: "Mahottari",
    lat: "26.7667",
    lng: "85.9167",
  },
  {
    country: "NP",
    name: "Sarlahi",
    lat: "26.9833",
    lng: "85.5167",
  },
  {
    country: "NP",
    name: "Rautahat",
    lat: "26.8000",
    lng: "85.3000",
  },
  {
    country: "NP",
    name: "Bara",
    lat: "27.0333",
    lng: "85.0167",
  },
  {
    country: "NP",
    name: "Parsa",
    lat: "27.0000",
    lng: "84.8667",
  },
  {
    country: "NP",
    name: "Chitwan",
    lat: "27.6833",
    lng: "84.4333",
  },
  {
    country: "NP",
    name: "Makwanpur",
    lat: "27.4167",
    lng: "85.0333",
  },
  {
    country: "NP",
    name: "Ramechhap",
    lat: "27.3333",
    lng: "86.0833",
  },
  {
    country: "NP",
    name: "Sindhuli",
    lat: "27.2500",
    lng: "85.9667",
  },
  {
    country: "NP",
    name: "Kavrepalanchok",
    lat: "27.5333",
    lng: "85.5333",
  },
  {
    country: "NP",
    name: "Lalitpur",
    lat: "27.6667",
    lng: "85.3167",
  },
  {
    country: "NP",
    name: "Bhaktapur",
    lat: "27.6722",
    lng: "85.4278",
  },
  {
    country: "NP",
    name: "Kathmandu",
    lat: "27.7172",
    lng: "85.3240",
  },
  {
    country: "NP",
    name: "Nuwakot",
    lat: "27.9167",
    lng: "85.1667",
  },
  {
    country: "NP",
    name: "Rasuwa",
    lat: "28.1333",
    lng: "85.3333",
  },
  {
    country: "NP",
    name: "Dhading",
    lat: "28.0000",
    lng: "84.9167",
  },
  {
    country: "NP",
    name: "Gorkha",
    lat: "28.0000",
    lng: "84.6333",
  },
  {
    country: "NP",
    name: "Lamjung",
    lat: "28.2333",
    lng: "84.3833",
  },
  {
    country: "NP",
    name: "Kaski",
    lat: "28.3000",
    lng: "83.9833",
  },
  {
    country: "NP",
    name: "Manang",
    lat: "28.6667",
    lng: "84.0167",
  },
  {
    country: "NP",
    name: "Mustang",
    lat: "29.1667",
    lng: "83.9667",
  },
  {
    country: "NP",
    name: "Myagdi",
    lat: "28.3500",
    lng: "83.5667",
  },
  {
    country: "NP",
    name: "Parbat",
    lat: "28.2333",
    lng: "83.6833",
  },
  {
    country: "NP",
    name: "Baglung",
    lat: "28.2667",
    lng: "83.6000",
  },
  {
    country: "NP",
    name: "Gulmi",
    lat: "28.0833",
    lng: "83.3000",
  },
  {
    country: "NP",
    name: "Palpa",
    lat: "27.8667",
    lng: "83.5500",
  },
  {
    country: "NP",
    name: "Nawalparasi",
    lat: "27.6667",
    lng: "83.9167",
  },
  {
    country: "NP",
    name: "Rupandehi",
    lat: "27.5000",
    lng: "83.4500",
  },
  {
    country: "NP",
    name: "Kapilvastu",
    lat: "27.5333",
    lng: "83.0500",
  },
  {
    country: "NP",
    name: "Arghakhanchi",
    lat: "27.9000",
    lng: "83.1500",
  },
  {
    country: "NP",
    name: "Pyuthan",
    lat: "28.0833",
    lng: "82.8667",
  },
  {
    country: "NP",
    name: "Rolpa",
    lat: "28.3667",
    lng: "82.5500",
  },
  {
    country: "NP",
    name: "Rukum",
    lat: "28.6333",
    lng: "82.5333",
  },
  {
    country: "NP",
    name: "Salyan",
    lat: "28.3833",
    lng: "82.1667",
  },
  {
    country: "NP",
    name: "Dang",
    lat: "27.9833",
    lng: "82.5167",
  },
  {
    country: "NP",
    name: "Banke",
    lat: "28.0500",
    lng: "81.6167",
  },
  {
    country: "NP",
    name: "Bardiya",
    lat: "28.2333",
    lng: "81.3333",
  },
  {
    country: "NP",
    name: "Surkhet",
    lat: "28.6000",
    lng: "81.6333",
  },
  {
    country: "NP",
    name: "Dailekh",
    lat: "28.8333",
    lng: "81.7167",
  },
  {
    country: "NP",
    name: "Jajarkot",
    lat: "28.7000",
    lng: "82.2333",
  },
  {
    country: "NP",
    name: "Dolpa",
    lat: "28.9833",
    lng: "82.9167",
  },
  {
    country: "NP",
    name: "Jumla",
    lat: "29.2833",
    lng: "82.1667",
  },
  {
    country: "NP",
    name: "Kalikot",
    lat: "29.2667",
    lng: "81.7667",
  },
  {
    country: "NP",
    name: "Mugu",
    lat: "29.5833",
    lng: "82.0833",
  },
  {
    country: "NP",
    name: "Humla",
    lat: "29.9667",
    lng: "81.8333",
  },
  {
    country: "NP",
    name: "Bajura",
    lat: "29.5167",
    lng: "81.5000",
  },
  {
    country: "NP",
    name: "Bajhang",
    lat: "29.5500",
    lng: "81.2333",
  },
  {
    country: "NP",
    name: "Darchula",
    lat: "29.8500",
    lng: "80.5500",
  },
  {
    country: "NP",
    name: "Baitadi",
    lat: "29.5500",
    lng: "80.4167",
  },
  {
    country: "NP",
    name: "Dadeldhura",
    lat: "29.3000",
    lng: "80.5833",
  },
  {
    country: "NP",
    name: "Kanchanpur",
    lat: "28.7667",
    lng: "80.5833",
  },
  {
    country: "NP",
    name: "Kailali",
    lat: "28.7000",
    lng: "80.6000",
  },
  {
    country: "NP",
    name: "Doti",
    lat: "29.2333",
    lng: "80.9333",
  },
  {
    country: "NP",
    name: "Achham",
    lat: "29.0667",
    lng: "81.3000",
  },
];

function celciusToFahrenheit(temp) {
  return ((temp * 9) / 5 + 32).toFixed(1);
}
