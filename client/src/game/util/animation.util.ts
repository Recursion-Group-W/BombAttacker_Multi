import { Scene } from 'phaser';

export class AnimationUtil {
  static createPlayerAnim(scene: Scene) {
    scene.anims.create({
      key: 'player-right',
      frameRate: 10,
      repeat: 0,
      frames: scene.anims.generateFrameNumbers('player', {
        start: 5,
        end: 7,
      }),
    });
    scene.anims.create({
      key: 'player-turn-right',
      frameRate: 10,
      repeat: 0,
      frames: [{ key: 'player', frame: 4 }],
    });
    scene.anims.create({
      key: 'player-down',
      frameRate: 10,
      repeat: 0,
      frames: scene.anims.generateFrameNumbers('player', {
        start: 2,
        end: 3,
      }),
    });
    scene.anims.create({
      key: 'player-turn-down',
      frameRate: 10,
      repeat: 0,
      frames: [{ key: 'player', frame: 1 }],
    });
    scene.anims.create({
      key: 'player-up',
      frameRate: 10,
      repeat: 0,
      frames: scene.anims.generateFrameNumbers('player', {
        start: 8,
        end: 9,
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
        start: 5,
        end: 7,
      }),
    });
    scene.anims.create({
      key: 'npc-turn-right',
      frameRate: 10,
      repeat: 0,
      frames: [{ key: 'npc', frame: 4 }],
    });
    scene.anims.create({
      key: 'npc-down',
      frameRate: 10,
      repeat: -1,
      frames: scene.anims.generateFrameNumbers('npc', {
        start: 2,
        end: 3,
      }),
    });
    scene.anims.create({
      key: 'npc-turn-down',
      frameRate: 10,
      repeat: 0,
      frames: [{ key: 'npc', frame: 1 }],
    });
    scene.anims.create({
      key: 'npc-up',
      frameRate: 10,
      repeat: -1,
      frames: scene.anims.generateFrameNumbers('npc', {
        start: 8,
        end: 9,
      }),
    });
    scene.anims.create({
      key: 'npc-turn-up',
      frameRate: 10,
      repeat: 0,
      frames: [{ key: 'npc', frame: 0 }],
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
