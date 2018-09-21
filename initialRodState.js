module.exports = {


    setUpInitialRodState: function () {
        let recipe = [
            //white
            {
                colour: 'white',
                length: 1,
                angle: 0
            },

            //red
            {
                colour: 'red',
                length: 2,
                angle: 0
            },

            //green
            {
                colour: '#00b300',
                length: 3,
                angle: 0
            },

            //purple
            {
                colour: 'purple',
                length: 4,
                angle: 0
            },

            //yellow
            {
                colour: 'yellow',
                length: 5,
                angle: 0
            },

            //darkgreen
            {
                colour: '#004d00',
                length: 6,
                angle: 0
            },


            //black
            {
                colour: 'black',
                length: 7,
                angle: 0
            },
            //brown
            {
                colour: '#994d00',
                length: 8,
                angle: 0
            },
            //blue
            {
                colour: 'blue',
                length: 9,
                angle: 0
            },

            {
                colour: 'orange',
                length: 10,
                angle: 0
            },

        ]
        let rods = this.duplicateTheRods(recipe)
        
        // this.positionTheRods(rods)
        return rods
    },

    duplicateTheRods(recipe) {
        let rods = []
        var rodIdNumber = 0
        let left = 2
        let top = 28.75
        for (var i = 0; i < recipe.length; i++) {
            if (left + recipe[i].length + 1.5 > 30) {
                left = 1.5 +recipe[i].length/2
                top += 1.5
            }
            //make 10 of each
            for (var j = 0; j < 10; j++) {
                let myRod = {
                    colour: recipe[i].colour,
                    length: recipe[i].length,
                    angle: recipe[i].angle,
                    id: "Rod" + rodIdNumber,
                    typeOfObj: "Rod",
                    top: top,
                    oldTop: top,
                    left: left, 
                    oldLeft: left,
                    startTop: top,
                    startLeft: left,
                    onTop: false
                }


                rods.push(myRod)

                rodIdNumber += 1
            }
            left += recipe[i].length + 1
        }
        rods.reverse(0)
       
        return rods
    },

    // nameTheRods: function (rods) {
    //     for (var i = 0; i < rods.length; i++) {
    //         rods[i].id = "Rod" + i
    //         rods[i].typeOfObj = "Rod"
    //     }
    //     return rods
    // },

    // positionTheRods: function (rods) {
    //     let left = 1;
    //     let top = 1;
    //     for (var i = 0; i < rods.length; i++) {
    //         if (left + rods[i].length + 0.5 > 40) {
    //             left = 1
    //             top += 1.5
    //         }
    //         rods[i].left = left
    //         rods[i].top = top
    //         left += rods[i].length + 0.5
    //     }
    // }

}

