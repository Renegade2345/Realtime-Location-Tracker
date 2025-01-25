// socket io has been initialized sending a request in the backend
const socketio = io(); 

// navigator is builtin
if(navigator.geolocation){
    navigator.geolocation.watchPosition((position)=>{
       const{latitude, longitude} = position.coords
       socketio.emit("send-location",{latitude, longitude});

       (error)=>{
        console.log(error)
       },

       {
        enableHighAccuracy:true,
        // no caching
        maximumAge :0,
        timeout:5000
       }
       

    })


    }

// using leaflet now
const map = L.map("map").setView([0,0],10)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution:"Renegade"

}).addTo(map)


const markers ={}

socketio.on("recieve-location", (data)=>{
    const{id, latitude, longitude} = data
    map.setView([latitude, longitude])
    if(markers[id]){
        markers[id].setLatlang([latitude, longitude])
    }else{
        markers[id]= L.marker([latitude,longitude]).addTo(map)
    }
})


socketio.on("user-disconnected", (id)=>{
    if(markers[id]){
        map.removeLayer(markers[id])
        delete markers[id]
    }
})
