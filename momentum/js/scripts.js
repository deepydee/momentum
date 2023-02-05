const lang = navigator.language || navigator.languages[0];
const options = {
  weekday: 'long',
  month: 'long',
  day: 'numeric', 
};

showTime();

const name = document.querySelector('.name');

window.addEventListener('beforeunload', setLocalStorage);
window.addEventListener('load', getLocalStorage);


function showTime() {
  const time = document.querySelector('.time');
  const date = new Date();

  time.textContent = date.toLocaleTimeString(lang);
  showDate();
  
  const greeting = document.querySelector('.greeting');
  greeting.textContent = getTimeOfDay(getHours());

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

function getTimeOfDay(hour) {
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