import { writable } from 'svelte/store';

const createMenu = () => {
  const { subscribe, set, update } = writable(false);
  return { subscribe, toggle: () => update((isOpen) => !isOpen) };
};

export const menu = createMenu();