import playList from './playList.js';

const lang = navigator.language || navigator.languages[0];
const options = {
  weekday: 'long',
  month: 'long',
  day: 'numeric', 
};


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

const quote = document.querySelector('.quote');
const author = document.querySelector('.author');
const changeQuote = document.querySelector('.change-quote');

const audio = new Audio();
const buttonPlay = document.querySelector('.play');
const buttonNext = document.querySelector('.play-next');
const buttonPrev = document.querySelector('.play-prev');

const playListContainer = document.querySelector('.play-list');

let isPlay = false;
let playNum = 0;
let randomNum = getRandomNum(1, 20);

setBg();
showTime();
getQuotes('assets/json/quotes.json');
makePlayList();

window.addEventListener('beforeunload', setLocalStorage);
window.addEventListener('load', getLocalStorage);
window.addEventListener('load', getWeather);



slideNext.addEventListener('click', getSlideNext);
slidePrev.addEventListener('click', getSlidePrev);

city.addEventListener('change', () => {
  getWeather();
});

changeQuote.addEventListener('click', () => {
  getQuotes('assets/json/quotes.json');
});

buttonPlay.addEventListener('click', playAudio);

buttonNext.addEventListener('click', playNext);
buttonPrev.addEventListener('click', playPrev);

audio.addEventListener('ended', () => {
    playNext();
});

function showTime() {
  const time = document.querySelector('.time');
  const date = new Date();

  time.textContent = date.toLocaleTimeString(lang);
  showDate();
  
  const greeting = document.querySelector('.greeting');
  greeting.textContent = getGreeting(getHours());

  setTimeout(showTime, 1000);
}

function showDate() {
  const dateTag = document.querySelector('.date');
  const date = new Date();

  dateTag.textContent = date.toLocaleDateString(lang, options);
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
}

function getLocalStorage() {
  if(localStorage.getItem('name')) {
    name.value = localStorage.getItem('name');
  }

  if(localStorage.getItem('city')) {
    city.value = localStorage.getItem('city');
  }
}

function getRandomNum(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setBg() {
  let timeOfDay = getTimeOfDay();
  let bgNum = String(randomNum).padStart(2, '0');
  const img = new Image();

  img.src = `https://github.com/deepydee/stage1-tasks/raw/assets/images/${timeOfDay}/${bgNum}.jpg`;
  img.onload = () => {      
    body.style.backgroundImage = `url(${img.src})`;
  }; 
}

function getSlideNext() {
  randomNum++;
  randomNum = randomNum === 21 ? 1 : randomNum;
  setBg();
}

function getSlidePrev() {
  randomNum--;
  randomNum = randomNum === 0 ? 20 : randomNum;
  setBg();
}

async function getWeather() {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=${lang}&appid=bf40592ccd1eba31b075bb9d4bfbf7c7&units=metric`;
    const res = await fetch(url);
    const data = await res.json();

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
    weatherDescription.textContent = `Город ${city.value} не найден ;(`;
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
