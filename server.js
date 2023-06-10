const user_exist = require('./controllers/auth')
const path = require('path');
const mongoose = require('mongoose');
const express = require('express');
const multer = require('multer');
const Student = require('./models/studentsModel');
const Prof = require('./models/profsModel');
const Modules = require('./models/modulesModel');
const Note = require('./models/notesModel');
const Demande = require('./models/demandesModel');
const { result } = require('lodash');
const pdfService = require('./services/pdf_services');
const pdfCertif = require('./services/pdf_certif');
const pdfCervices = require('./services/pdf_cervices');
const pdfConvention = require('./services/pdf_convention');
const pdfReleve = require('./services/pdf_releve');
const Certificat = require('./models/certifsModel');
const Demcert = require('./models/demandeCertsModel');
const Convention = require('./models/conventionstage');
const Releve = require('./models/relevenotes');
const nodemailer = require('nodemailer');
const app = express();


//define storage for the images

const storage = multer.diskStorage({
    //destination for files
    destination: function (request, file, callback) {
        callback(null, './public/uploads/images');
    },

    //add back the extension
    filename: function (request, file, callback) {
        callback(null, Date.now() + file.originalname);
    },
});

//upload parameters for multer
const upload = multer({
    storage: storage,
    limits: {
        fieldSize: 1024 * 1024 * 3,
    },
});

const port = process.env.PORT || 4040;
mongo_url = "mongodb+srv://Mohamed:Mohamed123@cluster0.iukxaek.mongodb.net/test"
mongoose.connect(mongo_url)
    .then((res) => {
        app.listen(port);
    })
    .catch((err) => {
        console.log("UNE ERREUR S'EST PRODUITE LORS DE LA CONNECTION AVEC LA BD MONGO");
    })

app.set("view engine", "ejs");

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static(path.join(__dirname, 'public')))
app.use('/static1', express.static(path.join(__dirname, 'assets')))

app.get('/', (req, res) => {
    res.render('accueil', {
        existe: true,
        existingEmail: false,
        email: "",
        pwd: "",
    });
})
app.get('/index', (req, res) => {
    res.render('index', {
        person: ourClient,
    });
})

app.get('/error', (req, res) => {
    res.render('error');
})


app.get('/create', (req, res) => {
    res.render('create', {
        existe: true,
        existingEmail: false,
        email: "",
        pwd: "",
    });
})

app.get('/accueil', (req, res) => {
    res.render('accueil', {
        existe: true,
        existingEmail: false,
        email: "",
        pwd: "",
    });
})

app.post('/index', (req, res) => {

    Student.find()
        .then((result) => {
            result.forEach(person => {
                if (req.body.email == person.email && req.body.password == person.password) {
                    global.ourClient = person;
                    // console.log(ourClient);
                    res.render('index', {
                        person: person,
                    });
                }
            });
            res.render('create', {
                existe: false,
                existingEmail: false,
                email: req.body.email,
                pwd: req.body.password,
            })
        })
        .catch(err => {
            console.log(err);
        })
})

app.get('/signup', (req, res) => {
    res.render('signup');
})

app.post('/updateProfile', upload.single('image'), async (req, res) => {
    if (ourClient.role == "Etudiant") {
        let user = req.body;
        Student.findByIdAndUpdate(user.userId,
            {
                nom: user.nom,
                prenom: user.prenom,
                cin: user.cin,
                cne: user.cne,
                filiere: user.filiere,
                image: req.file.filename,
                email: user.email,
                password: user.password

            },
            async (err, docs) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log("Updated User : ", docs);
                    const result = await Student.findById(user.userId);
                    res.render('index',
                        {
                            person: result,
                        });
                }
            })
    } else {
        let user = req.body;
        console.log(user);
        Prof.findByIdAndUpdate(user.userId,
            {
                nom: user.nom,
                prenom: user.prenom,
                departement: user.departement,
                image: await req.file.filename,
                classes: user.classes,
                email: user.email,
                password: user.password

            },
            async (err, docs) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log("Updated User : ", docs);
                    const result = await Prof.findById(user.userId);
                    res.render('index',
                        {
                            person: result,
                        });
                }
            })
    }
})

