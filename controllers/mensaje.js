const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const async = require("hbs/lib/async");
const { promisify } = require('util');
const { DATE } = require("mysql/lib/protocol/constants/types");
const controller = {};
const inquirer = require('inquirer');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

controller.Mensaje = async (req, res) => {
    const { question1, question2, question3, question4, question5 } = req.body;

    var mensaje = check(question1, question2, question3, question4, question5);
    const fecha = Date.now();
    const fecha_actual = new Date(fecha);
    const fechaf = fecha_actual.getFullYear() + "-" + fecha_actual.getMonth() + 1 + "-" + fecha_actual.getDate()
    const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);



    db.query('INSERT INTO Results SET ?', { id_usuario: decoded.id, mensaje: mensaje, fecha: fechaf }, (error) => {
        if (error) {
            console.log(error);
        } else {
            console.log('corecto', mensaje);
        }
    })

    db.query('SELECT distinct fecha FROM Results order by fecha asc', async (error, result) => {
        if (error) {
            console.log('error');
        }
        for (let index = 0; index < result.length; index++) {
            console.log(result[index].fecha);

        }

        const fecha_i = {
            type: 'input',
            name: 'fecha_inicio',
            message: "FechaInicio",

        };

        const pregunta = [fecha_i];

        const resultado = await inquirer.prompt(pregunta).then(answers => {
            return answers;
        });

        const fecha_inicio = resultado['fecha_inicio'];

        db.query(`SELECT A.id, A.mensaje, A.fecha, B.name FROM Results A LEFT JOIN Users B on A.id_usuario = B.id
        WHERE fecha >= CAST((?) AS DATE) order by fecha asc`, fecha_inicio, (error, result) => {
                if (error) {
                    console.log('error');
                }

                console.log(result);
            });

    });


    if (mensaje == 'Shy') {
        res.redirect('/shy');
    } else {
        res.redirect('/determined');
    }
}

function check(question1, question2, question3, question4, question5) {

    var correct1 = 0;
    var correct2 = 0;

    if (question1 == "One") {
        correct1++;
    }
    if (question1 == "Second") {
        correct2++;
    }
    if (question2 == "One") {
        correct1++;
    }
    if (question2 == "Second") {
        correct2++;
    }
    if (question3 == "One") {
        correct1++;
    }
    if (question3 == "Second") {
        correct2++;
    }
    if (question4 == "One") {
        correct1++;
    }
    if (question4 == "Second") {
        correct2++;
    }
    if (question5 == "One") {
        correct1++;
    }
    if (question5 == "Second") {
        correct2++;
    }

    var message = "";

    var path = "";
    if ((correct2 == correct1 && correct2 == 0) || correct2 + correct1 != 5) {
        message = "Complete the test"
        path = "/test"
    }
    else if (correct1 > correct2) {
        message = "Shy"
        path = "/shy"
    } else if (correct2 != correct1) {
        message = "Determined"
        path = "/determined"
    }


    console.log(message);
    return message;
}
module.exports = controller;