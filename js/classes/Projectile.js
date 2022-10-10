class Projectile extends Sprite {
    constructor({
        position ={
            x:0,
            y:0
        },
        enemy,
    }){
        super({
            position,
            imgSrc: './img/projectile.png'
        })
        //this.position = position
        this.velocity = {
            x:0,
            y:0
        }
        this.enemy = enemy
        this.radius = 10
    }
    draw(){
        super.draw()
        /* c.drawImage(
            this.image, 
            this.position.x,
            this.position.y) */

        c.beginPath()
        c.arc(this.position.x,this.position.y, this.radius, 0, Math.PI*2)
        c.fillStyle = 'rgba(255, 255, 255, 0.5)'
        c.fill()
    }
    update(){
        this.draw()
        const angle = Math.atan2(
            this.enemy.center.y - this.position.y,
            this.enemy.center.x - this.position.x,
            )
            const powerProjectileSpeed = 10
            this.velocity.x = Math.cos(angle) * powerProjectileSpeed
            this.velocity.y = Math.sin(angle) * powerProjectileSpeed

            this.position.x += this.velocity.x
            this.position.y += this.velocity.y
    }
}
////
