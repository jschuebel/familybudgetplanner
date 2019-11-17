    /// <reference path="Category.js" />

    $('#btnAddCategory').click(function() {
        var AddCategoryTitle = $('#txtAddCategoryTitle').val();
        if (AddCategoryTitle==""){
          alert("Category Title is required");
          return;
        }
  
        SSS.Category.Add({ CategoryID:0, Title:AddCategoryTitle}).then(data=>  
        { 
          RefreshCategoryRows();
          alert(data.status);
        });
  
      });
  
      $('#btnDelCategory').click(function() {
  
        let selCat = SSS.Category.GetSelectedCategory();
        if (selCat==null){
            alert("Please select a Category");
            return;
          }
        let ans = confirm(`Are you sure you want to delete (${selCat.Title})`);
        if (ans===true){
  //         alert("deleting item id=" + $('#selProducts').val());
          SSS.Category.Delete().then(data=>  
                { 
                  RefreshCategoryRows();
                  alert(data.status);
                  $('#btnAddCategory').prop('disabled', false);
                  $('#btnDelCategory').prop('disabled', true);
                  $('#btnUpdateCategory').prop('disabled', true);
                  $('#txtAddCategoryTitle').val('');
                });
        }
      });
  
      $('#btnUpdateCategory').click(function() {
        var UpdateCategoryTitle = $('#txtAddCategoryTitle').val();
        if (UpdateCategoryTitle==""){
          alert("Category Title is required");
          return;
        }
  
        SSS.Category.Save(UpdateCategoryTitle).then(data=>  
        { 
          RefreshCategoryRows();
          alert(data.status);
          $('#btnAddCategory').prop('disabled', false);
          $('#btnDelCategory').prop('disabled', true);
          $('#btnUpdateCategory').prop('disabled', true);
          $('#txtAddCategoryTitle').val('');
        });
      });
  
      $('#btnClearCategory').click(function() {
        $('#btnAddCategory').prop('disabled', false);
          $('#btnDelCategory').prop('disabled', true);
          $('#btnUpdateCategory').prop('disabled', true);
          $('#txtAddCategoryTitle').val('');
      });
  
      
  
      function RefreshCategoryRows() {
        //******** Refresh Home select      
        $("#selCatAll").empty();
        var vals = SSS.Category.Categories();
        (vals).forEach(element => {
          $("#selCatAll").append(new Option(element.Title, element.CategoryID));
        });
  
        $("#tblCategoryData").find("tr:gt(0)").remove();
        (vals).forEach(element => {
          //console.log('tblCategoryData element', element);
          var appendEl2 = $("<tr></tr>").appendTo("#tblCategoryData");
          $("<td>" + element.CategoryID + "</td><td>" + element.Title + "</td>").appendTo(appendEl2);  
        });
  
        $("#tblCategoryData").find("tr:gt(0)").click(function(event){
          console.log("event",event.currentTarget);
          let selectCatID = event.currentTarget.childNodes[0].innerText;
          let selectCatTitle = event.currentTarget.childNodes[1].innerText;
  
          var cats = SSS.Category.Categories();
          let cat =  cats.find(function(cat) {
                return cat.CategoryID==selectCatID;
              });
          if (cat==null) alert("problem finding Category=" + selectCatTitle);
          //console.log("category found",cat);
          SSS.Category.SetSelectedCategory(cat);
  
          
          $('#btnAddCategory').prop('disabled', true);
          $('#btnDelCategory').prop('disabled', false);
          $('#btnUpdateCategory').prop('disabled', false);
          $('#txtAddCategoryTitle').val(cat.Title);
        });
  
  
      }
  