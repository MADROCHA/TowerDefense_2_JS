const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1280
canvas.height = 768

c.fillStyle = 'white'
c.fillRect(0,0, canvas.width,canvas.height)
let debugDev = false
//parse data placement.js
const placementTilesData2D = []
for(let i = 0; i< placementTilesData.length; i+=20){
    placementTilesData2D.push(placementTilesData.slice(i,i + 20))
}


//parse data placement.js

const placementTiles = []
placementTilesData2D.forEach((row, y) =>{
    row.forEach((symbol, x) =>{
        if(symbol === 14){
            //able to place 
            placementTiles.push(
                new PlacementTile({
                position: {
                    x:x * 64,
                    y:y * 64
                }
            })
        )}
    })
})
//console.log(placementTiles)
const mapImage = new Image()
mapImage.onload= () =>{
    animate()
}
mapImage.src = './img/gameMap.png'



/* const enemies = []
for (let i = 1; i < 10; i++){
    const xEnemyOffset = i * 250
    enemies.push(new Enemy({
        position:{x:waypoints[0].x -xEnemyOffset,y:waypoints[0].y}
    }))
} */
// floating messages//
const floatingMessages = []
class floatingMessage{
    constructor(value, x,y,size,color,velocity){
        this.value = value
        this.x = x
        this.y = y
        this.size = size
        this.lifeSpan = 0
        this.color = color
        this.opacity = 1
        this.velocity = velocity


    }
    draw(){
        c.globalAlpha = this.opacity
        c.fillStyle = this.color
        c.font = this.size +'px Changa One' 
        c.fillText(
            this.value,
            this.x,
            this.y,
        )
        c.globalAlpha = 1
    }
    update(){
        //this.y -= 0.3
        this.y += this.velocity
        this.lifeSpan += 1
        if(this.opacity > 0.01) this.opacity -= 0.01
    }
    
}
function handleFloatingMessages(){
    for(let i = 0; i < floatingMessages.length; i++){
        floatingMessages[i].update()
        floatingMessages[i].draw()
        if(floatingMessages[i].lifeSpan >= 50){
            floatingMessages.splice(i,1)
            i--
        }
    }
}
// floating messages//

const enemies = []
    function spawnEnemies(
        spawnCount,
    ){
        for (let i = 1; i < spawnCount +1; i++){
            // added
            let waveSpeedIncrease = spawnCount * 0.25
            //
            const xEnemyOffset = i * 250
            enemies.push(new Enemy({
                position:{x:waypoints[0].x -xEnemyOffset,y:waypoints[0].y},
                // added constructor _const speed
                speed: waveSpeedIncrease
                //
            })
            )
        }
    }
