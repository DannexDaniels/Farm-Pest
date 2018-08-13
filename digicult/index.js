var express = require('express');
var mysql = require('mysql');
var bodyparser = require('body-parser');

var app = express();

app.use(express.static(__dirname + '/views'));
//app.use(express.static(__dirname + '/views/admin'));
app.use(bodyparser.urlencoded());

app.set('view engine', 'ejs');

//setting the connection variables
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "dannexte_digicult"
});

//loading the home page
app.get('/',function (req,res) {
    res.render('home');
});

app.get('/admin',function (req,res) {
    connection.query("SELECT ( SELECT COUNT(*) FROM farmer ) AS farmer, ( SELECT COUNT(*) FROM smartfarmer ) AS specialist, ( SELECT COUNT(*) FROM agrovet ) AS agrovets, ( SELECT COUNT(*) FROM help_requests ) AS requests FROM dual", function (err,result,fields) {
        if (err) throw err;
        console.log(result);
        res.render('admin/index',{farmer: result[0].farmer, specialist: result[0].specialist, requests: result[0].requests, agrovet: result[0].agrovets});
    });
});
app.get('/farmers_list', function (req,res){
    connection.query("SELECT * FROM farmer", function (err,result,fields) {
        if (err) throw err;
        console.log(result);
        res.render('admin/farmers_list', {data: result});
    });
});
app.get('/specialist_list', function (req,res){
    connection.query("SELECT * FROM smartfarmer", function (err,result,fields) {
        if (err) throw err;
        console.log(result);
        res.render('admin/specialist_list', {data: result});
    });

});
app.get('/agrovet_list', function (req,res){
    connection.query("SELECT * FROM agrovet", function (err,result,fields) {
        if (err) throw err;
        console.log(result);
        res.render('admin/agrovets_list', {data: result});
    });

});
app.get('/help_request_list', function (req,res){
    connection.query("SELECT * FROM help_requests", function (err,result,fields) {
        if (err) throw err;
        console.log(result);
        res.render('admin/help_request_list', {data: result});
    });

});

app.post('/authenticate_admin',function (req,res) {
    connection.query("SELECT * FROM auth WHERE username = '"+req.body.email+"' AND password = '"+req.body.password+"'", function (err, result,fields) {
        if (err) throw err;
        if(result === undefined || result.length == 0){
            console.log("nothing found");
        }else{
            console.log(result);
            res.render('admin');
        }

    });
});

app.post('/add_agrovet',function (req,res) {
    console.log("INSERT INTO agrovet (agrovet_id, agrovet_name, agrovet_phone, agrovet_email, agrovet_location, agrovet_address) VALUES ('"+req.body.idno+"', '"+req.body.fname+" "+req.body.lname+"', '"+req.body.phone+"', '"+req.body.email+"', '"+req.body.location+"', '"+req.body.address+"') ");

    connection.query("INSERT INTO agrovet (agrovet_id, agrovet_name, agrovet_phone, agrovet_email, agrovet_location, agrovet_address) VALUES ('"+req.body.idno+"', '"+req.body.fname+" "+req.body.lname+"', '"+req.body.phone+"', '"+req.body.email+"', '"+req.body.location+"', '"+req.body.address+"') ", function (err, result,fields) {
        if (err) throw err;
        res.render('home');
    });
});

app.listen(1337,function () {
    console.log('server is up and running');
});

