const PDFDocument = require('pdfkit');

function buildPDF(dataCallback, endCallback, convention) {
    const doc = new PDFDocument({ bufferPages: true, font: 'Courier' });

    doc.on('data', dataCallback);
    doc.on('end', endCallback);
    // Stretch the image
    // doc.image("./assets/images/tri_logo.png",  {width: 70, height: 70, align: 'right', valign: 'top'})
    doc.image("./assets/images/ensajlogo.png", { width: 120, height: 90, align: 'left', valign: 'top' }).moveDown(1.5);
    // doc.fontSize(25).text( "Type de la demande : " + demande.type);
    doc
        .font('Times-Bold')
        .fontSize(26)
        .text(
            "Demande de " + convention.type, {
            width: 410,
            align: 'center'
        }
        )
        .moveDown(1.5);
    doc
        .font('Times-Roman')
        .fontSize(15)
        .text(
            "Code Nationale de l'élève ingénieur : " + convention.cne, {
            width: 410,
            align: 'left'
        }
        )
        .moveDown(0.5);
    doc
        .font('Times-Roman')
        .fontSize(15)
        .text(
            "Nom et Prénom : " + convention.etudiant, {
            width: 410,
            align: 'left'
        }
        )
        .moveDown(0.5);
    doc
        .font('Times-Roman')
        .fontSize(15)
        .text(
            "Date et lieu de naissance : " + convention.datenaissance + " à " + convention.lieunaissance, {
            width: 410,
            align: 'left'
        }
        )
        .moveDown(0.5);
    doc
        .font('Times-Roman')
        .fontSize(15)
        .text(
            "Nationalité : " + convention.nationalite, {
            width: 410,
            align: 'left'
        }
        )
        .moveDown(0.5);
    doc
        .font('Times-Roman')
        .fontSize(15)
        .text(
            "Adresse : " + convention.adresse, {
            width: 410,
            align: 'left'
        }
        )
        .moveDown(0.5);
    doc
        .font('Times-Roman')
        .fontSize(15)
        .text(
            "Filière et année : " + convention.filiere, {
            width: 410,
            align: 'left'
        }
        )
        .moveDown(0.5);
    doc
        .font('Times-Roman')
        .fontSize(15)
        .text(
            "Tél : " + convention.telephone, {
            width: 410,
            align: 'left'
        }
        )
        .moveDown(0.5);
    doc.end();
}

module.exports = { buildPDF };