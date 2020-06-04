// function main(e) {
//   e.preventDefault();
//   locationAPIS();
// }

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
  const date = document.getElementById('date');
  const feel = document.getElementById('feel');
  const mymap = mapInit(lat, lon);
  nasaApi(lat, lon);
}
// create map
async function mapInit(lat, lon) {
  const url = '/show';
  const data = await fetch(url);
  const jdata = await data.json();
  console.log(jdata);
  // add locate user funcntion geolocation
  const mymap = L.map('map').setView([lat, lon], 12);
  // api call to mapbox
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',

  }).addTo(mymap);
  for (let idx = 0; idx < jdata.length; idx++) {
    L.marker([parseFloat(jdata[idx].lat), parseFloat(jdata[idx].lon)]).addTo(mymap);
  }
  const marker = L.marker([lat, lon]).addTo(mymap);

  return mymap;
}

// get satellite photo
async function nasaApi(lat, lon) {
  const url = `/space/${lat}/${lon}`;
  const res = await fetch(url);
  const data = await res.json();
  console.log(data);
  document.getElementById('myH1').textContent = `Photo Date ${data.date}`;
  document.getElementById('myImg').src = data.url;
  // document.getElementById('feelings').textContent = feel.value;
}


// document.getElementById('form-button').addEventListener('click', main);
// document.getElementById('show-all').addEventListener('click', map());