app.post('/addStudent', upload.single('image'), (req, res) => {
    const student = new Student({
        nom: req.body.nom,
        prenom: req.body.prenom,
        cin: req.body.cin,
        cne: req.body.cne,
        filiere: req.body.filiere,
        email: req.body.email,
        password: req.body.password,
        image: req.file.filename,
    });

    let client = false;
    Student.find()
        .then((result) => {
            result.forEach(person => {
                if (student.email == person.email) {
                    res.render('create', {
                        existe: true,
                        existingEmail: true,
                        email: "",
                        pwd: "",
                    })
                    client = true;
                }
            });
            if (!client) {

                student.save()
                    .then((result1) => {
                        // upload(req1, res1, (err1) )
                        //     if (err) {
                        //         console.log(err);
                        //     } else {
                        //         console.log(req.file)
                        //     }

                        // });
                        global.ourClient = result1;
                        res.render('index', {
                            person: result1,
                        });
                    })
                    .catch(err => {
                        console.log(err);
                    })

            }
            // .catch(err => {
            //     console.log(err);
            // })
        })
})


app.get('/signinadmin', (req, res) => {
    res.render('signinadmin', {
        existe: true,
        email: "",
        pwd: "",
    });
})
app.post('/signinadmin', (req, res) => {
    admins = [
        {
            nom: "Ensaj",
            prenom: "Admin",
            image: "1661708690257ensajlogo.png",
            email: "laasrimohamed2023@gmail.com",
            password: "Moad@@2001",
            departement: "TRI",
            role: "Cordinateur"
        }
    ]

    admins.forEach(admin => {
        if (req.body.email == admin.email && req.body.password == admin.password) {
            global.ourClient = admin;
            //    res.render('index', {
            //     person: admin,
            //    });
            res.redirect('dash')
        }
        res.render('signinadmin', {
            existe: false,
            email: req.body.email,
            pwd: req.body.password,
        })
    });
})
app.get('/signinprof', (req, res) => {
    res.render('signinprof', {
        existe: true,
        email: "",
        pwd: "",
    });
})
app.post('/signinprof', (req, res) => {

    Prof.find()
        .then((result) => {
            result.forEach(prof => {
                if (req.body.email == prof.email && req.body.password == prof.password) {

                    global.ourClient = prof;
                    res.render('index', {
                        person: prof,
                    });
                }
            });
            res.render('signinprof', {
                existe: false,
                email: req.body.email,
                pwd: req.body.password,
            })
        })
        .catch(err => {
            console.log(err);
        })

})

app.get('/profs', async (req, res) => {
    if (ourClient.role == "Cordinateur") {
        await Prof.find()
            .then((result) => {
                global.ourProfs = result;
            })
            .catch(err => {
                console.log(err);
            })

        await Note.find()
            .then((result) => {
                global.ourStudentsScores = result;
            })
            .catch(err => {
                console.log(err);
            })

        await Student.find()
            .then(result => {
                global.iite1Students = 0;
                global.iite2Students = 0;
                global.isic1Students = 0;
                global.isic2Students = 0;
                result.forEach(student => {
                    if (student.filiere == "2ITE-1") {
                        global.iite1Students++;
                    } else if (student.filiere == "2ITE-2") {
                        global.iite2Students++;
                    } else if (student.filiere == "ISIC-1") {
                        global.isic1Students++;
                    } else {
                        global.isic2Students++;
                    }
                });
            })
        res.render('profs', {
            profs: ourProfs,
            notes: ourStudentsScores,
            iite1Students: iite1Students,
            iite2Students: iite2Students,
            isic1Students: isic1Students,
            isic2Students: isic2Students
        })
    } else {
        res.render('error')
    }
})

app.get('/addprof', (req, res) => {
    if (ourClient.role == "Cordinateur") {
        res.render('addprof');
    } else {
        res.render('error')
    }
})

app.post('/addprof', (req, res) => {

    let classes = ""

    if (req.body.isic1 == "on") {
        classes = classes + " ISIC-1 |"
    }
    if (req.body.isic2 == "on") {
        classes = classes + " ISIC-2 |"
    }
    if (req.body._2ite1 == "on") {
        classes = classes + " 2ITE-1 |"
    }
    if (req.body._2ite2 == "on") {
        classes = classes + " 2ITE-2 |"
    }
    const prof = new Prof(
        {
            nom: req.body.nom,
            prenom: req.body.prenom,
            departement: req.body.departement,
            email: req.body.email,
            password: req.body.password,
            // image: req.body.image,
            classes: classes.slice(0, -1)
        }
    );
    prof.save()
        .then((result) => {
            console.log("Professeur added successfuly");
            Prof.find()
                .then(result => {
                    res.redirect("profs")
                })
                .catch(err => {
                    console.log(err);
                })
        })
        .catch(err => {
            console.log(err);
            res.send("error");
        })
})

