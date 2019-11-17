function RefreshProductCategories(selProductId) {
    $("#selCatAll").empty();
    $("#selCatSelected").empty();
    console.log('RefreshProductCategories selProductId', selProductId)
    let all = SSS.Category.Categories();
    console.log('RefreshProductCategories all', all);
    let selected = SSS.Category.GetCategoryByProductID(selProductId);
    console.log('RefreshProductCategories selected', selected);
    (all).forEach(element => {
      let cat =  selected.find(function(cat) {
            return cat.CategoryID==element.CategoryID;
          });
      if (cat==null)
        $("#selCatAll").append(new Option(element.Title, element.CategoryID));
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
