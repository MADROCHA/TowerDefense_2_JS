class Building extends Sprite {
    constructor({position = {x:0, y:0}, }){
        super({
            position,
            imgSrc: './img/tower.png',
            frames:{
                max:19
                //current:6
            },
            offset:{
                x:0,
                y:-80
            }
        })
        //this.position = position
        this.width = 64 * 2
        this.height = 64 
        this.center = {
            x: this.position.x +this.width * 0.5,
            y: this.position.y + this.height * 0.5
        }
        this.projectiles = [
            /* new Projectile({
                position:{
                    x: this.center.x,
                    y: this.center.y,
                },
                enemy: enemies[0]
            }) */
        ]
        this.projectileRangeRadius = 250
        this.target 
        //
        this.buildCost = 50
    }
    draw(){
    super.draw()
    if(debugDev){

        // tower box
        c.strokeStyle='blue'
        c.strokeRect(this.position.x,this.position.y,this.width,this.height)
        // projectileRadiusRangeAttack.arc
        c.beginPath()
        c.arc(
            this.center.x,
            this.center.y,
            this.projectileRangeRadius,
            0,
            Math.PI * 2
            )
        //c.fillStyle='rgba(0,0,255,0.2)'
        //c.fill()
        c.strokeStyle='rgba(0,0,255,1)'
        c.stroke()
    }
    if(
        mouse.x > this.position.x
        && mouse.x < this.position.x + this.width
        && mouse.y > this.position.y
        && mouse.y < this.position.y + this.height
        ){

            c.beginPath()
            c.arc(
                this.center.x,
                this.center.y,
                this.projectileRangeRadius,
                0,
                Math.PI * 2
                )
                c.fillStyle='rgba(0,0,255,0.099)'
                c.fill()
            }
        
    }
    update(){
        this.draw()
        if(this.target
            || !this.target && this.frames.current !== 0
            ){

            super.update()
        
        }
        if(this.target 
            &&  this.frames.current === 6
            &&  this.frames.elapsed % this.frames.hold === 0){
            this.shoot()
        }
            
        }
        shoot(){
            
            this.projectiles.push(
                new Projectile({
                    position:{
                        x: this.center.x -20,
                        y: this.center.y -120,
                    },
                    enemy: this.target
                }) 
            )
            
        
        
    }
}
