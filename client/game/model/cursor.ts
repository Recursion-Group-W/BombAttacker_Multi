export class Cursor {
  // none = true
  // prevNone = true

  //   left = false;
  //   right = false;
  //   up = false;
  //   down = false;
  //   objMovement: { [key: string]: boolean } = {
  //     forward: false,
  //     back: false,
  //     right: false,
  //     left: false,
  //   };

  constructor(public socket: any) {
    //   this.cursors = scene.input.keyboard.createCursorKeys()
    //   this.scene.events.on('update', this.update, this)
  }

  // function keyUpHandler(e) {
  //     if(e.key == "Right" || e.key == "ArrowRight") {
  //         rightPressed = false;
  //     }
  //     else if(e.key == "Left" || e.key == "ArrowLeft") {
  //         leftPressed = false;
  //     }
  // }

  //   cursorsDown() {
  //     return {
  //       left: this.left,
  //       right: this.right,
  //       up: this.up,
  //       none: this.none,
  //     };
  //   }

  //   update() {
  //     if (
  //       !this.cursors.left ||
  //       !this.cursors.right ||
  //       !this.cursors.up
  //     )
  //       return;

  //     this.none =
  //       this.cursors.left.isDown ||
  //       this.cursors.right.isDown ||
  //       this.cursors.up.isDown
  //         ? false
  //         : true;

  //     if (!this.none || this.none !== this.prevNone) {
  //       this.left = false;
  //       this.right = false;
  //       this.up = false;

  //       if (this.cursors.left.isDown) {
  //         this.left = true;
  //       } else if (this.cursors.right.isDown) {
  //         this.right = true;
  //       }

  //       if (this.cursors.up.isDown) {
  //         this.up = true;
  //       }

  //       if (!PHYSICS_DEBUG) {
  //         let total = 0;
  //         if (this.left) total += 1;
  //         if (this.right) total += 2;
  //         if (this.up) total += 4;
  //         if (this.none) total += 8;
  //         this.socket.emit(
  //           'U' /* short for updateDude */,
  //           total
  //         );
  //       }
  //     }

  //     this.prevNone = this.none;
  //   }
}
