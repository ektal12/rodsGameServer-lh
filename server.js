let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);

var port = process.env.PORT || 3001;

http.listen(port, function () {
    console.log('listening XXXX now in http://localhost:' + port);
});




var rodSetup = require('./initialRodState')


rodsState = rodSetup.setUpInitialRodState()
placesState = []
peopleState = []
boxesState = []

gameState = {
   
    rodsState: rodsState,
    peopleState: peopleState,
    placesState: placesState,
    boxesState: boxesState,
}

io.on('connection', (socket) => {

    socket.on('itemSelected', (item)=> {

        deselectAll()
        
        if (item.typeOfObj == "Rod") {
            socket.broadcast.emit('rodSelected', item)

            for (var x = 0; x < gameState.rodsState.length; x++) {
                if (gameState.rodsState[x].id == item.id) {
                    gameState.rodsState[x].selected = true  
                } 
                gameState.rodsState[x].oldLeft = gameState.rodsState[x].left
                gameState.rodsState[x].oldTop = gameState.rodsState[x].top
               //added this line
                gameState.rodsState[x].oldAngle = gameState.rodsState[x].angle
            }
           
        }

        if (item.typeOfObj == "Person") {

            for (var y = 0; y < gameState.peopleState.length; y++) {
                if (gameState.peopleState[y].id == item.id) {
                    gameState.peopleState[y].selected = true
                } 
                gameState.peopleState[y].oldLeft = gameState.peopleState[y].left
                gameState.peopleState[y].oldTop = gameState.peopleState[y].top
            }
            // socket.broadcast.emit('peopleSelectionChanged', peopleState)
        }


        if (item.typeOfObj == "Place") {

            for (var z = 0; z < gameState.placesState.length; z++) {
                if (gameState.placesState[z].id == item.id) {
                    gameState.placesState[z].selected = true
                } 
                gameState.placesState[z].oldLeft = gameState.placesState[z].left
                gameState.placesState[z].oldTop = gameState.placesState[z].top
            }
           
        }

        if (item.typeOfObj == "Box") {

            for (var v = 0; v < gameState.boxesState.length; v++) {
                if (gameState.boxesState[v].id == item.id) {
                    gameState.boxesState[v].selected = true
                } 
                
                gameState.boxesState[v].oldLeft = gameState.boxesState[v].left
                gameState.boxesState[v].oldTop = gameState.boxesState[v].top
            }
          
        }

    })


    socket.on('objectMoved', (item)=> {
       
        for (var w = 0; w < gameState.rodsState.length; w++) {
            gameState.rodsState[w].onTop = false
        }

        for (var x = 0; x < gameState.rodsState.length; x++) {
            if (gameState.rodsState[x].id == item.id) {
                
                gameState.rodsState[x].left = item.left
                gameState.rodsState[x].top = item.top
              //added this line
                gameState.rodsState[x].oldAngle = gameState.rodsState[x].angle
                gameState.rodsState[x].angle = item.angle
                gameState.rodsState.push(gameState.rodsState[x])
                gameState.rodsState.splice(x, 1)
                socket.broadcast.emit('currentGameState', gameState)
            }
        }

        for (var i = 0; i <  gameState.placesState.length; i++) {
            if ( gameState.placesState[i].id == item.id) {
                gameState.placesState[i].oldLeft =  gameState.placesState[i].left
                gameState.placesState[i].left = item.left
                gameState.placesState[i].oldTop =  gameState.placesState[i].top
                gameState.placesState[i].top = item.top
                gameState.placesState[i].angle = item.angle
                gameState.placesState[i].moved = true
                socket.broadcast.emit('currentGameState', gameState)
                return
            }

        }

        for (var j = 0; j <  gameState.peopleState.length; j++) {

            if ( gameState.peopleState[j].id == item.id) {
                gameState.peopleState[j].oldLeft =  gameState.peopleState[j].left
                gameState.peopleState[j].left = item.left
                gameState.peopleState[j].oldTop =  gameState.peopleState[j].top
                gameState.peopleState[j].top = item.top
                gameState.peopleState[j].angle = item.angle
                gameState.peopleState[j].moved = true
                socket.broadcast.emit('currentGameState',  gameState)

                return
            }
        }


        for (var k = 0; k < gameState.boxesState.length; k++) {

            if (gameState.boxesState[k].id == item.id) {

              
                gameState.boxesState[k].oldLeft = gameState.boxesState[k].left
                gameState.boxesState[k].left = item.left
                gameState.boxesState[k].oldTop = gameState.boxesState[k].top
                gameState.boxesState[k].top = item.top
                gameState.boxesState[k].angle = item.angle
                gameState.boxesState[k].moved = true
                socket.broadcast.emit('currentGameState',  gameState)

                return
            }
        }


    })

    socket.on('getCurrentGameState', ()=> {
      
        socket.emit('currentGameState', gameState)
    })

    socket.on('addNewItem', (item)=> {
        
        switch (item.type) {
            case 'f':
            newPerson(item)
            io.emit('currentGameState', gameState)
              break;
            case 'm':
            newPerson(item)
            io.emit('currentGameState', gameState)
              break;
            case 'place':
             newPlace(item.name)
             io.emit('currentGameState', gameState)
              break;
            case 'box':
            newBox(item.name)
            io.emit('currentGameState', gameState)
              break;
            default:
              
          }

    })

    socket.on('itemRemoved', (item)=> {
        switch (item.typeOfObj) {
            case 'Person':
            for (var i = 0; i < gameState.peopleState.length; i++) {
                if(gameState.peopleState[i].id == item.id){
                    gameState.peopleState.splice(i,1)
                    io.emit('currentGameState', gameState)
                    return
                }
              }
           
            case 'Place':
             
              for (var i = 0; i < gameState.placesState.length; i++) {
                if(gameState.placesState[i].id == item.id){
                    gameState.placesState.splice(i,1)
                    io.emit('currentGameState', gameState)
                    return
                }
              }
              break;

              case 'Box':
              
              for (var i = 0; i < gameState.boxesState.length; i++) {
                if(gameState.boxesState[i].id == item.id){
                    gameState.boxesState.splice(i,1)
                    io.emit('currentGameState', gameState)
                    return
                }
              }
              break;
        
            default:
              
          }
    })

    socket.on('resetGame', (res) => {
       gameState = {}
        gameState.rodsState = rodSetup.setUpInitialRodState()
        gameState.placesState = []
        gameState.peopleState = []
        gameState.boxesState = []
       
        io.emit('currentGameState', gameState)

    })

})