app.post('/update', (req, res) => {
    const id = req.body.profid;
    Prof.findById(id)
        .then(result => {
            res.render('index', {
                person: result
            })
        })
        .catch(err => {
            console.log(err);
        })
})

app.post('/deleteprof', (req, res) => {
    const id = req.body.profid;
    Prof.findByIdAndDelete(id)
        .then(() => {
            Prof.find()
                .then((result) => {
                    res.redirect('profs');
                })
        })
        .catch(err => {
            console.log(err);
        })
})

app.get('/etudiants', async (req, res) => {

    if (ourClient.role == "Cordinateur") {
        await Student.find()
            .then(result => {
                global.allStudents = result;
            })
            .catch(err => {
                console.log(err);
            })
        await Note.find()
            .then(result => {
                global.toutesLesnotes = result;
            })
            .catch(err => {
                console.log(err);
            })
        await Prof.find()
            .then(result => {
                global.allprofs = result;
            })
            .catch(err => {
                console.log(err);
            })
        console.log(allStudents);
        res.render('etudiants', {
            person: allStudents,
            marks: toutesLesnotes,
            profs: allprofs
        })
    } else {
        res.render('error')
    }

})


app.get('/modules', (req, res) => {

    if (ourClient.role == "Cordinateur") {
        Modules.find()
            .then((result) => {
                res.render('modules', {
                    modules: result
                });
            })
            .catch(err => {
                console.log(err);
            })
    } else {
        res.render('error')
    }
})

app.get('/addmodule', (req, res) => {

    if (ourClient.role == "Cordinateur") {
        Prof.find()
            .then(result => {
                res.render('addmodule', {
                    profs: result
                });
            })
            .catch(err => {
                console.log(err);
            })
    } else {
        res.render('error')
    }
})

app.post('/updatemodule', (req, res) => {
    const id = req.body.moduleid;
    Prof.find()
        .then(result => {
            global.profsnames = result;
        })
        .catch(err => {
            console.log("Cannot retreive teacher's names")
        })
    Modules.findById(id)
        .then(result => {
            res.render('updatemodule', {
                modules: result,
                profs: profsnames
            })
        })
        .catch(err => {
            console.log(err);
        })
})

