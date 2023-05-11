var express = require('express')
var cors = require('cors')
// var bodyParser = require('body-parser')
// var jsonParser = bodyParser.json() 
var jwt = require('jsonwebtoken');
const secret = 'Lilyn'

// const mysql = require('mysql2');
//  const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     database: 'webb'
// }); 



var app = express()
app.use(cors())
app.use(express.json())

require('dotenv').config()
const mysql = require('mysql2')
const connection = mysql.createConnection(process.env.DATABASE_URL)
console.log('Connected to PlanetScale!')

app.get('/information', function (req, res, next) {
    connection.query(
        'SELECT * FROM `information`',
        function (err, results, fields) {
            res.json(results);
        }
    );
})

app.get('/getinformation/', function (req, res, next) {
    try {
    const token = req.headers.authorization.split(" ")[1];
    var decoded = jwt.verify(token, secret);
    //res.json({ status: "error", message: decoded });
    connection.query(
        'SELECT * FROM `information` WHERE `email` = ?',
        [decoded.Users],
        function (err, results) {
            res.json(results);
        }
    );
    } catch (err) {
        return res.json({ status: "error", message: err.message });
    }
})

app.post('/updateinformation', function (req, res, next) {
    const data1 = req.body.data1;
    const data2 = req.body.data2;
    const data3 = req.body.data3;
    const data4 = req.body.data4;
    const data5 = req.body.data5;
    const data6 = req.body.data6;
    const data7 = req.body.data7;
    const data8 = req.body.data8;
    const data9 = req.body.data9;
    const data10 = req.body.data10;
    const token = req.headers.authorization.split(" ")[1];
    var decoded = jwt.verify(token, secret);
    connection.execute(
        'UPDATE information SET `cardnumber` = ?, `name` = ?, `surname` = ?, `nickname` = ?, `age` = ?, `address` = ?, `parentname` = ?, `phone` = ?, `email` = ?, `allergicfood` = ? WHERE email = ?',
        [req.body.data1, req.body.data2, req.body.data3, req.body.data4, req.body.data5, req.body.data6, req.body.data7, req.body.data8, req.body.data9, req.body.data10, decoded.Users],
        function (err, results) {
            if (err) {
                console.log(err);
            }else{
                res.json({status: "success", message:results});
            }
        }
    );
})

app.get('/information/:id', function (req, res, next) {
    const id = req.params.id;
    connection.query(
        'SELECT * FROM `information` WHERE `id` = ?',
        [id],
        function (err, results) {
            res.json(results);
        }
    );
})

app.post('/addinformation', function (req, res, next) {
    // const data1 = req.body.data1;
    // const data2 = req.body.data2;
    // const data3 = req.body.data3;
    // const data4 = req.body.data4;
    // const data5 = req.body.data5;
    // const data6 = req.body.data6;
    // const data7 = req.body.data7;
    // const data8 = req.body.data8;
    // const data9 = req.body.data9;
    // const data10 = req.body.data10;
    connection.execute(
        'INSERT INTO information (cardnumber, name, surname, nickname, age, address, parentname, phone, email, allergicfood) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [req.body.cardnumber, req.body.name, req.body.surname, req.body.nickname, req.body.age, req.body.address, req.body.parentname, req.body.phone, req.body.email, req.body.allergicfood],
        function (err, results) {
            if (err) {
                console.log(err);
            }else{
                res.json({status: "success", message:results});
            }
        }
    );
})

app.post('/login' , function (req, res, next) {
    connection.execute(
        'SELECT * FROM information WHERE email = ? AND cardnumber = ?',
        [req.body.email,req.body.cardnumber],
        function(err, results, fields) {
            if (err) {
                res.json({status: 'error', message: err})
                return
            } else if(results.length > 0){
                const token = jwt.sign({Users: req.body.Users}, secret, { expiresIn: '1h' });
                res.json({status: 'ok', message: "Login success" ,token: token})
            }else{
                res.json({status: 'error', message: 'Invalid username'})
            }
        }
    );
})

app.listen(5000, function () {
    console.log('CORS-enabled web server listening on port 5000')
})