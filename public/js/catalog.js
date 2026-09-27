import { getItems } from "./services/api.js";

const container = document.getElementById("catalogContainer");

async function loadCatalog() {
    try {
        const items = await getItems();

        if (!items || items.length === 0) {
            container.innerHTML = "<p>No hay items disponibles en el catálogo.</p>";
            return;
        }

        // Renderiza cada item con las clases .card y .card-content de tu styles.css
        container.innerHTML = items.map(item => `
            <article class="card">
                <div class="card-content">
                    <h3>${item.name}</h3>
                    <p>${item.description || "Sin descripción"}</p>
                </div>
            </article>
        `).join("");

    } catch (err) {
        console.error("Error cargando el catálogo:", err);
        container.innerHTML = "<p>Ocurrió un error al cargar los items del catálogo.</p>";
    }
}

loadCatalog();
