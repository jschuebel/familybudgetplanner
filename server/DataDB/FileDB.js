const fs = require('fs');

class FileDB {

    ReadProducts() {
        return new Promise((resolve, reject) => {
            fs.readFile('Data/Products.json', (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(JSON.parse(data));
            });

	/*
	fs.readFile('Data/Products.json', (err, data) => {
		if (err) throw err;
		response.data = JSON.parse(data);
		res.json(response);
		/    console.log('**after date cvt loop dump');
		students.forEach((element, index, array) => {
			console.log(index, element);
			element.PurchaseDate=new Date(element.PurchaseDate);
		});
	/	
	});
	*/

        });
    }
    ReadPurchases() {
        return new Promise((resolve, reject) => {
            fs.readFile('Data/Purchases.json', (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(JSON.parse(data));
            });
        });
    }
    ReadCategories() {
        return new Promise((resolve, reject) => {
            fs.readFile('Data/Categories.json', (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(JSON.parse(data));
            });
        });
    }

    ReadCategoryXref() {
        return new Promise((resolve, reject) => {
            fs.readFile('Data/CategoryXref.json', (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(JSON.parse(data));
            });
        });
    }
    

}
module.exports = FileDB;