const form = document.getElementById('flightForm');
const resultDiv = document.getElementById('result');

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const flightNumber = document.getElementById('flightNumber').value;

    // Replace with your API endpoint
    const API_URL = `https://opensky-network.org/api/flights?flight=${flightNumber}`;

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Flight not found');

        const flightData = await response.json();
        displayFlightData(flightData);
    } catch (error) {
        resultDiv.innerHTML = `<p>Error: ${error.message}</p>`;
    }
});

function displayFlightData(data) {
    resultDiv.innerHTML = `
        <p>Flight: ${data[0].callsign}</p>
        <p>Location: Lat ${data[0].latitude}, Lon ${data[0].longitude}</p>
    `;
    loadMap(data[0].latitude, data[0].longitude);
}

function loadMap(lat, lon) {
    const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat, lng: lon },
        zoom: 8,
    });
    new google.maps.Marker({ position: { lat, lng: lon }, map });
}
