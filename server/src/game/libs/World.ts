// ワールドクラス
// ・ゲーム内の各種要素を保持する
// ・ゲームに保持される
// ・ゲームワールドの更新処理を有する（ゲームから要請を受け、保持する各種要素を更新する）
// ・ゲーム内の各種要素の生成、破棄を有する
// モジュール
const Tank = require( './Tank.js' );
const Wall = require( './Wall.js');

// 設定
const SharedSettings = require( '../public/js/SharedSettings.js' );
const GameSettings = require( './GameSettings.js' );

module.exports = class World
{
    // コンストラクタ
    constructor( io )
    {
        this.io = io;   // socketIO
        this.setTank = new Set();	// タンクリスト
        this.setWall = new Set();	// 壁リスト

        // 壁の生成
        for( let i = 0; i < GameSettings.WALL_COUNT; i++ )
        {
            // ランダム座標値の作成
            const fX_left = Math.random() * ( SharedSettings.FIELD_WIDTH - SharedSettings.WALL_WIDTH );
            const fY_bottom = Math.random() * ( SharedSettings.FIELD_HEIGHT - SharedSettings.WALL_HEIGHT );
            // 壁生成
            const wall = new Wall( fX_left + SharedSettings.WALL_WIDTH * 0.5,
                fY_bottom + SharedSettings.WALL_HEIGHT * 0.5 );
            // 壁リストへの登録
            this.setWall.add( wall );
        }
    }

    // 更新処理
    update( fDeltaTime )
    {
        // オブジェクトの座標値の更新
        this.updateObjects( fDeltaTime );

        // 衝突チェック
        this.checkCollisions();

        // 新たな行動（特に、ボットに関する生成や動作
        this.doNewActions( fDeltaTime );
    }

    // オブジェクトの座標値の更新
    updateObjects( fDeltaTime )
    {
        // タンクの可動域
        const rectTankField = {
            fLeft: 0 + SharedSettings.TANK_WIDTH * 0.5,
            fBottom: 0 + SharedSettings.TANK_HEIGHT * 0.5,
            fRight: SharedSettings.FIELD_WIDTH - SharedSettings.TANK_WIDTH * 0.5,
            fTop: SharedSettings.FIELD_HEIGHT - SharedSettings.TANK_HEIGHT * 0.5
        };

        // タンクごとの処理
        this.setTank.forEach(
            ( tank ) =>
            {
                tank.update( fDeltaTime );
            } );
    }

    // タンクの生成
    createTank()
    {

        // タンクの可動域
        const rectTankField = {
            fLeft: 0 + SharedSettings.TANK_WIDTH * 0.5,
            fBottom: 0 + SharedSettings.TANK_HEIGHT * 0.5,
            fRight: SharedSettings.FIELD_WIDTH - SharedSettings.TANK_WIDTH * 0.5,
            fTop: SharedSettings.FIELD_HEIGHT - SharedSettings.TANK_HEIGHT * 0.5
        };
        
        // タンクの生成
        const tank = new Tank();
    
        // タンクリストへの登録
        this.setTank.add( tank );
    
        return tank;
    }
    
    // タンクの破棄
    destroyTank( tank )
    {
        // タンクリストリストからの削除
        this.setTank.delete( tank );
    }
    // 衝突のチェック
    checkCollisions()
    {
    }

    // 新たな行動
    doNewActions( fDeltaTime )
    {
    }
}


// コード解説

// ワールドクラスは、ゲームワールドを管理するクラスです。
// この章の実装としては、まだゲームワールドには何もないので、関数の定義はありますが、処理はありません。。
// ゲームワールドを更新します。（ update関数 ）
// 更新処理では、オブジェクトの座標値の更新（ updateObjects関数 ）、衝突チェック（ checkCollisions関数 ）、新たな行動（ doNewActions関数 ）を行います。