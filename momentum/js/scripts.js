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
const audioPlayerContainer = document.querySelector('.player');
const audio = new Audio();
const buttonPlay = document.querySelector('.play');
const buttonNext = document.querySelector('.play-next');
const buttonPrev = document.querySelector('.play-prev');
const buttonShowPlaylist = document.querySelector('.show-playlist');
const progressBar = document.querySelector('#progress-bar');
const volumeSlider = document.querySelector('#volume-slider');
const volumeOutput = document.querySelector('#volume-output');
const songArtist = document.querySelector('.song-artist'); 
const songTitle = document.querySelector('.song-title');
const buttonMute = document.querySelector('#mute-icon');
let currentTrackTime = 0;
let currentVolume = 0;
let mutestate = 'unmute';
const playListContainer = document.querySelector('.play-list');
const settingsDashboard = document.querySelector('#settings');
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

const todo = document.querySelector('#todo');
const todoToggle = document.querySelector('.todo-toggle');
const activeListContainer = document.querySelector('.active-list-container');
const todoListChooserToggle = document.querySelector('.list-chooser-toggle');
const todoListWrapper = document.querySelector('.todo-list-wrapper');
const todoList = document.querySelector('.todo-list');
const todoNewInput = document.querySelector('#todo-new');
const todoListChooserDropdown = document.querySelector('.list-chooser');

let todoListType = document.querySelector('.todo-list-choice-active').dataset.listId;

let state = {
  language: 'en',
  photoSource: 'github',
  blocks: ['time', 'date','greeting', 'quote', 'weather', 'player', 'todo'],
  todo: 
    {
      inbox: {},
      today: {},
      done: {},
    }
}
let lang = state['language'];
let isPlay = false;
let playNum = 0;
let randomNum = getRandomNum(1, 20);
let customTag = '';

/**
 * Load/Save Settings
 */
window.addEventListener('beforeunload', () => {
  localStorage.clear();
  setLocalStorage();
});

window.addEventListener('DOMContentLoaded', () => {
  getLocalStorage();
  setState();
  getLinkToImage();
  showTime();
  makePlayList();
  getQuotes(`assets/json/quotes-${lang}.json`)

  i18next
    .use(i18nextHttpBackend)
    .use(i18nextBrowserLanguageDetector)
    .init({
      fallbackLng: 'en',
      debug: false,
      ns: ['common', 'errors'],
      defaultNS: 'common',
      backend: {
        loadPath: 'locales/{{lng}}/{{ns}}.json',
        crossDomain: true
      }
    }, function(err, t) {
      updateContent();
    });
});

window.addEventListener('load', () => {
  changeLng(lang);
  getWeather();
});


