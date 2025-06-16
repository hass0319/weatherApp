# Weather Forecast Application

A responsive web application that provides current weather conditions and 24-hour forecasts for any location worldwide. Users can search by city name or use their device's geolocation.

## Features

- **Current Weather Display**: Shows temperature, conditions, wind speed, humidity, and precipitation
- **24-Hour Forecast**: Scrollable hourly temperature and conditions
- **Location Services**: Automatic detection using browser geolocation
- **Responsive Design**: Works on mobile, tablet, and desktop devices
- **Error Handling**: User-friendly error messages for invalid locations
- **Weather Icons**: Visual representation of weather conditions

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript
- **Weather API**: Visual Crossing Weather API
- **Icons**: Bootstrap Icons
- **CSS Features**: Flexbox, Gradients, Media Queries

## Setup Instructions

1. **Get API Key**:

   - Register at [Visual Crossing Weather API](https://www.visualcrossing.com/weather-api)
   - API key in `app.js`:
     ```javascript
     const apiKey = "W54YENYQ46FSDWASHUV2HUYST";
     ```

2. **Run the Application**:
   - Simply open `index.html` in any modern web browser
   - No server required (runs client-side only)

## Usage

1. **Search by City**:

   - Enter a city name in the search field
   - Press Enter or click the submit button

2. **Use Current Location**:

   - Click "Use My Current Location"
   - Grant location permissions when prompted

3. **View Forecast**:
   - Current weather appears immediately
   - Scroll horizontally to view hourly forecast

## File Structure

weather-app/
├── index.html - Main application structure
├── style.css - Styling and responsive layout
├── app.js - Weather data handling and UI logic
├── README.md - Project documentation

## Customization

- **Colors**: Modify CSS variables in `style.css`
- **Layout**: Adjust container sizes in media queries
- **Units**: Change temperature units in `app.js` (line 99)
- **Icons**: Update the `getIcon()` function in `app.js` to use different icon sets

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Edge (latest)
- Safari (latest)

## Known Limitations

- Requires internet connection for API access
- Geolocation requires HTTPS connection (works on localhost)
- API has daily request limits (free tier: 1000 requests/day)
