<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\ForecastService;
use App\Models\City;

class forecast extends Command
{
    private ForecastService $forecastService;
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'forecast {cities?*}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Displays forecast for cities specified';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        //
        $cities = $this->argument('cities');
        if (count($cities) < 1) {
            $this->fail("No cities, please provide them as an argument of your command.");
        }
        $citiesTable = [];
        foreach ($cities as $city) {
            // $this->comment($city); rm
            $forecast = $this->forecastService->getCurrentForecast($city);
            $citiesTable[] = ['City' => $city, 'Day 1' => $forecast[0]->getDateContentString(), 'Day 2' => $forecast[1]->getDateContentString(), 'Day 3' => $forecast[2]->getDateContentString(), 'Day 4' => $forecast[3]->getDateContentString(), 'Day 5' => $forecast[4]->getDateContentString(),];
        }
        $this->table(
            ["City", "Day 1", "Day 2", "Day 3", "Day 4", "Day 5"],
            $citiesTable
        );
    }

    public function __construct(ForecastService $forecastService)
    {
        parent::__construct();
        $this->forecastService = $forecastService;
    }
}
