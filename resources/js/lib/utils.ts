import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function convertToCelsius(fahrenheit: number) {
    return ((fahrenheit - 32) * 5) / 9;
}
