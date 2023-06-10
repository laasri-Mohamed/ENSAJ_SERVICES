const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const demcertSchema = new Schema({
    type: {
        type: String,
        required: true
    },
    etudiant: {
        type: String,
        required: true
    },
    cin: {
        type: String,
        required: true
    },
    cne: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    etat: {
        type: String,
        required: true
    }
}
, {timestamps: true})

const Demcert = mongoose.model('Demcert', demcertSchema);
module.exports = Demcert;