
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
        context.clearRect( 0, 0, 700, 400 );      
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
        let dat =  dataArr[ 0 ].PurchaseDate.getMonth()+1 + "/" + (dataArr[ 0 ].PurchaseDate.getFullYear() + "").substr(2);
        context.fillText( dat, 15, GRAPH_BOTTOM + 25);      
        for( var i = 1; i < arrayLen; i++ )
        {
            context.lineTo( GRAPH_RIGHT / arrayLen * i + GRAPH_LEFT, ( GRAPH_HEIGHT - dataArr[ i ].Cost / largest * GRAPH_HEIGHT ) + GRAPH_TOP );          
            // draw reference value for day of the week          
            let dat =  dataArr[i].PurchaseDate.getMonth()+1 + "/" + (dataArr[i].PurchaseDate.getFullYear() + "").substr(2)
            context.fillText(dat, GRAPH_RIGHT / arrayLen * i, GRAPH_BOTTOM + 25);      
        }      
        context.stroke();  
} 

