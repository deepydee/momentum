const lang = navigator.language || navigator.languages[0];
const options = {
  weekday: 'long',
  month: 'long',
  day: 'numeric', 
};


const body = document.body;
const name = document.querySelector('.name');
const slideNext = document.querySelector('.slide-next');
const slidePrev = document.querySelector('.slide-prev');

let randomNum;

getRandomNum(1, 20);
setBg();
showTime();

window.addEventListener('beforeunload', setLocalStorage);
window.addEventListener('load', getLocalStorage);

slideNext.addEventListener('click', getSlideNext);
slidePrev.addEventListener('click', getSlidePrev);


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
}

function getLocalStorage() {
  if(localStorage.getItem('name')) {
    name.value = localStorage.getItem('name');
  }
}

function getRandomNum(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
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