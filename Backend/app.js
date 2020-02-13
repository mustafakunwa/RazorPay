const express = require("express");
const cors = require('cors');
const Razorpay = require('razorpay');
const bodyParser = require("body-parser");
const CryptoJS = require("crypto-js");
const app = express();
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));

var instance = new Razorpay({
    key_id: 'rzp_test_Cr6EDaWlDAP2lU',
    key_secret: 'AjEFRyctA6B7QXbLbZvAmxrV',
});


app.get('/AllPayment', (req, res) => {
    instance.payments.all({
        from: '2016-08-01',
        to: '2016-08-20'
    }).then((response) => {
        // handle success
        console.log(response);
        return res.status(200).send(response)
    }).catch((error) => {
        // handle error
        return res.status(400).send(error)
        console.log(error)
    })
})

app.get('/CreatePayment', (req, res) => {
    var options = {
        amount: 10000,  // amount in the smallest currency unit
        currency: "INR",
        receipt: "order_rcptid_11",
        payment_capture: 1
    };
    instance.orders.create(options, function (err, order) {
        console.log(order);
        if (order)
            return res.status(200).send(order);
        else
            return res.status(400).send(err)
    });
})

app.post('/Callback', (req, res) => {
    // generated_signature = hmac_sha256(req.body.response.razorpay_order_id + "|" + req.body.response.razorpay_payment_id, "AjEFRyctA6B7QXbLbZvAmxrV");
    //var generated_signature = CryptoJS.HmacSHA1(req.body.response.razorpay_order_id + "|" + req.body.response.razorpay_payment_id, "AjEFRyctA6B7QXbLbZvAmxrV");
    var generated_signature = Razorpay.validateWebhookSignature(
        req.body.response.razorpay_order_id + "|" + req.body.response.razorpay_payment_id,
        req.body.response.razorpay_signature,
        "AjEFRyctA6B7QXbLbZvAmxrV")
        
    console.log(req);
    console.log(res);
    return res.status(200).send('')
})

app.listen(3000, () => {
    console.log(`Express server listening on port 3000 for RazorPay`);
});
