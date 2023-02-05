const lang = navigator.language || navigator.languages[0];
const options = {
  weekday: 'long',
  month: 'long',
  day: 'numeric', 
};

function showTime() {
  const time = document.querySelector('.time');
  const date = new Date();

  time.textContent = date.toLocaleTimeString(lang);
  showDate();
  setTimeout(showTime, 1000);
}

function showDate() {
  const dateTag = document.querySelector('.date');
  const date = new Date();

  dateTag.textContent = date.toLocaleDateString(lang, options);
}


showTime();