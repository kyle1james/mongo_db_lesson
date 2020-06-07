// hold all your user information
// init as None
// Have students clean up code by using this obj

const cordObj = {};

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
function success(pos) {
  cordObj.lat = pos.coords.latitude.toFixed(4);
  cordObj.lon = pos.coords.longitude.toFixed(4);
  mapInit();
}
// create map
async function mapInit() {
  // add locate user funcntion geolocation
  const mymap = L.map('map').setView([cordObj.lat, cordObj.lon], 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',

  }).addTo(mymap);
  const url = '/show';
  const data = await fetch(url);
  const locationData = await data.json();
  console.log(locationData);
  // add markers
  for (let idx = 0; idx < locationData.length; idx++) {
    const m = L.marker([parseFloat(locationData[idx].lat), parseFloat(locationData[idx].lon)]).addTo(mymap).bindPopup(locationData[idx].notes).openPopup();
    m._icon.id = locationData[idx]._id;
  }
  L.marker([cordObj.lat, cordObj.lon]).addTo(mymap).bindPopup('You are currently here. Add note below.').openPopup();
  //return mymap;
}

async function addData(event) {
  const note = document.getElementById('note').value;
  console.log(note);
  url = `/location/${cordObj.lat}/${cordObj.lon}/${note}`;
  resp = await fetch(url);
  console.log('done');
}

// add path to edit/del
document.body.addEventListener('click', (evt) => {
  if (evt.target.className === "leaflet-marker-icon leaflet-zoom-animated leaflet-interactive") {
    console.log(evt.target.id);
  }
}, false);


// obj to hold lat/lon
document.getElementById('form-button').addEventListener('click', addData);