app.post('/update_module_selected', (req, res) => {

    let classes = ""

    if (req.body.isic1 == "on") {
        classes = classes + " ISIC-1 |"
    }
    if (req.body.isic2 == "on") {
        classes = classes + " ISIC-2 |"
    }
    if (req.body._2ite1 == "on") {
        classes = classes + " 2ITE-1 |"
    }
    if (req.body._2ite2 == "on") {
        classes = classes + " 2ITE-2 |"
    }

    let module = req.body;
    Modules.findByIdAndUpdate(module.moduleId,
        {
            nom: module.nom,
            professeur: module.professeur,
            description: module.description,
            classe: classes.slice(0, -1)
        },
        async (err, docs) => {
            if (err) {
                console.log(err)
            } else {
                console.log("Updated User : ", docs);
                Modules.find()
                    .then(result => {
                        res.render('modules',
                            {
                                modules: result,
                            });
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }
        })
})

app.post('/deletemodule', (req, res) => {
    const id = req.body.moduleid;
    Modules.findByIdAndDelete(id)
        .then(() => {
            Modules.find()
                .then((result) => {
                    res.render('modules', {
                        modules: result
                    });
                })
        })
        .catch(err => {
            console.log(err);
        })
})

app.post('/addmodule', (req, res) => {

    let classes = ""

    if (req.body.isic1 == "on") {
        classes = classes + " ISIC-1 |"
    }
    if (req.body.isic2 == "on") {
        classes = classes + " ISIC-2 |"
    }
    if (req.body._2ite1 == "on") {
        classes = classes + " 2ITE-1 |"
    }
    if (req.body._2ite2 == "on") {
        classes = classes + " 2ITE-2 |"
    }
    const module = new Modules(
        {
            nom: req.body.nom,
            professeur: req.body.professeur,
            description: req.body.description,
            classe: classes.slice(0, -1)
        }
    );
    module.save()
        .then((result) => {
            console.log("Module added successfuly");
            Modules.find()
                .then(result => {
                    res.render("modules", {
                        modules: result
                    })
                })
                .catch(err => {
                    console.log(err);
                })
        })
        .catch(err => {
            console.log(err);
            res.send("error");
        })
})

app.get('/notes', async (req, res) => {
    let listOfModules = []
    if (ourClient.role == "Professeur") {

        await Modules.find()
            .then(result => {
                listOfModules = result;
                // console.log(listOfModules);
                global.modulesList = [];

                listOfModules.forEach(module => {
                    if (module.professeur == (ourClient.prenom + " " + ourClient.nom)) {
                        modulesList.push(module);
                    }
                })
            })
            .catch(err => {
                console.log(err);
            })
        listOfMarks = [];
        Note.find()
            .then(result => {
                global.listOfMarks = result;
            })
            .catch(err => {
                console.log(err);
            })
        Student.find()
            .then(result => {
                res.render('notes', {
                    person: result,
                    modules: modulesList,
                    notes: listOfMarks,
                });
            })
            .catch(err => {
                console.log(err);
            })
    } else {
        res.render('error')
    }
})

app.get('/notes', (req, res) => {
    if (ourClient.role == "Professeur") {
        res.redirect('/notes');
    } else {
        res.render('error')
    }
})

app.post('/addmark', (req, res) => {
    if (ourClient.role == "Professeur") {
        const id = req.body.studentid;
        const moduleName = req.body.nomModule;
        Student.findById(id)
            .then(result => {
                res.render('donnernote', {
                    person: result,
                    module: moduleName
                })
            })
            .catch(err => {
                console.log(err)
            })
    } else {
        res.render('error')
    }
})

app.post('/updatemark', (req, res) => {
    if (ourClient.role == "Professeur") {
        const id = req.body.studentid;
        const moduleName = req.body.nomModule;
        const studentScore = req.body.note;
        Student.findById(id)
            .then(result => {
                res.render('modifiernote', {
                    person: result,
                    module: moduleName,
                    score: studentScore
                })
            })
            .catch(err => {
                console.log(err);
            })
    } else {
        res.render('error')
    }
})

app.post('/validatemark', (req, res) => {
    const note = new Note(
        {
            note: req.body.note,
            module: req.body.nameOfModule,
            professeur: ourClient.prenom + " " + ourClient.nom,
            etudiant: req.body.prenom + " " + req.body.nom,
        }
    );
    note.save()
        .then(result => {
            res.redirect('/notes')
        })
        .catch(err => {
            console.log(err)
        })

})

app.post('/updatenote', (req, res) => {
    const noteId = req.body.noteId;
    const updatedNote = {
        note: req.body.note,
        module: req.body.nameOfModule,
        professeur: ourClient.prenom + " " + ourClient.nom,
        etudiant: req.body.prenom + " " + req.body.nom,
    };

    Note.updateOne({ _id: noteId }, updatedNote)
        .then(result => {
            res.redirect('/notes');
        })
        .catch(err => {
            console.log(err);
            res.redirect('/notes'); // Handle error by redirecting to an appropriate page
        });
});


app.get('/consulternote', (req, res) => {
    if (ourClient.role = "Etudiant") {
        let listOfValidMarks = [];
        Note.find()
            .then(result => {
                result.forEach(student => {
                    if (student.etudiant == (ourClient.prenom + " " + ourClient.nom)) {
                        listOfValidMarks.push(student)
                    }
                });
                res.render('consulternote', {
                    listOfMarks: listOfValidMarks
                })
            })
            .catch(err => {
                console.log(err)
            })
    } else {
        res.render('error')
    }
})

app.post('/demanderecorrection', (req, res) => {
    const id = req.body.notemoduleid;

    Note.findById(id)
        .then(result => {
            res.render('demandes', {
                validmodule: result,
                person: ourClient,
                recorrection: true,
                voircopie: false,
                certif: false
            })
        })
        .catch(err => {
            console.log(err)
        })
})


app.post('/demandevoircopie', (req, res) => {
    const id = req.body.notemoduleid;

    Note.findById(id)
        .then(result => {
            res.render('demandes', {
                validmodule: result,
                person: ourClient,
                recorrection: false,
                voircopie: true,
                certif: false
            })
        })
        .catch(err => {
            console.log(err)
        })
})

app.post('/demandecertif', (req, res) => {
    const cin = req.body.cin;
    const cne = req.body.cne;
    const id = req.body.demcertid;

    Demcert.findById(id)
        .then(result => {// Assign the id value from result to a variable

            res.render('demandes', {
                certif: result,
                person: ourClient,
                recorrection: false,
                voircopie: false,
                certif: true,
                cin: cin, // Pass cin value to the rendering template
                cne: cne, // Pass cne value to the rendering template
            });
        })
        .catch(err => {
            console.log(err);
        });
});



app.get('/demandes', (req, res) => {
    if (ourClient.role == "Etudiant") {
        res.render('demandes', {
            validmodule: [],
            person: ourClient,
            recorrection: true,
            voircopie: false
        })
    } else {
        res.render('error')
    }
})

app.post('/pdfdemande', (req, res, next) => {


    // Sauvegarder la demande
    const demande = new Demande(
        {
            type: req.body.type,
            etudiant: req.body.etudiant,
            professeur: req.body.professeur,
            module: req.body.module,
            message: req.body.message,
            etat: "en attente"
        }
    );
    demande.save()
        .then(result => {
            // alert("Demande envoyée avec succès!");
            // Generate a PDF
            const stream = res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment;filename=invoice.pdf`,
            });
            pdfService.buildPDF(
                (chunk) => stream.write(chunk),
                () => stream.end(),
                demande
            );
            console.log(req.body.demandeid);
        })
        .catch(err => {
            console.log(err)
        })
});

app.post('/pdfcervice', (req, res, next) => {


    // Sauvegarder la demande
    const demcert = new Demcert(
        {
            type: req.body.type,
            etudiant: req.body.etudiant,
            cin: req.body.cin,
            cne: req.body.cne,
            email: req.body.email,
            message: req.body.message,
            etat: "en attente"
        }
    );
    demcert.save()
        .then(result => {
            // alert("Demande envoyée avec succès!");
            // Generate a PDF
            const stream = res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment;filename=invoice.pdf`,
            });
            pdfCervices.buildPDF(
                (chunk) => stream.write(chunk),
                () => stream.end(),
                demcert
            );
            console.log(req.body.demcertid);
        })
        .catch(err => {
            console.log(err)
        })
});

