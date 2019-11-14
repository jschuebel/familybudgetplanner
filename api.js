const express = require('express');
const router = express.Router();

//const FileDB = require('./FileDB');
//const db = new FileDB();
const SQLiteDB = require('./sqlitedb');
const db = new SQLiteDB();

// Response handling
let response = {
    status: 200,
    data: [],
    message: null
};

router.get('/products', (req, res) => {
	db.ReadProducts().then(data => {
		response.data = data;
		res.json(response);
	})
	.catch(error => {
	  console.log(error);
	});
//	response.data = [{ ProductID: 1, Title: "Water", Count: 24, Cost: 1.99},{ ProductID: 2, Title: "Coffee Water", Count: 6, Cost: 2.99}];
});

router.get('/purchases', (req, res) => {
	db.ReadPurchases().then(data => {
		response.data = data;
		res.json(response);
	})
	.catch(error => {
	  console.log(error);
	});
});
router.get('/categories', (req, res) => {
	db.ReadCategories().then(data => {
		response.data = data;
		res.json(response);
	})
	.catch(error => {
	  console.log(error);
	});
});
router.get('/categoryxref', (req, res) => {
	db.ReadCategoryXref().then(data => {
		response.data = data;
		res.json(response);
	})
	.catch(error => {
	  console.log(error);
	});
});



module.exports = router;