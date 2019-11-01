const express = require('express');
const router = express.Router();
//const db = require('./db1');


// Response handling
let response = {
    status: 200,
    data: [],
    message: null
};

  

router.get('/products', (req, res) => {
	response.data = [{ ProductID: 1, Title: "Water", Count: 24, Cost: 1.99},{ ProductID: 2, Title: "Coffee Water", Count: 6, Cost: 2.99}];
	res.json(response);
});

router.get('/purchases', (req, res) => {
	response.data = [{ ProductID: 1, Count: 5},{ ProductID: 2, Count: 2}];
	res.json(response);
});



module.exports = router;