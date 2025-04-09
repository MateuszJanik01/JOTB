function toggleClientFields() {
    const type = document.getElementById("clientType").value;
    document.getElementById("companyFields").classList.toggle("hidden", type !== "Company");
    document.getElementById("individualFields").classList.toggle("hidden", type !== "Indyvidual");
}

function addProduct() {
    const container = document.getElementById("productsContainer");
    const index = container.children.length;
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
        <label>Nazwa:</label> <input type="text" id="p1_${index}"><br>
        <label>Cena netto:</label> <input type="number" id="p2_${index}"><br>
        <label>Ilość:</label> <input type="number" id="p3_${index}"><br>
        <label>Wartość netto:</label> <input type="number" id="p4_${index}"><br>
        <label>VAT (%):</label> <input type="number" id="p5_${index}"><br>
        <label>Wartość VAT:</label> <input type="number" id="p6_${index}"><br>
        <label>Wartość całkowita:</label> <input type="number" id="p7_${index}"><br>
    `;
    container.appendChild(div);
}

function collectFormData() {
    const data = {
        a1: document.getElementById("a1").value,
        a2: document.getElementById("a2").value,
        a3: document.getElementById("a3").value,
        a4: document.getElementById("a4").value,
        a5: document.getElementById("a5").value,
        a6: document.getElementById("a6").value,
        a7: document.getElementById("a7").value,
        a8: document.getElementById("a8").value,
        a9: document.getElementById("a9").value,
        a10: document.getElementById("a10").value,
        b1: document.getElementById("b1").value,
        b2: document.getElementById("b2").value,
        c1: document.getElementById("c1").value,
        c2: document.getElementById("c2").value,
        b3: document.getElementById("b3").value,
        b4: document.getElementById("b4").value,
        b5: document.getElementById("b5").value,
        b6: document.getElementById("b6").value,
        b7: document.getElementById("b7").value,
        b8: document.getElementById("b8").value,
        Products: []
    };

    const products = document.querySelectorAll("#productsContainer .product");
    products.forEach((p, i) => {
        data.Products.push({
            p1: document.getElementById(`p1_${i}`).value,
            p2: document.getElementById(`p2_${i}`).value,
            p3: document.getElementById(`p3_${i}`).value,
            p4: document.getElementById(`p4_${i}`).value,
            p5: document.getElementById(`p5_${i}`).value,
            p6: document.getElementById(`p6_${i}`).value,
            p7: document.getElementById(`p7_${i}`).value
        });
    });

    return data;
}

function generateInvoice() {
    const data = collectFormData();

    // Dane Sprzedawcy
    document.getElementById("sellerData").innerHTML = `
        <h3>Sprzedawca</h3>
        <p><strong>${data.a1}</strong><br>${data.a2}, ${data.a3}<br>NIP: ${data.a4}<br>Email: ${data.a5}<br>Telefon: ${data.a6}<br>WWW: ${data.a7}<br>
        Bank: ${data.a8}, Konto: ${data.a9}, SWIFT: ${data.a10}</p>
    `;

    // Dane Klienta
    let clientHTML = `<h3>Klient</h3><p>`;
    if (data.b1 && data.b2) {
        clientHTML += `<strong>${data.b1}</strong><br>NIP: ${data.b2}<br>`;
    } else if (data.c1 && data.c2) {
        clientHTML += `<strong>${data.c1} ${data.c2}</strong><br>`;
    }
    clientHTML += `${data.b3}, ${data.b4}<br>Email: ${data.b6}, Tel: ${data.b5}<br>Płatność: ${data.b7}<br>Faktura nr: ${data.b8}</p>`;
    document.getElementById("clientData").innerHTML = clientHTML;

    // Tabela Produktów
    let productsHTML = `<h3>Produkty</h3><table border="1" cellspacing="0" cellpadding="5"><tr>
        <th>Nazwa</th><th>Cena netto</th><th>Ilość</th><th>Wartość netto</th><th>VAT %</th><th>Wartość VAT</th><th>Razem</th></tr>`;
    data.Products.forEach(p => {
        productsHTML += `<tr><td>${p.p1}</td><td>${p.p2}</td><td>${p.p3}</td><td>${p.p4}</td><td>${p.p5}</td><td>${p.p6}</td><td>${p.p7}</td></tr>`;
    });
    productsHTML += `</table>`;
    document.getElementById("productsTable").innerHTML = productsHTML;

    // Wygeneruj kod matrycy
    generateMatrixSVG(data);

    // Pokaż sekcję faktury
    document.getElementById("invoicePreview").classList.remove("hidden");
}

function removePolishCharacters(text) {
    const map = {'ą':'a','ć':'c','ę':'e','ł':'l','ń':'n','ó':'o','ś':'s','ź':'z','ż':'z','Ą':'A','Ć':'C','Ę':'E','Ł':'L','Ń':'N','Ó':'O','Ś':'S','Ź':'Z','Ż':'Z'};
    return text.replace(/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g, m => map[m]);
}

function JSONToString(data) {
    let txt = `Sprzedawca:\n${data.a1}, ${data.a2}, ${data.a3}, NIP: ${data.a4}\nEmail: ${data.a5}, Tel: ${data.a6}, WWW: ${data.a7}\nBank: ${data.a8}, Konto: ${data.a9}, SWIFT: ${data.a10}\n\nKlient:\n`;
    if (data.b1 && data.b2) txt += `${data.b1}, NIP: ${data.b2}\n`; else if (data.c1 && data.c2) txt += `${data.c1} ${data.c2}\n`;
    txt += `${data.b3}, ${data.b4}, Email: ${data.b6}, Tel: ${data.b5}, Płatność: ${data.b7}, Faktura nr: ${data.b8}\n\nProdukty:\n`;
    data.Products.forEach((p, i) => {
        txt += `${i + 1}. ${p.p1}, Netto: ${p.p2}, Ilość: ${p.p3}, Netto: ${p.p4}, VAT: ${p.p5}%, VAT Wartość: ${p.p6}, Razem: ${p.p7}\n`;
    });
    return txt;
}

function generateMatrixSVG(message) {
    const values = JSONToString(message);
    const normalized = removePolishCharacters(values);
    const svgNode = DATAMatrix({ msg: normalized, dim: 320, rct: 0, pad: 2, vrb: 0 });
    const div = document.getElementById("matrixSVG");
    div.innerHTML = "";
    div.appendChild(svgNode);
}
