


function showTime() {
  const time = document.querySelector('.time');
  const date = new Date();

  time.textContent = date.toLocaleTimeString();
  showDate();
  setTimeout(showTime, 1000);
}

function showDate() {
  const dateTag = document.querySelector('.date');
  const date = new Date();
  const options = {
    weekday: 'long',
    month: 'long',
    day: 'numeric', 
    timeZone: 'UTC'
  };

  dateTag.textContent = date.toLocaleDateString('en-US', options);
}


showTime();