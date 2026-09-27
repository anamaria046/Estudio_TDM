function escapeHtml(str) {
    if (!str) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

export function renderItems(items, container, editingId = null) {
    container.innerHTML = "";

    if (!items || items.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>No hay items registrados. ¡Crea el primero usando el formulario de arriba!</p>
            </div>
        `;
        return;
    }

    items.forEach(item => {
        const isEditing = editingId === item.id;
        const card = document.createElement("article");
        card.className = `card card-manage ${isEditing ? "is-editing" : ""}`;
        card.dataset.id = item.id;

        if (isEditing) {
            // Modo edición directo en la tarjeta
            card.innerHTML = `
                <div class="card-content">
                    <div class="card-header">
                        <span class="card-id">#${item.id}</span>
                        <span class="badge-editing">Editando</span>
                    </div>
                    <form class="card-edit-form" data-id="${item.id}">
                        <div class="card-field">
                            <label>Nombre</label>
                            <input type="text" class="input-card-name" value="${escapeHtml(item.name)}" required>
                        </div>
                        <div class="card-field">
                            <label>Descripción</label>
                            <input type="text" class="input-card-description" value="${escapeHtml(item.description || "")}">
                        </div>
                        <div class="card-edit-buttons">
                            <button type="submit" class="btn-save-card">Guardar cambios</button>
                            <button type="button" class="btn-cancel-card" data-id="${item.id}">Cancelar</button>
                        </div>
                    </form>
                </div>
            `;
        } else {
            // Modo vista normal de la tarjeta
            card.innerHTML = `
                <div class="card-content">
                    <div class="card-header">
                        <span class="card-id">#${item.id}</span>
                        <button type="button" class="btn-delete" data-id="${item.id}" title="Eliminar item">
                            ✕ Eliminar
                        </button>
                    </div>
                    <h3>${escapeHtml(item.name)}</h3>
                    <p>${escapeHtml(item.description || "Sin descripción")}</p>
                    <div class="card-actions">
                        <button type="button" class="btn-edit" data-id="${item.id}">
                            ✏️ Editar
                        </button>
                    </div>
                </div>
            `;
        }

        container.appendChild(card);
    });

    // Si hay un item editándose, enfocar automáticamente su campo de nombre
    if (editingId) {
        const activeInput = container.querySelector(".input-card-name");
        if (activeInput) activeInput.focus();
    }
}

export function resetForm(form, submitBtn, cancelBtn) {
    if (form) form.reset();
    if (submitBtn) submitBtn.textContent = "Agregar";
    if (cancelBtn) cancelBtn.style.display = "none";
}

export function fillForm(form, item, submitBtn, cancelBtn) {
    if (!form || !item) return;
    form.querySelector("#name").value = item.name || "";
    form.querySelector("#description").value = item.description || "";
    if (submitBtn) submitBtn.textContent = "Guardar cambios";
    if (cancelBtn) cancelBtn.style.display = "inline-flex";
}