i18next.on('languageChanged', () => {
  updateContent();
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

songArtist.textContent = playList[0].artist;
songTitle.textContent = playList[0].title;
setInterval(() => {
  if (isPlay) {
    updateProgressValue();
    if (audio.readyState > 0) {
      displayBufferedAmount();
    }
  }
}, 500);
buttonPlay.addEventListener('click', playAudio);
buttonNext.addEventListener('click', playNext);
buttonPrev.addEventListener('click', playPrev);
audio.addEventListener('ended', () => {
    playNext();
});
buttonShowPlaylist.addEventListener('click', togglePlaylist);
progressBar.addEventListener('change', changeProgressBar);
progressBar.addEventListener('input', (event) => {showRangeProgress(event.target)});
volumeSlider.addEventListener('input', (event) => {showRangeProgress(event.target)});

playListContainer.addEventListener('click', function(event) {
  let playItem = event.target.closest('.play-item');
  if (!playItem) return;

  let trackId = playItem.dataset.id;
  playNum = Number(trackId);
  playFromPlaylist();
});

buttonMute.addEventListener('click', mute);

volumeSlider.addEventListener('input', (e) => {
  const value = Number(e.target.value);

  buttonMute.className = value === 0 ? 'mute player-icon':
                         value <= 30 ? 'volume-low player-icon' :
                         value <= 50 ? 'volume-medium player-icon' :
                         'volume-high player-icon';

  volumeOutput.textContent = value;
  audio.volume = value / 100;
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
  changeLng(lang);
  getWeather();
  getQuotes(`assets/json/quotes-${lang}.json`);
});


imageSourceSelect.addEventListener('change', (event) => {
  let photoSource = event.target.value;

  state.photoSource = photoSource;
  customTag = (customSlideTag.value !== '') 
  ? customSlideTag.value
  : '';

  if (event.target.value === 'github') {
    document.querySelector('.app .settings-label').classList.remove('visible');
    buttonSubmitBgChange.classList.remove('visible');
  } else {
    document.querySelector('.app .settings-label').classList.add('visible');
    buttonSubmitBgChange.classList.add('visible');
  }
  
  getLinkToImage();
});


buttonSubmitBgChange.addEventListener('click', (event) => {
  event.preventDefault();
  
  customTag = (customSlideTag.value !== '') 
  ? customSlideTag.value
  : '';

  getLinkToImage();
});

todoToggle.addEventListener('click', () => {
  toggleTodo();
});

todoListChooserToggle.addEventListener('click', () => {
  toggleMainTodoMenu();
});


todoListChooserDropdown.addEventListener('click', function(event) {
  const currentItem = event.target.closest('ul');

  if (!currentItem) return;

  todoListType = currentItem.dataset.listId;
  const activeListName = document.querySelector('.active-list-name');
  let listName = currentItem.querySelector('.list-name').textContent;

  [...todoListChooserDropdown.children].forEach(
    ul => ul.querySelector('li').className = 'todo-list-choice'
  );

  currentItem.querySelector('li').className = 'todo-list-choice-active';
  activeListName.textContent = listName;

  clearTodoList();
  getTodoList(todoListType);

  toggleMainTodoMenu();
});

todoList.addEventListener('click', (event) => {
  const moreButton = event.target.closest('.more');
  let todoListHeight = getComputedStyle(todoList).height;
  
  if (!moreButton) return;

  let todoItemDropdown = moreButton.querySelector('.todo-item-dropdown');

  if (moreButton.classList.contains('active')) {
    moreButton.classList.remove('active');
    moreButton.closest('li').classList.remove('active');

    todoItemDropdown.style.cssText = `
    display: none;
    top: 0px;
    right: 40px;
    bottom: auto;
    opacity: 0;
    height: auto;`;

    todoItemDropdown.firstElementChild.innerHTML = '';

    todoListWrapper.style.cssText = `
    min-height: ${ parseInt(todoListHeight) + 2}px;
    max-height: ${ parseInt(todoListHeight) + 2}px;
  `;
  } else {
    [...document.querySelectorAll('.todo-item-dropdown')].forEach((el) => {
      el.style.cssText = `
      display: none;
      top: 0px;
      right: 40px;
      bottom: auto;
      opacity: 0;
      height: auto;
      `;
      el.firstElementChild.innerHTML = '';
    });
    
    document.querySelector('.todo-item.active')?.classList.remove('active');
    document.querySelector('.more.active')?.classList.remove('active');
   
    moreButton.classList.add('active');
    moreButton.closest('li').classList.add('active');

    todoItemDropdown.style.cssText = `
    display: block;
    top: 0px;
    right: 40px;
    bottom: auto;
    opacity: 1;
    height: auto;
    `;

    todoItemDropdown.firstElementChild.insertAdjacentHTML('afterbegin', addMoreDropdown());

    todoListWrapper.style.cssText = `
    min-height: ${ parseInt(todoListHeight) + 80}px;
    max-height: ${ parseInt(todoListHeight) + 80}px;
  `;

    new MoreMenu(todoItemDropdown.firstElementChild);
  }
});

todoList.addEventListener('click', function(event) {
  let checkbox = event.target.closest('.todo-item-checkbox');
  
  if (!checkbox) return;

  let id = checkbox.closest('li').dataset.todoId;

  if (checkbox.checked) {
    checkbox.closest('li').classList.add('done');

    state.todo['done'][id] = state.todo[todoListType][id];
    delete state.todo[todoListType][id];
  } else {
    checkbox.closest('li').classList.remove('done');
    state.todo[todoListType][id] = state.todo['done'][id];
    delete state.todo['done'][id];
  }

  refreshTodoMainDropdown();
});

class MoreMenu {
  constructor(elem) {
    this._elem = elem;
    elem.onclick = this.onClick.bind(this);
  }

  edit(id) {
    const item = document.querySelector(`[data-todo-id="${id}"] .todo-item-title`);
    let caret = document.createRange();
    let sel = window.getSelection();

    item.setAttribute('contenteditable', true);
    caret.selectNodeContents(item);
    caret.collapse(null);
    sel.removeAllRanges();
    sel.addRange(caret);
    item.focus();

    item.addEventListener('keydown', function(event) {
      if (event.code === 'Enter') {
        saveItemToStorage();
        event.preventDefault();
      }
    });

    item.addEventListener('focusout', saveItemToStorage);

    function saveItemToStorage () {
      let newItemText = item.textContent;
      item.setAttribute('contenteditable', false);
      state.todo[todoListType][id] = newItemText;
    }

  }

  moveInbox(id) {
    state.todo.inbox[id] = state.todo.today[id];
    delete state.todo.today[id];
    clearTodoList();
    setTodoState();
  }

  moveToday(id) {
    state.todo.today[id] = state.todo.inbox[id];
    delete state.todo.inbox[id];
    clearTodoList();
    setTodoState();
  }

  remove(id) {
    delete state.todo[todoListType][id];
    clearTodoList();
    setTodoState();
  }

  onClick(event) {
    let action = event.target.closest('li').dataset.action;

    if (action) {
      let id = event.target.closest('.todo-item').dataset.todoId;
      this[action](id);
    }
  }
}

todoNewInput.addEventListener('change', function(event) {
  let todoItem = this.value;

  if (todoItem) {
    addTodo(uuidv4(), todoItem, false);
    this.value = '';
    clearTodoList();
    setTodoState();
  }

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
    wind.textContent = i18next.t('common:weather.windspeed', {windSpeed: Math.round(data.wind.speed)});
    humidity.textContent = i18next.t('common:weather.humidity', {humidity: Math.round(data.main.humidity)});
  } catch (e) {
    weatherIcon.className = '';
    temperature.textContent = '';
    wind.textContent = '';
    humidity.textContent = '';
    weatherDescription.textContent = '';
    weatherError.textContent = i18next.t('errors:weather.cityNotFound', {city: city.value});
  }
}

async function getQuotes(filePath) {  
  try {
    const quotes = filePath;
    const res = await fetch(quotes);
    const data = await res.json(); 
    let quoteNum = getRandomNum(0, data.length);

    quote.textContent = `"${data[quoteNum].text}"`;
    author.textContent = data[quoteNum].author;
  } catch (e) {
    quote.textContent = `${e.name}: ${e.message}`;
  }
}

function playAudio() {
  if (isPlay) {
    audio.pause();
    buttonPlay.classList.remove('pause');
    document.querySelector('.item-active').classList.remove('item-active');
    isPlay = false;
  } else {
    audio.src = playList[playNum].src;
    songArtist.textContent = playList[playNum].artist;
    songTitle.textContent = playList[playNum].title;
    audio.currentTime = currentTrackTime;
    audio.play();
    buttonPlay.classList.add('pause');
    isPlay = true;
    stylePlayItems();
  }
}

function playFromPlaylist() {
    let prevActiveId = document.querySelector('.item-active')?.dataset.id;
    stylePlayItems();
    let itemActiveId = document.querySelector('.item-active')?.dataset.id;
    
    if (prevActiveId === itemActiveId) {
      audio.pause();
      buttonPlay.classList.remove('pause');
      document.querySelector('.item-active').classList.remove('item-active');
      isPlay = false;
    } else {
      audio.src = playList[playNum].src;
      songArtist.textContent = playList[playNum].artist;
      songTitle.textContent = playList[playNum].title;
      audio.currentTime = 0;
      audio.play();
      buttonPlay.classList.add('pause');
      isPlay = true;
    }
}

function playNext() {
  if (playNum < playList.length - 1) {
    playNum++;
  } else {
    playNum = 0;
  }
  isPlay = false;
  audio.currentTime = 0;
  playAudio();
}

function playPrev() {
  if (playNum > 0) {
    playNum--;
  } else {
    playNum = playList.length - 1;
  }
  isPlay = false;
  audio.currentTime = 0;
  playAudio();
}

function togglePlaylist() {
  buttonShowPlaylist.classList.toggle('hide');
  playListContainer.classList.toggle('visible');

  if (playListContainer.classList.contains('visible')) {
    playListContainer.style.height = "auto";
  } else {
    playListContainer.style.height = "0";
  }
}

function changeProgressBar() {
  currentTrackTime = progressBar.value;
  audio.currentTime = currentTrackTime;
};

function updateProgressValue() {
  progressBar.max = audio.duration;
  progressBar.value = audio.currentTime;

  document.querySelector('.currentTime').innerHTML = (formatTime(Math.floor(audio.currentTime)));
  if (document.querySelector('.durationTime').innerHTML === "NaN:NaN") {
      document.querySelector('.durationTime').innerHTML = "0:00";
  } else {
      document.querySelector('.durationTime').innerHTML = (formatTime(Math.floor(audio.duration)));
  }
};

function formatTime(seconds) {
  let min = Math.floor((seconds / 60));
  let sec = Math.floor(seconds - (min * 60));
  if (sec < 10){ 
      sec  = `0${sec}`;
  };
  return `${min}:${sec}`;
};

function mute() {
  if (mutestate === 'unmute') {
    mutestate = 'mute';
    this.classList.remove('volume-high');
    this.classList.add('mute');
    currentVolume = volumeSlider.value;
    volumeSlider.value = 0;
    audio.muted = true;
  } else {
    mutestate = 'unmute';
    this.classList.remove('mute');
    this.classList.add('volume-high');
    volumeSlider.value = currentVolume;
    audio.muted = false;
    audio.volume = currentVolume / 100;
  }
}

const showRangeProgress = (rangeInput) => {
  if (rangeInput === progressBar) {
    audioPlayerContainer.style.setProperty(
      '--seek-before-width',
      rangeInput.value / rangeInput.max * 100 + '%'
    );
  } else if (rangeInput === volumeSlider) {
    audioPlayerContainer.style.setProperty(
      '--volume-before-width',
      rangeInput.value / rangeInput.max * 100 + '%'
    );
  }
}

const displayBufferedAmount = () => {
  const bufferedAmount = 
Math.floor(audio.buffered.end(audio.buffered.length - 1));
  audioPlayerContainer.style.setProperty('--buffered-width',
`${(bufferedAmount / progressBar.max) * 100}%`);
}

function makePlayList() {
  playList.forEach((el, index) => {
    const li = document.createElement('li');
    li.classList.add('play-item');
    li.dataset.id = index;
    li.textContent = `${el.artist} - ${el.title} (${el.duration})`;
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
  setTodoState();
}

function toggleWidget(widgetName) {
  const widget = document.querySelector(`.${widgetName}`);

  widget.classList.toggle('visible');
}

function showWidget(widgetName) {
  const widget = document.querySelector(`.${widgetName}`);

  widget.classList.add('visible');
}

function toggleTodo() {
  todo.classList.toggle('show-fade-in');
  todo.classList.toggle('show');
}

function toggleMainTodoMenu() {
  let todoListHeight = getComputedStyle(todoList).height;

  activeListContainer.classList.toggle('active');
  
  if (activeListContainer.classList.contains('active')) {
    todoListWrapper.style.cssText = `
      min-height: ${ parseInt(todoListHeight) + 80}px;
      max-height: auto;
    `;
  } else {
    todoListWrapper.style.cssText = `
      min-height: ${ parseInt(todoListHeight) + 2}px;
      max-height: auto;
    `;
  }
}

function addTodo(id, title, done = false) {
  let item = document.createElement('li');

  item.className = done ?
    "todo-item done visible" :
    "todo-item visible";

  item.setAttribute('data-todo-id', id);
  item.setAttribute('draggable', 'true');

  item.innerHTML = `
  <span class="todo-item-wrapper has-more">
    <label><input class="todo-item-checkbox" type="checkbox"></label>
    <span class="todo-item-title">${title}</span>
    <div class="more">
      <div class="icon-wrapper more-toggle">
        <svg class="icon icon-ellipsis more-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><path d="M8 22c-4.411 0-8 3.589-8 8s3.589 8 8 8 8-3.589 8-8-3.589-8-8-8zM52 22c-4.411 0-8 3.589-8 8s3.589 8 8 8 8-3.589 8-8-3.589-8-8-8zM30 22c-4.411 0-8 3.589-8 8s3.589 8 8 8 8-3.589 8-8-3.589-8-8-8z"></path>
        </svg>
      </div>
      <div class="dropdown todo-item-dropdown">
        <ul class="dropdown-list">
        </ul>
      </div>
    </div>
  </span>
  `;

  todoList.append(item);

  if (!Object.keys(state.todo[todoListType]).includes(id)) {
    state.todo[todoListType][id] = title;
  }
}

function addMoreDropdown() {
  let html = `
    <li class="dropdown-list-item" data-action="edit">
       <span class="dropdown-list-label">${i18next.t('todo.itemOptions.edit', {ns: 'common'})}</span>
    </li>`;
    
    if (todoListType === 'inbox') {
      html += `<li class="dropdown-list-item" data-action="moveToday">
      <span class="dropdown-list-label">${i18next.t('todo.itemOptions.moveToToday', {ns: 'common'})}</span>
    </li>`;
    } else if (todoListType === 'today') {
      html += `<li class="dropdown-list-item" data-action="moveInbox">
      <span class="dropdown-list-label">${i18next.t('todo.itemOptions.moveToInbox', {ns: 'common'})}</span>
      </li>`;
    }
    
    html += `<li class="dropdown-list-item" data-action="remove">
      <span class="dropdown-list-label">${i18next.t('todo.itemOptions.delete', {ns: 'common'})}</span>
    </li>`;

    return html;
}

function setTodoState() {
  if (state.todo) {

    [...todoListChooserDropdown.children].forEach(
      ul => {
        let li = ul.querySelector('li');
        let todoCount = li.querySelector('.todo-count');
        let count = Object.keys(state.todo[li.dataset.listId]).length;
        todoCount.textContent = count;

        if (li.classList.contains('todo-list-choice-active')) {
          getTodoList(li.dataset.listId); 
        }
      }
    );
  }
}

function refreshTodoMainDropdown() {
  if (state.todo) {

    [...todoListChooserDropdown.children].forEach(
      ul => {
        let li = ul.querySelector('li');
        let todoCount = li.querySelector('.todo-count');
        let count = Object.keys(state.todo[li.dataset.listId]).length;
        todoCount.textContent = count;
      }
    );
  }
}

function getTodoList(listId) {
  if (Object.keys(state.todo[listId]).length > 0) {
    for (let key in state.todo[listId]) {
      addTodo(key, state.todo[listId][key], listId === 'done');
    }
  }
}

function clearTodoList() {
  todoList.innerHTML = '';
}

function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

function updateContent() {
  name.placeholder = i18next.t('name.placeholder', {ns: 'common'});
  city.placeholder = i18next.t('weather.city.placeholder');

  document.querySelector('[data-navitem="general"]').textContent = i18next.t('settings.mainMenu.general', {ns: 'common'});
  document.querySelector('[data-navitem="background"]').textContent = i18next.t('settings.mainMenu.slider', {ns: 'common'});
  document.querySelector('#settings-general h3').textContent = i18next.t('settings.main.settingsHeader', {ns: 'common'});
  document.querySelector('#settings-general .description').textContent = i18next.t('settings.main.description', {ns: 'common'});
  document.querySelector('#settings-general h4:first-of-type').textContent = i18next.t('settings.main.languageHeader', {ns: 'common'});
  document.querySelector('#settings-general .first').textContent = i18next.t('settings.main.widgets.header', {ns: 'common'});
  document.querySelector('[data-related-widget="time"] .setting-name').textContent = i18next.t('settings.main.widgets.time', {ns: 'common'});
  document.querySelector('[data-related-widget="date"] .setting-name').textContent = i18next.t('settings.main.widgets.date', {ns: 'common'});
  document.querySelector('[data-related-widget="greeting"] .setting-name').textContent = i18next.t('settings.main.widgets.greeting', {ns: 'common'});
  document.querySelector('[data-related-widget="player"] .setting-name').textContent = i18next.t('settings.main.widgets.audioplayer', {ns: 'common'});
  document.querySelector('[data-related-widget="weather"] .setting-name').textContent = i18next.t('settings.main.widgets.weather', {ns: 'common'});
  document.querySelector('[data-related-widget="quote"] .setting-name').textContent = i18next.t('settings.main.widgets.quote', {ns: 'common'});
  document.querySelector('[data-related-widget="todo"] .setting-name').textContent = i18next.t('settings.main.widgets.todo', {ns: 'common'});

  document.querySelector('.todo-toggle').textContent = i18next.t('todo.header', {ns: 'common'});
  document.querySelector('li[data-list-id="inbox"] .list-name').textContent = i18next.t('todo.mainOptions.inbox', {ns: 'common'});
  document.querySelector('li[data-list-id="today"] .list-name').textContent = i18next.t('todo.mainOptions.today', {ns: 'common'});
  document.querySelector('li[data-list-id="done"] .list-name').textContent = i18next.t('todo.mainOptions.done', {ns: 'common'});

  document.querySelector('.active-list-name').textContent = document.querySelector('.todo-list-choice-active .list-name').textContent;
  document.querySelector('#todo-new').placeholder = i18next.t('todo.tasks.newTodo', {ns: 'common'});
}

function changeLng(lng) {
  i18next.changeLanguage(lng);
}


const crosscheckMessage = `
  1. Часы и календарь +15
   [x] время выводится в 24-часовом формате +5
   [x] время обновляется каждую секунду - часы идут +5
   [x] выводится день недели, число, месяц +5

  2. Приветствие +10
   [x] текст приветствия меняется в зависимости от времени суток (утро, день, вечер, ночь) +5
   [x] пользователь может ввести своё имя +5

  3. Смена фонового изображения +20
   [x] ссылка на фоновое изображение формируется с учётом времени суток и случайного номера изображения +5
   [x] изображения перелистываются последовательно +5
   [x] изображения перелистываются по кругу: +5
   [x] при смене слайдов важно обеспечить плавную смену фоновых изображений +5

  4. Виджет погоды +15
   [x] при перезагрузке страницы приложения указанный пользователем город сохраняется +5
   [x] данные о погоде включают в себя: иконку погоды, описание погоды, температуру в °C, скорость ветра в м/с, относительную влажность воздуха +5
   [x] выводится уведомление об ошибке при вводе некорректных значений +5

  5. Виджет цитата дня +10
   [x] при загрузке страницы приложения отображается рандомная цитата и её автор +5
   [x] при перезагрузке страницы цитата обновляется +5

  6. Аудиоплеер +15
   [x] при клике по кнопке Play/Pause проигрывается первый трек из блока play-list, иконка кнопки меняется на Pause +3
   [x] при клике по кнопке Play/Pause во время проигрывания трека, останавливается проигрывание трека, иконка кнопки меняется на Play +3
   [x] треки пролистываются по кругу +3
   [x] трек, который в данный момент проигрывается, в блоке Play-list выделяется стилем +3
   [x] после окончания проигрывания первого трека, автоматически запускается проигрывание следующего +3

  7. Продвинутый аудиоплеер +20
   [x] добавлен прогресс-бар в котором отображается прогресс проигрывания +3
   [x] при перемещении ползунка прогресс-бара меняется текущее время воспроизведения трека +3
   [x] над прогресс-баром отображается название трека +3
   [x] есть кнопка звука при клике по которой можно включить/отключить звук +2
   [x] добавлен регулятор громкости, при перемещении ползунка регулятора громкости меняется громкость проигрывания звука +3
   [x] можно запустить и остановить проигрывания трека кликом по кнопке Play/Pause рядом с ним в плейлисте +3

  8. Перевод приложения на два языка (en/ru или en/be) +15
   [x] переводится язык и меняется формат отображения даты +3
   [x] переводится приветствие и placeholder +3
   [x] переводится прогноз погоды в т.ч описание погоды и город по умолчанию +3
   [x] переводится цитата дня +3
   [x] переводятся настройки приложения. При переключении языка приложения в настройках, язык настроек тоже меняется +3

  9. Получение фонового изображения от API +10
   [x] в качестве источника изображений может использоваться Unsplash API +5
   [x] в качестве источника изображений может использоваться Flickr API +5

  10. Настройки приложения +20
   [x] в настройках приложения можно указать язык приложения (en/ru или en/be) +3
   [x] в настройках приложения можно указать источник получения фото для фонового изображения: коллекция изображений GitHub, Unsplash API, Flickr API +3
   [x] если источником получения фото указан API, в настройках приложения можно указать тег/теги, для которых API будет присылает фото +3
   [x] в настройках приложения можно скрыть/отобразить любой из блоков, которые находятся на странице +3
   [x] скрытие и отображение блоков происходит плавно, не влияя на другие элементы, которые находятся на странице, или плавно смещая их +3
   [x] настройки приложения сохраняются при перезагрузке страницы +5

  11. Дополнительный функционал на выбор +10
   [x] ToDo List - список дел (как в оригинальном приложении) +10
`;

// console.log(crosscheckMessage);