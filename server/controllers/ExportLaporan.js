const fs = require('fs')
const PDFDocument = require('pdfkit')

function createInvoice(hasil, path) {
    let doc = new PDFDocument({ margin: 50 });
    generateHeader(doc);
    generateProyekInformation(doc, hasil)
    generateTable(doc, hasil)
    doc.end();
    doc.pipe(fs.createWriteStream(path));
}

function generateHeader(doc) {
    doc
        .fillColor("#444444")
        .fontSize(20)
        .text("PT. Saba Pratama", 50, 57)
        .fontSize(10)
        .text("Jl. Gayung Kebonsari Manunggal No.a2, Kebonsari, Kec. Jambangan", 200, 65, { align: "right" })
        .text("Kota SBY, Jawa Timur 60233", 200, 80, { align: "right" })
        .moveDown();
}

function generateProyekInformation(doc, hasil) {
    doc
        .fillColor("#444444")
        .fontSize(20)
        .text("RAB", 50, 160);

    generateHr(doc, 185);
    const customerInformationTop = 200;

    doc
        .fontSize(10)
        .text("ID RAB:", 50, customerInformationTop)
        .font("Helvetica-Bold")
        .text(hasil._id, 150, customerInformationTop)
        .font("Helvetica")
        .text("Nama Proyek:", 50, customerInformationTop + 15)
        .text(hasil.idProyek.namaProyek, 150, customerInformationTop + 15)
        .moveDown();
    generateHr(doc, 252);
}

function generateTable(doc, hasil) {
    let i;
    const invoiceTableTop = 330;

    doc.font("Helvetica-Bold");
    generateTableRow(
        doc,
        invoiceTableTop,
        "Uraian Pekerjaan",
        "Nama Kegiatan",
        "",
        "",
        "",
    );

    generateHr(doc, invoiceTableTop + 20);
    doc.font("Helvetica");
    let tempPost = 0
    for (i = 0; i < hasil.rab.length; i++) {
        const rabq = hasil.rab[i];
        const position = invoiceTableTop + (i + 1) * 30;

        for (j = 0; j < rabq.idKegiatanProyek.length; j++) {
            const namaKegiatan = rabq.idKegiatanProyek[j]
            if (i != 0) {
                positionJ = tempPost + 30;
            } else {
                positionJ = position + (j + i) * 30;
            }
            console.log(positionJ)
            generateTableRow(
                doc,
                positionJ,
                "",
                namaKegiatan.namaKegiatan
            );

            tempPost = positionJ
        }
        generateTableRow(
            doc,
            tempPost,
            rabq.uraianPekerjaan,
            ""
        );
        generateHr(doc, tempPost + 20);
    }
    doc.font("Helvetica");
}

function generateHr(doc, y) {
    doc
        .strokeColor("#aaaaaa")
        .lineWidth(1)
        .moveTo(50, y)
        .lineTo(550, y)
        .stroke();
}

function generateTableRow(
    doc,
    y,
    uraianPekerjaan,
    namaKegiatan
) {
    doc
        .fontSize(10)
        .text(uraianPekerjaan, 50, y)
        .text(namaKegiatan, 300, y)
        .moveDown()
}


module.exports = {
    createInvoice
};