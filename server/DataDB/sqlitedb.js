//const db = require('./db1');
const sqlite3 = require('sqlite3');


class SQLiteDB {

    opendb() {
        return new Promise((resolve, reject) => {
        let db = new sqlite3.Database('data/budget.db', (err) => {
            if (err) {
                console.error(err.message);
                reject(err);
              return;
            }
            //console.log('Connected to data/budget.db database.');
            resolve(db);
          });
        });
    }
    
    closedb(db){
        db.close((err) => {
            if (err) {
              return console.error(err.message);
            }
            //console.log('Close the database connection.');
          });
    }

    
/************************************************ Reports *********************/
RunPurchaseReport(catid) {
    return new Promise((resolve, reject) => {
    this.opendb().then(db => {
        db.all("select Products.Title, Purchases.Count, Purchases.PurchaseDate,(CASE WHEN Purchases.CostOverride IS NULL THEN Products.Cost * Purchases.Count ELSE Purchases.CostOverride END) Cost from Purchases inner join Products on Products.ProductID  = Purchases.ProductID inner join CategoryXrefs on CategoryXrefs.ProductID  = Products.ProductID where CategoryXrefs.CategoryID=? order by Purchases.PurchaseDate", [catid], (err, rows) => {
            if (err) {
                this.closedb(db);
                reject(err);
                return;
            }
            this.closedb(db);
            if (rows.length===0) console.log('*********** No Purchases');
            rows.forEach((row) => {
                if (row.Cost!=null)
                    row.Cost = row.Cost/100;
            //console.log(" - " + row.Title);
            });
            resolve(rows);
        });
    });
});
}


/************************************************ Product *********************/
    ReadProducts() {
        return new Promise((resolve, reject) => {
            this.opendb().then(db => {
                db.all("select * from Products", [], (err, rows) => {
                    if (err) {
                        this.closedb(db);
                        reject(err);
                        return;
                    }
                    this.closedb(db);
                    if (rows.length===0) console.log('*********** No Products');
                    rows.forEach((row) => {
                        if (row.Cost!=null)
                            row.Cost = row.Cost/100;
                    //console.log(" - " + row.Title);
                    });
                    resolve(rows);
                });
            });
        });
    }

    AddProduct(Product) {
        return new Promise((resolve, reject) => {
            this.opendb().then(db => {
                db.run('insert into Products values($pk,$title,$count,$cost)',{
                    $pk:Product.ProductID,
                    $title:Product.Title,
                    $count:Product.Count,
                    $cost:Product.Cost*100
                },(err) => {
                if (err){
                    console.log('Product insert err',err);
                    this.closedb(db);
                    let retVal={ status:err, wasSuccessful:false};
                    reject(retVal);
                }
                else
                    this.closedb(db);
                    let retVal={ status:'Product added.', wasSuccessful:true};
                    resolve(retVal);
    //                    console.log('CategoryXrefs insert no error');
                });
            });
        });
    }

    SaveProduct(Product) {
        return new Promise((resolve, reject) => {
            this.opendb().then(db => {
                //Products(ProductID INTEGER primary key autoincrement, Title text, Count int, Cost int)
                db.run('update Products set Title=?,Count=?,Cost=? WHERE ProductID=?',[Product.Title
                    ,Product.Count
                    ,(Product.Cost*100)
                    ,Product.ProductID
                ],(err) => {
                if (err){
                    console.log('Product insert err');
                    console.log(err);
                    this.closedb(db);
                    let retVal={ status:err, wasSuccessful:false};
                    reject(retVal);
                }
                else {
                    this.closedb(db);
                    let retVal={ status:`Product ${Product.Title} saved.`, wasSuccessful:true};
                    resolve(retVal);
//                    console.log('Product insert no error');
                }
                });

            });
        });
    }

    DeleteProduct(ProductID) {
        return new Promise((resolve, reject) => {
            this.opendb().then(db => {

                    /*!!!!!!! TODO must remove all CategoryXrefs for this product */

                db.run('delete from Products WHERE ProductID=?',[ProductID
                ],(err) => {
                if (err){
                    console.log('Product delete err');
                    console.log(err);
                    this.closedb(db);
                    let retVal={ status:err, wasSuccessful:false};
                    reject(retVal);
                }
                else
                    this.closedb(db);
                    let retVal={ status:`Product deleted.`, wasSuccessful:true};
                    resolve(retVal);
//                    console.log('CategoryXrefs insert no error');
                });

            });
        });
    }


/************************************************ Purchase *********************/
ReadPurchases() {
        return new Promise((resolve, reject) => {
		this.opendb().then(db => {
            db.all("select * from Purchases", [], (err, rows) => {
                if (err) {
                    this.closedb(db);
                    reject(err);
                    return;
                }
                this.closedb(db);
                if (rows.length===0) console.log('*********** No Purchases');
                rows.forEach((row) => {
                    if (row.CostOverride!=null)
                        row.CostOverride = row.CostOverride/100;
                //console.log(" - " + row.Title);
                });
                resolve(rows);
            });
        });
    });
}

//Purchases(PurchaseID INTEGER primary key autoincrement,ProductID int, Count int, PurchaseDate datetime, CostOverride int)
AddPurchase(Purchase) {
    return new Promise((resolve, reject) => {
        this.opendb().then(db => {
            db.run('insert into Purchases values($pk,$fk, $count, $purchasedate, $costoverride)',{
                $pk:Purchase.PurchaseID,
                $fk:Purchase.ProductID,
                $count:Purchase.Count,
                $purchasedate:Purchase.PurchaseDate,
                $costoverride:(Purchase.CostOverride==null?null:Purchase.CostOverride*100)
            },(err) => {
            if (err){
                console.log('Purchase insert err',err);
                this.closedb(db);
                let retVal={ status:err, wasSuccessful:false};
                reject(retVal);
            }
            else
                this.closedb(db);
                let retVal={ status:'Purchase added.', wasSuccessful:true};
                resolve(retVal);
            });
        });
    });
}


SavePurchase(Purchase) {
    return new Promise((resolve, reject) => {
        this.opendb().then(db => {

            db.run('update Purchases set ProductID=?, Count=?, PurchaseDate=?, CostOverride=? WHERE PurchaseID=?',[Purchase.ProductID
                ,Purchase.Count
                ,Purchase.PurchaseDate
                ,(Purchase.CostOverride==null?null:Purchase.CostOverride*100)
                ,Purchase.PurchaseID
            ],(err) => {
            if (err){
                console.log('Purchase insert err');
                console.log(err);
                this.closedb(db);
                let retVal={ status:err, wasSuccessful:false};
                reject(retVal);
            }
            else
                this.closedb(db);
                let retVal={ status:`Purchase ${Purchase.ProductID} saved.`, wasSuccessful:true};
                resolve(retVal);
//                    console.log('CategoryXrefs insert no error');
            });

        });
    });
}

/************************************************   Category *********************/
ReadCategories() {  
        return new Promise((resolve, reject) => {
            this.opendb().then(db => {
            db.all("select * from Categories", [], (err, rows) => {
                if (err) {
                    this.closedb(db);
                    reject(err);
                    return;
                }
                this.closedb(db);
                if (rows.length===0) console.log('*********** No Categories');
                resolve(rows);
            });
            });
        });
    }

