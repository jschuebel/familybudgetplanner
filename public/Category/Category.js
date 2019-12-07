var SSS = SSS || {};
SSS.Category = {};

(function() {
    let self = this;
    self.mCategories = [];
    self.mCategoriesXref = [];
    self.selectedCategory = null;
    self.LoadErrorMessage='';

    this.Add = function(newPurchase) {
      return new Promise((resolve, reject) => {
        $.post("api/category",newPurchase,
          function(catRespone, status){
            console.log('category save return ', catRespone);
            //alert("Data: " + data.result + "\nStatus: " + status);

            self.LoadCategory().then((loadResult) => {
                console.log("LoadCategory from Add result",loadResult);
                self.mCategories = loadResult.data;
                resolve(catRespone.data);
            });
          });
        });
    };
    

    this.Categories = function() {
      return self.mCategories;
    };

    this.GetCategoryByProductID = function(ProductID) {
      let selProductList = [];
      (self.mCategoriesXref).forEach(element => {
        if (element.ProductID==ProductID) {
          let cat =  self.mCategories.find(function(cat) {
            return cat.CategoryID==element.CategoryID;
          });
          if (cat!=null)
            selProductList.push(cat);
        }
      });
      return selProductList;
    };

    this.GetSelectedCategory = function(selCat) {
      return self.selectedCategory;
    }

    this.SetSelectedCategory = function(selCat) {
      self.selectedCategory=selCat;
    }

    this.Save = function(updatedTitle) {
      if (self.selectedCategory==null){
        alert("Please select a Category");
        return;
      }
      self.selectedCategory.Title=updatedTitle;
      return new Promise((resolve, reject) => {
        $.ajax({
          url: "api/category",
          data: self.selectedCategory,
          dataType: 'json',
          type: 'PUT',
          success: function(response) {
            self.selectedCategory=null;
            resolve(response.data);
          },
          error: function(request,msg,error) {
            reject(error);
          }
        });
        });
    };

    this.Delete = function() {
      if (self.selectedCategory==null){
        alert("Please select a Category");
        return;
      }
      return new Promise((resolve, reject) => {
      $.ajax({
        url: "api/category/"+self.selectedCategory.CategoryID,
        type: 'DELETE',
        success: function(apiResponse) {
            self.selectedCategory=null;
            if (apiResponse.data.wasSuccessful){
              self.LoadCategory().then((loadResult) => {
                console.log("LoadCategory from delete result",loadResult);
                self.mCategories = loadResult.data;
                resolve(apiResponse.data);
            });
            }
            else
              resolve(apiResponse.data);
          },
          error: function(request,msg,error) {
            reject(error);
          }
        });
      });
    };

    this.LoadCategory = function() {
      return new Promise((resolve, reject) => {
        $.getJSON("api/category?brk=" + (new Date()).getTime(), null, function (data, textStatus, request) {
        console.log('Categories init', data);
        console.log('RowTotal', request.getResponseHeader('X-Total-Count')); 
        resolve({ type:1, data : data});
        })
        .fail(function(jqXHR, textStatus, errorThrown) 
        { 
          //alert('getJSON request failed! ' + textStatus); 
          if (jqXHR.status!=200)
            reject(jqXHR.responseText)
          else
            reject(textStatus)
        })
      });
    };

    this.LoadCategoryXref = function() {
      return new Promise((resolve, reject) => {
        $.getJSON("api/categoryxref?brk=" + (new Date()).getTime(), null, function (data, textStatus, request) {
          console.log('Categories categoryxref init', data);
          console.log('RowTotal', request.getResponseHeader('X-Total-Count')); 
          resolve({ type:2, data : data});
        })
        .fail(function(jqXHR, textStatus, errorThrown)
        { 
          //alert('getJSON request failed! ' + textStatus); 
          if (jqXHR.status!=200)
            reject(jqXHR.responseText)
          else
            reject(textStatus)
        })
      });
    };

    this.SaveCategoryXref = function(selProductId, CategoriesSelected) {
      if (CategoriesSelected==null){
        alert("Please select a Category");
        return;
      }
      return new Promise((resolve, reject) => {
        $.ajax({
          url: "api/categoryxref",
          data: { ProductID: selProductId, Categories:CategoriesSelected},
          dataType: 'json',
          type: 'PUT',
          success: function(response) {
            self.LoadCategoryXref().then((loadXrefResult) => {
                console.log("LoadCategoryXref from SaveCategoryXref results",loadXrefResult);
                self.mCategoriesXref = loadXrefResult.data;
                resolve(response.data);
            });
          },
          error: function(request,msg,error) {
            reject(error);
          }
        });
        });
    };


    this.GetLoadError = function() {
      return self.LoadErrorMessage;
    }

    function init(){
      console.log("Category init");
      let promises = [];
      promises.push(self.LoadCategory());
      promises.push(self.LoadCategoryXref());

      Promise.all(promises).then((results) => {
        //console.log("promisall results",results);
        results.forEach((item) => {
            //console.log("promisall item",item);
            if (item.type===1){
              //console.log('Categories category init', item.data);
              self.mCategories = item.data;
            }
            if (item.type===2){
              //console.log('Categories categoryxref init', item.data);
              self.mCategoriesXref = item.data;
              RefreshCategoryRows();
          }
        });

      })
      .catch(error => {
        console.log('Category Init catch error',error);
        self.LoadErrorMessage=`Load Category(${error})`;
        RefreshCategoryRows();
      });
    }
    init();
  }).apply(SSS.Category);
  