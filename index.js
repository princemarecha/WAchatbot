
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const fetch = require('node-fetch');
const fs = require('fs');

const webApp = express();

webApp.use(bodyParser.urlencoded({ extended: true }));

webApp.use(bodyParser.json());

const PORT = process.env.PORT;

function stats(start, filler) {
    let newFile = {
         start: start,
         filler : filler
            
    }

    fs.writeFile("./status.json", JSON.stringify(newFile), (err) => {
        if (err) throw err;
        console.log("Done writing"); // Success
    });
}

 function statsRead() {

    return fs.readFileSync("./status.json","utf8" ,(err, data) => {
        if (err) throw err;
        let stats = JSON.parse(data);
        //console.log(stats); // Success
        return stats;
    })
}

async function sabhari() {
    const {Paynow} = require('paynow');

let paynow = new Paynow("15836","7319f42d-729b-41e0-8683-77f2d7f82feb");




let payment = paynow.createPayment("Invoice 41", "pmanstylz@gmail.com");
    payment.add("Bananas", 2.5);
    payment.add("Apples", 1.0);

    const jerome  = await paynow.sendMobile(
        
        // The payment to send to Paynow
        payment, 

        // The phone number making payment
        '0776844446',
        
        // The mobile money method to use. 
        'ecocash' 

    ).then(function(response) {
        if(response.success) {
            // These are the instructions to show the user. 
            // Instruction for how the user can make payment
            let instructions = response.instructions // Get Payment instructions for the selected mobile money method

            // Get poll url for the transaction. This is the url used to check the status of the transaction. 
            // You might want to save this, we recommend you do it
            let pollUrl = response.pollUrl; 

            console.log(instructions)
            return instructions;

        } else {
            console.log(response.error)
        }
    }).catch(ex => {
        // Ahhhhhhhhhhhhhhh
        // *freak out*
        console.log('Your application has broken an axle', ex)
    });

    return jerome;
}


webApp.get('/', async (req, res) => {
    res.send('Hello World!');
    stats();
});

const WA = require ("./helper/whatsapp-send-messages.js");
const { response } = require('express');

webApp.post('/whatsapp', async (req, res) => {
    console.log(req.body);

    var filler = JSON.parse(statsRead()).filler;
    var start = JSON.parse(statsRead()).start;
    

    //  const newani  = await fetch('https://jsonplaceholder.typicode.com/todos/1')
    //   .then(response => response.json())
    //   .then((json) => {return json})

    if (req.body.Body === 'Hello' && start !== "Start") {

        var op = ("*Welcome to the world of Entertainment*📺 \n \n How may I be of help Today \n \n 1️⃣ DSTV Payments \n 2️⃣ Available Bouqets \n 3️⃣ About Us \n 4️⃣ Help \n 5️⃣ Exit")
        await WA.sendMessage(req.body.From, '👋Hi, I am Mukanya🐵, how are you? \n \n '+ op); 
        stats("Start", "idle");
       
    }

    else if (req.body.Body === '1' && start === "Start" && filler === "idle") {
        
        var op1 = ("DSTV Payments 📺 \n \n 1️⃣Ecocash (ZWL) \n 2️⃣Ecocash (USD) \n 3️⃣ V-Payment \n 4️⃣Exit")
        await WA.sendMessage(req.body.From, '*Please select a Payment Method* 💳 \n \n '+ op1);
        stats("Start", "payment");
        
    }

    else if (req.body.Body === '1' && filler === "payment") {
        var message = await sabhari();
        let senderID = req.body.From;
    
        console.log(message);
        console.log(senderID);
    
        // return mssage to user
        await WA.sendMessage(senderID, message + " \n \n Thank you for using Mukanya's DStv Self Service 😊. \n \n Have a great day! 👍🏿 \n \n Say \"Hello\" to start again 🐒");
        stats("stop", "");
    }

    else if (req.body.Body === '2' && filler === "payment"|| req.body.Body === '3' && filler === "payment") {
        await WA.sendMessage(req.body.From, "🙈 Option Coming Soon, Thank you, please choose another option form the above list");
        return;
    }
    else if (req.body.Body === '4' && filler === "payment") {
        var op7 = ("😊Thank you for using Mukanya's DStv Self Service. \n \n Have a great day!👍🏿");
        await WA.sendMessage(req.body.From, 'Exit⚠️ \n \n '+ op7);
        stats("stop", "");
        return;
    }

    else if (req.body.Body === '2' && start === "Start" && filler === "idle") {
        filler = "bouquets";
        var op2 = ("DSTV Payments \n \n 1️⃣ DSTV Premium \n 2️⃣ DSTV Compact Plus \n 3️⃣ DSTV Compact \n 4️⃣ DSTV Family \n 5️⃣ DSTV Access \n 6️⃣ Exit")
        await WA.sendMessage(req.body.From, 'Available Bouquets 📺 \n \n '+ op2);
        stats("Start", "bouquets");
        return;
    }

    

    else if (req.body.Body === '3' && start === "Start" && filler === "idle") {
        
        var op3 = ("💵Payments are made easy with Mukanya's DStv  Self Service. \n \n say *\"Hello!\"* now \n \n and pay for your entertainment📺 in the comfort of your home🏘️. You can pay for your own subscription💸 or help others pay for their DStv subscription.🙂")
        await WA.sendMessage(req.body.From, 'About Us🐒 \n \n '+ op3);
        stats("Stop", "idle");
        return;
    }
    else if (req.body.Body === '4' && start === "Start" && filler === "idle") {
        
        var op4 = ("Please contact our support team on 0771111111 ☎️ \n \n say *\"Hello!\"* now and pay for your entertainment📺 in the comfort of your home🏘️ ");
        await WA.sendMessage(req.body.From, 'Help🆘 \n \n '+ op4);
        stats("Stop", "idle");
        return;
    }

    else if (req.body.Body === '5' && start === "Start" && filler === "idle") {
        var op5 = ("😊Thank you for using Mukanya's DStv Self Service. \n \n Have a great day!👍🏿");
        await WA.sendMessage(req.body.From, 'Exit⚠️ \n \n '+ op5);
        stats("stop", "");
        return;

    }
    else if (req.body.Body === 'Quit' ) {
        var op8 = ("Leaving so soon😢, till we meet again then, just say *\"Hello!\"* I'll be right here😎");
        await WA.sendMessage(req.body.From, 'Quit❌ \n \n '+ op8);
        stats("stop", "")
    }
    else{
        var op6 = ("Please select a valid option🤠, or say *\"Quit\"* to leave or *\"Hello!\"* now to begin enjoying my services😎");
        await WA.sendMessage(req.body.From, 'Invalid Input❌ \n \n '+ op6);
        return;
    }
    console.log(filler);
});

webApp.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

