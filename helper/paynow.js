const {Paynow} = require('paynow');

let paynow = new Paynow("15879","35c578aa-8faf-4b92-8a62-1f1015cc882b");




let payment = paynow.createPayment("Invoice 41", "pmanstylz@gmail.com");
    payment.add("Bananas", 2.5);
    payment.add("Apples", 1.0);

    paynow.sendMobile(
        
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

        } else {
            console.log(response.error)
        }
    }).catch(ex => {
        // Ahhhhhhhhhhhhhhh
        // *freak out*
        console.log('Your application has broken an axle', ex)
    });
