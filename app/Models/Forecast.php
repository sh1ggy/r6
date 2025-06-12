<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Forecast extends Model
{
    protected $fillable = [
        'headline',
        'daily_forecasts'
    ];

    protected $casts = [
        'headline' => 'array',
        'daily_forecasts' => 'array',
    ];
}
