import path from "node:path";
import { JSONFilePreset } from "lowdb/node";

const DATA_PATH = path.join(import.meta.dirname, "..", "data", "items.json");

const defaultData = { items: [] };

export const db = await JSONFilePreset(DATA_PATH, defaultData);

// Normalizar estructura si items.json era una lista [...] directa
if (Array.isArray(db.data)) {
    db.data = { items: db.data };
    await db.write();
} else if (!db.data || !Array.isArray(db.data.items)) {
    db.data = { items: [] };
    await db.write();
}

export function getAllItems() {
    return db.data.items;
}

export function findItem(id) {
    return db.data.items.find((item) => item.id === id);
}

export async function insertItem({ name, description }) {
    const item = {
        id: Date.now(),
        name,
        description: description ?? ""
    };

    await db.update((data) => data.items.push(item));
    return item;
}

export async function modifyItem(id, changes) {
    const index = db.data.items.findIndex((item) => item.id === id);
    if (index === -1) return null;

    const updated = { ...db.data.items[index], ...changes, id };

    await db.update((data) => {
        data.items[index] = updated;
    });
    return updated;
}

export async function removeItem(id) {
    const index = db.data.items.findIndex((item) => item.id === id);
    if (index === -1) return false;

    await db.update((data) => data.items.splice(index, 1));
    return true;
}