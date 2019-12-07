const express = require('express');
const router = express.Router();

//const FileDB = require('./DataBB/FileDB');
//const db = new FileDB();
const SQLiteDB = require('./DataDB/sqlitedb');
const db = new SQLiteDB();

// Response handling
let response = {
    status: 200,
    data: [],
    message: null
};
/************************************************ Report *********************/
router.get('/report/:id', (req, res) => {
	if (req.params == null || req.params.id==null)
	{
		response.data = { status:'ID is required', wasSuccessful:false};
		res.json(response);
		return;
	} 

	console.log("req.body",req.body);    //body to json from a post
	console.log("req.query", req.query);
	console.log("req.params.id", req.params.id)

	var rpt = JSON.parse(JSON.stringify(req.query));
	console.log("get report rpt",rpt);

	//
	if (req.params.id==1)
	{
		console.log("Purchase Report CategoryID", rpt.CategoryID)
		db.RunPurchaseReport(rpt.CategoryID).then(data => {
			response.data = data;
			res.json(response);
		})
		.catch(error => {
		console.log(error);
		response.data = { status:error.status.message, wasSuccessful:false};
		res.json(response);
		});

	}
	else 	{
	response.data = { status:'Unknow Report requested', wasSuccessful:false};
	res.json(response);
	return;
	} 

});


/************************************************ Product *********************/
	router.get('/product', (req, res) => {
		db.ReadProducts().then(data => {
			res.set('Access-Control-Expose-Headers','X-Total-Count, X-Paging-PageSize')
			res.set('X-Total-Count', data.length)
			res.status(200);
			res.json(data);
		})
		.catch(error => {
			console.log(error);
			res.status(400);
			res.send(error.message);
		});
	//	response.data = [{ ProductID: 1, Title: "Water", Count: 24, Cost: 1.99},{ ProductID: 2, Title: "Coffee Water", Count: 6, Cost: 2.99}];
	});

	router.post('/product', (req, res) => {
		console.log("req.body",req.body);    //body to json from a post
		console.log("req.query", req.query);

		var newProd = JSON.parse(JSON.stringify(req.body));
		newProd.ProductID=null;
		console.log("product post prod:",newProd);
	
		db.AddProduct(newProd).then(data => {
			response.data = data;
			res.json(response);
		})
		.catch(error => {
		console.log(error);
		response.data = { status:error.status.message, wasSuccessful:false};
		res.json(response);
		});
	});

	router.put('/product', (req, res) => {
		console.log("req.body",req.body);    //body to json from a post
		console.log("req.query", req.query);
	
		var newprod = JSON.parse(JSON.stringify(req.body));
		console.log("put product cat",newprod);
	 
		newprod.Count = parseInt(newprod.Count);
		newprod.Cost = parseFloat(newprod.Cost);
	  
		db.SaveProduct(newprod).then(data => {
			response.data = data;
			res.json(response);
		})
		.catch(error => {
		  console.log(error);
		  response.data = { status:error.status.message, wasSuccessful:false};
		  res.json(response);
		});
	});
	
	///TODO must delete all xrefs with this categoryid
	router.delete('/product/:id', (req, res) => {
		console.log("req.body",req.body);    //body to json from a post
		console.log("req.query", req.query);
		console.log("req.params.id", req.params.id)
	
		if (req.params == null || req.params.id==null)
		{
			response.data = { status:'ID is required', wasSuccessful:false};
			res.json(response);
			return;
		} 
		db.DeleteProduct(req.params.id).then(data => {
			response.data = data;
			res.json(response);
		})
		.catch(error => {
		  console.log(error);
		  response.data = { status:error.status.message, wasSuccessful:false};
		  res.json(response);
		});
	});
	

/************************************************ Purchase *********************/
router.get('/purchase', (req, res) => {
	db.ReadPurchases().then(data => {
		response.data = data;
		res.set('Access-Control-Expose-Headers','X-Total-Count, X-Paging-PageSize')
		res.set('X-Total-Count', data.length)
		res.status(200);
		res.json(data);
	})
	.catch(error => {
	  console.log(error);
	  res.status(400);
	  res.send(error.message);
	});
});

