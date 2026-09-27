import { Router } from "express";
import { getAllItems, findItem, insertItem, modifyItem, removeItem } from "../db/db.js";

const router = Router();

router.param("id", (req, res, next, value) => {
    const id = Number(value);
    if (!Number.isInteger(id)) {
        return res.status(400).json({ error: "id is not a number" });
    }
    req.itemId = id;
    next();
});

// GET /api/items
router.get("/", (req, res) => {
    res.json(getAllItems());
});

// GET /api/items/:id
router.get("/:id", (req, res) => {
    const item = findItem(req.itemId);
    if (!item) return res.status(404).json({ error: "Item not found" });
    res.json(item);
});

// POST /api/items
router.post("/", async (req, res) => {
    const { name, description } = req.body ?? {};
    if (!name || !name.trim()) {
        return res.status(400).json({ error: "Field 'name' is obligatory" });
    }

    const nuevo = await insertItem({ name: name.trim(), description: description?.trim() });
    res.status(201).json(nuevo);
});

// PUT /api/items/:id
router.put("/:id", async (req, res) => {
    const { name, description } = req.body ?? {};
    if (name !== undefined && !name.trim()) {
        return res.status(400).json({ error: "Field 'name' cannot be empty" });
    }

    const changes = {};
    if (name !== undefined) changes.name = name.trim();
    if (description !== undefined) changes.description = description.trim();

    const actualizado = await modifyItem(req.itemId, changes);

    if (!actualizado) return res.status(404).json({ error: "Item not found" });
    res.json(actualizado);
});

// DELETE /api/items/:id
router.delete("/:id", async (req, res) => {
    const eliminado = await removeItem(req.itemId);
    if (!eliminado) return res.status(404).json({ error: "Item not found" });
    res.status(200).json({ mensaje: "Item removed", id: req.itemId });
});

export default router;
