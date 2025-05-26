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
        <label>Numer produktu:</label> <input type="number" id="p8_${index}"><br>
        <label>Cena netto:</label> <input type="number" id="p2_${index}" step="0.01" oninput="recalculate(${index})"><br>
        <label>Ilość:</label> <input type="number" id="p3_${index}" step="1" oninput="recalculate(${index})"><br>
        <label>Wartość netto:</label> <input type="number" id="p4_${index}" readonly><br>
        <label>VAT (%):</label> <input type="number" id="p5_${index}" step="1" oninput="recalculate(${index})"><br>
        <label>Wartość VAT:</label> <input type="number" id="p6_${index}" readonly><br>
        <label>Wartość całkowita:</label> <input type="number" id="p7_${index}" readonly><br>
    `;
    container.appendChild(div);
    div.scrollIntoView({ behavior: 'smooth', block: 'start' });
}


function collectFormData() {
    const data = {
        issueDate: document.getElementById("issueDate").value,
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
            p7: document.getElementById(`p7_${i}`).value,
            p8: document.getElementById(`p8_${i}`).value,
        });
    });

    return data;
}


function collectMatrixCodeData(code){
        
      
    const data = JSON.parse(code);
    return data;
}

function recalculate(index) {
    const price = parseFloat(document.getElementById(`p2_${index}`).value) || 0;
    const quantity = parseFloat(document.getElementById(`p3_${index}`).value) || 0;
    const vatPercent = parseFloat(document.getElementById(`p5_${index}`).value) || 0;

    const netValue = price * quantity;
    const vatValue = netValue * (vatPercent / 100);
    const total = netValue + vatValue;

    document.getElementById(`p4_${index}`).value = netValue.toFixed(2);
    document.getElementById(`p6_${index}`).value = vatValue.toFixed(2);
    document.getElementById(`p7_${index}`).value = total.toFixed(2);
}


function generateInvoice(mode = 0, code = "") {
    const oldMatrixPages = document.querySelectorAll(".page-break");
    oldMatrixPages.forEach(el => el.remove());

    const data = mode == 0 ? collectFormData() : collectMatrixCodeData(code);

    // Dane Sprzedawcy
    document.getElementById("sellerData").innerHTML = `
        <span>${data.issueDate}</span>
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
    let totalNet = 0, totalVAT = 0, totalGross = 0;

    let productsHTML = `<h3>Produkty</h3><table id="printTable" border="1" cellspacing="0" cellpadding="5">
        <tr>
            <th>Nazwa</th>
            <th>Cena netto</th>
            <th>Ilość</th>
            <th>Wartość netto</th>
            <th>VAT %</th>
            <th>Wartość VAT</th>
            <th>Razem</th>
        </tr>`;
    let i = 0;
    data.Products.forEach(p => {
        const netto = parseFloat(p.p4) || 0;
        const vat = parseFloat(p.p6) || 0;
        const brutto = parseFloat(p.p7) || 0;
    
        totalNet += netto;
        totalVAT += vat;
        totalGross += brutto;
    
        productsHTML +=
        `<tr>
            <td>${p.p1}</td><td>${p.p2}</td><td>${p.p3}</td><td>${p.p4}</td><td>${p.p5}</td><td>${p.p6}</td><td>${p.p7}</td>
        </tr>
        <tr>
            <td colspan="7" style="text-align: center;"> 
                <svg id="barcode${i}" jsbarcode-value="${p.p8}"
                    jsbarcode-textmargin="0"
                    jsbarcode-margin="1"
                    jsbarcode-height="30"
                    jsbarcode-width="1"
                    jsbarcode-fontSize="12">
                </svg>
            </td>
        </tr>`;
    });
    
    productsHTML += `
        <tr style="font-weight:bold;">
            <td colspan="3">Razem</td>
            <td>${totalNet.toFixed(2)}</td>
            <td></td>
            <td>${totalVAT.toFixed(2)}</td>
            <td>${totalGross.toFixed(2)}</td>
        </tr>   
    </table>`;
    
    document.getElementById("productsTable").innerHTML = productsHTML;
    const invoicePreview = document.getElementById("invoicePreview");
 
    const matrixPage = document.createElement("div");
    matrixPage.className = "page-break matrix-center";
    matrixPage.innerHTML = `
        <p><strong>Zeskanuj kod matrycy, aby pobrać dane</strong></p>
        <div id="matrixSVG"></div>
    `;
    invoicePreview.appendChild(matrixPage);
    
    generateMatrixSVG(data, matrixPage.querySelector("#matrixSVG"));

    document.getElementById("invoicePreview").classList.remove("hidden");
    while(i>=0){
        JsBarcode(`#barcode${i}`).init();
        i--;
    }
}

function removePolishCharacters(text) {
    const map = {'ą':'a','ć':'c','ę':'e','ł':'l','ń':'n','ó':'o','ś':'s','ź':'z','ż':'z','Ą':'A','Ć':'C','Ę':'E','Ł':'L','Ń':'N','Ó':'O','Ś':'S','Ź':'Z','Ż':'Z'};
    return text.replace(/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g, m => map[m]);
}

function generateMatrixSVG(message, container) {
    const jsonString = JSON.stringify(message, null, 4);
    const normalized = removePolishCharacters(jsonString);
    const svgNode = DATAMatrix({ msg: normalized, dim: 320, rct: 0, pad: 2, vrb: 0 });
    container.innerHTML = ""; 
    container.appendChild(svgNode);
}


window.onload = () => {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById("issueDate").value = today;
};
