function RefreshProductCategories(selProductId) {
    $("#selCatAll").empty();
    $("#selCatSelected").empty();
    console.log('RefreshProductCategories selProductId', selProductId)
    let all = SSS.Category.Categories();
    console.log('RefreshProductCategories all', all);
    let selected = SSS.Category.GetCategoryByProductID(selProductId);
    console.log('RefreshProductCategories selected', selected);
    var colcnt=0;
    var rowcnt=1;
    $("#divCatXrefs").empty();
    var appendEl3 = $(`<div class="row" id='${rowcnt}'></div>`).appendTo("#divCatXrefs");
    (all).forEach(element => {
      let cat =  selected.find(function(cat) {
            return cat.CategoryID==element.CategoryID;
          });
      if (cat==null) {
        hldcheck="";
        $("#selCatAll").append(new Option(element.Title, element.CategoryID));
      }
      else {
        hldcheck="checked";
      }
      if (colcnt>5) {
          appendEl3 = $("<div class='row' ></div>").appendTo("#divCatXrefs");
          rowcnt++;
          colcnt=0;
      }
      $(`<div style='background-color: white;' class='col-sm-2'><label class='checkbox-inline'><input type='checkbox' name='catgroup' ${hldcheck} id='${element.CategoryID}' />${element.Title}</label></div></div>`).appendTo(appendEl3);  
          colcnt++;

    });

    (selected).forEach(element => {
      $("#selCatSelected").append(new Option(element.Title, element.CategoryID));
    });
  }

  $('#selCatProducts').change(function() {
    var selProductId = $('#selCatProducts').val();
    if (selProductId=="-1") {
      $('#btnUpdateCategoryXref').prop('disabled', true);
      return;
    }

    $('#btnUpdateCategoryXref').prop('disabled', false);
    RefreshProductCategories(selProductId);
  });

  
  $('#btnCatProdMoveRight').click(function() {
    $('#selCatAll  > option:selected').each(function() {
      //alert($(this).text() + ' ' + $(this).val());

      $("#selCatSelected").append(new Option($(this).text(), $(this).val()));
      $(this).remove();
    });
  });

  $('#btnCatProdMoveLeft').click(function() {
    $('#selCatSelected  > option:selected').each(function() {
      //alert($(this).text() + ' ' + $(this).val());

      $("#selCatAll").append(new Option($(this).text(), $(this).val()));
      $(this).remove();
    });
  });

  $('#btnUpdateCategoryXref').click(function() {
    var selProductId = $('#selCatProducts').val();
    if (selProductId=="-1") {
      $('#btnUpdateCategoryXref').prop('disabled', true);
      return;
    }
    
   // var selcats = $("input[name='catgroup']:checked");
    


    /*
    let selCatAll = [];
    $('#selCatAll > option').each(function() {
      selCatAll.push($(this).val());
      //alert($(this).text() + ' ' + $(this).val());
    });
    console.log('selCatAll', selCatAll)
    */
    let selCatSelected = [];
    $('#selCatSelected > option').each(function() {
      selCatSelected.push($(this).val());
    });
    console.log('selCatSelected', selCatSelected)

    SSS.Category.SaveCategoryXref(selProductId, selCatSelected).then(data=>  
    { 
      RefreshProductCategories(selProductId);
      alert(data.status);
    });
  });
