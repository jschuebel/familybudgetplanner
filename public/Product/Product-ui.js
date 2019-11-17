/// <reference path="Product.js" />

$('#btnAddProduct').click(function() {
    var ProductTitle = $('#txtAddTitle').val();
    var ProductCount = $('#txtAddCount').val();
    var ProductCost = $('#txtAddCost').val();

    if (ProductTitle==""){
      alert("An Item Title is required");
      return;
    }

    if (ProductCount==""){
      alert("An Item Count is required");
      return;
    }
    if (ProductCost==""){
      alert("An Item Cost is required");
      return;
    }

    var Prods = SSS.Product.Products();
    var Idx = Prods.length + 1;
    SSS.Product.Add({ ProductID: Idx, Title: ProductTitle, Count: ProductCount, Cost: ProductCost});
    SSS.Product.Save();
    RefreshProductRows();
    $('#txtAddTitle').val('');
    $('#txtAddCount').val('');
    $('#txtAddCost').val('');
  });

  $('#btnRemoveProduct').click(function() {
//      var ans = confirm("Are you sure you want to delete (" + $('#selProducts').text() + ")");
//      if (ans===true){
//          alert("deleting item id=" + $('#selProducts').val());
    //TODO  SSS.Product.Remove();
  });

  function RefreshProductRows() {

    //******** Refresh Home select      
    $("#selHomeProducts").empty();
    var vals = SSS.Product.Products();
    (vals).forEach(element => {
      var txt = element.Title.padright("...............") + (element.Count + "").padright("...............") + (element.Cost==null?'$0.00':formatMoney(element.Cost));
      $("#selHomeProducts").append(new Option(txt, element.ProductID));
    });

    //******** Refresh Category select      
    $("#selCatProducts").empty();
    $("#selCatProducts").append(new Option("Select Product", "-1"));
    var vals = SSS.Product.Products();
    (vals).forEach(element => {
      $("#selCatProducts").append(new Option(element.Title, element.ProductID));
    });
    

    //******** Refresh Product grid
    var rows = $("#tblProductData > .row");
    for (i=0; i< rows.length;i++) {
        rows[i].remove();  
    }

    (vals).forEach(element => {
      var appendEl = $("<div class='row'></div>").appendTo("#tblProductData");
      $("<div class='col-sm-2'>" + element.ProductID + "</div><div class='col-sm-2'>" + element.Title + "</div><div class='col-sm-2'>" + element.Count + "</div><div class='col-sm-2'>" + formatMoney(element.Cost) + "</div>").appendTo(appendEl);  
    });
  }
