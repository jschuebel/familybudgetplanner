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
    
    ReadProducts() {
        return new Promise((resolve, reject) => {
		this.opendb().then(db => {
            db.all("select * from Products", [], (err, rows) => {
                if (err) {
                    this.closedb(db);
                    reject(err);
                    return;
                }
                if (rows.length===0) console.log('*********** No Products');
                rows.forEach((row) => {
                    row.Cost = row.Cost/100;
                //console.log(" - " + row.Title);
                });
                resolve(rows);
            });
            this.closedb(db);
        });
    });
}
    ReadPurchases() {
        return new Promise((resolve, reject) => {
		this.opendb().then(db => {
            db.all("select * from Purchases", [], (err, rows) => {
                if (err) {
                    this.closedb(db);
                    reject(err);
                    return;
                }
                if (rows.length===0) console.log('*********** No Purchases');
                resolve(rows);
            });
            this.closedb(db);
        });
    });
}
    ReadCategories() {  
        return new Promise((resolve, reject) => {
            this.opendb().then(db => {
            db.all("select * from Categories", [], (err, rows) => {
                if (err) {
                    this.closedb(db);
                    reject(err);
                    return;
                }
                if (rows.length===0) console.log('*********** No Categories');
                resolve(rows);
            });
            this.closedb(db);
            });
        });
    }
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
                resolve(rows);
            });
            this.closedb(db);
            });
        });
    }
}
module.exports = SQLiteDB;