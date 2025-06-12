<?php

namespace App\Services;

use App\Models\Day;
use Illuminate\Support\Facades\Http;
use App\Models\Forecast;

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
        echo ("GETTING\n");
        $client = Http::timeout(30);
        $apiUrl = config('app.api_url');

        $cityKey = $client->get(
            "{$apiUrl}/locations/v1/cities/search",
            ['q' => $q, 'apikey' => config('app.api_key')],
        )->json()[0]['Key'];

        $dailyForecasts = $client->get(
            "{$apiUrl}/forecasts/v1/daily/5day/{$cityKey}",
            ['apikey' => config('app.api_key')],
        )->json();
        $forecast = Day::weatherFromJSON($dailyForecasts);
        echo ($forecast);
        return $forecast;
    }
}
