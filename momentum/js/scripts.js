import playList from './playList.js';

const unsplashApiKey = 'uDuPL8kLMy1AJOU4p4xDFu0-XRwLYTDkREhOQewMadU';
const flickrApiKey = '6b55fdbcf8f7d61ab2f0826f940fada0';

const body = document.body;
const name = document.querySelector('.name');
const city = document.querySelector('.city');
const slideNext = document.querySelector('.slide-next');
const slidePrev = document.querySelector('.slide-prev');
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');
const weatherDescription = document.querySelector('.weather-description');
const weatherError = document.querySelector('.weather-error');
const quote = document.querySelector('.quote-text');
const author = document.querySelector('.author');
const changeQuote = document.querySelector('.change-quote');
const audio = new Audio();
const buttonPlay = document.querySelector('.play');
const buttonNext = document.querySelector('.play-next');
const buttonPrev = document.querySelector('.play-prev');
const playListContainer = document.querySelector('.play-list');
const settingsDashboard = document.querySelector('.settings');
const settingsToggle = document.querySelector('.settings .toggle');
const mobileCloseTablet = document.querySelector('.settings-tablet-control .mobile-close');
const settingsList = document.querySelector('#apps-list');
const settingsNavList = document.querySelector('.settings-nav-list');
const buttonToggleLang = document.querySelector('.toggle-lang');
const languageText = document.querySelector('.toggle-lang .setting-name');
const imageSourceSelect = document.querySelector('#image-source');
const settingsSliderInfoAlert = document.querySelector('.bg-info');
const customSlideTag = document.querySelector('#slide-tag');
const buttonSubmitBgChange = document.querySelector('.settings-submit');

let state = {
  language: 'en',
  photoSource: 'github',
  blocks: ['time', 'date','greeting', 'quote', 'weather', 'player']
}
let lang = state['language'];
let isPlay = false;
let playNum = 0;
let randomNum = getRandomNum(1, 20);
let customTag = '';

/**
 * Load/Save Settings
 */
window.addEventListener('beforeunload', setLocalStorage);
window.addEventListener('load', () => {
  getLocalStorage();
  setState();
  getLinkToImage();
  getQuotes(`assets/json/quotes-${lang}.json`);
  getWeather();
  showTime();
  makePlayList();
});


/**
 * Slider Widget
 */
slideNext.addEventListener('click', getSlideNext);
slidePrev.addEventListener('click', getSlidePrev);

/**
 * Weather Widget
 */
city.addEventListener('change', () => {
  getWeather();
});

changeQuote.addEventListener('click', () => {
  getQuotes(`assets/json/quotes-${lang}.json`);
});

/**
 * Simple Player Widget
 */
buttonPlay.addEventListener('click', playAudio);
buttonNext.addEventListener('click', playNext);
buttonPrev.addEventListener('click', playPrev);
audio.addEventListener('ended', () => {
    playNext();
});

/**
 * Settings Dashboard
 */
settingsToggle.addEventListener('click', () => {
  settingsDashboard.classList.toggle('show-fade-in');
});

mobileCloseTablet.addEventListener('click', () => {
  settingsDashboard.classList.remove('show-fade-in');
});

settingsList.addEventListener('click', (event) => {
  let settingsItem = event.target;
  let slideToggle = settingsItem.closest('.slide-toggle');
  let widgetName = slideToggle.dataset.relatedWidget;
  
  if (slideToggle.classList.contains('on')) {
    slideToggle.classList.remove('on');
    slideToggle.classList.add('disabled');
    state.blocks.splice(state.blocks.indexOf(widgetName), 1);
    toggleWidget(widgetName);
  } else {
    slideToggle.classList.remove('disabled');
    slideToggle.classList.add('on');
    state.blocks.push(widgetName);
    toggleWidget(widgetName);
  }
});

settingsNavList.addEventListener('click', (event) => {
  let menuItem = event.target;
  let currentNavItem = menuItem.dataset.navitem;
  
  [...event.currentTarget.children].forEach(
    (item) => {
      if (item.classList.contains('active')) {
        item.classList.remove('active');
        document.querySelector(`.settings-${item.dataset.navitem}`).classList.remove('tab-visible');
      }
  });

    menuItem.classList.add('active');
    document.querySelector(`.settings-${currentNavItem}`).classList.add('tab-visible');
});

