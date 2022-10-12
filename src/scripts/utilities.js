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
********************************************************************/


let currentPage = 1;

const page1 = document.getElementById("page-1");
const page2 = document.getElementById("page-2");
const page3 = document.getElementById("page-3");

const link1 = document.getElementById("page1-link");
const link2 = document.getElementById("page2-link");
const link3 = document.getElementById("page3-link");

const linkPrev = document.getElementById("page-prev-link");
const linkNext = document.getElementById("page-next-link");

let numberOfLocations = 0;
let numberOfSubjects = 0;

window.onload = function() {
  let locations = getCookie('locationsList');
  let subjects = getCookie('subjectsList');

  if (locations === '') {
    console.log(`locations cookie empty, returning`);
  } else {
    let locationsArray = locations.split(",");
    console.log(`cookie contents= ${locations}`);

    let locationsForm = document.getElementById("locationDropdownForm");
    let locationsModalForm = document.getElementById("locationModalForm");

    for (var i = 0; i < locationsForm.length; i++) {
      console.log(`checkbox ${i} = ${locationsForm[i].value}`);
      if (locationsForm[i].value)
      numberOfLocations++;
    }

    let checkedLocations = [];

    for (i = 0; i < locationsArray.length; i++) {
      console.log(`analysing option ${locationsArray[i]}`);
      for (j = 0; j < locationsForm.length; j++) {
        if (locationsForm[j].value == locationsArray[i]) {
          console.log(`input value ${locationsForm[j].value} == ${locationsArray[i]}, checked`);
          locationsForm[j].checked = true;
          locationsModalForm[j-1].checked = true; // no idea why this is the case, will revist
          checkedLocations.push(locationsArray[i]);
        }
      }
    }

    updateLocationBtn(checkedLocations);

    let currentPage = 1;
    page2.style.display = "none";
    page3.style.display = "none";
  }

  if (subjects === '') {
    console.log(`subjects cookie empty, returning`);
  } else {
    let subjectsArray = subjects.split(",");
    console.log(`cookie contents= ${subjects}`);

    let subjectsForm = document.getElementById("subjectDropdownForm");
    let subjectsModalForm = document.getElementById("subjectModalForm");

    for (var i = 0; i < subjectsForm.length; i++) {
      console.log(`checkbox ${i} = ${subjectsForm[i].value}`);
      if (subjectsForm[i].value)
      numberOfSubjects++;
    }

    let checkedSubjects = [];

    for (i = 0; i < subjectsArray.length; i++) {
      console.log(`analysing option ${subjectsArray[i]}`);
      for (j = 0; j < subjectsForm.length; j++) {
        if (subjectsForm[j].value == subjectsArray[i]) {
          console.log(`input value ${subjectsForm[j].value} == ${subjectsArray[i]}, checked`);
          subjectsForm[j].checked = true;
          subjectsModalForm[j-1].checked = true;
          checkedSubjects.push(subjectsArray[i]);
        }
      }
    }

    updateSubjectBtn(checkedSubjects);
  }
  
}

function updateLocationBtn(locationsArray) {
  let dropdownButton = document.getElementById("dropdownMenuLocation");
  let modalButton = document.getElementById("filterModalLocationButton");

  console.log(`CHECKED LOCATIONS = ${locationsArray}`);

  if (locationsArray.length > 1) {
    console.log(`MORE THAN one location, setting button text to = ${locationsArray.length}`);
    dropdownButton.innerHTML = `Location • ${locationsArray.length}`;
    modalButton.innerHTML = `Location • ${locationsArray.length}`;
  } else if (locationsArray.length == 1) {
    console.log(`one location, setting button text to = ${locationsArray[0]}`);
    dropdownButton.innerHTML = `${locationsArray[0]}`;
    modalButton.innerHTML = `${locationsArray[0]}`;
  } else {
    console.log(`other, setting button text to = Location`);
    dropdownButton.innerHTML = `Location`;
    modalButton.innerHTML = `Location`;
  }
}
function updateSubjectBtn(subjectsArray) {
  let dropdownButton = document.getElementById("dropdownMenuSubject");
  let modalButton = document.getElementById("filterModalSubjectButton");

  console.log(`CHECKED SUBJECTS = ${subjectsArray}`);

  if (subjectsArray.length > 1) {
    console.log(`MORE THAN one subject, setting button text to = ${subjectsArray.length}`);
    dropdownButton.innerHTML = `Subject • ${subjectsArray.length}`;
    modalButton.innerHTML = `Subject • ${subjectsArray.length}`;
  } else if (subjectsArray.length == 1) {
    console.log(`one subject, setting button text to = ${subjectsArray[0]}`);
    dropdownButton.innerHTML = `${subjectsArray[0]}`;
    modalButton.innerHTML = `${subjectsArray[0]}`;
  } else {
    console.log(`other, setting button text to = Subject`);
    dropdownButton.innerHTML = `Subject`;
    modalButton.innerHTML = `Subject`;
  }
}

