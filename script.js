"use strict";

const cities = [
  ["Islamabad", "Islamabad Capital Territory", "Federal capital", 33.6844, 73.0479],
  ["Karachi", "Sindh", "Provincial capital", 24.8607, 67.0011],
  ["Lahore", "Punjab", "Provincial capital", 31.5204, 74.3587],
  ["Peshawar", "Khyber Pakhtunkhwa", "Provincial capital", 34.0151, 71.5249],
  ["Quetta", "Balochistan", "Provincial capital", 30.1798, 66.9750],
  ["Gilgit", "Gilgit-Baltistan", "Administrative capital", 35.9208, 74.3144],
  ["Muzaffarabad", "Azad Jammu and Kashmir", "Administrative capital", 34.3700, 73.4711],
  ["Rawalpindi", "Punjab", "Metropolitan city", 33.5651, 73.0169],
  ["Faisalabad", "Punjab", "Industrial city", 31.4504, 73.1350],
  ["Multan", "Punjab", "Historic city", 30.1575, 71.5249],
  ["Gujranwala", "Punjab", "Industrial city", 32.1877, 74.1945],
  ["Sialkot", "Punjab", "Industrial city", 32.4945, 74.5229],
  ["Bahawalpur", "Punjab", "Historic city", 29.3956, 71.6836],
  ["Sargodha", "Punjab", "Regional city", 32.0740, 72.6861],
  ["Hyderabad", "Sindh", "Regional city", 25.3960, 68.3578],
  ["Sukkur", "Sindh", "Regional city", 27.7244, 68.8228],
  ["Larkana", "Sindh", "Historic city", 27.5590, 68.2120],
  ["Abbottabad", "Khyber Pakhtunkhwa", "Hill city", 34.1688, 73.2215],
  ["Mardan", "Khyber Pakhtunkhwa", "Regional city", 34.1989, 72.0231],
  ["Skardu", "Gilgit-Baltistan", "Mountain city", 35.2971, 75.6333]
];

const stations = [
  ["Islamabad Zero Point", 27, 68, 33.7008, 73.0651], ["Karachi Airport", 31, 12, 24.9065, 67.1608],
  ["Lahore Airport", 29, 54, 31.5216, 74.4036], ["Peshawar Station", 28, 42, 34.0081, 71.5785],
  ["Quetta Airport", 21, 18, 30.2514, 66.9378], ["Gilgit Station", 19, 24, 35.9187, 74.3336],
  ["Muzaffarabad Station", 25, 76, 34.3551, 73.4769], ["Chaklala Station", 27, 65, 33.6167, 73.0992],
  ["Faisalabad Station", 30, 31, 31.4187, 73.0791], ["Multan Airport", 33, 15, 30.2032, 71.4191],
  ["Sialkot Airport", 28, 49, 32.5356, 74.3639], ["Bahawalpur Airport", 34, 9, 29.3481, 71.7180],
  ["Hyderabad Airport", 32, 11, 25.3181, 68.3661], ["Sukkur Airport", 35, 7, 27.7219, 68.7917],
  ["Jacobabad Station", 36, 5, 28.2819, 68.4376], ["Nawabshah Station", 34, 8, 26.2442, 68.4100],
  ["Abbottabad Station", 23, 83, 34.1463, 73.2117], ["Mardan Station", 27, 47, 34.1954, 72.0447],
  ["Dalbandin Station", 29, 3, 28.8783, 64.3998], ["Skardu Airport", 15, 20, 35.3355, 75.5360]
];

const map = L.map("map", {center: [30.6, 69.4], zoom: 5, minZoom: 4, maxZoom: 18, zoomControl: false});
L.control.zoom({position: "bottomright"}).addTo(map);

const osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19, attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);
const satellite = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
  maxZoom: 19, attribution: "Tiles &copy; Esri"
});

const cityIcon = L.divIcon({className: "city-marker", iconSize: [18, 18], iconAnchor: [9, 9], popupAnchor: [0, -10]});
const weatherIcon = L.divIcon({className: "weather-marker", iconSize: [20, 20], iconAnchor: [10, 10], popupAnchor: [0, -11]});
const cityLayer = L.layerGroup();
const weatherLayer = L.layerGroup();

cities.forEach(([name, province, type, lat, lng]) => {
  L.marker([lat, lng], {icon: cityIcon, title: name, alt: `${name} city`})
    .bindPopup(`<p class="popup-label">City</p><h3 class="popup-title">${name}</h3><dl class="popup-grid"><dt>Province / area</dt><dd>${province}</dd><dt>Type</dt><dd>${type}</dd></dl>`)
    .addTo(cityLayer);
});

stations.forEach(([name, temperature, rainfall, lat, lng]) => {
  L.marker([lat, lng], {icon: weatherIcon, title: name, alt: `${name} weather station`})
    .bindPopup(`<p class="popup-label">Weather station</p><h3 class="popup-title">${name}</h3><dl class="popup-grid"><dt>Temperature</dt><dd>${temperature} °C</dd><dt>Rainfall</dt><dd>${rainfall} mm</dd></dl>`)
    .addTo(weatherLayer);
});

cityLayer.addTo(map);
weatherLayer.addTo(map);
L.control.layers({"OpenStreetMap": osm, "Satellite imagery": satellite}, {"Cities": cityLayer, "Weather stations": weatherLayer}, {position: "topright", collapsed: false}).addTo(map);

const status = document.querySelector("#map-status");
function updateStatus(){
  const shown = [];
  if(map.hasLayer(cityLayer)) shown.push(`${cities.length} cities`);
  if(map.hasLayer(weatherLayer)) shown.push(`${stations.length} stations`);
  status.textContent = shown.length ? `Showing ${shown.join(" and ")}` : "All data layers are off";
}
map.on("overlayadd overlayremove", updateStatus);
updateStatus();
document.querySelector("#city-count").textContent = cities.length;
document.querySelector("#station-count").textContent = stations.length;

const root = document.documentElement;
const themeButton = document.querySelector(".theme-toggle");
const savedTheme = localStorage.getItem("pakistan-atlas-theme");
if(savedTheme) root.dataset.theme = savedTheme;
function currentTheme(){return root.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");}
function updateThemeLabel(){themeButton.setAttribute("aria-label", `Switch to ${currentTheme() === "dark" ? "light" : "dark"} mode`);}
themeButton.addEventListener("click", () => {
  const next = currentTheme() === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  localStorage.setItem("pakistan-atlas-theme", next);
  updateThemeLabel();
});
updateThemeLabel();
