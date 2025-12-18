/**
 * Service for fetching real-time weather data
 * Currently using a simulated fetch for demonstration.
 * In production, this would call OpenWeatherMap or similar API.
 */

export interface WeatherData {
    windSpeed: number; // km/h
    windDirection: number; // degrees
    temp: number;
    description: string;
}

export async function fetchRealTimeWeather(lat: number, lon: number): Promise<WeatherData> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // In real implementation:
    // const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=YOUR_API_KEY`);
    // const data = await response.json();

    // Mock data for now (slightly randomized based on lat/lon to feel "real")
    const seed = Math.abs(lat + lon);
    const mockWindSpeed = 5 + (seed % 25);
    const mockWindDir = (seed * 10) % 360;

    return {
        windSpeed: Math.round(mockWindSpeed),
        windDirection: Math.round(mockWindDir),
        temp: 20 + (seed % 15),
        description: "Clear Sky (Simulated)"
    };
}