buttonToggleLang.addEventListener('click', (event) => {
  let li = event.target.closest('li');
  li.classList.toggle('on');

  if (state.language === 'ru') {
    languageText.textContent = 'English';
    state.language = 'en';
    lang = 'en';
  } else {
    languageText.textContent = 'Русский';
    state.language = 'ru';
    lang = 'ru';
  }
  getWeather();
  getQuotes(`assets/json/quotes-${lang}.json`);
});


imageSourceSelect.addEventListener('change', (event) => {
  let photoSource = event.target.value;

  state.photoSource = photoSource;
  customTag = (customSlideTag.value !== '') 
  ? customSlideTag.value
  : '';
  
  getLinkToImage();
});


buttonSubmitBgChange.addEventListener('click', (event) => {
  event.preventDefault();
  
  customTag = (customSlideTag.value !== '') 
  ? customSlideTag.value
  : '';

  getLinkToImage();
});

function showTime() {
  const time = document.querySelector('.time');
  const date = new Date();
  const greeting = document.querySelector('.greeting-text');

  time.textContent = date.toLocaleTimeString(lang);
  showDate();
  greeting.textContent = getGreeting(getHours());
  setTimeout(showTime, 1000);
}

function showDate() {
  const dateTag = document.querySelector('.date');
  const dateOptions = {
    weekday: 'long',
    month: 'long',
    day: 'numeric', 
  };

  const date = new Date();
  dateTag.textContent = date.toLocaleDateString(lang, dateOptions);
}

function getHours() {
  const date = new Date();

  return date.getHours();
}

function getTimeOfDay() {
  const tods = ['night', 'morning', 'afternoon', 'evening'];
  let hour = getHours();
 
  return tods[Math.floor(hour / 6)];
}

function getGreeting(hour) {
  let greetings;

  if (lang === 'ru') {
    greetings = ['Доброй ночи', 'Доброе утро', 'Добрый день', 'Добрый вечер'];
  } else if (lang === 'en') {
    greetings = ['Good night', 'Good morning', 'Good afternoon', 'Good evening'];
  }

  return greetings[Math.floor(hour / 6)];
}

function setLocalStorage() {
  localStorage.setItem('name', name.value);
  localStorage.setItem('city', city.value);
  localStorage.setItem('state', JSON.stringify(state));
}

function getLocalStorage() {
  if(localStorage.getItem('name')) {
    name.value = localStorage.getItem('name');
  }

  if(localStorage.getItem('city')) {
    city.value = localStorage.getItem('city');
  }

  if(localStorage.getItem('state')) {
    state = JSON.parse(localStorage.getItem('state'));
  }
}

