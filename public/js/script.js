// function main(e) {
//   e.preventDefault();
//   locationAPIS();
// }

// hold all your user information
// init as None
// Have students clean up code by using this obj

let cordObj = {};

(function locationAPIS() {
  if ('geolocation' in navigator) {
    document.getElementById('myH1').textContent = 'Allow Geolocation to run site';
    // call api
    navigator.geolocation.getCurrentPosition(success);
  } else {
    document.getElementById('myH1').textContent = 'Geolocation is not Enabled. Reload and accept to continue';
  }
}());

// success calls map init
async function success(pos) {
  const lat = pos.coords.latitude.toFixed(4);
  const lon = pos.coords.longitude.toFixed(4);
  cordObj.lat = lat;
  cordObj.lon = lon;
  const mymap = mapInit(lat, lon);
}
// create map
async function mapInit(lat, lon) {
  const url = '/show';
  const data = await fetch(url);
  const locationData = await data.json();
  console.log(locationData);
  // add locate user funcntion geolocation
  const mymap = L.map('map').setView([lat, lon], 12);
  // api call to mapbox
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',

  }).addTo(mymap);
  for (let idx = 0; idx < locationData.length; idx++) {
    L.marker([parseFloat(locationData[idx].lat), parseFloat(locationData[idx].lon)]).addTo(mymap).bindPopup(locationData[idx].notes).openPopup();
  }
  //const marker = L.marker([lat, lon]).addTo(mymap).bindPopup('Add a note here in the form below!').openPopup();
  return mymap;
}

async function addData(event) {
  const note = document.getElementById('note').value;
  console.log(note);
  url = `/location/${cordObj.lat}/${cordObj.lon}/${note}`;
  resp = await fetch(url);
  console.log('done');
}

// obj to hold lat/lon
console.log(cordObj);
document.getElementById('form-button').addEventListener('click', addData);
