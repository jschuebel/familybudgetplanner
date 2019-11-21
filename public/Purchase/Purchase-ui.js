/// <reference path="Purchase.js" />

$('#btnAddPurchase').click(function() {
    var selProductId = $('#selHomeProducts').val();
    if (selProductId=="-1"){
      alert("Product is a required field");
      return;
    }
   
    var PurchaseCount = $('#txtHomeCount').val();
    if (PurchaseCount==""){
      alert("A Count of Items purchased is required");
      return;
    }

    var PurchaseCostOverride = $('#txtHomeCostOverride').val();
    if (PurchaseDate=="") PurchaseCostOverride=null;
    var PurchaseDate = $('#txtHomeDate').val();
    if (PurchaseDate==""){
      alert("A Date of Items purchased is required");
      return;
    }

    PurchaseDate=new Date(PurchaseDate);
    SSS.Purchase.Add({ PurchaseID:null, ProductID: selProductId, Count: PurchaseCount, PurchaseDate: PurchaseDate, CostOverride: PurchaseCostOverride}).then(data=>  
      { 
        RefreshPurchaseRows();
        $('#selHomeProducts').val('-1');
        $('#txtHomeCount').val('');
        $('#txtHomeDate').val('');
        $('#txtHomeCostOverride').val('');
        alert(data.status);
      });
    
  });


  $('#btnClearPurchase').click(function() {
    $('#btnAddPurchase').prop('disabled', false);
      $('#btnDelPurchase').prop('disabled', true);
      $('#btnUpdatePurchase').prop('disabled', true);
      $('#selHomeProducts').val('-1');
      $('#txtHomeCount').val('');
      $('#txtHomeCostOverride').val('');
      $('#txtHomeDate').val('');
  });


  function RefreshPurchaseRows() {

    var vals = SSS.Purchase.Purchases();
   
    /*
    var rows = $("#tblPurchaseData > .row");
    for (i=0; i< rows.length;i++) {
     // if (i>0)//Skip title row
        rows[i].remove();  
    }

    (vals).forEach(element => {
      var appendEl = $("<div class='row'></div>").appendTo("#tblPurchaseData");
      $("<div class='col-sm-2'>" + element.Title + "</div><div class='col-sm-2'>" + element.UnitCount + "</div><div class='col-sm-2'>" + formatMoney(element.UnitCost) + "</div><div class='col-sm-2'>" + element.Count + "</div><div class='col-sm-2'>" + element.Cost + "</div>").appendTo(appendEl);  
    });
  */

      // Refresh Product grid data
      $("#tblPurchaseData2").find("tr:gt(0)").remove();
      (vals).forEach(element => {
        //console.log('datetype', typeof(element.PurchaseDate));
        var appendEl2 = $(`<tr id='${element.ProductID}'></tr>`).appendTo("#tblPurchaseData2");
        $("<td>" + element.Title + "</td><td>" + element.UnitCount + "</td><td>" + formatMoney(element.UnitCost) + "</td><td>" + element.Count + "</td><td>" + element.Cost + "</td><td>" + element.PurchaseDate.toDateString() + "</td>").appendTo(appendEl2);  
      });

      
      //******** Product grid ROW CLICK
      $("#tblPurchaseData2").find("tr:gt(0)").click(function(event){
        console.log("event",event.currentTarget);
        let selectPurchaseID = event.currentTarget.id;
        //console.log("selectPurchaseID",selectPurchaseID);
        let selectPurchTitle = event.currentTarget.childNodes[0].innerText;
        //console.log("selectPurchTitle",selectPurchTitle);
       
        var purchs = SSS.Purchase.Purchases();
        let purchase =  purchs.find(function(purch) {
              return purch.PurchaseID==selectPurchaseID;
            });
        if (purchase==null) alert("problem finding Purchase=" + selectPurchTitle);
        console.log("purchase found",purchase);
        SSS.Purchase.SetSelectedPurchase(purchase);
  
        //$('#selHomeProducts').val();
        $('#txtHomeCount').val(purchase.Count);
        $('#txtHomeDate').val(purchase.PurchaseDate.getFullYear() + "-" + purchase.PurchaseDate.getMonth() + "-" + purchase.PurchaseDate.getDate());
        $('#selHomeProducts').val(purchase.ProductID);
        $('#txtHomeCostOverride').val(purchase.CostOverride==null?'':purchase.CostOverride);
        
        $('#btnAddPurchase').prop('disabled', true);
        $('#btnDelPurchase').prop('disabled', false);
        $('#btnUpdatePurchase').prop('disabled', false);
      });
  }
