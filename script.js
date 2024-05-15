import axios from "axios"
import { format } from "date-fns"

navigator.geolocation.getCurrentPosition(positionSuccess, positionError)

function positionSuccess({ coords }) {
  getWeather(coords.latitude, coords.longitude)
}

const SAN_FRANCISCO_LAT = 37.7749
const SAN_FRANCISCO_LON = -122.4194

function positionError() {
  alert(
    "Failed to fetch weather data from your current location. Please enable location permissions and try again. Showing weather for San Francisco (USA) by default."
  )
  getWeather(SAN_FRANCISCO_LAT, SAN_FRANCISCO_LON)
}

function getWeather(lat, lon) {
  axios
    .get("https://scientific-ansley-andres-dev-1ae14355.koyeb.app/weather", {
      params: {
        lat,
        lon,
      },
    })
    .then((res) => {
      // console.log(res.data)
      renderWeather(res.data)
    })
    .catch((e) => {
      console.log(e)
      alert("Failed to fetch weather data. Please try again.")
    })
}

function renderWeather({ location, current, daily, hourly }) {
  document.body.classList.remove("blurred")
  renderCurrentLocation(location)
  renderCurrentWeather(current)
  renderDailyWeather(daily)
  renderHourlyWeather(hourly)
}

function setValue(selector, value, { parent = document } = {}) {
  parent.querySelector(`[data-${selector}]`).textContent = value
}

function formatDate(timestamp) {
  return format(new Date(timestamp), "eeee")
}

function renderCurrentLocation(location) {
  setValue("current-city", location.city)
  setValue("current-country", location.country)
}

const currentIcon = document.querySelector("[data-current-icon]")
function renderCurrentWeather(current) {
  currentIcon.src = current.icon
  setValue("current-temp", current.currentTemp)
  setValue("current-high", current.highTemp)
  setValue("current-low", current.lowTemp)
  setValue("current-fl-high", current.feelslike)
  setValue("current-wind", current.windSpeed)
  setValue("current-precip", current.precip)
  setValue("current-description", current.description)
}

const dailySection = document.querySelector("[data-day-section]")
const dayCardTemplate = document.getElementById("day-card-template")
function renderDailyWeather(daily) {
  dailySection.innerHTML = ""
  daily.forEach((day) => {
    const element = dayCardTemplate.content.cloneNode(true)
    setValue("temp", day.temp, { parent: element })
    setValue("date", formatDate(day.timestamp), { parent: element })
    element.querySelector("[data-icon]").src = day.icon
    dailySection.appendChild(element)
  })
}

const hourlySection = document.querySelector("[data-hour-section]")
const hourRowTemplate = document.getElementById("hour-row-template")
function renderHourlyWeather(hourly) {
  hourlySection.innerHTML = ""
  hourly.forEach((hour) => {
    const element = hourRowTemplate.content.cloneNode(true)
    setValue("temp", hour.temp, { parent: element })
    setValue("fl-temp", hour.feelslike, { parent: element })
    setValue("wind", hour.windSpeed, { parent: element })
    setValue("precip", hour.precip, { parent: element })
    setValue("day", formatDate(hour.timestamp), { parent: element })
    setValue("time", format(hour.timestamp, "ha"), { parent: element })
    element.querySelector("[data-icon]").src = hour.icon
    hourlySection.appendChild(element)
  })
}
