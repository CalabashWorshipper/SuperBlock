const can1 = document.getElementById('c1');
const ctx1 = can1.getContext('2d');
const can2 = document.getElementById('c2');
const ctx2 = can2.getContext('2d');
const socket2= new WebSocket('ws://68.172.47.98:1335/testingstuff');
const socket= new WebSocket('ws://68.172.47.98:1334/BBws');
const BIG = document.getElementById('large');
const AVER = document.getElementById('average');
const LATE = document.getElementById('latests');
const TOT = document.getElementById('total');
const FPSSHOW = document.getElementById('fps');
const FPSTOT = document.getElementById('fpstot');
var prev_time = null
var fpsss = 0
var fps_tot = 0
var big_tot = 0
var fsss = 0
var biggest = 0
//'ws://127.0.0.1:8001/testingstuff'

socket.onopen = function (event) {
    console.log('connection is open!');
    alert('the connection is open');
    socket.send(prompt());
    socket2.send(prompt());
}


can1.width = 1216;
can1.height = 684;
can2.width = can1.width
can2.height = can1.height
var old_url = null
var not_done_before = false

document.addEventListener('keydown', function (e) {
    e = e || window.event;
    if (!e.repeat) {
        console.log(e.key)
        socket2.send("DOWN:" + e.key)
    }
});

document.addEventListener('keyup', function (f) {
    f = f || window.event;
    console.log(f.key)
    socket2.send("UP:" + f.key)
});


can1.addEventListener('contextmenu', function(event) {
    // Prevent the default context menu from appearing
    event.preventDefault();

    // Your custom code for right-click handling goes here
    let x = event.offsetX
    let y = event.offsetY
    x = x * 1.57894736842
    y = y * 1.57894736842
    console.log(x,y)
    x = String(x)
    y = String(y)
    click_data = "click:" + x + ':' + y + ':' + 'RIGHT'
    socket2.send(click_data)   
});

can1.addEventListener('click',function(event){
    let x = event.offsetX
    let y = event.offsetY
    x = x * 1.57894736842
    y = y * 1.57894736842
    console.log(x,y)
    x = String(x)
    y = String(y)
    click_data = "click:" + x + ':' + y + ':' + 'LEFT'
    socket2.send(click_data)
})

socket.onmessage = ({data}) =>{
    if (typeof(data) != 'string'){
        fsss +=1
        file_size = data.size
        file_size = file_size/1000
        LATE.innerHTML = 'Most Recent File Size:' + String(file_size) + 'kB'
        big_tot += file_size
        TOT.innerHTML = 'Total Data Received:' + String(Math.round(((big_tot/1000)*100))/100) + 'MB'
        if (file_size >= biggest){
            biggest = file_size
            BIG.innerHTML = "Largest File Size:" + String(biggest) + "kB"
            
        }
        AVER.innerHTML = "Average File Size:" + String((Math.round((big_tot/fsss)*100))/100) + "kB"

        
        
        new_url=URL.createObjectURL(data);
        //console.log(new_url);
        if (not_done_before){
            first_img(new_url);
            prev_time = performance.now()
            not_done_before = false
        }
        else{
            //console.log(new_url);
            manual(new_url).then(
                URL.revokeObjectURL(new_url)
            );
            timething = performance.now()
            if (prev_time == null){
                prev_time = timething + 200
            }
            fps = 1/((timething-prev_time)/1000)
            fps_tot += fps
            fpsss +=1
            FPSTOT.innerHTML = "Average FPS:" + String((Math.round((fps_tot/fpsss)*100))/100)
            FPSSHOW.innerHTML = "FPS:" + String((Math.round(fps*100))/100)
            prev_time = timething
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
    
        //console.log(scanned,scanned2)
        for (let i = 0; i<data.length; i+=4){
            if (data[i] < 20){
                if (data[i+1] < 20){
                    if (data[i+2] < 20){
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
