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

const todo =  document.querySelector('#todo');
const todoToggle = document.querySelector('.todo-toggle');
const activeListContainer = document.querySelector('.active-list-container');
const todoListChooserToggle = document.querySelector('.list-chooser-toggle');
const todoListWrapper = document.querySelector('.todo-list-wrapper');
const todoList = document.querySelector('.todo-list');
const headerDropdown = document.querySelector('.todo-header .dropdown');
const todoNewInput = document.querySelector('#todo-new');
const todoListChooserDropdown = document.querySelector('.list-chooser');
const todoItemTitle = document.querySelector('.todo-item-title');

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

  // console.log(todoItemDropdown.firstElementChild);
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

  quote.textContent = `"${data[quoteNum].text}"`;
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
       <span class="dropdown-list-label">Редактировать</span>
    </li>`;
    
    if (todoListType === 'inbox') {
      html += `<li class="dropdown-list-item" data-action="moveToday">
      <span class="dropdown-list-label">Перенести на сегодня</span>
    </li>`;
    } else if (todoListType === 'today') {
      html += `<li class="dropdown-list-item" data-action="moveInbox">
      <span class="dropdown-list-label">Перенести во входящие</span>
      </li>`;
    }
    
    html += `<li class="dropdown-list-item" data-action="remove">
      <span class="dropdown-list-label">Удалить</span>
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