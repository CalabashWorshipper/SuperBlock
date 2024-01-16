const can1 = document.getElementById('c1');
const ctx1 = can1.getContext('2d');
const can2 = document.getElementById('c2');
const ctx2 = can2.getContext('2d');
const socket= new WebSocket('ws://68.172.39.167:443/BBws');

socket.onopen = function (event) {
    console.log('connection is open!');
    alert('the connection is open');
    socket.send('start');             // <- this is the change
}

can1.width = 1216;
can1.height = 684;
can2.width = can1.width
can2.height = can1.height
var old_url = null
var not_done_before = false

//can1.addEventListener('click',function(event){
    //let x = event.offsetX
    //let y = event.offsetY
    console.log(x,y)
    socket.send((x,y))
    //ctx1.fillStyle = 'red'
    //ctx1.beginPath();
    //ctx1.arc(x,y,5,0,Math.PI*2);
    //ctx1.fill();
    //ctx1.stroke();
//})

socket.onmessage = ({data}) =>{
    if (typeof(data) != 'string'){
        new_url=URL.createObjectURL(data);
        if (not_done_before){
            first_img(new_url);
            not_done_before = false
        }
        else{
            //console.log(new_url);
            manual(new_url);
        }
    }
    else{
        console.log(data);
    }       
}

function manual(img1s,img2s){
    var img1 =  new Image();
    img1.src = img1s
 
    img1.addEventListener('load',function(){
        ctx1.drawImage(img1,0,0)
        var scanned = ctx1.getImageData(0,0,1216,684)
        var data = scanned.data
        var scanned2 = ctx2.getImageData(0,0,1216,684)
        var data2 = scanned2.data
    
        console.log(scanned,scanned2)
        for (let i = 0; i<data.length; i+=4){
            if (data[i] < 35){
                if (data[i+1] < 35){
                    if (data[i+2] < 35){
                        data[i] = data2[i]
                        data[i+1] = data2[i+1]
                        data[i+2] = data2[i+2]
                    }
                }
            }
        }
        scanned.data = data
        ctx1.putImageData(scanned,0 ,0)
        ctx2.putImageData(scanned,0,0)
        
    })
}

function first_img(){
    var img1 =  new Image();
    img1.src = img1s
    img1.addEventListener('load',function(){
        ctx1.drawImage(img1,0,0)
        var scanned = ctx1.getImageData(0,0,1216,684)
        var data = scanned.data
    
        ctx2.drawImage(img1,0,0)
        var scanned2 = ctx2.getImageData(0,0,1216,684)
        var data2 = scanned2.data
    })

}
