var SSS = SSS || {};
SSS.Purchase = {};

(function() {
    let self = this;
    self.mPurchases = [];
    self.selectedPurchase = null;

    this.Add = function(newPurchase) {
      console.log('***** ADD Purchase ');
      return new Promise((resolve, reject) => {
        $.post("api/purchase",newPurchase,
          function(purchRespone, status){
            console.log('Purchase save return ', purchRespone);
            //alert("Data: " + data.result + "\nStatus: " + status);
            self.mPurchases = [];
            self.Load().then((loadResult) => {
                console.log("LoadPurchase from Add result",loadResult);
                $.each(loadResult, function (key, value) {
                  self.AddPurchase(value);
              });
              resolve(purchRespone.data);
            });
          });
        });

    };

    this.AddPurchase = function(newPurchase) {
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
      newPurchase.PurchaseDate=new Date(newPurchase.PurchaseDate);

      console.log('Purchase Add newpurchase', newPurchase);
      self.mPurchases.push(newPurchase);
    }


    this.GetSelectedPurchase = function() {
      return self.selectedPurchase;
    }

    this.SetSelectedPurchase = function(selPurchase) {
      self.selectedPurchase=selPurchase;
    }


    this.Purchases = function() {
      return self.mPurchases;
    };

    this.Save = function(UpdPurchase) {
      if (self.selectedPurchase==null){
        alert("Please select a Purchase");
        return;
      }

      self.selectedPurchase.ProductID=UpdPurchase.ProductID;
      self.selectedPurchase.Count=UpdPurchase.Count;
      self.selectedPurchase.PurchaseDate=UpdPurchase.PurchaseDate;
      self.selectedPurchase.CostOverride=UpdPurchase.CostOverride;

      return new Promise((resolve, reject) => {
        $.ajax({
          url: "api/purchase",
          data: self.selectedPurchase,
          dataType: 'json',
          type: 'PUT',
          success: function(response) {
            self.Load().then((loadPurchaseResult) => {
                console.log("LoadPurchase from SavePurchase results",loadPurchaseResult);
                self.mPurchases = [];
                $.each(loadPurchaseResult, function (key, value) {
                    self.AddPurchase(value);
                });
                resolve(response.data);
            });
          },
          error: function(request,msg,error) {
            reject(error);
          }
        });
        });
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
        self.mPurchases = [];
        $.each(data, function (key, value) {
            self.AddPurchase(value);
        });
        document.getElementById("defaultOpen").click();
       })
       .catch(error => {
        console.log(error);
      });
    }
    
  }).apply(SSS.Purchase);

