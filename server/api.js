const express = require('express');
const router = express.Router();

//const FileDB = require('./DataBB/FileDB');
//const db = new FileDB();
const SQLiteDB = require('./DataBB/sqlitedb');
const db = new SQLiteDB();

// Response handling
let response = {
    status: 200,
    data: [],
    message: null
};

/************************************************ Product *********************/
router.get('/product', (req, res) => {
	db.ReadProducts().then(data => {
		response.data = data;
		res.json(response);
	})
	.catch(error => {
	  console.log(error);
	  response.data = { status:error, wasSuccessful:false};
	  res.json(response);
	});
//	response.data = [{ ProductID: 1, Title: "Water", Count: 24, Cost: 1.99},{ ProductID: 2, Title: "Coffee Water", Count: 6, Cost: 2.99}];
});

/************************************************ Purchase *********************/
router.get('/purchase', (req, res) => {
	db.ReadPurchases().then(data => {
		response.data = data;
		res.json(response);
	})
	.catch(error => {
	  console.log(error);
	  response.data = { status:error, wasSuccessful:false};
	  res.json(response);
	});
});

/************************************************   Category *********************/
router.get('/category', (req, res) => {
	db.ReadCategories().then(data => {
		response.data = data;
		res.json(response);
	})
	.catch(error => {
	  console.log(error);
	  response.data = { status:error, wasSuccessful:false};
	  res.json(response);
	});
});
router.post('/category', (req, res) => {
	console.log("req.body",req.body);    //body to json from a post
    console.log("req.query", req.query);

	var newCat = JSON.parse(JSON.stringify(req.body));
	newCat.CategoryID=null;
    console.log("category post cat:",newCat);
 
	db.AddCategory(newCat).then(data => {
		response.data = data;
		res.json(response);
	})
	.catch(error => {
	  console.log(error);
	  response.data = { status:error, wasSuccessful:false};
	  res.json(response);
	});
});
	
	//router.put('/category/:id', (req, res) => {
	//console.log("req.params.id", req.params.id)
router.put('/category', (req, res) => {
	console.log("req.body",req.body);    //body to json from a post
	console.log("req.query", req.query);

    var newCat = JSON.parse(JSON.stringify(req.body));
    console.log("put Category cat",newCat);
 
	db.SaveCategory(newCat).then(data => {
		response.data = data;
		res.json(response);
	})
	.catch(error => {
	  console.log(error);
	  response.data = { status:error, wasSuccessful:false};
	  res.json(response);
	});
});

router.delete('/category/:id', (req, res) => {
	console.log("req.body",req.body);    //body to json from a post
	console.log("req.query", req.query);
	console.log("req.params.id", req.params.id)

	if (req.params == null || req.params.id==null)
	{
		response.data = { status:'ID is required', wasSuccessful:false};
		res.json(response);
		return;
	} 
	db.DeleteCategory(req.params.id).then(data => {
		response.data = data;
		res.json(response);
	})
	.catch(error => {
	  console.log(error);
	  response.data = { status:error, wasSuccessful:false};
	  res.json(response);
	});
});

/************************************************   CategoryXref *********************/
router.get('/categoryxref', (req, res) => {
	db.ReadCategoryXref().then(data => {
		response.data = data;
		res.json(response);
	})
	.catch(error => {
	  console.log(error);
	  response.data = { status:error, wasSuccessful:false};
	  res.json(response);
	});
});

//Put == Update
router.put('/categoryxref', (req, res) => {
	console.log("req.body",req.body);    //body to json from a post
    console.log("req.query", req.query);

	var newXref = JSON.parse(JSON.stringify(req.body));
    console.log("categoryxref newxref:",newXref);


	db.DeleteCategoryXrefByProduct(newXref.ProductID).then(data => {
		if (data.wasSuccessful) {
			newXref.Categories.forEach((row) => {
				console.log("row",row);
				db.AddCategoryXref({ProductID: newXref.ProductID,CategoryID:row}).then(data => {
					console.log('CategoryID:row saved', row);
				})
				.catch(error => {
				console.log(error);
				});
			})
			response.data = { status:'CategoryXrefs Updated.', wasSuccessful:true};
			res.json(response);
		}
		else {
			response.data = data;
			res.json(response);
		}
	})
	.catch(error => {
	  console.log(error);
	  response.data = { status:error, wasSuccessful:false};
	  res.json(response);
	});
});


module.exports = router;