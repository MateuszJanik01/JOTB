function toggleClientFields() {
            const type = document.getElementById('clientType').value;
            document.getElementById('companyFields').classList.toggle('hidden', type !== 'Company');
            document.getElementById('individualFields').classList.toggle('hidden', type !== 'Indyvidual');
        }

function addProduct() {
    const container = document.getElementById('productsContainer');
    const productIndex = container.children.length + 1;
    const productDiv = document.createElement('div');
    productDiv.classList.add('product');
    productDiv.innerHTML = `
        <h3>Produkt ${productIndex}</h3>
        <label>Nazwa:</label> <input type="text" class="p1" required><br>
        <label>Cena netto:</label> <input type="number" class="p2" required><br>
        <label>Ilość:</label> <input type="number" class="p3" required><br>
        <label>Wartość netto:</label> <input type="number" class="p4" required><br>
        <label>VAT (%):</label> <input type="number" min="0" class="p5" required><br>
        <label>Wartość VAT:</label> <input type="number" class="p6" required><br>
        <label>Wartość całkowita:</label> <input type="number" class="p7" required>
    `;
    container.appendChild(productDiv);
}

function generateJSON() {
    const jsonData = {
        a1: document.getElementById('a1').value,
        a2: document.getElementById('a2').value,
        a3: document.getElementById('a3').value,
        a4: document.getElementById('a4').value,
        a5: document.getElementById('a5').value,
        a6: document.getElementById('a6').value,
        a7: document.getElementById('a7').value,
        a8: document.getElementById('a8').value,
        a9: document.getElementById('a9').value,
        a10: document.getElementById('a10').value,
        b3: document.getElementById('b3').value,
        b4: document.getElementById('b4').value,
        b5: document.getElementById('b5').value,
        b6: document.getElementById('b6').value,
        b7: document.getElementById('b7').value,
        b8: document.getElementById('b8').value,
        Products: []
    };

    const clientType = document.getElementById('clientType').value;
    if (clientType === 'Company') {
        jsonData.b1 = document.getElementById('b1').value;
        jsonData.b2 = document.getElementById('b2').value;
    } else if (clientType === 'Indyvidual') {
        jsonData.c1 = document.getElementById('c1').value;
        jsonData.c2 = document.getElementById('c2').value;
    }

    document.querySelectorAll('#productsContainer .product').forEach(productDiv => {
        const product = {
            p1: productDiv.querySelector('.p1').value,
            p2: parseFloat(productDiv.querySelector('.p2').value),
            p3: parseInt(productDiv.querySelector('.p3').value),
            p4: parseFloat(productDiv.querySelector('.p4').value),
            p5: parseInt(productDiv.querySelector('.p5').value),
            p6: parseFloat(productDiv.querySelector('.p6').value),
            p7: parseFloat(productDiv.querySelector('.p7').value)
        };
        jsonData.Products.push(product);
    });


    const jsonString = JSON.stringify(jsonData, null, 4);
    generateMatrixSVG(jsonData);


    const blob = new Blob([jsonString], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'faktura.json';
    link.click();
}