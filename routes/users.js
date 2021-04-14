var express = require('express');
var router = express.Router();
const fs = require("fs");
const cors = require("cors");
const rand = require("random-key");
const LocalStorage = require("node-localstorage").LocalStorage;
localStorage = new LocalStorage("./scratch");
router.use(cors());

/* GET users listing. */
router.get("/", (req, res, next) => {

  res.send("Hej från routern");
  
});

// Hämta input-värderna och kolla om inloggningen stämmer
router.post('/', function(req, res, next) {

  // Hämta input-värderna från en post i frontend
  let getUser = req.body;

  // Läs users.json-filen
  fs.readFile("users.json", (err, data) => {

    if (err) {
      console.log(err);
    };

    let users = JSON.parse(data);

    // Loopa igenom arrayen från users.json och kolla om den matchar med input-värderna
    for (user in users) {

      if (getUser.userName == users[user].userName && getUser.passWord == users[user].passWord) {

        userId = users[user].id;
        console.log("Användare inloggad: ", userId);

        // Skickar till localstorage/scratch-filen
        localStorage.setItem("User", userId);
        // res.send(userId);

        // Skickar svar till console-loggen
        res.json("Från backend: Inloggning lyckad");
        return;

      };
    };
    const Err = new Error("404, Fel inloggning!");
    console.error(Err.message);

    // Skickar svar till console-loggen
    res.json("Från backend: Misslyckad inloggning");

  });
});


// Kunna lägga till en ny användare i min users.json-fil
router.post("/new", (req, res) => {

  // Hämtar ny array från post i frontend
  let newUser = req.body;

  // Ger den ett unikt id
  newUser.id = rand.generateDigits(5);

  console.log(newUser);

  // Läser users.json-filen
  fs.readFile("users.json", (err, data) => {

    if (err) {
      console.log(err);
      
      // Felmeddelande om fil-vägen skulle vara fel
      if (err.code == "ENOENT") {

        console.log("404, nej nu gick något fel!");
        res.json("404, nej nu gick något fel!");

      };
    };

    let users = JSON.parse(data);
    
    // Pushar ny användare
    users.push(newUser);

    // Skriver in den i users.json-filen
    fs.writeFile("users.json", JSON.stringify(users, null, 2), function(err) {

      if (err) {
        console.log(err);
      };

      res.json("Ny användare skapad");
      console.log("Ny användare skapad");

    });
  });
});

module.exports = router;