var accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
var authToken = process.env.TWILIO_AUTH_TOKEN;   // Your Auth Token from www.twilio.com/console


const client = require('twilio')(accountSid, authToken, {
    lazyLoading: false
});

// FUNCTION TO SEND MESSAGE
const sendMessage = async (senderID, message) => {

    try {
        

       


        await client.messages.create({
            to: senderID,
            body: message,
            from: 'whatsapp:+14155238886'
        });
    }
    catch (error) {
        console.log('Error at sendMessage --> ', error);
    }
}

module.exports = {
    sendMessage
}