function applyFiltersLocation(locations) {
  let locationsList = [];

  for (var i = 0; i < locations.length; i++) {
    if (locations[i].checked) {
      text = locations[i].value;
      locationsList.push(text);
      console.log(`added location ${text}`);
    }
  }

  console.log(`list of locations= ${locationsList}`);

  let hour = 1/24;
  setCookie('locationsList', locationsList, hour);

  window.location.href = "{{ '/libraries-events-search' | url }}";
}

function applyFiltersSubject(subjects) {
  let subjectsList = [];

  for (var i = 0; i < subjects.length; i++) {
    if (subjects[i].checked) {
      text = subjects[i].value;
      subjectsList.push(text);
      console.log(`added subject ${text}`);
    }
  }

  console.log(`list of subjects= ${subjectsList}`);

  let hour = 1/24;
  setCookie('subjectsList', subjectsList, hour);

  window.location.href = "{{ '/libraries-events-search' | url }}";
}

function clearFiltersLocation() {
  let locationsList = [];

  let hour = 1/24;
  setCookie('locationsList', locationsList, hour);

  window.location.href = "{{ '/libraries-events-search' | url }}";
}
function clearFiltersSubject() {
  let subjectsList = [];

  let hour = 1/24;
  setCookie('subjectsList', subjectsList, hour);

  window.location.href = "{{ '/libraries-events-search' | url }}";
}

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function nextPage() {
  if (currentPage >= 3) return;
  showPage(currentPage + 1);
}

function prevPage() {
  if (currentPage <= 1) return;
  showPage(currentPage - 1);
}

function showPage(pageNum) {
  
  if (pageNum == 1) {
    page1.style.display = "flex";
    page2.style.display = "none";
    page3.style.display = "none";

    link1.classList.add("active");
    link2.classList.remove("active");
    link3.classList.remove("active");

    linkPrev.classList.add("disabled");
    linkPrev.firstElementChild.tabIndex="-1";
    linkNext.classList.remove("disabled");
    linkNext.firstElementChild.tabIndex="0";
    currentPage = 1;

    page1.getElementsByTagName('a')[0].focus();

    page1.scrollIntoView();
  } else if (pageNum == 2) {
    page1.style.display = "none";
    page2.style.display = "flex";
    page3.style.display = "none";

    link1.classList.remove("active");
    link2.classList.add("active");
    link3.classList.remove("active");

    linkPrev.classList.remove("disabled");
    linkPrev.firstElementChild.tabIndex="0";
    linkNext.classList.remove("disabled");
    linkNext.firstElementChild.tabIndex="0";
    currentPage = 2;

    page2.getElementsByTagName('a')[0].focus();

    page2.scrollIntoView();
  } else if (pageNum == 3) {
    page1.style.display = "none";
    page2.style.display = "none";
    page3.style.display = "flex";

    link1.classList.remove("active");
    link2.classList.remove("active");
    link3.classList.add("active");

    linkPrev.classList.remove("disabled");
    linkPrev.firstElementChild.tabIndex="0";
    linkNext.classList.add("disabled");
    linkNext.firstElementChild.tabIndex="-1";
    currentPage = 3;

    page3.getElementsByTagName('a')[0].focus();

    page3.scrollIntoView();
  } else {
    console.log("pagination error");
  }
}