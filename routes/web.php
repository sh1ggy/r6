<?php

use App\Http\Controllers\ForecastController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/api/forecast/{city}', ForecastController::class);