//const enemy1 = new Enemy({position:{x:waypoints[0].x,y:waypoints[0].y}})
//const enemy2 = new Enemy({position:{x:waypoints[0].x -enemiesGap,y:waypoints[0].y}})
const buildings = []
let activeTile = undefined
let hearts = 10
let playerCoins = 70
let buildCost = 55
let projectileDamage = 20
let enemyCount = 3
let enemyDrop = 7
let enemyHpDamage = 1
const explosions = []
spawnEnemies(enemyCount)
function animate(){
    const animationId = requestAnimationFrame(animate)
    
    c.drawImage(mapImage,0,0)
    for (let i = enemies.length -1; i >= 0; i-- ){
        const enemy = enemies[i]
        enemy.update()

        if(enemy.position.x > canvas.width){
            //console.log('heart-1')
            enemies.splice(i,1)
            hearts -= enemyHpDamage
            floatingMessages.push(new floatingMessage(
                '- ' + enemyHpDamage, 
                1200 , 
                70 , 
                35,
                '#E70000',
                0.3
            ))
            document.querySelector('#heartsNum').innerHTML = hearts

            
            //console.log(hearts)
            if(hearts ===0){
                cancelAnimationFrame(animationId)
                //console.log('hearts 0')
                document.querySelector('#gameOverText').style.display = 'flex'
            }
        }
    }


    for(let i = explosions.length -1; i >= 0; i--){
        const explosion = explosions[i]
        explosion.draw()
        explosion.update()
        if(explosion.frames.current >= explosion.frames.max -1){
            explosions.splice(i, 1)
        }
    }

    if ( enemies.length ===0){
        enemyCount += 3
        spawnEnemies(enemyCount)
    }
    /* enemies.forEach(enemy =>{
        enemy.update()
    }) */
    placementTiles.forEach(tile=>{
        tile.update(
            mouse
            )
    })
    buildings.forEach((building) =>{
        building.update()
        building.target = null
        const validEnemies = enemies.filter((enemy) =>{
            const xDifference = enemy.center.x - building.center.x
            const yDifference = enemy.center.y - building.center.y
            const distance = Math.hypot( xDifference,yDifference)
            return distance < enemy.radius + building.projectileRangeRadius
        })
        building.target = validEnemies[0]
        //console.log(validEnemies)
        //building.projectiles.forEach((projectile, i) =>{})
        for (let i = building.projectiles.length -1; i >= 0; i-- ){
            const projectile = building.projectiles[i]
        
            projectile.update()

            const xDifference = projectile.enemy.center.x - projectile.position.x
            const yDifference = projectile.enemy.center.y - projectile.position.y
            const distance = Math.hypot(
                xDifference,
                yDifference
            )
            // projectile hit enemy
            if(distance < projectile.enemy.radius + projectile.radius){
                // enemy health and projectile removal
                projectile.enemy.health -= projectileDamage
                if(projectile.enemy.health <= 0){
                    const enemyIndex = enemies.findIndex((enemy)=>{
                        return projectile.enemy === enemy
                    })

                    if(enemyIndex > -1){
                        playerCoins += enemyDrop
                        // coins earned from enemy
                        floatingMessages.push(new floatingMessage(
                            '+ ' + enemyDrop, 
                            enemies[i].center.x , 
                            enemies[i].center.y , 
                            25,
                            '#f3c70d',
                            -0.3
                        ))
                        // coins earned from enemy
                        floatingMessages.push(new floatingMessage(
                            '+ ' + enemyDrop, 
                            1100 , 
                            70 , 
                            25,
                            '#eeb501',
                            -0.3
                        ))
                        enemies.splice(enemyIndex,1)
                        document.querySelector('#coinsNum').innerHTML = playerCoins
                    }
                    // amount of enemies
                }

                building.projectiles.splice(i, 1)
                explosions.push(new Sprite({
                    position:{
                        x:projectile.position.x,
                        y:projectile.position.y
                    },
                    imgSrc: './img/explosion.png',
                    frames:{
                        max:4,
                    },
                    offset:{
                        x:0,
                        y:0
                    },
                }))
                //console.log(projectile.enemy.health)
                //console.log(projectile.enemy.health)
            }
            //console.log(distance)
        }
    })
    //enemy1.update()
    //enemy2.update()
    handleFloatingMessages()
}

const mouse = {
    x:undefined,
    y:undefined
}

//
canvas.addEventListener('click', (e)=>{
    if(
        activeTile  
        && !activeTile.isOccupied
        && playerCoins -  buildCost >= 0
        ){
            //
            floatingMessages.push(new floatingMessage(
                '- ' + buildCost, 
                mouse.x, 
                mouse.y, 
                40,
                '#f3c70d',
                -0.3
            ))
            //
        playerCoins -= buildCost
        document.querySelector('#coinsNum').innerHTML = playerCoins
        buildings.push(new Building({
            position:{
                x:activeTile.position.x,
                y:activeTile.position.y
            },
            
        }))
        activeTile.isOccupied = true
        buildings.sort((a,b) =>{
            return a.position.y - b.position.y
        })
    } else if(activeTile  
        && !activeTile.isOccupied
        && playerCoins -  buildCost < 0) {
        floatingMessages.push(new floatingMessage(
            'Need More Coins', 
            mouse.x, 
            mouse.y, 
            35,
            '#e9ad03',
            0.07
            //'cyan'
        ))
    }
    //console.log(buildings)
})
//
window.addEventListener('mousemove', (e)=>{
    mouse.x = e.clientX
    mouse.y = e.clientY
    
    activeTile = null
    for(let i = 0; i < placementTiles.length; i++){
        const tile = placementTiles[i]
        if(
            mouse.x > tile.position.x
            && mouse.x < tile.position.x + tile.size
            && mouse.y > tile.position.y
            && mouse.y < tile.position.y + tile.size
            ){
                activeTile = tile
                break
            }
    }
    //console.log(activeTile)
})

/* const keys ={
    º:{
        pressed: false
    } 
}*/
window.addEventListener('keydown',(e)=>{
    switch (e.key){
        case'º':
        debugDev = !debugDev
        break
    }
})


