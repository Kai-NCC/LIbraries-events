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

/********************************************************************
 * CONSTANTS
********************************************************************/



/********************************************************************
 * UTILITIES
********************************************************************/

window.onload = function() {
  console.log('test');
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

/********************************************************************
 * FILTERING
********************************************************************/



/********************************************************************
 * PAGINATION
********************************************************************/

const calculatePageCount = function(events) {

}

const displayEvents = function() {

}

const generatePageLinks = function() {

}

const nextPage = function() {

}

const prevPage = function() {

}

const gotoPage = function(p) {
  
}
