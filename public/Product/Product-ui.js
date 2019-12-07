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
    SSS.Product.Add({ ProductID: null, Title: ProductTitle, Count: ProductCount, Cost: ProductCost}).then(data=>  
      { 
        RefreshProductRows();
        $('#txtAddTitle').val('');
        $('#txtAddCount').val('');
        $('#txtAddCost').val('');
        alert(data.status);
      });
  });



  $('#btnDelProduct').click(function() {
    let selProd = SSS.Product.GetSelectedProduct();
    if (selProd==null){
        alert("Please select a Product");
        return;
      }

      let ans = confirm(`Are you sure you want to delete (${selProd.Title})`);
    if (ans===true){
//         alert("deleting item id=" + $('#selProducts').val());
      SSS.Product.Delete().then(data=>  
            { 
              RefreshProductRows();
              alert(data.status);
              $('#txtAddTitle').val('');
              $('#txtAddCount').val('');
              $('#txtAddCost').val('');
      

              $('#btnAddProduct').prop('disabled', false);
              $('#btnDelProduct').prop('disabled', true);
              $('#btnUpdateProduct').prop('disabled', true);
              $('#txtAddProductTitle').val('');
            });
    }
  });

  $('#btnUpdateProduct').click(function() {
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


    let isChecked = $('#prodOverChk').prop('checked');
    if (!isChecked) {
      if (ProductCost==""){
        alert("An Item Cost is required");
        return;
      }
    }
    SSS.Product.Save({Title: ProductTitle, Count: ProductCount, Cost: ProductCost}).then(data=>  
    { 
      $('#txtAddTitle').val('');
      $('#txtAddCount').val('');
      $('#txtAddCost').val('');
    RefreshProductRows();
      alert(data.status);

      $('#btnAddProduct').prop('disabled', false);
      $('#btnDelProduct').prop('disabled', true);
      $('#btnUpdateProduct').prop('disabled', true);
      $('#txtAddProductTitle').val('');
    });
  });

  $('#btnClearProduct').click(function() {
    $('#btnAddProduct').prop('disabled', false);
      $('#btnDelProduct').prop('disabled', true);
      $('#btnUpdateProduct').prop('disabled', true);
      $('#txtAddTitle').val('');
      $('#txtAddCount').val('');
      $('#txtAddCost').val('');
    });



  function RefreshProductRows() {

    //******** Refresh Home select      
    $("#selHomeProducts").empty();

    if (SSS.Product.GetLoadError()!='') {
      $("#selHomeProducts").append(new Option(SSS.Product.GetLoadError(), '-1'));
    }
    else {
      $("#selHomeProducts").append(new Option("Title...............Count...........Cost", '-1'));
 
      var vals = SSS.Product.Products();
      (vals).forEach(element => {
        var txt = element.Title.padright(".....................") + (element.Count + "").padright("...............") + (element.Cost==null?'$0.00':formatMoney(element.Cost));
        $("#selHomeProducts").append(new Option(txt, element.ProductID));
      });
    }

    //******** Refresh Category select      
    $("#selCatProducts").empty();
    if (SSS.Product.GetLoadError()!='') {
      $("#selCatProducts").append(new Option(SSS.Product.GetLoadError(), '-1'));
    }
    else {
      $("#selCatProducts").append(new Option("<<<Select Product>>>", '-1'));
      var vals = SSS.Product.Products();
      (vals).forEach(element => {
        $("#selCatProducts").append(new Option(element.Title, element.ProductID));
      });
    }
    // Refresh Product grid data
    $("#tblProductData2").find("tr:gt(0)").remove();
    if (SSS.Product.GetLoadError()!='') {
      var appendEl2 = $(`<tr></tr>`).appendTo("#tblProductData2");
      $("<td colspan='6'>" + SSS.Product.GetLoadError() + "</td>").appendTo(appendEl2);  

    }
    else
    {
      (vals).forEach(element => {
        //console.log('tblCategoryData element', element);
        var appendEl2 = $("<tr></tr>").appendTo("#tblProductData2");
        $("<td>" + element.ProductID + "</td><td>" + element.Title + "</td><td>" + element.Count + "</td><td>" + formatMoney(element.Cost) + "</td>").appendTo(appendEl2);  
      });

      $("#prodOverChk").change(function() {
          let prod = SSS.Product.GetSelectedProduct();
          if (prod==null) {
            alert("problem finding Product=" + selectProdTitle);
            return;
          }

          if(this.checked) {
            prod.Cost=null;
            $('#txtAddCost').val('');
            $('#txtAddCost').prop('disabled', true);
          }
          else {
            prod.Cost=null;
            $('#txtAddCost').prop('disabled', false);
        }
      });

      //******** Product grid ROW CLICK
      $("#tblProductData2").find("tr:gt(0)").click(function(event){
        console.log("event",event.currentTarget);
        let selectProdID = event.currentTarget.childNodes[0].innerText;
        console.log("selectProdID",selectProdID);
        let selectProdTitle = event.currentTarget.childNodes[1].innerText;
    
        var prods = SSS.Product.Products();
        let prod =  prods.find(function(prod) {
              return prod.ProductID==selectProdID;
            });
        if (prod==null) {
          alert("problem finding Product=" + selectProdTitle);
          return;
        }
        //console.log("category found",cat);
        SSS.Product.SetSelectedProduct(prod);

        $('#txtAddTitle').val(prod.Title);
        $('#txtAddCount').val(prod.Count);
        $('#txtAddCost').val(prod.Cost);

        if (prod.Cost==null) {
          $('#prodOverChk').prop('checked', true);
          $('#txtAddCost').prop('disabled', true);
        }
        else {
          $('#prodOverChk').prop('checked', false);
          $('#txtAddCost').prop('disabled', false);
        }
        
        $('#btnAddProduct').prop('disabled', true);
        $('#btnDelProduct').prop('disabled', false);
        $('#btnUpdateProduct').prop('disabled', false);
      });
    }
    /******** bootstrap  Product grid
    var rows = $("#tblProductData > .row");
    for (i=0; i< rows.length;i++) {
        rows[i].remove();  
    }

    (vals).forEach(element => {
      var appendEl = $("<div class='row'></div>").appendTo("#tblProductData");
      $("<div class='col-sm-2'>" + element.ProductID + "</div><div class='col-sm-2'>" + element.Title + "</div><div class='col-sm-2'>" + element.Count + "</div><div class='col-sm-2'>" + formatMoney(element.Cost) + "</div>").appendTo(appendEl);  
    }); ************/
  }
