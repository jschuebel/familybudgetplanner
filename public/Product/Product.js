/// <reference path="../Purchase/Purchase.js" />


var SSS = SSS || {};
SSS.Product = {};


(function() {
    let self = this;
    self.mProducts = [];

    this.Add = function(newProduct) {
      console.log('***** ADD PRoduct ');
      return new Promise((resolve, reject) => {
        $.post("api/product",newProduct,
          function(prodRespone, status){
            console.log('Product save return ', prodRespone);
            //alert("Data: " + data.result + "\nStatus: " + status);

            self.Load().then((loadResult) => {
                console.log("LoadProduct from Add result",loadResult);
                self.mProducts = loadResult;
                resolve(prodRespone.data);
            });
          });
        });

    };

    this.Delete = function() {
      if (self.selectedProduct==null){
        alert("Please select a Product");
        return;
      }
      return new Promise((resolve, reject) => {
      $.ajax({
        url: "api/product/"+self.selectedProduct.ProductID,
        type: 'DELETE',
        success: function(apiResponse) {
            self.selectedProduct=null;
            if (apiResponse.data.wasSuccessful){
              self.Load().then((loadResult) => {
                console.log("LoadProduct from delete result",loadResult);
                self.mProducts = loadResult;
                resolve(apiResponse.data);
            });
            }
            else
              resolve(apiResponse.data);
          },
          error: function(request,msg,error) {
            reject(error);
          }
        });
      });
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

    this.GetSelectedProduct = function() {
      return self.selectedProduct;
    }

    this.SetSelectedProduct = function(selProd) {
      self.selectedProduct=selProd;
    }



    this.Save = function(updProduct) {
      if (self.selectedProduct==null){
        alert("Please select a Product");
        return;
      }
      self.selectedProduct.Title=updProduct.Title;
      self.selectedProduct.Count=updProduct.Count;
      self.selectedProduct.Cost=updProduct.Cost;
      return new Promise((resolve, reject) => {
        $.ajax({
          url: "api/product",
          data: self.selectedProduct,
          dataType: 'json',
          type: 'PUT',
          success: function(response) {
            self.selectedProduct=null;
            resolve(response.data);
          },
          error: function(request,msg,error) {
            reject(error);
          }
        });
        });

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
