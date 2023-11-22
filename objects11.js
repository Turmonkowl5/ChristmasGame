let spriteObject = {
    sourceX: 0,
    sourceY: 0,
    sourceWidth: 64,
    sourceHeight: 64,
    width: 64,
    height: 64,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    visible: true,
    aRot: 0,
    rf: true,
    rotation: 0,
    // Physics Properties
    speedLimit: 3,
    gravity: 0.7,
    // Platform game properties
    isOnGround: undefined,
    jumpForce: -14,
    // Getters
    centerX: function(){
        return this.x + this.width / 2;
    },
    centerY: function(){
        return this.y + this.height / 2;
    },
    halfWidth: function(){
        return this.width / 2;
    },
    halfHeight: function(){
        return this.height / 2;
    }
};
