// 7. 実装向け定数定義（マジックナンバーの排除）

export const CONSTANTS = {
    // プレイヤーの速度設定
    MOVE_SPEED_NORMAL: 3.0,     // 通常移動速度
    MOVE_SPEED_DASH: 6.0,       // 走行移動速度
    MOVE_SPEED_SLOW: 1.5,       // 低速移動速度（横移動や後退など）

    // プレイヤーの音範囲（聴覚センサー用トリガー半径）
    FOOTSTEP_RADIUS_WALK: 0.0,  // 歩行時は無音または非常に狭い
    FOOTSTEP_RADIUS_DASH: 15.0, // 走行時の足音範囲（敵Aが感知する範囲）

    // 敵A（だるまさんがころんだ・音感知）
    ENEMY_A_SPEED: 7.5,         // プレイヤーの走行速度より高速
    ENEMY_A_PATROL_SPEED: 1.0,  // 徘徊時の極めて遅い速度
    ENEMY_A_HEARING_RANGE: 15.0,// 聴覚センサーの基本感知範囲（足音範囲と交差で検知）
    ENEMY_A_VISION_RANGE: 30.0, // 視覚センサーの距離
    ENEMY_A_VISION_FOV: Math.PI / 2, // 視界の角度 (真横まで見える 90度)

    // 敵B（ランダム巡回・ゴール強襲）
    ENEMY_B_SPEED: 4.5,         // プレイヤーの通常速度より速く、走行速度より遅い
    ENEMY_B_PATROL_SPEED: 1.0,  // 徘徊時の極めて遅い速度
    ENEMY_B_VISION_RANGE: 25.0, // 視覚センサーの距離
    ENEMY_B_VISION_FOV: Math.PI / 2, // 視界の角度 (真横まで見える 90度)

    // AI共通
    AI_FIND_LOOK_TIME: 3000,    // (ms) 索敵時に周囲を見渡す時間
    AI_LOST_LOOK_TIME: 5000,    // (ms) 見失った後、最後に検知した場所で留まる時間
    AI_CHASE_PATIENCE_TIME: 5000, // (ms) 視界から消えた後もプレイヤーの位置を推測して追跡を続ける猶予時間

    // マップ設定
    MAP_BLOCKS_X: 4,            // 全体マップのX方向ブロック数
    MAP_BLOCKS_Y: 4,            // 全体マップのY方向ブロック数
    BLOCK_SIZE: 15,             // 1ブロックあたりのグリッドサイズ（15x15）
    GRID_SCALE: 2.0,            // 1グリッドの3D空間での実寸サイズ

    // プレイヤー・カメラ設定
    PLAYER_HEIGHT: 1.5,         // カメラの高さ
    PLAYER_RADIUS: 0.5,         // プレイヤーの当たり判定半径

    // 鍵の種類（色で代用）
    KEY_TYPES: [
        { id: 'red', color: 0xff0000 },
        { id: 'blue', color: 0x0000ff },
        { id: 'green', color: 0x00ff00 },
        { id: 'yellow', color: 0xffff00 }
    ]
};
