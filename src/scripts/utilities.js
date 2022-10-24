/*** notes on code structure ****************************************
 * 
 * seperate functionality for pagination and filters
 * 
 * have cookie functions in utilities file
 * 
 * filters+search select events - events list passed to pagination function
 * - pagination function presents events and computes number of pages
 * 
 * pagination function must create prev/next/number buttons on demand
 * 
 * number of events (n), maximum number of events per page (e),
 * resulting number of pages (p)
 * 
 * p = ceil(n / e)
 * 
 * 
 * showing events based on page number:
 * 
 * 1 ->  1-6
 * 2 ->  7-12
 * 3 -> 13-18 
 *
********************************************************************/

/********************************************************************
 * CONSTANTS
********************************************************************/

const SEARCH_INPUT = document.querySelector('#libraries-search-input');
const DATE = document.querySelector('#date');

const LOCATION_DROPDOWN = document.getElementsByName('locationOption');
const SUBJECT_DROPDOWN = document.getElementsByName('locationOption');

const RESULTS_WRAPPER = document.querySelector('#page-content');

const SEARCH_INDICATOR = document.querySelector('#search-indicator');
const FILTER_INDICATOR = document.querySelector('#multi-filter-indicator');
const RESULT_NUM_INDICATOR = document.querySelector('#result-number-indicator');

const PAGE_LINKS = document.querySelector('#libraries-pagination-list');
const MAX_EVENTS_PER_PAGE = 6;

const ALL_EVENTS = document.querySelectorAll('.single-event-container');

const FORM = document.querySelector('#main-search-form');
function handleForm(e) {
  e.preventDefault();
} 
FORM.addEventListener('submit', handleForm);

// for filters testing
setCookie('locationSelections', '', 1);

/********************************************************************
 * UTILITIES
********************************************************************/

// using the underscore to distinguish global variables
let _currentPage = 1;
let _numberOfPages = 1;
let _filteredEvents = ALL_EVENTS;

window.onload = function() {
  fillFields();
  refreshResults();
}

const refreshResults = function() {
  _currentPage = 1;
  _filteredEvents = applyFilters();

  console.log(`filtered events=`);
  console.log(_filteredEvents);

  if (_filteredEvents.length === 0) {
    console.log(`No results!`);
    displayEvents(_filteredEvents, _currentPage);
    return;
  }

  calculatePageCount();
  updatePageLinks();

  displayEvents(_filteredEvents, _currentPage);
}


function fillFields() {
  const dateCookie = getCookie('date');
  const searchCookie = getCookie('searchQuery');

  SEARCH_INPUT.value = searchCookie;
  DATE.value = dateCookie;
}

const picker = document.querySelector('duet-date-picker');
const output = document.querySelector('output');

picker.addEventListener('duetChange', function(event) {
  console.log(event.detail.value);
  setCookie('date', event.detail.value, 1);
  refreshResults();
});

const advancedSearchLink = function() {
  // set search query, if any
  const query = SEARCH_INPUT.value;
  if (query)
    setCookie('searchQuery', query, 1);
  else
    setCookie('searchQuery', '', 1);

  const date = DATE.value;
  if (date != '')
    setCookie('date', date, 1);
  else
    setCookie('date', '', 1);

  setCookie('goToFilters', 'yes', 1);
  refreshResults();
}

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = 'expires='+ d.toUTCString();
  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
}