app.post('/pdfconvention', (req, res, next) => {

    const convention = new Convention(
        {
            type: req.body.type,
            etudiant: req.body.etudiant,
            cne: req.body.cne,
            telephone: req.body.telephone,
            filiere: req.body.filiere,
            adresse: req.body.adresse,
            datenaissance: req.body.datenaissance,
            lieunaissance: req.body.lieunaissance,
            nationalite: req.body.nationalite,
            email: req.body.email, // Assign the extracted email value
            etat: "en attente"
        }
    );

    convention.save()
        .then(result => {
            // alert("Demande envoyée avec succès!");
            // Generate a PDF
            const stream = res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment;filename=invoice.pdf`,
            });
            pdfConvention.buildPDF(
                (chunk) => stream.write(chunk),
                () => stream.end(),
                convention
            );
            console.log(req.body.conventionid);
        })
        .catch(err => {
            console.log(err)
        })
});

app.post('/pdfreleve', (req, res, next) => {

    const releve = new Releve(
        {
            type: req.body.type,
            etudiant: req.body.etudiant,
            cne: req.body.cne,
            telephone: req.body.telephone,
            filiere: req.body.filiere,
            anneeuniv: req.body.anneeuniv,
            email: req.body.email, // Assign the extracted email value
            etat: "en attente"
        }
    );

    releve.save()
        .then(result => {
            // alert("Demande envoyée avec succès!");
            // Generate a PDF
            const stream = res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment;filename=invoice.pdf`,
            });
            pdfReleve.buildPDF(
                (chunk) => stream.write(chunk),
                () => stream.end(),
                releve
            );
        })
        .catch(err => {
            console.log(err)
        })
});

