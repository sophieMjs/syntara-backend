// parsers/htmlParser.js

const IParser = require("./IParser");
const { JSDOM } = require("jsdom");

class HTMLParser extends IParser {
    parse(rawHtml) {
        if (!rawHtml) {
            throw new Error("No hay HTML para parsear.");
        }

        const dom = new JSDOM(rawHtml);
        const document = dom.window.document;

        // Buscar tablas
        const table = document.querySelector("table");
        if (!table) {
            throw new Error("No se encontró ninguna tabla en el HTML.");
        }

        const rows = [...table.querySelectorAll("tr")];

        const headers = rows[0]
            .querySelectorAll("th,td")
            .values();
        const headerNames = Array.from(headers).map((h) =>
            h.textContent.trim().toLowerCase()
        );

        const data = rows.slice(1).map((row) => {
            const cells = [...row.querySelectorAll("td")];
            let obj = {};

            cells.forEach((cell, index) => {
                obj[headerNames[index] || `col${index}`] = cell.textContent.trim();
            });

            return obj;
        });

        return data;
    }
}

module.exports = HTMLParser;
