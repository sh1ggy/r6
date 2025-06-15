import { Icon } from '@/components/icon';
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Head } from '@inertiajs/react';
import { MapPin } from 'lucide-react';
import { useState } from 'react';

interface Forecast {
    date: Date;
    avg: number;
    max: number;
    low: number;
}

export default function Welcome() {
    const [location, setLocation] = useState<string | undefined>(undefined);
    const [forecast, setForecast] = useState<Forecast[]>([]);
    async function handleChange(e: string) {
        setLocation(e);
        const result = (await fetch(`https://r6.test/api/forecast/${e}`)).json();
        console.log(result);
    }

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <main>
                <div className="flex flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:min-h-screen lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                    <Card className="flex w-full lg:max-w-4xl">
                        <CardHeader>
                            <h1 className="mb-4 text-5xl">R6 5 Day Weather Forecasts</h1>
                            <CardDescription></CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DropdownMenu>
                                <DropdownMenuTrigger
                                    value={location}
                                    className="item-center flex w-42 gap-2 rounded-xl p-2 dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]"
                                >
                                    <Icon iconNode={MapPin} className="h-6" />
                                    <p>{location ?? 'Pick a Location'}</p>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>Cities</DropdownMenuLabel>

                                    <DropdownMenuRadioGroup value={location} onValueChange={async (e) => await handleChange(e)}>
                                        <DropdownMenuRadioItem value="Brisbane">Brisbane</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="Gold Coast">Gold Coast</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="Sunshine Coast">Sunshine Coast</DropdownMenuRadioItem>
                                    </DropdownMenuRadioGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            {forecast && forecast.length > 0 && JSON.stringify(forecast)}
                        </CardContent>
                        <CardFooter>
                            <p className="mt-auto mb-2 text-[#706f6c] dark:text-[#A1A09A]">
                                This is a 5 day forecast sourced from the
                                <span>
                                    <a
                                        href="https://laravel.com/docs"
                                        target="_blank"
                                        className="ml-1 inline-flex items-center space-x-1 font-medium text-[#f53003] underline underline-offset-4 dark:text-[#FF4433]"
                                    >
                                        <span>AccuWeather API</span>
                                        <svg
                                            width={10}
                                            height={11}
                                            viewBox="0 0 10 11"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-2.5 w-2.5"
                                        >
                                            <path
                                                d="M7.70833 6.95834V2.79167H3.54167M2.5 8L7.5 3.00001"
                                                stroke="currentColor"
                                                strokeLinecap="square"
                                            />
                                        </svg>
                                    </a>
                                </span>
                            </p>
                        </CardFooter>
                    </Card>
                </div>
            </main>
        </>
    );
}