app.post('/pdfcertif', (req, res, next) => {


    // Sauvegarder la demande
    const certif = new Certificat(
        {
            etudiant: req.body.etudiant,
            cin: req.body.cin,
            cne: req.body.cne,
            telephone: req.body.telephone,
            email: req.body.email,
            datedepot: req.body.datedepot
        }
    );
    certif.save()
        .then(result => {
            // alert("Certificat téléchargé avec succès!");
            // Generate a PDF
            const stream = res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment;filename=invoice.pdf`,
            });
            pdfCertif.buildPDF(
                (chunk) => stream.write(chunk),
                () => stream.end(),
                certif
            );
        })
        .catch(err => {
            console.log(err)
        })
});


app.get('/suivredemande', (req, res) => {
    if (ourClient.role == "Etudiant") {
        let listOfDemandes = []
        Demande.find()
            .then(result => {
                result.forEach(demande => {
                    if (demande.etudiant == (ourClient.prenom + " " + ourClient.nom)) {
                        listOfDemandes.push(demande);
                    }
                });
                res.render('suivredemande', {
                    demandes: listOfDemandes
                })
            })
            .catch(err => {
                console.log(err);
            })
    } else {
        res.render('error')
    }
})

app.get('/suivredemcert', (req, res) => {
    if (ourClient.role == "Etudiant") {
        let listOfDemcerts = [];
        let listOfConventions = [];
        let listOfReleves = [];

        Demcert.find()
            .then(result => {
                result.forEach(demcert => {
                    if (demcert.etudiant == (ourClient.prenom + " " + ourClient.nom)) {
                        listOfDemcerts.push(demcert);
                    }
                });

                Convention.find()
                    .then(conventionResult => {
                        conventionResult.forEach(convention => {
                            if (convention.etudiant == (ourClient.prenom + " " + ourClient.nom)) {
                                listOfConventions.push(convention);
                            }
                        });

                        Releve.find()
                            .then(releveResult => {
                                releveResult.forEach(releve => {
                                    if (releve.etudiant == (ourClient.prenom + " " + ourClient.nom)) {
                                        listOfReleves.push(releve);
                                    }
                                });

                                res.render('suivredemcert', {
                                    demcerts: listOfDemcerts,
                                    conventions: listOfConventions,
                                    releves: listOfReleves
                                });
                            })
                            .catch(err => {
                                console.log(err);
                            });
                    })
                    .catch(err => {
                        console.log(err);
                    });
            })
            .catch(err => {
                console.log(err);
            });
    } else {
        res.render('error');
    }
});


app.get('/certifscolarite', (req, res) => {
    if (ourClient.role == "Etudiant") {
        let Demandecertif = []
        Demcert.find()
            .then(result => {
                result.forEach(demcert => {
                    if (demcert.etudiant == (ourClient.prenom + " " + ourClient.nom)) {
                        Demandecertif.push(demcert);
                    }
                });
                res.render('certifscolarite', {
                    person: ourClient,
                    demcerts: Demandecertif
                })
            })
            .catch(err => {
                console.log(err);
            })
    } else {
        res.render('error')
    }
})


app.get('/relevedenote', (req, res) => {
    if (ourClient.role == "Etudiant") {
        let Demandereleve = []
        Releve.find()
            .then(result => {
                result.forEach(releve => {
                    if (releve.etudiant == (ourClient.prenom + " " + ourClient.nom)) {
                        Demandereleve.push(releve);
                    }
                });
                res.render('relevedenote', {
                    person: ourClient,
                    releves: Demandereleve
                })
            })
            .catch(err => {
                console.log(err);
            })
    } else {
        res.render('error')
    }
})

app.get('/conventiondestage', (req, res) => {
    if (ourClient.role == "Etudiant") {
        let demandeconvention = []
        Convention.find()
            .then(result => {
                result.forEach(demande => {
                    if (demande.etudiant == (ourClient.prenom + " " + ourClient.nom)) {
                        demandeconvention.push(demande);
                    }
                });
                res.render('conventiondestage', {
                    person: ourClient,
                    demandes: demandeconvention
                })
            })
            .catch(err => {
                console.log(err);
            })
    } else {
        res.render('error')
    }
})

app.get('/lettrederecommendation', (req, res) => {
    if (ourClient.role == "Etudiant") {
        let Demanderecommandation = []
        Demande.find()
            .then(result => {
                result.forEach(demande => {
                    if (demande.etudiant == (ourClient.prenom + " " + ourClient.nom)) {
                        Demanderecommandation.push(demande);
                    }
                });
                res.render('lettrederecommendation', {
                    demandes: Demanderecommandation
                })
            })
            .catch(err => {
                console.log(err);
            })
    } else {
        res.render('error')
    }
})

app.post('/deletedemande', (req, res) => {
    const id = req.body.demandeid;
    Demande.findByIdAndDelete(id)
        .then(() => {
            Demande.find()
                .then((result) => {
                    res.redirect('suivredemande');
                })
        })
        .catch(err => {
            console.log(err);
        })
})

app.post('/deletedemcert', (req, res) => {
    const id = req.body.demcertid;
    Demcert.findByIdAndDelete(id)
        .then(() => {
            Demcert.find()
                .then((result) => {
                    res.redirect('suivredemcert');
                })
        })
        .catch(err => {
            console.log(err);
        })
})

app.post('/deleteconvention', (req, res) => {
    const id = req.body.conventionid;
    Convention.findByIdAndDelete(id)
        .then(() => {
            Convention.find()
                .then((result) => {
                    res.redirect('suivredemcert');
                })
        })
        .catch(err => {
            console.log(err);
        })
})

app.post('/deletereleve', (req, res) => {
    const id = req.body.releveid;
    Releve.findByIdAndDelete(id)
        .then(() => {
            Releve.find()
                .then((result) => {
                    res.redirect('suivredemcert');
                })
        })
        .catch(err => {
            console.log(err);
        })
})

app.get('/listedemandes', (req, res) => {
    if (ourClient.role == "Professeur") {
        let listedesdemandes = [];
        Demande.find()
            .then(result => {
                result.forEach(demande => {
                    if (demande.professeur == (ourClient.prenom + " " + ourClient.nom)) {
                        listedesdemandes.push(demande);
                    }
                });
                res.render('listedemandes', {
                    demandes: listedesdemandes
                })
            })
            .catch(err => {
                console.log(err)
            })

    } else {
        res.render('error')
    }
})

app.get('/listedesdemandes', (req, res) => {
    if (ourClient.role == "Cordinateur") {
        let listedesdemcerts = [];
        let listedesconventions = [];
        let listedesreleves = [];

        Demcert.find()
            .then(demcertResult => {
                demcertResult.forEach(demcert => {
                    listedesdemcerts.push(demcert);
                });

                Convention.find()
                    .then(conventionResult => {
                        conventionResult.forEach(convention => {
                            listedesconventions.push(convention);
                        });
                        Releve.find()
                            .then(releveResult => {
                                releveResult.forEach(releve => {
                                    listedesreleves.push(releve);
                                });
                                res.render('listedesdemandes', {
                                    demcerts: listedesdemcerts,
                                    conventions: listedesconventions,
                                    releves: listedesreleves
                                });
                            })
                            .catch(err => {
                                console.log(err);
                            });
                    })
                    .catch(err => {
                        console.log(err);
                    });
            })
            .catch(err => {
                console.log(err);
            });
    } else {
        res.render('error');
    }
});


app.post('/downloaddemande', (req, res) => {
    const id = req.body.demandeid;
    Demande.findById(id)
        .then(result => {
            // Generate a PDF
            const stream = res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment;filename=invoice.pdf`,
            });
            pdfCervices.buildPDF(
                (chunk) => stream.write(chunk),
                () => stream.end(),
                result
            );
        })
})

