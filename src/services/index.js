import httpNoAuth from "@/api/no-auth.config";

class WeatherService {
  searchByCity(city) {
    return httpNoAuth.get(`data/2.5/weather?q=${city}`);
  }
}

export default new WeatherService();
