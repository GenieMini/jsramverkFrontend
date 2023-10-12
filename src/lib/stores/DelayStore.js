import { writable } from 'svelte/store';
import { getData, ROUTES } from '../../routes/utils';

export const delays = writable(await getData(ROUTES.DELAYS));

export const map = writable();

export const followCount = writable(0);