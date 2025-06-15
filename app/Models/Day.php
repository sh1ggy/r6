<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Day extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'date',
        'avg',
        'max',
        'low'
    ];

    protected $casts = [
        'date' => 'string',
        'avg' => 'float',
        'max' => 'float',
        'low' => 'float'
    ];

    public function getDateContentString()
    {
        return "Avg: $this->avg, Max: $this->max, Low: $this->low";
    }

    public static function weatherFromJSON($data)
    {
        $dayModels = [];
        foreach ($data['DailyForecasts'] as $forecast) {
            $min = $forecast['Temperature']['Minimum']['Value'];
            $max = $forecast['Temperature']['Maximum']['Value'];
            $avg = ($min + $max) / 2;
            $dayModels[] = new self([
                'date' => $forecast['Date'],
                'avg' => $avg,
                'max' => $max,
                'low' => $min
            ]);
        }

        return $dayModels;
    }
}
