let apiKey = 'ff2add26d0667029ddeff099b97cf3a3';

const root = document.getElementById('root');
const popup = document.getElementById('popup');
const textInput = document.getElementById('text-input');
const form = document.getElementById('form');

let store = {
  city: 'Minsk',
  clouds: {
    all: 0,
  },
  sys: {
    type: 0,
  },
  main: {
    temp: 0,
    humidity: 0,
    pressure: 0,
  },
  weather: [
    {
      main: '',
      description: '',
    },
  ],
  wind: {
    speed: 0,
  },
  visibility: 0,
};

const fetchData = async (api) => {
  try {
    const query = localStorage.getItem('q') || store.city;
    const result = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${api}`
    );
    const data = await result.json();

    const {
      main: { temp, humidity, pressure },
      clouds: { all },
      sys: { type },
      weather,
      wind: { speed },
      visibility,
      name,
    } = data;

    store = {
      ...store,
      properties: {
        clouds: {
          all: {
            title: 'clouds',
            value: `${all} octants`,
            icon: 'cloud.png',
          },
        },
        sys: {
          type: {
            title: 'uvIndex',
            value: `${!type ? 0 : type}/100`,
            icon: 'uv-index.png',
          },
        },
        main: {
          humidity: {
            title: 'humidity',
            value: `${humidity} %`,
            icon: 'humidity.png',
          },
          pressure: {
            title: 'pressure',
            value: `${pressure} mill of mercury`,
            icon: 'gauge.png',
          },
          temp,
        },
        wind: {
          speed: {
            title: 'windSpeed',
            value: `${speed} km/h`,
            icon: 'wind.png',
          },
        },
        visibility: {
          title: 'visibility',
          value: `${visibility} meters`,
          icon: 'visibility.png',
        },
      },
      weather,
      name,
    };
    renderComponent();
  } catch (err) {
    console.log(err);
  }
};

const getImage = (description) => {
  switch (description) {
    case 'partly cloudy':
      return 'partly.png';
    case 'overcast clouds':
      return 'cloud.png';
    case 'fog':
      return 'fog.png';
    case 'sunny':
      return 'sunny.png';
    case 'clear sky':
      return 'clear.png';
    default:
      return 'the.png';
  }
};

const renderProperty = (property) => {
  return Object.values(property)
    .map(({ title, value, icon }) => {
      return `<div class="property">
  <div class="property-icon">
    <img src="./img/icons/${icon}" alt="">
  </div>
  <div class="property-info">
    <div class="property-info__value">${value}</div>
    <div class="property-info__description">${title}</div>
  </div>
</div>`;
    })
    .join('');
};

const markup = () => {
  const {
    name,
    properties: {
      clouds: { all },
      main: { temp, humidity, pressure },
      wind: { speed },
      visibility,
      sys: { type },
    },
    weather,
  } = store;

  const property = {
    all,
    humidity,
    pressure,
    speed,
    visibility,
    type,
  };

  const day = 24;
  const hours = new Date().getHours();
  const minutes = new Date().getMinutes();
  const timeHourse = hours > day / 2 ? day - hours : hours;
  const timeMinute = minutes < 10 ? '0' + minutes : minutes;
  const time = hours <= day / 2 ? 'AM' : 'PM';

  const temperature = Math.ceil(temp - 273.15);

  const containerClass = hours < 8 || hours < 18 ? 'is-day' : '';

  return `<div class="container ${containerClass}">
  <div class="top">
    <div class="city">
      <div class="city-subtitle">Weather Today in</div>
        <div class="city-title" id="city">
        <span>${name}</span>
      </div>
    </div>
    <div class="city-info">
      <div class="top-left">
      <img class="icon" src="./img/${getImage(
        weather[0].description
      )}" alt="" />
      <div class="description">${weather[0].main}</div>
    </div>
    <div class="top-right">
      <div class="city-info__subtitle">as of ${
        timeHourse + ':' + timeMinute + ' ' + time
      }</div>
      <div class="city-info__title">${temperature}°</div>
    </div>
  </div>
</div>
<div id="properties">${renderProperty(property)}</div>
</div>`;
};

const togglePopupClass = () => {
  popup.classList.toggle('active');
};

const renderComponent = () => {
  root.innerHTML = markup();

  const city = document.getElementById('city');
  city.addEventListener('click', togglePopupClass);

  const popupClose = document.getElementById('close');
  popupClose.addEventListener('click', togglePopupClass);
};

const handleInput = (e) => {
  store = {
    ...store,
    city: e.target.value,
  };
};
const handleSubmit = (e) => {
  e.preventDefault();
  const value = store.city;

  if (!value) return null;

  localStorage.setItem('q', value);
  fetchData(apiKey);
  togglePopupClass();
};

form.addEventListener('submit', handleSubmit);
textInput.addEventListener('input', handleInput);

fetchData(apiKey);
