// Time

function SetTime() {
    var Present = new Date();
    var Hours = Present.getHours().toString().padStart(2, "0");
    var Minutes = Present.getMinutes().toString().padStart(2, "0");
    var Seconds = Present.getSeconds().toString().padStart(2, "0");
    var Timeoutput = `${Hours}:${Minutes}:${Seconds}`;
    document.getElementById('clock').textContent = Timeoutput;
}
SetTime();
    setInterval(SetTime, 1000);


// Temperature Change

let Searching = document.getElementById('ValueSearch');
let cityName = document.getElementById('Name');
let Temperaturee = document.getElementById("Temperature");
let Desribe = document.querySelector(".description");
let Windspeedd = document.getElementById("Windspeed");
let Windgustt = document.getElementById("Windgusts");
let WindDe = document.getElementById("Pre");
let Humid = document.getElementById("Hum");
let Cloudy = document.getElementById("Cloud");
let Pressure = document.getElementById("Press");
let CityTime = document.getElementById("TimeofCity");


function capitalizeFirstLetter(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// Khi mà không tra được

let BackgroundOpacity = document.querySelector(".Background-Opacity");
            function ShowtheError(){
                BackgroundOpacity.classList.add('Open');
            }
            function ClosetheError(){
                BackgroundOpacity.classList.remove('Open');
            }
document.querySelector(".Close-Button").addEventListener('click', ClosetheError);

// Continue dự báo

async function ChangeSearch(){
    var city = Searching.value.trim();
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=fccaa69792e05a9da9f2ed78f8e3e3c2`;
    let data = await fetch(url)
    .then(a => a.json())
    .then(data => {
        console.log(data);
        if(data.cod == 200){
            cityName.innerText = `${data.name}, ${data.sys.country}`;
            const tempSpan = Temperaturee.querySelector("figcaption span");
            if (tempSpan) {
                tempSpan.innerText = Math.round(data.main.temp - 273.15) + '°C';
            }
            async function LocalTimeofSearchedCity() {
                try {
                    let url = `http://api.timezonedb.com/v2.1/get-time-zone?key=A0WSFJKDHEA7&format=json&by=position&lat=${data.coord.lat}&lng=${data.coord.lon}`;
                    let response = await fetch(url);
                    let dataTime = await response.json();
                    console.log(dataTime); 
                    const timeFull = dataTime.formatted;
                    const timeOnly = timeFull.substring(11, 16);

                    CityTime.innerText = `${timeOnly}`;
                } catch (error) {
                    console.error("Lỗi khi lấy thời gian:", error);
                }
            }
            let iconCode = data.weather[0].icon;
            document.getElementById("img1").src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
            Desribe.innerText = data.weather[0].description;
            Desribe.textContent = capitalizeFirstLetter(Desribe.textContent);

            Windspeedd.innerText = `${data.wind.speed} M/C`;
            Windgustt.innerText = data.wind.gust ? `${data.wind.gust} M/C` : 'N/A';
            WindDe.innerText = `${data.wind.deg}°`;
            Humid.innerText = `${data.main.humidity}%`;
            Cloudy.innerText = `${data.clouds.all}%`;
            Pressure.innerText = `${data.main.pressure} hPa`;
            loadForecast();
            LocalTimeofSearchedCity();
        } else {
            ShowtheError();
        }
    }
)}
document.querySelector(".button-finding").addEventListener("click", ChangeSearch);
document.querySelector('.FindingSection').addEventListener('submit', function(e) {
    e.preventDefault();
    ChangeSearch();
});

// Forecast slider 

new Swiper('.slider', {
    spaceBetween: 20,
    grabCursor: true,
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
        0: {slidesPerView: 1 },
        320: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        1024: { slidesPerView: 4 },
        1440: { slidesPerView: 4 },
    },
});


async function loadForecast() {
  const city = Searching.value.trim();
  const API_Url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=fccaa69792e05a9da9f2ed78f8e3e3c2&units=metric`;

  try {
    const res = await fetch(API_Url);
    const data = await res.json();
    const forecastList = data.list;
    const forecastElements = document.querySelectorAll(".TemperaturePrediction");

    for (let i = 0; i < forecastElements.length; i++) {
      const a = forecastElements[i];
      const forecast = forecastList[i];
      if (!forecast) break; 
      const temp = Math.round(forecast.main.temp);
      const icon = forecast.weather[0].icon;
      const dt_txt = forecast.dt_txt;
      const date = new Date(dt_txt);
      const hours = date.getHours().toString().padStart(2, "0") + ":00";
      const weekday = date.toLocaleDateString("en-US", { weekday: "short" });

      const tempa = a.querySelector(".Data-Forecast");
      const icona = a.querySelector(".image-forecast");
      const timea = a.querySelector(".Time-Forecast");

      if (tempa) tempa.innerText = `${temp}°C`;
      if (icona) icona.src = `https://openweathermap.org/img/wn/${icon}@4x.png`;
      if (timea) timea.innerText = `${hours} ${weekday}`;
    }

  } catch (error) {
    console.error("Lỗi:", error);
  }
}
document.addEventListener("DOMContentLoaded", function () {
  if (Searching) Searching.value = "Hanoi";
  loadForecast("Hanoi");
  ChangeSearch("Hanoi");
});
