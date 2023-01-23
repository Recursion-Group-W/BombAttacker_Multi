import { Scene } from 'phaser';

export class AnimationUtil {
  static createPlayerAnim(scene: Scene) {
    scene.anims.create({
      key: 'player-right',
      frameRate: 10,
      repeat: 0,
      frames: scene.anims.generateFrameNumbers('player', {
        start: 4,
        end: 6,
      }),
    });
    scene.anims.create({
      key: 'player-turn-right',
      frameRate: 10,
      repeat: 0,
      frames: [{ key: 'player', frame: 5 }],
    });
    scene.anims.create({
      key: 'player-down',
      frameRate: 10,
      repeat: 0,
      frames: scene.anims.generateFrameNumbers('player', {
        start: 1,
        end: 3,
      }),
    });
    scene.anims.create({
      key: 'player-turn-down',
      frameRate: 10,
      repeat: 0,
      frames: [{ key: 'player', frame: 2 }],
    });
    scene.anims.create({
      key: 'player-up',
      frameRate: 10,
      repeat: 0,
      frames: scene.anims.generateFrameNumbers('player', {
        start: 7,
        end: 8,
      }),
    });
    scene.anims.create({
      key: 'player-turn-up',
      frameRate: 10,
      repeat: 0,
      frames: [{ key: 'player', frame: 0 }],
    });
  }

  static setPlayerAnimation(
    sprite: Phaser.GameObjects.Sprite,
    animation: string,
    direction: number
  ) {
    if (!sprite.anims.isPlaying) sprite.play(animation);
    else if (sprite.anims.getName() !== animation) sprite.play(animation);
    //左に進むときは右方向の動きを反転させる
    sprite.setFlipX(direction === 3);
  }

  static setNpcAnimation(
    sprite: Phaser.GameObjects.Sprite,
    animation: string,
    direction: number
  ) {
    if (!sprite.anims.isPlaying) sprite.play(animation);
    else if (sprite.anims.getName() !== animation) sprite.play(animation);
    //左に進むときは右方向の動きを反転させる
    sprite.setFlipX(direction === 3);
  }
  static setBombAnimation(
    sprite: Phaser.GameObjects.Sprite,
    animation: string
  ) {
    if (!sprite.anims.isPlaying) sprite.play(animation);
    else if (sprite.anims.getName() !== animation) sprite.play(animation);
  }

  static setExplosionAnimation(
    sprite: Phaser.GameObjects.Sprite,
    animation: string
  ) {
    if (!sprite.anims.isPlaying) sprite.play(animation);
    else if (sprite.anims.getName() !== animation) sprite.play(animation);
  }

  static createNpcAnim(scene: Scene) {
    scene.anims.create({
      key: 'npc-right',
      frameRate: 10,
      repeat: -1,
      frames: scene.anims.generateFrameNumbers('npc', {
        start: 4,
        end: 6,
      }),
    });
    scene.anims.create({
      key: 'npc-turn-right',
      frameRate: 10,
      repeat: 0,
      frames: [{ key: 'npc', frame: 5 }],
    });
    scene.anims.create({
      key: 'npc-down',
      frameRate: 10,
      repeat: -1,
      frames: scene.anims.generateFrameNumbers('npc', {
        start: 1,
        end: 3,
      }),
    });
    scene.anims.create({
      key: 'npc-turn-down',
      frameRate: 10,
      repeat: 0,
      frames: [{ key: 'npc', frame: 2 }],
    });
    scene.anims.create({
      key: 'npc-up',
      frameRate: 10,
      repeat: -1,
      frames: scene.anims.generateFrameNumbers('npc', {
        start: 7,
        end: 8,
      }),
    });
    scene.anims.create({
      key: 'npc-turn-up',
      frameRate: 10,
      repeat: 0,
      frames: [{ key: 'npc', frame: 0 }],
    });
  }

  static createYellowEffect(scene: Scene) {
    scene.anims.create({
      key: 'yellowEffect-anim',
      frameRate: 10,
      repeat: -1,
      frames: scene.anims.generateFrameNumbers('yellowEffect', {
        start: 0,
        end: 2,
      }),
    });
  }
  static createOrangeEffect(scene: Scene) {
    scene.anims.create({
      key: 'orangeEffect-anim',
      frameRate: 10,
      repeat: -1,
      frames: scene.anims.generateFrameNumbers('orangeEffect', {
        start: 0,
        end: 2,
      }),
    });
  }
  static createBlueEffect(scene: Scene) {
    scene.anims.create({
      key: 'blueEffect-anim',
      frameRate: 10,
      repeat: -1,
      frames: scene.anims.generateFrameNumbers('blueEffect', {
        start: 0,
        end: 2,
      }),
    });
  }

  static createBombAnim(scene: Scene) {
    scene.anims.create({
      key: 'bomb-anim',
      frameRate: 10,
      repeat: 2,
      frames: scene.anims.generateFrameNumbers('bomb', {
        start: 0,
        end: 7,
      }),
    });
  }

  static createExplosionAnim(scene: Scene) {
    scene.anims.create({
      key: 'explosion-anim',
      frameRate: 10,
      repeat: 0,
      frames: scene.anims.generateFrameNumbers('explosion', {
        start: 0,
        end: 9,
      }),
    });
  }
}
