<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

// CONTROLLER HERE

class deeznuts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'deeznuts';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        //
        $this->comment('deez nuts');
    }
}