    AddCategory(Category) {
        return new Promise((resolve, reject) => {
            this.opendb().then(db => {

                db.run('insert into Categories values($pk,$title)',{
                    $pk:Category.CategoryID,
                    $title:Category.Title
                },(err) => {
                if (err){
                    console.log('Category insert err');
                    console.log(err);
                    this.closedb(db);
                    let retVal={ status:err, wasSuccessful:false};
                    reject(retVal);
                }
                else
                    this.closedb(db);
                    let retVal={ status:`Category added.`, wasSuccessful:true};
                    resolve(retVal);
//                    console.log('CategoryXrefs insert no error');
                });

            });
        });
    }


    SaveCategory(Category) {
        return new Promise((resolve, reject) => {
            this.opendb().then(db => {

                db.run('update Categories set Title=? WHERE CategoryID=?',[Category.Title,Category.CategoryID
                ],(err) => {
                if (err){
                    console.log('Category insert err');
                    console.log(err);
                    this.closedb(db);
                    let retVal={ status:err, wasSuccessful:false};
                    reject(retVal);
                }
                else
                    this.closedb(db);
                    let retVal={ status:`Category ${Category.Title} saved.`, wasSuccessful:true};
                    resolve(retVal);
//                    console.log('CategoryXrefs insert no error');
                });

            });
        });
    }

    DeleteCategory(CategoryID) {
        return new Promise((resolve, reject) => {
            this.opendb().then(db => {

                db.run('delete from Categories WHERE CategoryID=?',[CategoryID
                ],(err) => {
                if (err){
                    console.log('Category delete err');
                    console.log(err);
                    this.closedb(db);
                    let retVal={ status:err, wasSuccessful:false};
                    reject(retVal);
                }
                else
                    this.closedb(db);
                    let retVal={ status:`Category deleted.`, wasSuccessful:true};
                    resolve(retVal);
//                    console.log('CategoryXrefs insert no error');
                });

            });
        });
    }

/************************************************   CategoryXref *********************/
    ReadCategoryXref() {
        return new Promise((resolve, reject) => {
            this.opendb().then(db => {
            db.all("select * from CategoryXrefs", [], (err, rows) => {
                if (err) {
                    this.closedb(db);
                    reject(err);
                    return;
                }
                if (rows.length===0) console.log('*********** No CategoryXrefs');
                this.closedb(db);
                console.log('CategoryXrefs read rows', rows);
                resolve(rows);
            });
           });
        });
    }

    AddCategoryXref(CategoryXref) {
        return new Promise((resolve, reject) => {
            this.opendb().then(db => {

                db.run('insert into CategoryXrefs values($prodid,$catid)',{
                    $prodid:CategoryXref.ProductID,
                    $catid:CategoryXref.CategoryID
                },(err) => {
                if (err){
                    console.log('CategoryXrefs insert err',err);
                    this.closedb(db);
                    reject(err);
                }
                else {
                    this.closedb(db);
                    let retVal={ status:`Category added.`, wasSuccessful:true};
                    resolve(retVal);
                }
//                    console.log('CategoryXrefs insert no error');
                });
            });
        });
    }
    
    DeleteCategoryXrefByProduct(ProductID) {
        return new Promise((resolve, reject) => {
            this.opendb().then(db => {

                db.run('delete from CategoryXrefs WHERE ProductID=?',[ProductID
                ],(err) => {
                if (err){
                    console.log('DeleteCategoryXrefByProduct delete err', err);
                    this.closedb(db);
                    let retVal={ status:err, wasSuccessful:false};
                    reject(retVal);
                }
                else
                    this.closedb(db);
                    let retVal={ status:`CategoryXref deleted.`, wasSuccessful:true};
                    resolve(retVal);
//                    console.log('CategoryXrefs insert no error');
                });

            });
        });
    }
}
module.exports = SQLiteDB;