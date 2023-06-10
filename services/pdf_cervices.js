const PDFDocument = require('pdfkit');

function buildPDF(dataCallback, endCallback, demcert) {
    const doc = new PDFDocument({ bufferPages: true, font: 'Courier' });

    doc.on('data', dataCallback);
    doc.on('end', endCallback);
    // Stretch the image
    // doc.image("./assets/images/tri_logo.png",  {width: 70, height: 70, align: 'right', valign: 'top'})
    doc.image("./assets/images/ensajlogo.png", { width: 120, height: 90, align: 'left', valign: 'top' }).moveDown(1.5);
    // doc.fontSize(25).text( "Type de la demande : " + demande.type);
    doc.font('Times-Roman')
        .fontSize(19)
        .text("Type de la demande : " + demcert.type, {
            align: 'center'
        })
        .moveDown(1.5);


    doc
        .font('Times-Roman')
        .fontSize(15)
        .text(
            "Demandeur : " + demcert.etudiant, {
            width: 410,
            align: 'left'
        }
        )
        .moveDown(1.5);
    doc
        .font('Times-Roman')
        .fontSize(15)
        .text(
            demcert.message, {
            width: 500,
            align: 'justify'
        }
        )
        .moveDown(0.5);
    doc
        .font('Times-Roman')
        .fontSize(15)
        .text(
            "Dans l'attente d'une réponse que j'espère favorable, je vous prie de recevoir, Madame, Monsieur, mes salutations distinguées.", {
            width: 500,
            align: 'left'
        }
        )
        .moveDown(0.5);
    doc.end();
}

module.exports = { buildPDF };