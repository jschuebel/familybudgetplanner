var SSS = SSS || {};
SSS.Purchase = {};

(function() {
    let self = this;
    self.mPurchases = [];

    this.Add = function(newPurchase) {
      //console.log('Purchase Add');

      var prod =  SSS.Product.GetProductByID(newPurchase.ProductID);
      //console.log('Purchase Add GetProductByID', prod);
      newPurchase.UnitCount = prod.Count;
      newPurchase.UnitCost = prod.Cost==null?'0.00':prod.Cost;

      let ccost=0.0;
      if (newPurchase.CostOverride!=null)
        ccost=formatMoney(newPurchase.Count * newPurchase.CostOverride);
      else
        ccost=formatMoney(newPurchase.Count * prod.Cost);
      newPurchase.Cost = ccost;
      newPurchase.Title = prod.Title;
      newPurchase.PurchaseDate = new Date(newPurchase.PurchaseDate);
              
      //console.log('Purchase Add newpurchase', newPurchase);
      self.mPurchases.push(newPurchase);
    };
    

    this.Purchases = function() {
      return self.mPurchases;
    };

    this.Save = function() {
      return self.mProducts;
    };

    this.Load = function() {
      return new Promise((resolve, reject) => {
        $.getJSON("api/purchase?brk=" + (new Date()).getTime(), null, function (data) {
          console.log('purchase init', data);
          resolve(data.data);
        })
        .fail(function(jqXHR, textStatus, errorThrown) { alert('getJSON request failed! ' + textStatus); reject(textStatus)})
      });
    };

    this.init = function(){
      self.Load().then(data => {
        console.log('purchase init after promis data', data);
        $.each(data, function (key, value) {
            self.Add(value);
        });
        document.getElementById("defaultOpen").click();
       })
       .catch(error => {
        console.log(error);
      });
    }
    
  }).apply(SSS.Purchase);

