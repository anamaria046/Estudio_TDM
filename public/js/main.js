import { getItems, getItem, createItem, updateItem, deleteItem } from "./services/api.js";
import { renderItems, resetForm, fillForm } from "./ui/ui.js";

const form = document.getElementById("itemForm");
const itemsContainer = document.getElementById("itemsContainer") || document.getElementById("itemsTable");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
let editingId = null;

// Manejo de eventos dentro del contenedor de tarjetas
itemsContainer.addEventListener("click", async (e) => {
    // 1. Clic en botón "Eliminar"
    const deleteBtn = e.target.closest(".btn-delete");
    if (deleteBtn) {
        e.stopPropagation();
        const id = Number(deleteBtn.dataset.id);
        const confirmDelete = confirm("¿Estás seguro de que deseas eliminar este item?");
        if (!confirmDelete) return;

        try {
            await deleteItem(id);
            if (editingId === id) {
                editingId = null;
                resetForm(form, submitBtn, cancelBtn);
            }
            loadItems();
        } catch (err) {
            console.error("Error eliminando:", err);
            alert("No se pudo eliminar el item.");
        }
        return;
    }

    // 2. Clic en botón "Editar" de la tarjeta
    const editBtn = e.target.closest(".btn-edit");
    if (editBtn) {
        e.stopPropagation();
        const id = Number(editBtn.dataset.id);

        try {
            const item = await getItem(id);
            editingId = id;
            fillForm(form, item, submitBtn, cancelBtn);
            loadItems(); // Renderiza la tarjeta en modo edición
        } catch (err) {
            console.error("Error cargando item:", err);
            alert("No se pudo cargar el item para edición.");
        }
        return;
    }

    // 3. Clic en "Cancelar" dentro de la propia tarjeta
    const cancelCardBtn = e.target.closest(".btn-cancel-card");
    if (cancelCardBtn) {
        e.preventDefault();
        editingId = null;
        resetForm(form, submitBtn, cancelBtn);
        loadItems();
        return;
    }
});

// Guardar cambios al enviar el formulario propio de la tarjeta
itemsContainer.addEventListener("submit", async (e) => {
    const cardForm = e.target.closest(".card-edit-form");
    if (!cardForm) return;

    e.preventDefault();
    const id = Number(cardForm.dataset.id);
    const name = cardForm.querySelector(".input-card-name").value.trim();
    const description = cardForm.querySelector(".input-card-description").value.trim();

    if (!name) {
        alert("El campo nombre es obligatorio");
        return;
    }

    try {
        await updateItem(id, { name, description });
        editingId = null;
        resetForm(form, submitBtn, cancelBtn);
        loadItems();
    } catch (err) {
        console.error("Error actualizando desde la tarjeta:", err);
        alert("No se pudo guardar el item.");
    }
});

// Botón "Cancelar" en el formulario superior de index
if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
        editingId = null;
        resetForm(form, submitBtn, cancelBtn);
        loadItems();
    });
}

// Envío del formulario superior de index (Crear nuevo o Guardar cambios)
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = form.querySelector("#name").value.trim();
    const description = form.querySelector("#description").value.trim();

    if (!name) {
        alert("El campo nombre es obligatorio");
        return;
    }

    try {
        if (editingId) {
            await updateItem(editingId, { name, description });
            editingId = null;
        } else {
            await createItem({ name, description });
        }

        resetForm(form, submitBtn, cancelBtn);
        loadItems();
    } catch (err) {
        console.error("Error guardando item:", err);
        alert("No se pudo guardar el item.");
    }
});

// Cargar items desde el servidor
async function loadItems() {
    try {
        const items = await getItems();
        renderItems(items, itemsContainer, editingId);
    } catch (err) {
        console.error("Error cargando lista:", err);
        alert("No se pudieron cargar los items.");
    }
}

loadItems();