<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\ForecastService;


class ForecastController extends Controller
{
    //
    public function __invoke(string $city, ForecastService $forecastService) 
    {
        $forecast = $forecastService->getCurrentForecast($city);
        return response()->json($forecast);
    }
}
