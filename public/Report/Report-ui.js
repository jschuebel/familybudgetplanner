$('#selReportCat').change(function() {
    var selCategoryId = $('#selReportCat').val();
    if (selCategoryId=="-1") {
      alert("Please select a Category to generate report")
      return;
    }

    let isrdoBarChecked = $('#rdoBar').prop('checked');
    let isrdoLineChecked = $('#rdoLine').prop('checked');
    
    /*
    if (!isrdoBarChecked && !isrdoLineChecked)
    {
        alert("Please select a Report Type")
      return;
    }*/
    SSS.Report.SetSelectedCategory({ CategoryID:selCategoryId, Title:null});
    SSS.Report.init(isrdoLineChecked?2:1);
  });

  $('input[type=radio][name=rpttype]').change(function() {
      let reportType=-1;
    if (this.id == 'rdoBar') {
        reportType=1;
    }
    if (this.id == 'rdoLine') {
        reportType=2;
    }

    var selCategoryId = $('#selReportCat').val();
    /*
    if (selCategoryId=="-1") {
        alert("Please select a Category to generate report")
        return;
      }
      */
    SSS.Report.SetSelectedCategory({ CategoryID:selCategoryId, Title:null});
    SSS.Report.init(reportType);

});

function drawGraph( dataArr )
{   var canvas = document.getElementById( "purchasesCanvas" );      
    var context = canvas.getContext( "2d" );       
    var GRAPH_TOP = 25;      
    var GRAPH_BOTTOM = 375;      
    var GRAPH_LEFT = 25;      
    var GRAPH_RIGHT = 575; // 475;        
    var GRAPH_HEIGHT = 350;      
    var GRAPH_WIDTH = 750; //450;       
    var arrayLen = dataArr.length;        
    var largest = 0;     
    for( var i = 0; i < arrayLen; i++ )
    {          
        
        if( dataArr[ i ].Cost > largest )
        {              
            largest = dataArr[ i ].Cost;
        }      
    }
        context.clearRect( 0, 0, 700, 450 );      
        // set font for fillText()      
        context.font = "16px Arial";            
        // draw X and Y axis      
        context.beginPath();      
        context.moveTo( GRAPH_LEFT, GRAPH_BOTTOM );      
        context.lineTo( GRAPH_RIGHT, GRAPH_BOTTOM );      
        context.lineTo( GRAPH_RIGHT, GRAPH_TOP );      
        context.stroke();             
        // draw reference line      
        context.beginPath();      
        context.strokeStyle = "#BBB";      
        context.moveTo( GRAPH_LEFT, GRAPH_TOP );      
        context.lineTo( GRAPH_RIGHT, GRAPH_TOP );      
        
        
        // draw reference value for hours      
        context.fillText( largest, GRAPH_RIGHT + 15, GRAPH_TOP);      
        context.stroke();         
        // draw reference line      
        context.beginPath();      
        context.moveTo( GRAPH_LEFT, ( GRAPH_HEIGHT ) / 4 * 3 + GRAPH_TOP );      
        context.lineTo( GRAPH_RIGHT, ( GRAPH_HEIGHT ) / 4 * 3 + GRAPH_TOP );      
        // draw reference value for hours      
        context.fillText( Math.round(largest / 4) + ".00", GRAPH_RIGHT + 15, ( GRAPH_HEIGHT ) / 4 * 3 + GRAPH_TOP);      
        context.stroke();        
        // draw reference line      
        context.beginPath();      
        context.moveTo( GRAPH_LEFT, ( GRAPH_HEIGHT ) / 2 + GRAPH_TOP );      
        context.lineTo( GRAPH_RIGHT, ( GRAPH_HEIGHT ) / 2 + GRAPH_TOP );      
        // draw reference value for hours      
        context.fillText( Math.round(largest / 2) + ".00", GRAPH_RIGHT + 15, ( GRAPH_HEIGHT ) / 2 + GRAPH_TOP);      
        context.stroke();         
        // draw reference line      
        context.beginPath();      
        context.moveTo( GRAPH_LEFT, ( GRAPH_HEIGHT ) / 4 + GRAPH_TOP );      
        context.lineTo( GRAPH_RIGHT, ( GRAPH_HEIGHT ) / 4 + GRAPH_TOP );      
        // draw reference value for hours      
        context.fillText( Math.round(largest / 4 * 3) + ".00", GRAPH_RIGHT + 15, ( GRAPH_HEIGHT ) / 4 + GRAPH_TOP);      
        context.stroke();        


        // draw titles      
        context.fillText( "Month/Year", GRAPH_RIGHT / 3, GRAPH_BOTTOM + 50);      
        context.fillText( "Cost", GRAPH_RIGHT + 30, GRAPH_HEIGHT / 2);        
        context.beginPath();      
        context.lineJoin = "round";      
        context.strokeStyle = "black"; 
        context.font = "12px Arial";       
        context.moveTo( GRAPH_LEFT, ( GRAPH_HEIGHT - dataArr[ 0 ].Cost / largest * GRAPH_HEIGHT ) + GRAPH_TOP );      
        // draw reference value for day of the week   
        context.fillText( dataArr[ 0 ].monthYear, 15, GRAPH_BOTTOM + 25);      
        for( var i = 1; i < arrayLen; i++ )
        {
            context.lineTo( GRAPH_RIGHT / arrayLen * i + GRAPH_LEFT, ( GRAPH_HEIGHT - dataArr[ i ].Cost / largest * GRAPH_HEIGHT ) + GRAPH_TOP );          
            // draw reference value for day of the week          
            context.fillText(dataArr[i].monthYear, GRAPH_RIGHT / arrayLen * i, GRAPH_BOTTOM + 25);      
        }      
        context.stroke();  
} 


 
function drawLine(ctx, startX, startY, endX, endY,color){
    ctx.save();
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(startX,startY);
    ctx.lineTo(endX,endY);
    ctx.stroke();
    ctx.restore();
}
 