app.post('/downloadcertif', (req, res) => {
    const id = req.body.demcertid;
    Demcert.findById(id)
        .then(result => {
            // Generate a PDF
            const stream = res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment;filename=invoice.pdf`,
            });
            pdfCervices.buildPDF(
                (chunk) => stream.write(chunk),
                () => stream.end(),
                result
            );
        })
})

app.post('/downloadconv', (req, res) => {
    const id = req.body.conventionid;
    Convention.findById(id)
        .then(result => {
            // Generate a PDF
            const stream = res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment;filename=invoice.pdf`,
            });
            pdfConvention.buildPDF(
                (chunk) => stream.write(chunk),
                () => stream.end(),
                result
            );
        })
})

app.post('/downloadrel', (req, res) => {
    const id = req.body.releveid;
    Releve.findById(id)
        .then(result => {
            // Generate a PDF
            const stream = res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment;filename=invoice.pdf`,
            });
            pdfReleve.buildPDF(
                (chunk) => stream.write(chunk),
                () => stream.end(),
                result
            );
        })
})

app.post('/downloadcerter', (req, res) => {
    const id = req.body.demcertid;
    Demcert.findById(id)
        .then(result => {
            // Generate a PDF
            const stream = res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment;filename=invoice.pdf`,
            });
            pdfCertif.buildPDF(
                (chunk) => stream.write(chunk),
                () => stream.end(),
                result
            );
        })
})

app.post('/professeurdecision', (req, res) => {
    const id = req.body.demandeid;
    console.log(id)
    Demande.findByIdAndUpdate(id, { etat: req.body.decision },
        function (err, docs) {
            if (err) {
                console.log(err)
            } else {
                console.log("Updated demande : ", docs);
            }
        });
    res.redirect('listedemandes')
})

