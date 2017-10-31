const { wrap } = require('co');
const { join } = require('path');
const moment = require('moment');
const pdf = require('html-pdf');
const handlebars = require('handlebars');
const fs = require('fs');
var mailer = require('nodemailer-promise');




// PDF Options
const pdf_options = { format: 'A5', quality: 300 };

// GeneratePDF
const generatePDF = wrap(function () {
    // Data we're going to pass to Handlebars
    const data = {
        mycompany: {
            name: 'GASCO',
            address: 'Street 1 El Damam',
            city: 'EL Qadsya',
            zipcode: '1000 AA'
        },
        customer: {},
        invoice_no: generateInvoiceNo(),
        date_created: moment().format('DD/MM/YYYY'),
        date_due: moment().add(14, 'days').format('DD/MM/YYYY')
    };

    // Add customer data
    data.customer = {
        org: 'GASCO',
        name: 'Ramez',
        email: 'maghraby@vodafone.com'
    };

    // Read source template
    const source = fs.readFileSync(join(`${__dirname}/template.html`), 'utf-8');

    // Convert to Handlebars template and add the data
    const template = handlebars.compile(source);
    const html = template(data);

    // Generate PDF and thunkify the toFile function
    pdf.create(html, pdf_options).toFile(`${join(__dirname, 'invoice.pdf')}`, () => { 
        
    });
});


function generateInvoiceNo() {
    return moment().format('YYYYMMDD');
}


var smtpServer = mailer.config({
    email: 'ahmed.ramez.deeb@gmail.com',
    password: 'Ahmed@@2020',
    server: 'smtp.gmail.com'
});

function sendMail(email) {
    var options = {
        subject: 'Sending Dynamic PDF Test',
        senderName: 'ahmed.ramez.deeb@gmail.com',
        receiver: email+', ahmed.ramez-mahmoud@vodafone.com',
        html: "<h1>GASCO Kuwait</h1> <br/>" + '<h2>this is just a test mail for testing sending pdf with dynamic data via mail</h2>',
        attachments: [
            { 
                filename: 'dynamicPDF.pdf',
                path: './invoice.pdf' 
            },
        ]
    };
    return smtpServer(options)
    .then(function (info) { console.log("Email Sent Successfully");return { success: true, info: info } })   // if successful
    .catch(function (err) { console.log('got error', err); return { success: false, err: err } });
}



generatePDF();
sendMail('ramez.fci123@gmail.com');