function drawBar(ctx, upperLeftCornerX, upperLeftCornerY, width, height,color){
    ctx.save();
    ctx.fillStyle=color;
    ctx.fillRect(upperLeftCornerX,upperLeftCornerY,width,height);
    ctx.restore();
}
 
var myVinyls = {
    "1/19": 10,
    "3/19": 14,
    "4/19": 2,
    "5/19": 12,
    "6/19": 8,
    "7/19": 6
};
 
var Barchart = function(options){

    this.options = options;
    this.canvas = document.getElementById( "purchasesCanvas" ); //options.canvas;
    this.ctx = this.canvas.getContext("2d");
    this.colors = options.colors;
  
    function getRndColor() {
        var r = 255*Math.random()|0,
            g = 255*Math.random()|0,
            b = 255*Math.random()|0;
        return 'rgb(' + r + ',' + g + ',' + b + ')';
    }

    this.draw = function(){
        this.ctx.clearRect( 0, 0, 700, 450 );      
        var maxValue = 0;
        for (var categ in this.options.data){
            maxValue = Math.max(maxValue,this.options.data[categ].Cost);
        }
        var canvasActualHeight = this.canvas.height - this.options.padding * 2;
        var canvasActualWidth = this.canvas.width - this.options.padding * 2;
 
        //drawing the grid lines
        var gridValue = 0;
        //console.log("!!!!!!!!!!!!!!!!!!!!!!! maxValue",maxValue);
        while (gridValue <= maxValue){
            var gridY = canvasActualHeight * (1 - gridValue/maxValue) + this.options.padding;
            //console.log("!!!!!!!!!!!!!!!!!!!!!!! gridY",gridY);
            drawLine(
                this.ctx,
                0,
                gridY,
                this.canvas.width,
                gridY,
                this.options.gridColor
            );

            //writing grid markers
            this.ctx.save();
            this.ctx.fillStyle = this.options.gridColor;
            this.ctx.textBaseline="bottom"; 
            this.ctx.font = "bold 10px Arial";
            this.ctx.fillText(gridValue, 10,gridY - 2);
            this.ctx.restore();
 
            gridValue+=this.options.gridScale;
        }      
  
  //  return;
        //drawing the bars
        var barIndex = 0;
        var numberOfBars = Object.keys(this.options.data).length;
        var barSize = (canvasActualWidth)/numberOfBars;
        //console.log("!!!!!!!!!!!!!!!!!!!!!!! barSize",barSize);

        this.options.data.forEach(categ => {
            var val = categ.Cost; //this.options.data[categ];
            var barHeight = Math.round( canvasActualHeight * val/maxValue) ;
            drawBar(
                this.ctx,
                this.options.padding + barIndex * barSize,
                this.canvas.height - barHeight - this.options.padding,
                barSize,
                barHeight,
                getRndColor()
                //this.colors[barIndex%this.colors.length]
            );

            this.ctx.save();
            this.ctx.textBaseline="bottom";
            this.ctx.textAlign="center";
            this.ctx.fillStyle = "#000000";
            this.ctx.font = "bold 14px Arial";
            this.ctx.fillText(categ.monthYear, (this.options.padding + barIndex * barSize)+(15 + (barSize/4)),this.canvas.height);
            this.ctx.restore();  
    

 
            barIndex++;
        });
 
        /*drawing series name
        this.ctx.save();
        this.ctx.textBaseline="bottom";
        this.ctx.textAlign="center";
        this.ctx.fillStyle = "#000000";
        this.ctx.font = "bold 14px Arial";
        for (categ in this.options.data){
            this.ctx.fillText(categ, this.canvas.width/2,this.canvas.height);
        }
        this.ctx.restore();  
         */
        /*draw legend
        barIndex = 0;
        var legend = document.querySelector("legend[for='purchasesCanvas']");
        var ul = document.createElement("ul");
        legend.append(ul);
        for (categ in this.options.data){
            var li = document.createElement("li");
            li.style.listStyle = "none";
            li.style.borderLeft = "20px solid "+this.colors[barIndex%this.colors.length];
            li.style.padding = "5px";
            li.textContent = categ;
            ul.append(li);
            barIndex++;
        }
        */
    }
}
 
