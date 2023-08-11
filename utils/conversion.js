export function convertToBeaufort(windSpeed) {
    if (windSpeed === 0) {
      return 0;
    } else if (windSpeed >= 1 && windSpeed <= 6) {
      return 1;
    } else if (windSpeed >= 7 && windSpeed <= 11) {
      return 2;
    } else if (windSpeed >= 12 && windSpeed <= 19) {
      return 3;
    } else if (windSpeed >= 20 && windSpeed <= 29) {
      return 4;
    } else if (windSpeed >= 30 && windSpeed <= 39) {
      return 5;
    } else if (windSpeed >= 40 && windSpeed <= 50) {
      return 6;
    } else if (windSpeed >= 51 && windSpeed <= 62) {
      return 7;
    } else if (windSpeed >= 63 && windSpeed <= 75) {
      return 8;
    } else if (windSpeed >= 76 && windSpeed <= 87) {
      return 9;
    } else if (windSpeed >= 88 && windSpeed <= 102) {
      return 10;
    } else if (windSpeed >= 103 && windSpeed <= 117) {
      return 11;
    } else if (windSpeed >= 118) {
      return 12;
    }
    return -1;
  }

  export function convertWeatherCode(weatherCode) {
    const weatherCodes = {
      100: "Clear",
      200: "Partial Clouds",
      300: "Cloudy",
      400: "Light Showers",
      500: "Heavy Showers",
      600: "Rain",
      700: "Snow",
      800: "Thunder",
    };
  
    return weatherCodes[weatherCode] || "Unknown"; 
  }

  export function convertWindDirection(windDirection) {
    const directions = ["North", "North-Northeast", "Northeast", "East-Northeast", "East", "East-Southeast", "Southeast", "South-Southeast", "South", "South-Southwest", "Southwest", "West-Southwest", "West", "West-Northwest", "Northwest", "North-Northwest"];
    const index = Math.round((windDirection % 360) / 22.5);
    return directions[index % 16];
}

export function calculateWindChill(temperature, windSpeed) {
  const windChill = 13.12 + 0.6215 * temperature - 11.37 * Math.pow(windSpeed, 0.16) + 0.3965 * temperature * Math.pow(windSpeed, 0.16);
  return Math.round(windChill * 10) / 10; 
}

  
  

  
  