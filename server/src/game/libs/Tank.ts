// モジュール
const GameObject = require( './GameObject.js' );
const OverlapTester = require( './OverlapTester.js' );

// 設定
const SharedSettings = require( '../public/js/SharedSettings.js' );
const GameSettings = require( './GameSettings.js' );

// タンククラス
module.exports = class Tank extends GameObject
{
    // コンストラクタ
    constructor()
    {
        // 親クラスのコンストラクタ呼び出し
        super( SharedSettings.TANK_WIDTH, SharedSettings.TANK_HEIGHT, 0.0, 0.0, Math.random() * 2 * Math.PI );

        this.objMovement = {};	// 動作
        this.fSpeed = GameSettings.TANK_SPEED;    // 速度[m/s]。1frameあたり5進む => 1/30[s] で5進む => 1[s]で150進む。
        this.fRotationSpeed = GameSettings.TANK_ROTATION_SPEED;    // 回転速度[rad/s]。1frameあたり0.1進む => 1/30[s] で0.1進む => 1[s]で3[rad]進む。

        // 初期位置
        this.fX = Math.random() * ( SharedSettings.FIELD_WIDTH - SharedSettings.TANK_WIDTH );
        this.fY = Math.random() * ( SharedSettings.FIELD_HEIGHT - SharedSettings.TANK_HEIGHT );
    
        // 障害物にぶつからない初期位置の算出
        do
        {
            this.setPos( rectField.fLeft + Math.random() * ( rectField.fRight - rectField.fLeft ),
                rectField.fBottom + Math.random() * ( rectField.fTop - rectField.fBottom ) );
        } while( this.overlapWalls( setWall ) );
    }

    // 更新
    // ※rectField : フィールド矩形は、オブジェクト中心と判定する。（OverlapTester.pointInRect()）
    //               オブジェクトの大きさ分狭めた(上下左右で、大きさの半分づつ狭めた）矩形が必要。
    //               呼び出され側で領域を狭めのは、処理コストが無駄なので、呼び出す側で領域を狭めて渡す。
    update( fDeltaTime, rectField, setWall )
    {
        const fX_old = this.fX; // 移動前座標値のバックアップ
        const fY_old = this.fY; // 移動前座標値のバックアップ
        let bDrived = false;	// 前後方向の動きがあったか
        // 動作に従って、タンクの状態を更新
        if( this.objMovement['forward'] )
        {	// 前進
            const fDistance = this.fSpeed * fDeltaTime;
            //console.log( 'forward' );
            this.setPos( this.fX + fDistance * Math.cos( this.fAngle ),
                this.fY + fDistance * Math.sin( this.fAngle ) );
            bDrived = true;
        }
        if( this.objMovement['back'] )
        {	// 後進
            const fDistance = this.fSpeed * fDeltaTime;
            //console.log( 'back' );
            this.setPos( this.fX - fDistance * Math.cos( this.fAngle ),
                this.fY - fDistance * Math.sin( this.fAngle ) );
            bDrived = true;
        }
        if( bDrived )
        {	// 動きがある場合は、不可侵領域との衝突のチェック
            let bCollision = false;
            if( !OverlapTester.pointInRect( rectField, { fX: this.fX, fY: this.fY } ) )
            {	// フィールドの外に出た。
                bCollision = true;
            }
            else if( this.overlapWalls( setWall ) )
            {	// 壁に当たった。
                bCollision = true;
            }
            if( bCollision )
            {	// 衝突する場合は、移動できない。
                this.setPos( fX_old, fY_old );
                bDrived = false;	// 前後方向の動きはなし
            }
        }
    }
}
// コード解説

// タンククラスは、プレーヤーの操作で移動するタンクのクラスです。
// タンククラスは、ゲームオブジェクトクラスを継承します。（ extends GameObject ）
// どんな動作をしているかを保持します。（ this.objMovement = {}; ）
// 移動スピード、回転スピードを保持します。（ this.fSpeed = GameSettings.TANK_SPEED; this.fRotationSpeed = GameSettings.TANK_ROTATION_SPEED; ）
// 動作に従ってタンクの状態を更新します。（ update関数 ）