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
    constructor(value){
        this.value = value
    }
}
// floating messages//

const enemies = []
    function spawnEnemies(
        spawnCount,
    ){
        for (let i = 1; i < spawnCount +1; i++){
            const xEnemyOffset = i * 250
            enemies.push(new Enemy({
                position:{x:waypoints[0].x -xEnemyOffset,y:waypoints[0].y}
            })
        )
    }
}
//const enemy1 = new Enemy({position:{x:waypoints[0].x,y:waypoints[0].y}})
//const enemy2 = new Enemy({position:{x:waypoints[0].x -enemiesGap,y:waypoints[0].y}})
const buildings = []
let activeTile = undefined
let enemyCount = 10
let hearts = 10
let coins = 100
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
            hearts-=1
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
        enemyCount += 2
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
                projectile.enemy.health -=20
                if(projectile.enemy.health <= 0){
                    const enemyIndex = enemies.findIndex((enemy)=>{
                        return projectile.enemy === enemy
                    })

                    if(enemyIndex > -1){
                        coins += 20
                        document.querySelector('#coinsNum').innerHTML = coins
                        enemies.splice(enemyIndex,1)
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
        && coins - 50 >= 0
        ){
        coins -=50
        document.querySelector('#coinsNum').innerHTML = coins
        buildings.push(new Building({
            position:{
                x:activeTile.position.x,
                y:activeTile.position.y
            }
        }))
        activeTile.isOccupied = true
        buildings.sort((a,b) =>{
            return a.position.y - b.position.y
        })
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