//Post = Add/Insert
router.post('/purchase', (req, res) => {
	console.log("req.body",req.body);    //body to json from a post
	console.log("req.query", req.query);

	var newPurchase = JSON.parse(JSON.stringify(req.body));
	console.log("purchase post:",newPurchase);

	newPurchase.PurchaseID=null;
	newPurchase.Count = parseInt(newPurchase.Count);
	newPurchase.CostOverride=newPurchase.CostOverride==""?null:parseFloat(newPurchase.CostOverride);

	db.AddPurchase(newPurchase).then(data => {
		response.data = data;
		res.json(response);
	})
	.catch(error => {
	console.log(error);
	response.data = { status:error.status.message, wasSuccessful:false};
	res.json(response);
	});
});

//PUT = Update
router.put('/purchase', (req, res) => {
	console.log("req.body",req.body);    //body to json from a post
	console.log("req.query", req.query);

	var newPurchase = JSON.parse(JSON.stringify(req.body));
	console.log("purchase post:",newPurchase);

	newPurchase.Count = parseInt(newPurchase.Count);
	newPurchase.CostOverride=newPurchase.CostOverride==""?null:parseFloat(newPurchase.CostOverride);

	db.SavePurchase(newPurchase).then(data => {
		response.data = data;
		res.json(response);
	})
	.catch(error => {
	  console.log(error);
	  response.data = { status:error.status.message, wasSuccessful:false};
	  res.json(response);
	});
});

/************************************************   Category *********************/
router.get('/category', (req, res) => {
	db.ReadCategories().then(data => {
		res.set('Access-Control-Expose-Headers','X-Total-Count, X-Paging-PageSize')
		res.set('X-Total-Count', data.length)
		res.status(200);
		res.json(data);
	})
	.catch(error => {
		console.log(error);
		res.status(400);
		res.send(error.message);
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
	  response.data = { status:error.status.message, wasSuccessful:false};
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
	  response.data = { status:error.status.message, wasSuccessful:false};
	  res.json(response);
	});
});

///TODO must delete all xrefs with this categoryid
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
	  response.data = { status:error.status.message, wasSuccessful:false};
	  res.json(response);
	});
});

/************************************************   CategoryXref *********************/
router.get('/categoryxref', (req, res) => {
	db.ReadCategoryXref().then(data => {
		res.set('Access-Control-Expose-Headers','X-Total-Count, X-Paging-PageSize')
		res.set('X-Total-Count', data.length)
		res.status(200);
		res.json(data);
	})
	.catch(error => {
		console.log(error);
		res.status(400);
		res.send(error.message);
	});
});

//Put == Update
router.put('/categoryxref', (req, res) => {
	console.log("req.body",req.body);    //body to json from a post
    console.log("req.query", req.query);

	var newXref = JSON.parse(JSON.stringify(req.body));
    console.log("categoryxref put newxref:",newXref);


	db.DeleteCategoryXrefByProduct(newXref.ProductID).then(data => {
		if (data.wasSuccessful) {
			//let rowCnt=1;
			console.log('Categoryxref deleted for ProductID', newXref.ProductID);
			newXref.Categories.forEach((row) => {
				console.log("xref add catid",row);
				db.AddCategoryXref({ProductID: newXref.ProductID,CategoryID:row}).then(data => {
					console.log('CategoryID:row insert catid', row);
					//console.log('CategoryID:row insert rowCnt', rowCnt++);
					//if (rowCnt >= newXref.Categories.length)
				})
				.catch(error => {
				console.log('AddCategoryXrefs catch error',error);
				//console.log('AddCategoryXrefs:row catch rowCnt', rowCnt++);
			});
			})
			//console.log('AddCategoryXrefs **** RETURNING');
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
	  response.data = { status:error.status.message, wasSuccessful:false};
	  res.json(response);
	});
});


module.exports = router;