<?php

namespace App\Services;

use App\Models\Day;
use Illuminate\Support\Facades\Http;
use App\Models\Forecast;
use Exception;
use PhpParser\PrettyPrinter;

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
        $cityResponse = $client->get(
            "{$apiUrl}/locations/v1/cities/search",
            ['q' => $q, 'apikey' => config('app.api_key')],
        );
        if (!$cityResponse->successful()) {
            throw new Exception($cityResponse->json()['Message']);
        }
        $cityResponse = $cityResponse->json();
        echo(json_encode($cityResponse, JSON_PRETTY_PRINT));
        if (!array_key_exists(0, $cityResponse)) {
            throw new Exception("No array");
        }
        $cityResponse = $cityResponse[0];
        if (!array_key_exists('Key', $cityResponse)) {
            throw new Exception("No Key");
        }
        $cityKey = $cityResponse['Key'];
        $dailyForecasts = $client->get(
            "{$apiUrl}/forecasts/v1/daily/5day/{$cityKey}",
            ['apikey' => config('app.api_key')],
        )->json();
        $forecast = Day::weatherFromJSON($dailyForecasts);
        // echo(json_encode($forecast, JSON_PRETTY_PRINT));
        return $forecast;
    }
}
