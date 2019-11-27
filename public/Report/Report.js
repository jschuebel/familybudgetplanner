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

    this.init = function(reportType){
      self.Load().then(data => {
        console.log('report init after promis data', data);
        
        let rptData = [];
        data.forEach((row) => {
          if (row.PurchaseDate!=null)
              row.PurchaseDate = new Date(row.PurchaseDate);

          let mth =  rptData.find(function(rpt) {
            return rpt.month==(row.PurchaseDate.getMonth()+1);
          });
          
          if (mth!=null) {
            mth.Cost += row.Cost;
          } else {
            let rptRow = {};
            rptRow.month=row.PurchaseDate.getMonth()+1;
            rptRow.monthYear = row.PurchaseDate.getMonth()+1 + "/" + (row.PurchaseDate.getFullYear() + "").substr(2);
            rptRow.Cost = row.Cost;
            rptData.push(rptRow);
          }

        });
        //self.mPurchases = data;
        var myBarchart = new Barchart(
          {
              padding:20,
              gridScale:25,
              gridColor:"#67b6c7",
              data:rptData
            //  colors:["#a55ca5","#67b6c7", "#bccd7a","#eb9743"]
          });

          if (reportType==1)
            myBarchart.draw();
          else
            drawGraph(rptData);
       })
       .catch(error => {
        console.log(error);
      });
    }
    
  }).apply(SSS.Report);

