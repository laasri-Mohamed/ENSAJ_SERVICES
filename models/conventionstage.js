const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const conventionSchema = new Schema({
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
    adresse: {
        type: String,
        required: true
    },
    datenaissance: {
        type: Date,
        required: true
    },
    lieunaissance: {
        type: String,
        required: true
    },
    nationalite: {
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

const Convention = mongoose.model('Convention', conventionSchema);
module.exports = Convention;