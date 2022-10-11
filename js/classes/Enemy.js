//c.fillRect(200,400,100,100)
class Enemy extends Sprite {
    constructor({
        position={
            x: 0,
            y: 0
        },
        speed = 1
    }){
        super({
            position,
            imgSrc: './img/orc.png',
            frames:{
                max: 7
            }
        })
        this.position = position
        this.width = 100
        this.height = 100
        this.waypointIndex = 0
        this.center = {
            x:this.position.x + this.width * 0.5,
            y:this.position.y + this.height * 0.5
        }
        this.radius = 50
        //
        this.healthEnemyOffset = 15
        //
        this.health = 100
        this.velocity={
            x:0,
            y:0
        }
        this.speed = speed
    }
    draw(){
        super.draw()
        //c.fillRect(this.position.x,this.position.y,this.width,this.height)
        if(debugDev){
            c.beginPath()
            c.arc(this.center.x,this.center.y, this.radius, 0, Math.PI*2)
            c.strokeStyle = 'purple'
            c.stroke()
        }

        // healthBar
        c.fillStyle = 'red'
        c.fillRect(
        this.position.x,
        this.position.y - this.healthEnemyOffset,
        this.width,
        10
        )    
        //   
        c.fillStyle = 'green'
        c.fillRect(
        this.position.x,
        this.position.y - this.healthEnemyOffset,
        this.width * this.health / 100,
        10
        )       

    }
    update(){
        this.draw()
        super.update()
        
        const waypoint = waypoints[this.waypointIndex]
        const yDistance = waypoint.y - this.center.y 
        const xDistance = waypoint.x - this.center.x 
        const angle = Math.atan2(yDistance, xDistance)
        const speed = 2
        this.velocity.x = Math.cos(angle) * this.speed
        this.velocity.y = Math.sin(angle) * this.speed
        
        this.position.x += this.velocity.x 
        this.position.y += this.velocity.y 
        //update center//
        this.center = {
            x:this.position.x + this.width * 0.5,
            y:this.position.y + this.height * 0.5
        }
        //update center//

        //console.log('position x- ' + this.position.x)
        //console.log('position y- ' + this.position.y)
        if(
            Math.abs(Math.round(this.center.x) - Math.round(waypoint.x)) 
            < Math.abs(this.velocity.x) 
            && Math.abs(Math.round(this.center.y) - Math.round(waypoint.y))
            < Math.abs(this.velocity.y)
            && this.waypointIndex < waypoints.length -1
            ){
            this.waypointIndex++
        }
    }
}
//