newBox = function(item) {

    deselectAll()
    
    let myBox = {
        name: item,
        width: 2,
        height:2,
        angle: 0,
        typeOfObj: "Box",
    }
    gameState.boxesState.push(myBox)

    left = 20
    top = 15
    number = 0
    for (var i = 0; i < boxesState.length; i++) {
        

        if (!gameState.boxesState[i].moved) {
            gameState.boxesState[i].left = left
            gameState.boxesState[i].oldLeft = left
            gameState.boxesState[i].top = top
            gameState.boxesState[i].oldTop = top
            
        }
        gameState.boxesState[i].id = "Box" + number
        number += 1
    }
   
}

newPerson = function(item) {

    deselectAll()
   

    let myPerson = {
        name: item.name,
        gender: item.type,
        radius: 2,
        angle: 0,
        typeOfObj: "Person",
    }
    gameState.peopleState.push(myPerson)

    left = 37
    top = 1
    number = 0
    for (var i = 0; i < gameState.peopleState.length; i++) {
     
        if (!gameState.peopleState[i].moved) {
            gameState.peopleState[i].left = left
            gameState.peopleState[i].oldLeft = left
            gameState.peopleState[i].top = top
            gameState.peopleState[i].oldTop = top
            
        }
        gameState.peopleState[i].id = "Person" + number
        number += 1
    }
   
}

newPlace = function(placeName) {
    deselectAll()
    

    let myPlace = {
        name: placeName,
        radius: 2,
        angle: 0,
        typeOfObj: "Place",
    }
    gameState.placesState.push(myPlace)

    left = 37
    top = 24
    number = 0
    for (var i = 0; i < placesState.length; i++) {
       
        if (!gameState.placesState[i].moved) {
            gameState.placesState[i].left = left
            gameState.placesState[i].oldLeft = left
            gameState.placesState[i].top = top
            gameState.placesState[i].oldTop = top
            
        }
        gameState.placesState[i].id = "Place" + number
        number += 1
    }
    
}


deselectAll =  function() {
   
    for (var x = 0; x < gameState.rodsState.length; x++) {
        gameState.rodsState[x].selected = false

        // ??WARNING DO YOU NEED TO SORT OUT OLD POS SEE BELW
    }
    for (var y = 0; y < gameState.placesState.length; y++) {
        gameState.placesState[y].selected = false
        // gameState.placesState[x].oldLeft = gameState.placesState[x].left
        // gameState.placesState[x].oldTop = gameState.placesState[x].top
    }
    for (var z = 0; z < gameState.peopleState.length; z++) {
        gameState.peopleState[z].selected = false
        // gameState.peopleState[x].oldLeft = gameState.peopleState[x].left
        // gameState.peopleState[x].oldTop = gameState.peopleState[x].top
    }
    for (var w = 0; w < gameState.boxesState.length; w++) {
        gameState.boxesState[w].selected = false
        // gameState.boxesState[x].oldLeft = gameState.boxesState[x].left
        // gameState.boxesState[x].oldTop = gameState.boxesState[x].top
    }

}