function getRandomNum(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setBg(url) {
  const img = new Image();

  img.src = url;
  img.onload = () => {      
    body.style.backgroundImage = `url(${img.src})`;
    settingsSliderInfoAlert.textContent = '';
  }; 
}

async function getLinkToImage() {
  let timeOfDay = getTimeOfDay();
  
  let bgNum = String(randomNum).padStart(2, '0');
  let imgLink = '', imgUrl = '';
  let res, data;

  switch (state.photoSource) {
    case 'github':
      imgUrl = `https://github.com/deepydee/stage1-tasks/raw/assets/images/${timeOfDay}/${bgNum}.jpg`;
      settingsSliderInfoAlert.textContent = 'Подключаемся к github...';
      break;
    case 'unsplash':

      if (customTag !== '') {
        timeOfDay = customTag;
      } else {
        timeOfDay = getTimeOfDay();
      }

      imgLink = `https://api.unsplash.com/photos/random?orientation=landscape&query=${timeOfDay}&client_id=${unsplashApiKey}`;

      try {
        settingsSliderInfoAlert.textContent = 'Подключаемся к Unsplash API...';
        res = await fetch(imgLink);
        data = await res.json();
        imgUrl = data.urls.regular;
      } catch (error) {
        settingsSliderInfoAlert.textContent = 'Ошибка подключения к Unsplash API';
      }
      break;
    case 'flickr':

      if (customTag !== '') {
        timeOfDay = customTag;
      } else {
        timeOfDay = getTimeOfDay();
      }

      imgLink = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${flickrApiKey}&tags=${timeOfDay}&extras=url_l&format=json&nojsoncallback=1`;
      try {
        settingsSliderInfoAlert.textContent = 'Подключаемся к Flickr API...';
        res = await fetch(imgLink);
        data = await res.json();
        imgUrl = data.photos.photo[randomNum].url_l;
      } catch (error) {
        settingsSliderInfoAlert.textContent = 'Ошибка подключения к Unsplash API';
      }
      break;
    default:
      imgUrl = `https://github.com/deepydee/stage1-tasks/raw/assets/images/${timeOfDay}/${bgNum}.jpg`;
  }
  setBg(imgUrl);
 }

function getSlideNext() {
  randomNum++;
  randomNum = randomNum === 21 ? 1 : randomNum;
  getLinkToImage();
}

function getSlidePrev() {
  randomNum--;
  randomNum = randomNum === 0 ? 20 : randomNum;
  getLinkToImage();
}

async function getWeather() {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=${lang}&appid=bf40592ccd1eba31b075bb9d4bfbf7c7&units=metric`;
    const res = await fetch(url);
    const data = await res.json();

    weatherError.textContent = '';
    weatherIcon.className = 'weather-icon owf';
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${Math.round(data.main.temp)} °C`;
    weatherDescription.textContent = data.weather[0].description;
    wind.textContent = `Скорость ветра: ${Math.round(data.wind.speed)} м/с`;
    humidity.textContent = `Влажность: ${Math.round(data.main.humidity)}%`;
  } catch (e) {
    weatherIcon.className = '';
    temperature.textContent = '';
    wind.textContent = '';
    humidity.textContent = '';
    weatherDescription.textContent = '';
    weatherError.textContent = `Город ${city.value} не найден ;(`;
  }
}

async function getQuotes(filePath) {  
  const quotes = filePath;
  const res = await fetch(quotes);
  const data = await res.json(); 
  let quoteNum = getRandomNum(0, data.length);

  quote.textContent = data[quoteNum].text;
  author.textContent = data[quoteNum].author;
}

function playAudio() {
  if (isPlay) {
    audio.pause();
    buttonPlay.classList.remove('pause');
    isPlay = false;
  } else {
    audio.src = playList[playNum].src;
    audio.currentTime = 0;
    audio.play();
    buttonPlay.classList.add('pause');
    isPlay = true;
    stylePlayItems();
  }
}

function playNext() {
  if (playNum < playList.length - 1) {
    playNum++;
  } else {
    playNum = 0;
  }
  isPlay = false;
  playAudio();
}

function playPrev() {
  if (playNum > 0) {
    playNum--;
  } else {
    playNum = playList.length - 1;
  }
  isPlay = false;
  playAudio();
}

function makePlayList() {
  playList.forEach(el => {
    const li = document.createElement('li');
    li.classList.add('play-item');
    li.textContent = el.title;
    playListContainer.append(li)
  })
}

function stylePlayItems() {
  let items = [...playListContainer.children];
  items.forEach((item, index) => 
    index === playNum
    ? item.classList.add('item-active')
    : item.classList.remove('item-active')
  );
}

function setState() {
  lang = state.language;
  state.blocks.forEach(
    widget => showWidget(widget)
  );

  [...settingsList.children].forEach(
    (li) => state.blocks.includes(li.dataset.relatedWidget)
    ? li.classList.add('on')
    : li.classList.add('disabled')
  );
  
  if (lang === 'ru') {
    languageText.textContent = 'Русский';
    buttonToggleLang.closest('li').classList.remove('on');
  } else {
    languageText.textContent = 'English';
    buttonToggleLang.closest('li').classList.add('on');
  }
   
  [...imageSourceSelect.children].forEach(
    (option) => option.value === state.photoSource
    ? option.setAttribute('selected', 'selected')
    : option.removeAttribute('selected')
  );
}

function toggleWidget(widgetName) {
  const widget = document.querySelector(`.${widgetName}`);

  widget.classList.toggle('visible');
}

function showWidget(widgetName) {
  const widget = document.querySelector(`.${widgetName}`);

  widget.classList.add('visible');
}