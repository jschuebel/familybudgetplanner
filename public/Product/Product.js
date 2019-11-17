/// <reference path="../Purchase/Purchase.js" />


var SSS = SSS || {};
SSS.Product = {};


(function() {
    let self = this;
    self.mProducts = [];

    this.Add = function(newProduct) {
      self.mProducts.push(newProduct);
    };

    this.Remove = function(newProduct) {
      self.mProducts.push(newProduct);
    };
    
    this.Products = function() {
      return self.mProducts;
    };

    this.GetProductByID = function(ProductID) {
      var res = self.mProducts.find(element => {
        if (element.ProductID==ProductID) return element;
      });
      return res;
    };

    this.Save = function() {
      return self.mProducts;
    };

    this.Load = function() {
      return new Promise((resolve, reject) => {
        $.getJSON("api/product?brk=" + (new Date()).getTime(), null, function (data) {
          console.log('product load', data);
          resolve(data.data);
        })
        .fail(function(jqXHR, textStatus, errorThrown) { alert('getJSON request failed! ' + textStatus); reject(textStatus)})
      });
    };

    this.init = function init(){
      self.Load().then(data => {
        console.log('product init after promis data', data);
        self.mProducts = data;
            //******** Testing
            self.Add({ ProductID: 3, Title: "Water3", Count: 1, Cost: 3.00});
            RefreshProductRows();
          // setTimeout(() => {
          SSS.Purchase.init();
          // }, 500); 
      })
      .catch(error => {
        console.log(error);
      });
    }
  }).apply(SSS.Product);
