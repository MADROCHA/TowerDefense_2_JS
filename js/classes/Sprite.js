class Sprite{
    constructor({ 
        position={ x:0,y:0 }, 
        imgSrc,
        frames={ 
            max: 1,
        },
        offset ={
            x:0,
            y:0,
        }
    }){
        this.offset = offset
        this.position = position
        this.image = new Image()
        this.image.src = imgSrc
        this.frames= {
            max: frames.max,
            current:0,
            elapsed:0,
            hold:4,
            
        }
    }
    draw(){
        const cropSpriteWidth = this.image.width / this.frames.max
        const cropSprite = {
            position:{
                x:cropSpriteWidth *this.frames.current,
                y:0
            },
            width:cropSpriteWidth,
            height:this.image.height,
        }
        c.drawImage(
            this.image, 
            cropSprite.position.x,
            cropSprite.position.y,
            cropSprite.width,
            cropSprite.height,
            this.position.x + this.offset.x,
            this.position.y + this.offset.y,
            cropSprite.width,
            cropSprite.height,
            
            )

        }
        update(){
        //animation sprite
        this.frames.elapsed++
        if(this.frames.elapsed % this.frames.hold === 0){
            this.frames.current++
            if(this.frames.current >= this.frames.max){
                this.frames.current = 0
            }
        }

    }
}