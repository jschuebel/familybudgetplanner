/// <reference path="Purchase.js" />

$('#btnHomeAdd').click(function() {
    var selProductId = $('#selHomeProducts').val();
    var PurchaseCount = $('#txtHomeCount').val();
    if (PurchaseCount==""){
      alert("A Count of Items purchased is required");
      return;
    }
    var PurchaseDate = $('#txtHomeDate').val();
    if (PurchaseDate==""){
      alert("A Date of Items purchased is required");
      return;
    }

    PurchaseDate=new Date(PurchaseDate);
    SSS.Purchase.Add({ ProductID: selProductId, Count: PurchaseCount, PurchaseDate: PurchaseDate});
    RefreshPurchaseRows();
  });

  function RefreshPurchaseRows() {

    $("#tblPurchaseData2").find("tr:gt(0)").remove();
    

    var rows = $("#tblPurchaseData > .row");
    for (i=0; i< rows.length;i++) {
     // if (i>0)//Skip title row
        rows[i].remove();  
    }

    var vals = SSS.Purchase.Purchases();
    (vals).forEach(element => {
      var appendEl = $("<div class='row'></div>").appendTo("#tblPurchaseData");
      $("<div class='col-sm-2'>" + element.Title + "</div><div class='col-sm-2'>" + element.UnitCount + "</div><div class='col-sm-2'>" + formatMoney(element.UnitCost) + "</div><div class='col-sm-2'>" + element.Count + "</div><div class='col-sm-2'>" + element.Cost + "</div>").appendTo(appendEl);  


      //console.log('datetype', typeof(element.PurchaseDate));
      var appendEl2 = $("<tr></tr>").appendTo("#tblPurchaseData2");
      $("<td>" + element.Title + "</td><td>" + element.UnitCount + "</td><td>" + formatMoney(element.UnitCost) + "</td><td>" + element.Count + "</td><td>" + element.Cost + "</td><td>" + element.PurchaseDate.toDateString() + "</td>").appendTo(appendEl2);  
      


    });
    

  }
