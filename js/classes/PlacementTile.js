    class PlacementTile {
        constructor({
            position={
                x:0,
                y:0
            }
        }){
            this.position = position
            /* this.size = {
                width:64,
                height:64,
            } */
            this.size = 64
            this.color = 'rgba(255, 255, 255, 0.1)'
            this.onHoverColor = 'rgba(0, 0, 0, 0.3)'
            this.occupied = false

        }
        draw(){
            c.fillStyle = this.color
            c.fillRect(
                this.position.x,
                this.position.y,
                /* this.size.width,
                this.size.height */
                this.size,
                this.size
                )
        }
        update(){
            this.draw()
            if(
                mouse.x > this.position.x
                && mouse.x < this.position.x + this.size
                && mouse.y > this.position.y
                && mouse.y < this.position.y + this.size
                ){
                    //console.log('hello')
                    this.color = this.onHoverColor
            } else this.color = 'rgba(255, 255, 255, 0.1)'
        }
    }
////
    
