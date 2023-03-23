const fs = require('fs');
const { isEmail } = require('validator');
const axios = require('axios');
const apiKey = 'Ton Api key'; //https://hunter.io/ se faire un compte pour recup l'API key

const fileContents = fs.readFileSync('email.txt', 'utf-8'); // Remplace "email.txt" par le nom de ton ficher avec les emails.
const emailArray = fileContents.split('\n');

const validEmails = [];
const undeliverableEmails = [];
const riskyEmails = [];
const unknownEmails = [];
const invalidEmails = [];

emailArray.forEach(email => {
  if (isEmail(email.trim())) {
    verifyEmail(email.trim());
  } else {
    invalidEmails.push(email.trim());
    fs.appendFileSync('invalid.txt', email.trim() + '\n');
  }
});

function verifyEmail(email) {
    axios.get(`https://api.hunter.io/v2/email-verifier?email=${email}&api_key=${apiKey}`)
    .then(response => {
      const data = response.data.data;
      if (data.result === 'deliverable') {
        validEmails.push(email);
        fs.appendFileSync('deliverable.txt', email + '\n');
    } else if (data.result === 'undeliverable') {
        undeliverableEmails.push(email);
        fs.appendFileSync('undeliverable.txt', email + '\n');
      } else if (data.result === 'risky') {
        riskyEmails.push(email);
        fs.appendFileSync('risky.txt', email + '\n');
      } else {
        unknownEmails.push(email);
        fs.appendFileSync('unknown.txt', email + '\n');
      }
    })
    .catch(error => {
      console.log(error.response.data);
  });
}

// console.log(`\x1b[32mValid emails: ${validEmails.join('\n')}`);