app.post('/admindecision', (req, res) => {
    const id = req.body.demcertid;
    const decision = req.body.decision;

    // Retrieve the email address of the student from the database
    Demcert.findById(id, (err, demcert) => {
        if (err) {
            console.log(err);
        } else {
            const studentEmail = demcert.email; // Assuming the email is stored in the 'email' field

            Demcert.findByIdAndUpdate(id, { etat: req.body.decision }, (err, docs) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Updated demande: ", docs);

                    if (decision === 'Approuvée') {
                        // Set up Nodemailer transporter
                        const transporter = nodemailer.createTransport({
                            host: 'smtp.gmail.com',
                            port: 465,
                            secure: true,
                            auth: {
                                user: 'laasrimohamed2023@gmail.com',
                                pass: 'voylbdulhhvbbokr'
                            }
                        });

                        // Compose email
                        const mailOptions = {
                            from: 'laasrimohamed2023@gmail.com',
                            to: studentEmail, // Use the student's email address as the recipient
                            subject: 'Demande de certificat de scolarité approuvée!',
                            text: 'Votre demande de certificat de scolarité a été bien approuvée. Vous pouvez la télécharger maintenant.'
                        };

                        // Send email
                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                console.log('Email sending error:', error);
                            } else {
                                console.log('Email sent:', info.response);
                            }
                        });
                    }
                }
            });
        }
    });
    res.redirect('listedesdemandes');
})

app.post('/admindecisi', (req, res) => {
    const id = req.body.releveid;
    const decision = req.body.decision;

    // Retrieve the email address of the student from the database
    Releve.findById(id, (err, releve) => {
        if (err) {
            console.log(err);
        } else {
            const studentEmail = releve.email; // Assuming the email is stored in the 'email' field

            Releve.findByIdAndUpdate(id, { etat: req.body.decision }, (err, docs) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Updated demande: ", docs);

                    if (decision === 'Approuvée') {
                        // Set up Nodemailer transporter
                        const transporter = nodemailer.createTransport({
                            host: 'smtp.gmail.com',
                            port: 465,
                            secure: true,
                            auth: {
                                user: 'laasrimohamed2023@gmail.com',
                                pass: 'voylbdulhhvbbokr'
                            }
                        });

                        // Compose email
                        const mailOptions = {
                            from: 'laasrimohamed2023@gmail.com',
                            to: studentEmail, // Use the student's email address as the recipient
                            subject: 'Demande de relevé de notes approuvée!',
                            text: 'Votre demande de relevé de notes a été bien approuvée. Elle est maintenant disponible chez l accueil de l ENSAJ.'
                        };

                        // Send email
                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                console.log('Email sending error:', error);
                            } else {
                                console.log('Email sent:', info.response);
                            }
                        });
                    }
                }
            });
        }
    });
    res.redirect('listedesdemandes');
})

app.post('/admindecisio', (req, res) => {
    const id = req.body.conventionid;
    const decision = req.body.decision;

    // Retrieve the email address of the student from the database
    Convention.findById(id, (err, convention) => {
        if (err) {
            console.log(err);
        } else {
            const studentEmail = convention.email; // Assuming the email is stored in the 'email' field

            Convention.findByIdAndUpdate(id, { etat: req.body.decision }, (err, docs) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Updated demande: ", docs);

                    if (decision === 'Approuvée') {
                        // Set up Nodemailer transporter
                        const transporter = nodemailer.createTransport({
                            host: 'smtp.gmail.com',
                            port: 465,
                            secure: true,
                            auth: {
                                user: 'laasrimohamed2023@gmail.com',
                                pass: 'voylbdulhhvbbokr'
                            }
                        });

                        // Compose email
                        const mailOptions = {
                            from: 'laasrimohamed2023@gmail.com',
                            to: studentEmail, // Use the student's email address as the recipient
                            subject: 'Demande de convention de stage approuvée!',
                            text: 'Votre demande de convention de stage a été bien approuvée. Elle est maintenant disponible chez l accueil de l ENSAJ.'
                        };

                        // Send email
                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                console.log('Email sending error:', error);
                            } else {
                                console.log('Email sent:', info.response);
                            }
                        });
                    }
                }
            });
        }
    });
    res.redirect('listedesdemandes');
})

app.get('/dash', async (req, res) => {
    if (ourClient.role == "Cordinateur") {
        await Student.find()
            .then(result => {
                studentsNumber = result.length;
            })
            .catch(err => {
                console.log(err);
            })

        await Prof.find()
            .then(result => {
                profsNumber = result.length;
            })
            .catch(err => {
                console.log(err);
            })
        await Note.find()
            .then(result => {
                result.forEach(point => {
                    global.listdesnOtes = result;
                });
            })

        res.render('dash', {
            studentsNumber: studentsNumber,
            profsNumber: profsNumber
        })
    } else {
        res.render('error')
    }
})

app.get('*', (req, res) => {
    res.redirect('error')
})
