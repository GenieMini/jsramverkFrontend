import { writable } from 'svelte/store';

export const delays = writable();

export const map = writable();

export const followCount = writable(0);

export const token = writable();