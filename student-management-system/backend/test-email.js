console.log('=== TEST FILE IS RUNNING ===');
console.log('Hello World!');
console.log('Current directory:', __dirname);

const emailService = require('./services/emailService');
console.log('Email service:', emailService);
console.log('sendEnrollmentEmail:', emailService.sendEnrollmentEmail);
console.log('Type:', typeof emailService.sendEnrollmentEmail);