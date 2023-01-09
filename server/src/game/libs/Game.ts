// モジュール
const World = require( './World.js' );

// 設定
const GameSettings = require( './GameSettings.js' );

// ゲームクラス
// ・ワールドを保持する
// ・通信処理を有する
// ・周期的処理を有する
module.exports = class Game
{
    // 始動
    start( io )
    {
        // 変数
        const world = new World( io ); // setInterval()内での参照があるので、スコープを抜けても、生存し続ける（ガーベッジコレクションされない）。
        let iTimeLast = Date.now(); // setInterval()内での参照があるので、スコープを抜けても、生存し続ける（ガーベッジコレクションされない）。

        // 接続時の処理
        //   サーバーとクライアントの接続が確立すると、
        // 　サーバーで、'connection'イベント
        // 　クライアントで、'connect'イベントが発生する
        io.on(
            'connection',
            ( socket ) =>
            {
                console.log( 'connection : socket.id = %s', socket.id );
                let tank = null;	// コネクションごとのタンクオブジェクト。イベントをまたいで使用される。

                // ゲーム開始時の処理の指定
                // ・クライアント側の接続確立時の「socket.emit( 'enter-the-game' );」に対する処理
                socket.on( 'enter-the-game',
                    () =>
                    {	// 自タンクの作成
                        console.log( 'enter-the-game : socket.id = %s', socket.id );
                        tank = world.createTank();
                    } );
                                // 移動コマンドの処理の指定
                // ・クライアント側のキー入力時の「socket.emit( 'change-my-movement', objMovement );」に対する処理
                socket.on( 'change-my-movement',
                    ( objMovement ) =>
                    {
                        //console.log( 'change-my-movement : socket.id = %s', socket.id );
                        if( !tank )
                        {
                            return;
                        }
                        tank.objMovement = objMovement;	// 動作
                    } );

                // 切断時の処理の指定
                // ・クライアントが切断したら、サーバー側では'disconnect'イベントが発生する
                socket.on( 'disconnect',
                    () =>
                    {
                        console.log( 'disconnect : socket.id = %s', socket.id );
                        if( !tank )
                        {
                            return;
                        }
                        world.destroyTank( tank );
                        tank = null;	// 自タンクの解放
                    } );
            } );

        // 周期的処理（1秒間にFRAMERATE回の場合、delayは、1000[ms]/FRAMERATE[回]）
        setInterval(
            () =>
            {
                // 経過時間の算出
                const iTimeCurrent = Date.now();    // ミリ秒単位で取得
                const fDeltaTime = ( iTimeCurrent - iTimeLast ) * 0.001;	// 秒に変換
                iTimeLast = iTimeCurrent;
                //console.log( 'DeltaTime = %f[s]', fDeltaTime );

                // 処理時間計測用
                const hrtime = process.hrtime();  // ナノ秒単位で取得

                // ゲームワールドの更新
                world.update( fDeltaTime );

                const hrtimeDiff = process.hrtime( hrtime );
                const iNanosecDiff = hrtimeDiff[0] * 1e9 + hrtimeDiff[1];

                // 最新状況をクライアントに送信
                io.emit( 'update',
                    Array.from( world.setTank ),  // Setオブジェクトは送受信不可（SetにJSON変換が未定義だから？）。配列にして送信する。
                    Array.from( world.setWall ),  // Setオブジェクトは送受信不可（SetにJSON変換が未定義だから？）。配列にして送信する。
                    iNanosecDiff );	// 送信
            },
            1000 / GameSettings.FRAMERATE );	// 単位は[ms]。1000[ms] / FRAMERATE[回]
    }
}

// コード解説
// ゲームクラスは、ゲーム全体を管理するクラスです。
// ワールドクラスのインスタンスを保持します。（ コンストラクタの const world = new World( io ); ）
// サーバー側の通信イベントを処理します。通信イベント処理とは、クライアントから送信されるデータを受信した時の処理です。「クライアントとサーバーの接続時の処理」「クライアントとサーバーの切断時の処理」「クライアントが操作しているものの状態変更のデータ受信時の処理」等です。この章の実装としては、まだ「クライアントが操作しているものの状態変更のデータ受信時の処理」の実装はありません。（ io.on( ・・・略・・・ ); ）
// 周期的処理をします。周期的処理では、ワールドの「更新処理」を呼び出し、更新処理後、「ワールドが保持するゲーム内に存在しているもの」の最新状況を、クライアントへ送信します。この章の実装としては、まだゲームワールドには何もないので、ゲームワールドの更新の処理時間のみをクライアントへ送信します。（ setInterva( ・・・略・・・ ); ）