document.getElementById('fileInput').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const jsonData = JSON.parse(e.target.result);
            displayData(jsonData);
        } catch (error) {
            document.getElementById('output').textContent = "Błąd: Nieprawidłowy format JSON.";
        }
    };
    reader.readAsText(file);
});

function displayData(data) {
    let output = `Sprzedawca:\n`;
    output += `Nazwa: ${data.a1}\nAdres: ${data.a2}\nKraj: ${data.a3}\nNIP: ${data.a4}\n`;
    output += `Email: ${data.a5}\nTelefon: ${data.a6}\nStrona WWW: ${data.a7}\n`;
    output += `Bank: ${data.a8}\nKonto: ${data.a9}\nSWIFT: ${data.a10}\n\n`;

    output += `Klient:\n`;

    // Automatyczne wykrycie typu klienta
    if (data.b1 && data.b2) {
        output += `Typ: Firma\n`;
        output += `Firma: ${data.b1}\nNIP: ${data.b2}\n`;
    } else if (data.c1 && data.c2) {
        output += `Typ: Indywidualny\n`;
        output += `Imię: ${data.c1}\nNazwisko: ${data.c2}\n`;
    } else {
        output += `Nieznany typ klienta\n`;
    }

    output += `Adres: ${data.b3}\nKraj: ${data.b4}\nTelefon: ${data.b5}\nEmail: ${data.b6}\n`;
    output += `Metoda płatności: ${data.b7}\nFaktura nr: ${data.b8}\n\n`;

    output += `Produkty:\n`;
    data.Products.forEach((product, index) => {
        output += `Produkt ${index + 1}:\n`;
        output += `Nazwa: ${product.p1}\nCena netto: ${product.p2}\n`;
        output += `Ilość: ${product.p3}\nWartość netto: ${product.p4}\n`;
        output += `VAT: ${product.p5}%\nWartość VAT: ${product.p6}\n`;
        output += `Wartość całkowita: ${product.p7}\n\n`;
    });

    document.getElementById('output').textContent = output;
}