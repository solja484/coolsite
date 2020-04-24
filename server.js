let express = require('express');
let server = express();
let mongoClient = require("mongodb").MongoClient;
let ObjectId = require('mongodb').ObjectId;
let url = "mongodb://localhost:27017/coolsite";
let bodyParser = require('body-parser');
let config = require('./config.json');
let crypto = require('crypto');
let nodemailer = require("nodemailer");

server.set("view engine", "pug");
server.set('views', './');

server.use(express.static(__dirname));
server.use(bodyParser.urlencoded({extended: true}));

const PORT = 3000;
let db;


mongoClient.connect(url, {useUnifiedTopology: true}, (err, client) => {
    if (err) return console.log(err);
    db = client.db('coolsite');
    server.listen(PORT, () => {
        console.log('listening on ' + PORT);
    })
});

const menu = [
    {
        "href": "/",
        "title": {
            "ukr": "ГОЛОВНА",
            "eng": "MAIN"
        },
        "id": "menu_main"
    },
    {
        "href": "/books",
        "title": {
            "ukr": "КНИГИ",
            "eng": "BOOKS"
        },
        "id": "menu_books"
    },
    {
        "href": "/about",
        "title": {
            "ukr": "ПРО НАС",
            "eng": "ABOUT US"
        },
        "id": "menu_about"
    },
];

const content = {
    "main": {
        "eng": "Welcome to our book catalogue!",
        "ukr": "Ласкаво просимо до нашого книжкового каталогу!",
    },
    "about": {
        "eng": "We're cool😎",
        "ukr": "Ми круті😎"
    }
};

const bk = {
    "eng": {
        "author": "Author:",
        "title": "Title:",
        "more": "more...",
        "less": "less"
    },
    "ukr": {
        "author": "Автор:",
        "title": "Назва:",
        "more": "детальніше...",
        "less": "згорнути"
    }
};


server.get('/', function (req, res) {
    const lang = req.query.lang ? req.query.lang : "ukr",
        url_path = req.url.split('?')[0];
    res.render('./views/main.pug', {info: {config: config, url_path, lang: lang}, menu: menu, content: content.main});
});


server.get('/about', function (req, res) {
    const lang = req.query.lang ? req.query.lang : "ukr",
        url_path = req.url.split('?')[0];
    res.render('./views/main.pug', {info: {config: config, url_path, lang: lang}, menu: menu, content: content.about});
});


server.get('/applications', function (req, res) {
    db.collection('applications').find().toArray((err, result) => {
        if (err) return console.log(err);
        res.render('./views/applications.pug', {info: {config: config}, data: result})
    });

});

server.get('/books', function (req, res) {
    const lang = req.query.lang ? req.query.lang : "ukr",
        url_path = req.url.split('?')[0];
    db.collection('books').find().toArray((err, result) => {
        if (err) return console.log(err);
        res.render('./views/main.pug', {info: {config: config, url_path, lang: lang}, menu: menu, bk:bk,books: result});
    });

});


server.post('/register', function (req, res) {
    const lang = req.query.lang ? req.query.lang : "ukr",
        url_path = req.url.split('?')[0];
    const hash = crypto.createHmac('sha256', req.body.email+req.body.username+req.body.phone+req.body.comments+req.time)
        .update(config.hash).digest('hex');
    const user = {hash, confirmed: false, ...req.body};
    db.collection('applications').insertOne(user).then(
        (result, err) => {
            send(user, lang).catch((err) => console.log(err));
            if (err) return console.log(err);
            console.log('saved to database');
            res.redirect('/');
        })
});

server.get('/confirm/:hash', function (req, res) {

    db.collection('applications').updateOne({hash: req.params.hash}, {$set: {"confirmed": true},}).then(
        (result, err) => {
            if (err) return console.log("error in confirmation");
            res.redirect('/');
        })

});


let confirm = {
    "ukr": {
        "message":
            "Перейдіть за посиланням, щоб завершити реєстрацію",
        "subject": "Підтвердження електронної пошти"
    },
    "eng": {
        "message":
            "Please follow the link to complete your registration",
        "subject": "Email confirmation"
    }
};

async function send(user, lang) {
    let mailfrom = 'gingermias@gmail.com';
    let mailto = 'solja484@gmail.com';

    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        port: 587,
        secure: false,
        auth: {
            user: "gingermias@gmail.com",
            pass: "barbareum47"
        }
    });

    let result = await transporter.sendMail({
        from: "gingermias@gmail.com",
        to: user.email,
        subject: confirm[lang].subject,
        text: confirm[lang].message + "\n" + "http://localhost:3000/confirm/" + user.hash

    });
    console.log(result);

}

