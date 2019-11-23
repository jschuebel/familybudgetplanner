var SSS = SSS || {};
SSS.Report = {};

(function() {
    let self = this;
    self.mPurchases = [];
    self.selectedCategory = null;
    //var ReportID = Purchases
    self.ReportID = 1;

    this.GetSelectedCategory = function(selCat) {
      return self.selectedCategory;
    }

    this.SetSelectedCategory = function(selCat) {
      self.selectedCategory=selCat;
    }

    this.Load = function() {
      return new Promise((resolve, reject) => {
        console.log('report Load selectCat', self.selectedCategory);
        $.getJSON("api/report/"+self.ReportID, self.selectedCategory, function (data) {
          console.log('report init', data);
          resolve(data.data);
        })
        .fail(function(jqXHR, textStatus, errorThrown) { alert('getJSON request failed! ' + textStatus); reject(textStatus)})
      });
    };

    this.init = function(){
      self.Load().then(data => {
        console.log('report init after promis data', data);
        data.forEach((row) => {
          if (row.PurchaseDate!=null)
              row.PurchaseDate = new Date(row.PurchaseDate);
        });
        self.mPurchases = data;
        drawGraph( self.mPurchases);
       })
       .catch(error => {
        console.log(error);
      });
    }
    
  }).apply(SSS.Report);

