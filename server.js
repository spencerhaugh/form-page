const express = require('express');
const PORT = 3000;

const app = express();

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.render('form.ejs')
})

app.post('/', (req, res) => {
    if (req) {
        res.send({
            "status": "success",
            "message": "Thank you. You are now subscribed."
        })
    } else {
        res.send({
            "status": "error",
            "message": "Invalid Subscription request."
        })
    }
});

app.listen(PORT, () => {
    console.log('Listening on Port: ', PORT)
});