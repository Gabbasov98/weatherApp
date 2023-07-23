const APPID = '6e0cbc6ba8ca28e2d697827e926593e3';

window.addEventListener('DOMContentLoaded', () => {

    fix100vh();
    window.addEventListener('resize', () => {
        fix100vh();
    })
})

function fix100vh() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}



const layout = document.querySelector(".layout");
function getLocation() {
    if (navigator.geolocation) {
        layout.classList.remove("_no-permission")
        layout.classList.add("_has-permission")
        navigator.geolocation.getCurrentPosition(getCityWeather);

    } else {
        layout.classList.remove("_has-permission")
        layout.classList.add("_no-permission")
    }
}



async function getCityWeather(position) {
    let result = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&exclude=current&APPID=${APPID}`)
    let data =  await result.json()


    renderResults(data)
}


function renderResults(data) {
    let icon = document.querySelector(".weather__type img")
    let city = document.querySelector("._city")
    let temp = document.querySelector("._temp")
    let humidity = document.querySelector("._humidity")
    let wind = document.querySelector("._wind")
    let description = document.querySelector("._description")


    icon.setAttribute("src","http://openweathermap.org/img/w/" + data.weather[0].icon + ".png")
    city.innerHTML = data.name
    temp.innerHTML = (data.main.temp - 273.15).toFixed(0)
    humidity.innerHTML = data.main.humidity
    wind.innerHTML = data.wind.speed
    description.innerHTML = data.weather[0].description

    console.log(data)
}

getLocation()




let search = document.querySelector(".search")
let searchInput = search.querySelector("input")
let searchVariants = search.querySelector(".search__variants")
let searchBtn = search.querySelector(".search__btn")

search.querySelector("input").addEventListener("keydown", function (e) {
    if (e.code === "Enter") {  //checks whether the pressed key is "Enter"
        showCities()
    }
});

searchBtn.onclick = function () {
    showCities()
}


function showCities() {

    if(searchInput.value.trim() !== ''){
        renderCities()
    } else{
        search.classList.remove("_active")
        searchVariants.innerHTML = ''
    }
}

async function renderCities() {
    let options = {
        method: 'GET',
        headers: { 'x-api-key': 'JGExZgO7wP8+bFuUmKVVOQ==IUyqhryPN3MTtdwN' },
        limit: 30
    }
    let result = await fetch(`https://api.api-ninjas.com/v1/city?name=${searchInput.value}&limit=30`,options)
    let data =  await result.json()

    if(data.length === 0){
        searchVariants.innerHTML = `
        <span class="text20">Cities not found</span>
        `
        search.classList.add("_active")
        return
    }

    searchVariants.innerHTML = ''
    data.forEach(city => {
        searchVariants.innerHTML += `
        <div class="variant-item" 
            data-latitude="${city.latitude}" 
            data-longitude="${city.longitude}">
            ${city.name} (${city.country})
        </div>
        `
    })

    search.classList.add("_active")

    let variantItems = document.querySelectorAll(".variant-item")

     variantItems.forEach(variant => {
        variant.onclick = async function () {
            let position = {
                coords: {
                    latitude: variant.dataset.latitude,
                    longitude: variant.dataset.longitude
                }
            }
            getCityWeather(position)
            search.classList.remove("_active")
            layout.classList.remove("_no-permission")
            layout.classList.add("_has-permission")
        }
    })
}



document.addEventListener( 'click', (e) => {
    const withinBoundaries = e.composedPath().includes(search);

    if ( ! withinBoundaries ) {
        search.classList.remove("_active")
        searchVariants.innerHTML = ''
    }
})
