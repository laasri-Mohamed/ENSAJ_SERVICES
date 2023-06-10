const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const certifSchema = new Schema({
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
        telephone: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        datedepot: {
            type: Date,
            required: true
        }
    }
    , {timestamps: true})

const Certificat = mongoose.model('Certificat', certifSchema);
module.exports = Certificat;