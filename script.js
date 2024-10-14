
const products = {
    verduras: ["Papa", "Zanahoria", "Tomate", "Lechuga", "Pepino", "Brócoli", "Espinaca", "Coliflor", "Berenjena", "Pimiento", "Cebolla", "Ajo", "Apio", "Calabacín", "Nabo", "Remolacha", "Alcachofa", "Repollo", "Esparrago", "Rábano", "Culantro", "Perejil"],
    frutas: ["Manzana", "Banana", "Naranja", "Pera", "Melón", "Sandía", "Uva", "Piña", "Fresa", "Cereza", "Mango", "Papaya", "Kiwi", "Mandarina", "Limón", "Durazno", "Coco", "Ciruela", "Granada", "Frambuesa", "Chirimoya", "Tumbo", "Lúcuma"],
    granos: ["Arroz", "Frijol", "Maíz", "Lenteja", "Garbanzo", "Cebada", "Quinoa", "Trigo", "Mijo", "Soja", "Avena", "Sorgo", "Centeno", "Amaranto", "Alforfón", "Frejol pallar", "Lupino", "Trigo sarraceno", "Frejol negro", "Mote"],
    abarrotes: ["Fideos", "Azúcar", "Sal", "Harina", "Aceite", "Vinagre", "Arroz", "Avena", "Levadura", "Pan", "Café", "Té", "Mantequilla", "Mermelada", "Cacao", "Cereales", "Conservas"],
    bebidas: ["Agua", "Refresco", "Jugo", "Gaseosa", "Cerveza", "Vino", "Chicha morada", "Emoliente", "Pisco", "Ron", "Whisky"],
    esencias: ["Vainilla", "Canela", "Clavo de olor", "Pimienta", "Comino", "Achiote", "Orégano", "Hierba buena"],
    frutos_secos: ["Almendras", "Nueces", "Pistachos", "Castañas", "Maní", "Pasas", "Higos secos", "Dátiles", "Arándanos secos"]
};

function updateProducts(categorySelect) {
    const row = categorySelect.closest("tr");
    const productSelect = row.querySelector("td:nth-child(2) select");
    const customProductInput = row.querySelector("td:nth-child(2) input[type='text']");
    const category = categorySelect.value;

    // Clear previous product options
    productSelect.innerHTML = '<option value="">Seleccione un producto</option>';
    customProductInput.style.display = "none"; // Hide custom input by default

    if (category === 'otro') {
        customProductInput.style.display = "block"; // Show input for custom product
    } else if (category && products[category]) {
        products[category].forEach(product => {
            const option = document.createElement("option");
            option.value = product.toLowerCase();
            option.textContent = product;
            productSelect.appendChild(option);
        });
    }
}

function calculateAllTotals() {
    let generalTotal = 0;
    const rows = document.querySelectorAll("#shopping-list tbody tr");
    let hasError = false;
    const errorMessage = document.getElementById("error-message");

    rows.forEach(row => {
        const quantityInput = row.querySelector("input[type='number']");
        const priceInput = row.querySelector("input[type='number'][step]");
        const totalInput = row.querySelector("input[readonly]");

        const quantity = parseFloat(quantityInput.value);
        const price = parseFloat(priceInput.value);

        if (isNaN(quantity) || isNaN(price) || quantity <= 0 || price < 0) {
            hasError = true;
            errorMessage.textContent = "Por favor, complete todos los campos correctamente.";
        } else {
            const total = quantity * price;
            totalInput.value = total.toFixed(2);
            generalTotal += total;
        }
    });

    if (!hasError) {
        document.getElementById("general-total").textContent = generalTotal.toFixed(2);
        errorMessage.textContent = "";
    }
}

function validateInput(input) {
    if (input.value <= 0) {
        input.style.border = "2px solid red";
    } else {
        input.style.border = "";
    }
}

function downloadCSV() {
    let csvContent = "data:text/csv;charset=utf-8,Categoría,Producto,Cantidad,Unidad de medida,Precio unitario,Precio total\n";
    const rows = document.querySelectorAll("#shopping-list tbody tr");

    rows.forEach(row => {
        const category = row.querySelector("td:nth-child(1) select").value;
        const productSelect = row.querySelector("td:nth-child(2) select");
        const customProduct = row.querySelector("td:nth-child(2) input[type='text']").value;
        const product = productSelect.value || customProduct;
        const quantity = row.querySelector("td:nth-child(3) input").value;
        const unit = row.querySelector("td:nth-child(4) select").value;
        const price = row.querySelector("td:nth-child(5) input").value;
        const total = row.querySelector("td:nth-child(6) input").value;

        csvContent += `${category},${product},${quantity},${unit},${price},${total}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "lista_compras.csv");
    document.body.appendChild(link);
    link.click();
}