function getCookie(cname) {
  let name = cname + '=';
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

/********************************************************************
 * FILTERING
********************************************************************/


const applyForm = function(filterType, cookie) {
  let dropdown;
  switch (filterType) {
    case ('location'):
      dropdown = LOCATION_DROPDOWN;
    case ('subject'):
      dropdown = SUBJECT_DROPDOWN;
    default:
      dropdown = LOCATION_DROPDOWN;
      // in practice this may never be used.
      // replace with return?
  }

  let items = [];
  dropdown.forEach(function(checkbox) {
    if (checkbox.checked === true) {
      items.push(checkbox.value);
    }
  });
  setCookie(cookie, items, 1);

  refreshResults();
}

const clearForm = function(cookie) {
  setCookie(cookie, '', 1);
  _filteredEvents = applyFilters();
  refreshResults();
  return;
}

const applyFiltersOld = function() {
  const locations = getCookie('locationSelections');
  const filteredEventsLocation = [...ALL_EVENTS].filter(function (e) {
    const s = e.id.split('-');
    const eventNum = s[1];
    const loc = document.querySelector(`#result-${eventNum}-location`);
    return checkLocation(eventNum, locations);
  });
  return filteredEventsLocation;
}

// works, using as demo
const applyFilters = function() {
  const locations = getCookie('locationSelections');
  //const subject = getCookie('subjectSelections');


  const filteredEvents = [...ALL_EVENTS].filter(function (e) {
    const s = e.id.split('-');
    const eventNum = s[1];

    const loc = document.querySelector(`#result-${eventNum}-location`);
    //const subject = document.querySelector(`#result-${eventNum}-subject`);

    let match = false;

    if (checkLocation(eventNum, locations) && checkDate(eventNum, getCookie('date')) && checkSearch(eventNum, getCookie('searchQuery'))) {
      match = true;
    }

    return match;
  });

  console.log('object test:');
  applyFiltersNew();
  
  return filteredEvents;
}

function checkLocation(n, cookie) {
  const locations = cookie.split(","); // [Time & Tide, Cromer]
  if (locations == '') return true;

  const locationEl = document.getElementById(`result-${n}-location`);
  let match = false;
  locations.forEach(function (loc) {
    if (locationEl.textContent.includes(loc)) {
      match = true;
    }
  });
  return match;
}

function checkDate(n, cookie) {
  if (cookie == '') {
    return true;
  }

  // YYYY-MM-DD
  const date = cookie.split("-");

  const dateM = Number(date[1]);
  const dateD = Number(date[2]);

  const monthEl = document.getElementById(`result-${n}-month`);
  const dayEl = document.getElementById(`result-${n}-day`);
  let month = 0;
  let day = +dayEl.textContent; // the '+' converts from a string to a number :)

  switch (monthEl.textContent) {
    case 'January':   month = 1; break;
    case 'February':  month = 2; break;
    case 'March':     month = 3; break;
    case 'April':     month = 4; break;
    case 'May':       month = 5; break;
    case 'June':      month = 6; break;
    case 'July':      month = 7; break;
    case 'August':    month = 8; break;
    case 'September': month = 9; break;
    case 'October':   month = 10; break;
    case 'November':  month = 11; break;
    case 'December':  month = 12; break;
    default: console.error(`invalid month`);
  }

  console.log(`checking date ${dateM}=${month} and ${dateD}=${day}`);

  return (dateM === month && dateD === day);
}

function checkSearch(n, cookie) {
  if (cookie == '')
    return true;
  const typeEl = document.getElementById(`result-${n}-type`);
  const locationEl = document.getElementById(`result-${n}-location`);
  const titleEl = document.getElementById(`result-${n}-title`);
  const descEl = document.getElementById(`result-${n}-desc`);
  let match = false;
  return typeEl.textContent.toLowerCase().includes(cookie.toLowerCase())
      || locationEl.textContent.toLowerCase().includes(cookie.toLowerCase()) 
      || titleEl.textContent.toLowerCase().includes(cookie.toLowerCase())
      || descEl.textContent.toLowerCase().includes(cookie.toLowerCase());
}

/**
 * 
 * 1. store cookie contents as variables
 * 2. for each cookies, store values as array
 * 3. cycle through events list once
 * 
 * for each event {
 *   if event matches every filter {
 *     add to filteredLocations
 *   } else {
 *     hide and skip
 *   }
 * }
 * 
 */

const applyFiltersNew = function() {
  //const locations = getCookie('locationSelections').split(",");
  //const subjects = getCookie('subjectSelections').split(",");

  //const filterList = [locations];
  // filterList is an array of objects, where each object has a "name" and an array of filters
  // eg. locations = {filters: [Norwich, Dereham]}

  const locations = {
    name: 'location',
    filters: getCookie('locationSelections').split(","),
  };

  const filterList = [locations];

  console.log(locations);

  const filteredEvents = [...ALL_EVENTS].filter(function (e) {
    const s = e.id.split('-');
    const eventNum = s[1];

    filterList.forEach(function(f) {
      const value = document.querySelector(`#result-${eventNum}-${f.name}`);
      let match = false;
      console.log(`does ${f.filters} match ${value.textContent}?`);
      f.filters.forEach(function (item) {
        if (value.textContent.includes(item)) {
          console.log(true);
          match = true;
        } else {
          console.log(false);
        }
      });
    });

    /*
    const loc = document.querySelector(`#result-${eventNum}-location`);

    let match = false;

    if (checkLocation(eventNum, locations)) {
      match = true;
    }

    return match;
    */
  });
  //return filteredEvents;
}


/********************************************************************
 * PAGINATION
********************************************************************/

const calculatePageCount = function() {
  const events = _filteredEvents.length;
  const numPages = Math.ceil(events / MAX_EVENTS_PER_PAGE);

  _numberOfPages = numPages;

  console.log(`generating ${numPages} pages`);
  generatePageLinks(numPages);
}

// Determines which results to display based on page number
// Any number greater than 0 valid
const displayEvents = function(events, page) {
  [...ALL_EVENTS].forEach(e => e.style.display = 'none');
  for (i = 0; i < events.length; i++) {
    events[i].style.display = 'none';
    if (i >= (MAX_EVENTS_PER_PAGE * (page - 1)) && i < MAX_EVENTS_PER_PAGE * page) {
      events[i].style.display = 'block';
    }
  }
}

// Takes the relevant number, returns the final element markup for a single link
const generateLink = function(n) {
  const newLink = document.createElement('li');
  newLink.id = `page-${n}-link`;
  newLink.classList.add('page-item');
  newLink.innerHTML = `<button class="page-link" onclick="showPage(${n})">${n}</button>`;
  return newLink;
}

// Iteratively generate the given number of page links
const generatePageLinks = function(pageNum) {

  PAGE_LINKS.innerHTML = '';

  if (pageNum < 2) return;

  PAGE_LINKS.insertAdjacentHTML('beforeend',
  `<li id="page-prev-link" class="page-item disabled">
    <button class="page-link" onclick="prevPage()" tabindex="-1">Previous</button>
  </li>`);

  for (i = 1; i <= pageNum; i++) {
    PAGE_LINKS.appendChild(generateLink(i));
  }

  PAGE_LINKS.insertAdjacentHTML('beforeend',
  `<li id="page-next-link" class="page-item">
    <button class="page-link" onclick="nextPage()">Next</button>
  </li>`);
}

const nextPage = function() {
  _currentPage++;
  displayEvents(_filteredEvents, _currentPage);
  updatePageLinks();
}

const prevPage = function() {
  _currentPage--;
  displayEvents(_filteredEvents, _currentPage);
  updatePageLinks();
}

const showPage = function(p) {
  _currentPage = p;
  displayEvents(_filteredEvents, _currentPage);
  updatePageLinks();
}

const updatePageLinks = function() {

  if (_numberOfPages === 1) return;

  const prevLink = document.querySelector('#page-prev-link');
  const nextLink = document.querySelector('#page-next-link');
  const currentLink = document.querySelector(`#page-${_currentPage}-link`);
  const allLinks = document.querySelectorAll('.page-item');

  if (_currentPage === 1) {
    prevLink.classList.add("disabled");
    prevLink.firstElementChild.tabIndex="-1";
    document.activeElement.blur();
  } else {
    prevLink.classList.remove("disabled");
    prevLink.firstElementChild.tabIndex="0";
  }
  if (_currentPage === _numberOfPages) {
    nextLink.classList.add("disabled");
    nextLink.firstElementChild.tabIndex="-1";
    document.activeElement.blur();
  } else {
    nextLink.classList.remove("disabled");
    nextLink.firstElementChild.tabIndex="0";
  }

  allLinks.forEach(l => l.classList.remove('active'));
  currentLink.classList.add('active');
}
