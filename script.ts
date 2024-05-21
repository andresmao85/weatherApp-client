import axios from "axios"
import { format } from "date-fns"

interface Position {
  coords: {
    latitude: number
    longitude: number
  }
}

interface LocationData {
  city: string
  country: string
}

interface CurrentWeatherData {
  currentTemp: number
  highTemp: number
  lowTemp: number
  feelslike: number
  windSpeed: number
  precip: number
  description: string
  icon: string
}

interface DailyWeatherData {
  temp: number
  timestamp: number
  icon: string
}

interface HourlyWeatherData {
  temp: number
  feelslike: number
  windSpeed: number
  precip: number
  timestamp: number
  icon: string
}

interface WeatherData {
  location: LocationData
  current: CurrentWeatherData
  daily: DailyWeatherData[]
  hourly: HourlyWeatherData[]
}

interface ParentNodeWithQuery extends ParentNode {
  querySelector: (selectors: string) => HTMLElement | null
}

const locationCoordinates: { [key: string]: { lat: number; lon: number } } = {
  bogota: { lat: 4.6097, lon: -74.0818 },
  dubai: { lat: 25.276987, lon: 55.296249 },
  frankfurt: { lat: 50.1109, lon: 8.6821 },
  hongkong: { lat: 22.3193, lon: 114.1694 },
  london: { lat: 51.5074, lon: -0.1278 },
  losangeles: { lat: 34.0522, lon: -118.2426 },
  newyork: { lat: 40.7128, lon: -74.006 },
  paris: { lat: 48.8566, lon: 2.3522 },
  saopaulo: { lat: -23.5505, lon: -46.6333 },
  sanfrancisco: { lat: 37.7749, lon: -122.4194 },
  shanghai: { lat: 31.2304, lon: 121.4737 },
  singapore: { lat: 1.3521, lon: 103.8198 },
  sydney: { lat: -33.8688, lon: 151.2093 },
  tokyo: { lat: 35.6895, lon: 139.6917 },
}

const locationSelect = document.getElementById("location") as HTMLSelectElement

locationSelect.addEventListener("change", () => {
  const selectedLocation = locationSelect.value

  if (selectedLocation === "current") {
    navigator.geolocation.getCurrentPosition(positionSuccess, positionError)
  } else {
    const { lat, lon } = locationCoordinates[selectedLocation]
    getWeather(lat, lon)
  }
})

function positionSuccess({ coords }: Position) {
  getWeather(coords.latitude, coords.longitude)
}

function positionError() {
  alert(
    "Failed to fetch weather data. Please enable location permissions and try again. Defaulting to San Francisco (USA)."
  )
  const { lat, lon } = locationCoordinates.sanfrancisco
  getWeather(lat, lon)
}

function getWeather(lat: number, lon: number) {
  app?.classList.add("blurred")
  axios
    .get<WeatherData>(
      "https://scientific-ansley-andres-dev-1ae14355.koyeb.app/weather",
      {
        params: { lat, lon },
      }
    )
    .then((res) => {
      renderWeather(res.data)
    })
    .catch((e) => {
      console.log(e)
      alert("Failed to fetch weather data. Please try again.")
      app?.classList.remove("blurred")
    })
}

const app = document.getElementById("app")
function renderWeather({ location, current, daily, hourly }: WeatherData) {
  app?.classList.remove("blurred")
  renderCurrentLocation(location)
  renderCurrentWeather(current)
  renderDailyWeather(daily)
  renderHourlyWeather(hourly)
}

function setValue(
  selector: string,
  value: string,
  {
    parent = document as ParentNodeWithQuery,
  }: { parent?: ParentNodeWithQuery } = {}
) {
  if (parent) {
    const element = parent.querySelector(`[data-${selector}]`)
    if (element) {
      element.textContent = value
    }
  }
}

function formatDate(timestamp: number) {
  return format(new Date(timestamp), "eeee")
}

function renderCurrentLocation(location: LocationData) {
  setValue("current-city", location.city)
  setValue("current-country", location.country)
}

const currentIcon = document.querySelector(
  "[data-current-icon]"
) as HTMLImageElement

function renderCurrentWeather(current: CurrentWeatherData) {
  currentIcon.src = current.icon
  setValue("current-temp", current.currentTemp.toString())
  setValue("current-high", current.highTemp.toString())
  setValue("current-low", current.lowTemp.toString())
  setValue("current-fl-high", current.feelslike.toString())
  setValue("current-wind", current.windSpeed.toString())
  setValue("current-precip", current.precip.toString())
  setValue("current-description", current.description)
}

const dailySection = document.querySelector("[data-day-section]")!
const dayCardTemplate = (
  document.getElementById("day-card-template") as HTMLTemplateElement
)?.content as DocumentFragment

function renderDailyWeather(daily: DailyWeatherData[]) {
  dailySection.innerHTML = ""
  daily.forEach((day) => {
    const element = dayCardTemplate?.cloneNode(true) as DocumentFragment
    const dayCard = element.firstElementChild as HTMLElement | null
    if (dayCard) {
      setValue("temp", day.temp.toString(), { parent: dayCard })
      setValue("date", formatDate(day.timestamp), { parent: dayCard })
      const iconElement = dayCard.querySelector("[data-icon]")
      if (iconElement) {
        ;(iconElement as HTMLImageElement).src = day.icon
      }
    }
    dailySection.appendChild(element)
  })
}

const hourlySection = document.querySelector("[data-hour-section]")!
const hourRowTemplate = (
  document.getElementById("hour-row-template") as HTMLTemplateElement
).content

function renderHourlyWeather(hourly: HourlyWeatherData[]) {
  hourlySection.innerHTML = ""
  hourly.forEach((hour) => {
    const element = hourRowTemplate.cloneNode(true) as DocumentFragment
    const hourRow = element.firstElementChild as HTMLElement
    setValue("temp", hour.temp.toString(), { parent: hourRow })
    setValue("fl-temp", hour.feelslike.toString(), { parent: hourRow })
    setValue("wind", hour.windSpeed.toString(), { parent: hourRow })
    setValue("precip", hour.precip.toString(), { parent: hourRow })
    setValue("day", formatDate(hour.timestamp), { parent: hourRow })
    setValue("time", format(hour.timestamp, "ha"), { parent: hourRow })
    ;(hourRow.querySelector("[data-icon]") as HTMLImageElement).src = hour.icon
    hourlySection.appendChild(element)
  })
}
