const PDFDocument = require('pdfkit');
const moment = require('moment');
const currentDate = moment().format('DD/MM/YYYY');

function buildPDF(dataCallback, endCallback, demcert) {
    const doc = new PDFDocument({ bufferPages: true, font: 'Courier' });

    doc.on('data', dataCallback);
    doc.on('end', endCallback);
    // Stretch the image
    // doc.image("./assets/images/tri_logo.png",  {width: 70, height: 70, align: 'right', valign: 'top'})
    doc.image("./assets/images/Universite.png", { width: 510, height: 100, align: 'center', valign: 'top' }).moveDown(1.5);
    // doc.fontSize(25).text( "Type de la demande : " + demande.type);
    doc.font('Times-Bold')
        .fontSize(26)
        .text("CERTIFICAT DE SCOLARITE", {
            align: 'center'
        })
        .moveDown(1.5);


    doc
        .font('Times-Roman')
        .fontSize(15)
        .text(
            "Le Directeur de l'Ecole Nationale des Sciences Appliquées d'El Jadida (ENSA-J), soussigné, atteste que :" , {
            width: 410,
            align: 'justify'
        }
        )
        .moveDown(0.5);

    doc
        .font('Times-Roman')
        .fontSize(15)
        .text(
            "     L'élève :" + demcert.etudiant, {
            width: 410,
            align: 'center'
        }
        )
        .moveDown(0.5);
    doc
        .font('Times-Roman')
        .fontSize(15)
        .text(
            "CNE : " + demcert.cne, {
            width: 410,
            align: 'center'
        }
        )
        .moveDown(1.5);
    doc
        .font('Times-Roman')
        .fontSize(15)
        .text(
            "Est inscrit(e) en Deuxième année de la filière "+ ourClient.filiere +" au titre de l'année universitaire 2022/2023, et poursuit ses études à l'Ecole Nationale des Sciences Appliquées.", {
            width: 500,
            align: 'justify'
        }
        )
        .moveDown(0.5);
    doc
        .font('Times-Roman')
        .fontSize(12)
        .text(
            "Fait à El Jadida le : " + currentDate, {
            width: 410,
            align: 'right'
        }
        )
        .moveDown(0.5);

    doc.image("./assets/images/Signature.png", { width: 510, height: 100, align: 'center', valign: 'top' }).moveDown(1.5);
    doc
        .font('Times-Roman')
        .fontSize(8)
        .text(
            "Avis Important : Il ne peut être délivré qu'un seul exemplaire du présent certificat d'inscription. Aucun duplicata ne sera fourni." , {
            width: 410,
            align: 'left'
        }
        )
        .moveDown(0.5);
    doc.end();
}

module.exports = { buildPDF };