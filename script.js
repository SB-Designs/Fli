// Initialize the map
const map = L.map('map').setView([48.8566, 2.3522], 5); // Centered on Europe

// Add a tile layer (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Fetch flight data from OpenSky API
async function fetchFlightData() {
  const url = 'https://opensky-network.org/api/states/all';

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: 'Basic ' + btoa('username:password') // Replace with your OpenSky credentials
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    updateMap(data.states);
  } catch (error) {
    console.error('Error fetching flight data:', error);
  }
}

// Update the map with plane markers
function updateMap(flights) {
  // Clear all existing markers (optional depending on your use case)
  map.eachLayer(layer => {
    if (layer instanceof L.Marker) {
      map.removeLayer(layer);
    }
  });

  // Add markers for each plane
  flights.forEach(flight => {
    const [icao24, callsign, originCountry, timePosition, lastContact, longitude, latitude, baroAltitude] = flight;

    // Only add markers for flights with valid coordinates
    if (latitude && longitude) {
      L.marker([latitude, longitude])
        .addTo(map)
        .bindPopup(`
          <strong>Callsign:</strong> ${callsign || 'N/A'}<br>
          <strong>Country:</strong> ${originCountry}<br>
          <strong>Altitude:</strong> ${baroAltitude ? baroAltitude.toFixed(0) + ' m' : 'N/A'}
        `);
    }
  });
}

// Fetch data every 10 seconds
setInterval(fetchFlightData, 10000);

// Fetch data on page load
fetchFlightData();
