<?php

namespace App\Services;

use App\Models\Day;
use Illuminate\Support\Facades\Http;
use Exception;
use Illuminate\Support\Facades\Cache;

class ForecastService
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function getCurrentForecast(string $q)
    {
        $client = Http::timeout(30);
        $apiUrl = config('app.api_url');
        // Passing vars through into cache fn closure
        $cityKey = Cache::rememberForever("location-{$q}", function () use ($client, $apiUrl, $q) {
            $cityResponse = $client->get(
                "$apiUrl/locations/v1/cities/search",
                ['q' => $q, 'apikey' => config('app.api_key')],
            );
            // err handling
            if (!$cityResponse->successful()) {
                throw new Exception($cityResponse->json()['Message']);
            }
            $cityResponse = $cityResponse->json();
            if (!array_key_exists(0, $cityResponse)) {
                throw new Exception("No cities listed under the name: $q");
            }
            $cityResponse = $cityResponse[0];
            if (!array_key_exists('Key', $cityResponse)) {
                throw new Exception("API does not return a key for: $q");
            }
            return $cityResponse['Key'];
        });
        $forecast = Cache::remember("forecast-$cityKey", now()->addMinute(30), function () use ($client, $apiUrl, $cityKey) {
            $forecastResponse = $client->get(
                "$apiUrl/forecasts/v1/daily/5day/$cityKey",
                ['apikey' => config('app.api_key')],
            );
            if (!$forecastResponse->successful()) {
                throw new Exception($forecastResponse->json()['Message']);
            }
            $forecastResponse = $forecastResponse->json();
            return Day::weatherFromJSON($forecastResponse);
        });
        return $forecast;
    }
}
