import { Icon } from '@/components/icon';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { convertToCelsius } from '@/lib/utils';
import { Head } from '@inertiajs/react';
import { MapPin, Thermometer } from 'lucide-react';
import { useState } from 'react';

interface Forecast {
    date: Date;
    avg: number;
    max: number;
    low: number;
}

export default function Forecast() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [location, setLocation] = useState<string | undefined>(undefined);
    const [forecast, setForecast] = useState<Forecast[]>([]);
    const [err, setErr] = useState<string | undefined>(undefined);
    async function handleChange(e: string) {
        setErr(undefined);
        setLocation(e);
        const result = await fetch(`/api/forecast/${e}`);
        if (!result.ok) {
            const errMsg = (await result.json()).message;
            setErr(errMsg ?? 'There has been an error.');
            setForecast([]);
            return;
        }
        if (!result) return;
        setForecast(await result.json());
    }

    return (
        <>
            <Head title="Forecast">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <main>
                <div className="flex flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:min-h-screen lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                    <Card className="flex w-full lg:max-w-6xl">
                        <CardHeader>
                            <h1 className="mb-4 text-5xl">R6 5 Day Weather Forecasts</h1>
                        </CardHeader>
                        <CardContent>
                            <DropdownMenu>
                                <DropdownMenuTrigger
                                    value={location}
                                    className={`${(forecast.length > 0 || err !== undefined || isLoading) && 'mb-12'} item-center flex w-42 gap-2 rounded-xl p-2 dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]`}
                                >
                                    <Icon iconNode={MapPin} className="h-6" />
                                    <p>{location ?? 'Pick a Location'}</p>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>Cities</DropdownMenuLabel>

                                    <DropdownMenuRadioGroup
                                        value={location}
                                        onValueChange={async (e) => {
                                            setIsLoading(true);
                                            await handleChange(e).finally(() => setIsLoading(false));
                                        }}
                                    >
                                        <DropdownMenuRadioItem value="Brisbane">Brisbane</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="Gold Coast">Gold Coast</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="Sunshine Coast">Sunshine Coast</DropdownMenuRadioItem>
                                    </DropdownMenuRadioGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <div className="flex flex-wrap gap-5">
                                {err && <p className="text-red-500">{err}</p>}
                                {isLoading ? (
                                    <p className="animate-pulse">Loading...</p>
                                ) : (
                                    <>
                                        {forecast &&
                                            forecast.length > 0 &&
                                            forecast.map((f: Forecast) => {
                                                const convertedForecast: Forecast = {
                                                    ...f,
                                                    avg: convertToCelsius(f.avg),
                                                    max: convertToCelsius(f.max),
                                                    low: convertToCelsius(f.low),
                                                };
                                                const { avg, max, low } = convertedForecast;
                                                const forecastDate: Date = new Date(f.date);
                                                let forecastString = forecastDate.toLocaleDateString();
                                                const today = new Date();
                                                const tomorrow = new Date();
                                                const yesterday = new Date();
                                                tomorrow.setDate(today.getDate() + 1);
                                                yesterday.setDate(today.getDate() - 1);
                                                if (forecastDate.getDate() === today.getDate()) {
                                                    forecastString = 'Today';
                                                } else if (forecastDate.getDate() === tomorrow.getDate()) {
                                                    forecastString = 'Tomorrow';
                                                } else if (forecastDate.getDate() === yesterday.getDate()) {
                                                    // 12AM edge case 🗣️🤓
                                                    forecastString = 'Yesterday';
                                                }
                                                return (
                                                    <Card key={f.date.toString()} className="w-48">
                                                        <CardHeader>
                                                            <h1 className="mb-4 text-xl font-extrabold">{forecastString}</h1>
                                                        </CardHeader>
                                                        <CardContent className="flex flex-col gap-6 text-lg font-bold">
                                                            <div className="flex">
                                                                <Thermometer className="h-6" />
                                                                {`${avg.toFixed(1)}°C`}
                                                            </div>
                                                            <Separator />
                                                            <div className="flex gap-2">
                                                                <p className="text-red-300">{`${low.toFixed(1)}°C`}</p>
                                                                {' - '}
                                                                <p className="text-blue-300">{`${max.toFixed(1)}°C`}</p>
                                                            </div>
                                                        </CardContent>
                                                        <CardFooter></CardFooter>
                                                    </Card>
                                                );
                                            })}
                                    </>
                                )}
                            </div>
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
