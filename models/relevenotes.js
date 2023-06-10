const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const releveSchema = new Schema({
    type: {
        type: String,
        required: true
    },
    etudiant: {
        type: String,
        required: true
    },
    cne: {
        type: String,
        required: true
    },
    telephone: {
        type: String,
        required: true
    },
    filiere: {
        type: String,
        required: true
    },
    anneeuniv: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    etat: {
        type: String,
        required: true
    }
}
    , { timestamps: true })

const Releve = mongoose.model('Releve', releveSchema);
module.exports = Releve;