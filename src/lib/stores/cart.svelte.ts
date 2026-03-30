import { browser } from '$app/environment';
import type { CartItem } from '$lib/types';

const STORAGE_KEY = 'ecommerce-cart';
const SHIPPING_THRESHOLD = 50;
const SHIPPING_FEE = 5;
const MAX_QTY = 99;

function loadFromStorage(): CartItem[] {
	if (!browser) return [];
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		return stored ? JSON.parse(stored) : [];
	} catch {
		return [];
	}
}

function saveToStorage(items: CartItem[]): void {
	if (!browser) return;
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
	} catch {
		// localStorage quota exceeded — data not persisted
	}
}

let items = $state<CartItem[]>(loadFromStorage());
let mounted = $state(false);

if (browser) {
	mounted = true;
}

const subtotal = $derived(items.reduce((sum, item) => sum + item.price * item.quantity, 0));
const shipping = $derived(subtotal > 0 && subtotal <= SHIPPING_THRESHOLD ? SHIPPING_FEE : 0);
const total = $derived(subtotal + shipping);
const count = $derived(items.reduce((sum, item) => sum + item.quantity, 0));
const isEmpty = $derived(items.length === 0);

function persist(): void {
	saveToStorage(items);
}

function addItem(item: Omit<CartItem, 'quantity'>, quantity = 1): void {
	const existing = items.find((i) => i.id === item.id);
	if (existing) {
		existing.quantity = Math.min(existing.quantity + quantity, MAX_QTY);
		items = [...items];
	} else {
		items = [...items, { ...item, quantity: Math.min(quantity, MAX_QTY) }];
	}
	persist();
}

function removeItem(id: string): void {
	items = items.filter((i) => i.id !== id);
	persist();
}

function updateQuantity(id: string, quantity: number): void {
	if (quantity <= 0) {
		removeItem(id);
		return;
	}
	const item = items.find((i) => i.id === id);
	if (item) {
		item.quantity = Math.min(quantity, MAX_QTY);
		items = [...items];
	}
	persist();
}

function clear(): void {
	items = [];
	persist();
}

export const cart = {
	get items() {
		return items;
	},
	get subtotal() {
		return subtotal;
	},
	get shipping() {
		return shipping;
	},
	get total() {
		return total;
	},
	get count() {
		return count;
	},
	get isEmpty() {
		return isEmpty;
	},
	get mounted() {
		return mounted;
	},
	addItem,
	removeItem,
	updateQuantity,
	clear
};
