import { Scene } from 'phaser';
import { CustomSocket } from '../../socket/interface/customSocket.interface';

export default class Cursor {
  keyboard: Phaser.Types.Input.Keyboard.CursorKeys;

  none = true;
  prevNone = true;

  constructor(
    public scene: Scene,
    public socket: CustomSocket
  ) {
    this.keyboard = scene.input.keyboard.createCursorKeys();
  }

  update() {
    if (
      Phaser.Input.Keyboard.JustDown(this.keyboard.space)
    ) {
      this.socket.emit('putBomb');
    }

    if (
      !this.keyboard.left ||
      !this.keyboard.right ||
      !this.keyboard.up ||
      !this.keyboard.down
    )
      return;

    //キーが押されているかどうか
    this.none =
      this.keyboard.left.isDown ||
      this.keyboard.right.isDown ||
      this.keyboard.up.isDown ||
      this.keyboard.down.isDown
        ? false
        : true;

    //キーが現在押されている、
    //または、
    //離した（現在押されていなくて直前に押されていた）場合
    if (!this.none || this.none !== this.prevNone) {
      let arrowInput = {
        up: false,
        right: false,
        down: false,
        left: false,
      };

      if (this.keyboard.left.isDown) {
        arrowInput.left = true;
      } else if (this.keyboard.right.isDown) {
        arrowInput.right = true;
      } else if (this.keyboard.up.isDown) {
        arrowInput.up = true;
      } else if (this.keyboard.down.isDown) {
        arrowInput.down = true;
      }

      this.socket.emit('movePlayer', arrowInput);
    }

    this.prevNone = this.none;
  }
}
