const express = require('express');
const router = express.Router();
const fs = require('fs');
//const db = require('./db1');


// Response handling
let response = {
    status: 200,
    data: [],
    message: null
};

  

router.get('/products', (req, res) => {

	fs.readFile('Data/Products.json', (err, data) => {
		if (err) throw err;
		response.data = JSON.parse(data);
		res.json(response);
		/*    console.log('**after date cvt loop dump');
		students.forEach((element, index, array) => {
			console.log(index, element);
			element.PurchaseDate=new Date(element.PurchaseDate);
		});
	*/	
	});
//	response.data = [{ ProductID: 1, Title: "Water", Count: 24, Cost: 1.99},{ ProductID: 2, Title: "Coffee Water", Count: 6, Cost: 2.99}];
});

router.get('/purchases', (req, res) => {
		fs.readFile('Data/Purchases.json', (err, data) => {
		if (err) throw err;
		response.data = JSON.parse(data);
		res.json(response);
	});

});
router.get('/categories', (req, res) => {
	fs.readFile('Data/Categories.json', (err, data) => {
		if (err) throw err;
		response.data = JSON.parse(data);
		res.json(response);
	});
});
router.get('/categoryxref', (req, res) => {
	fs.readFile('Data/CategoryXref.json', (err, data) => {
		if (err) throw err;
		response.data = JSON.parse(data);
		res.json(response);
	});
});



module.exports = router;