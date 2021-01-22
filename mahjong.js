/*
簡易仮想麻雀 -Virtual Riichi Mahjong- ver0.0.1
Copyright © nkgw-marronnier 2021
GitHub: https://github.com/nkgw-marronnier
*/

// 宣言
var mahjong_pai = []; //麻雀牌(山牌)
var mahjong_pai_len;
//var yama_pai = []; // 山牌
var wan_pai = []; // 王牌
var su_pai_manz = [1, 2, 3, 4, 5, 6, 7, 8, 9] // 数牌_萬子
var su_pai_pinz = [11, 12, 13, 14, 15, 16, 17, 18, 19]; // 数牌_筒子
var su_pai_souz = [21, 22, 23, 24, 25, 26, 27, 28, 29]; // 数牌_索子
var zi_pai_fon = [31, 32, 33, 34]; // 字牌_風牌(東、南、西、北)
var zi_pai_san = [41, 42, 43]; // 字牌_三元牌(白、發、中)
var jicha = []; // 自家の配牌
var shimocha = []; // 下家の配牌
var toimen = []; // 対面の配牌
var kamicha = []; // 上家の配牌
var jicha_tsumo; // 自家の自摸
var shimocha_tsumo; // 下家の自摸
var toimen_tsumo; // 対面の自摸
var kamicha_tsumo; // 上家の自摸
var jicha_kawa = []; // 自家の河
var shimocha_kawa = []; // 下家の河
var toimen_kawa = []; // 対面の河
var kamicha_kawa = []; // 上家の河
/*
今後実装予定
var jicha_naki = [];
var shimocha_naki = [];
var toimen_naki = [];
var kamicha_naki = [];
*/
var pai_resource = []; // 麻雀牌画像配列
var pai_haikei = []; // 麻雀牌の背画像配列
var pai_back = Math.floor(Math.random() * 5); // 麻雀牌の背画像決定
var ctx1; // 自家の描画領域
var ctx2; // 下家の描画領域
var ctx3; // 対面の描画領域
var ctx4; // 上家の描画領域
var pai_height = 50; // 麻雀牌画像の縦長
var pai_width = 35; // 麻雀牌画像の横長
var pai_height_kawa = 40; // 麻雀牌(河)画像の縦長
var pai_width_kawa = 30; // 麻雀牌(河)画像の横長
var pai_height_dora = 30; // 麻雀牌(ドラ)画像の縦長
var pai_width_dora = 20; // 麻雀牌(ドラ)画像の横長
var turn_flag = false; // 先自摸防止フラグ
var ba = 0; // 東局、南局判定
var honba = 0; // 本場判定
var bakaze_random = Math.floor(Math.random() * 4); // 自風を無作為に決定
var jicha_tokuten = 25000;
var shimocha_tokuten = 25000;
var toimen_tokuten = 25000;
var kamicha_tokuten = 25000;
var honba_tensu = 0; // 連荘による親の100点棒計算用

function MahjongPai() {
  // 136枚を格納
  for (var i = 0; i < 4; i++) {
    mahjong_pai = mahjong_pai.concat(su_pai_manz);
    mahjong_pai = mahjong_pai.concat(su_pai_pinz);
    mahjong_pai = mahjong_pai.concat(su_pai_souz);
    mahjong_pai = mahjong_pai.concat(zi_pai_fon);
    mahjong_pai = mahjong_pai.concat(zi_pai_san);
  }
  // デバッグ用
  //console.log(mahjong_pai);

  // 麻雀牌配列の長さ取得
  mahjong_pai_len = mahjong_pai.length;
  // 洗牌(無作為に並べ替え)(偏り平坦化試行回数:100000)
  for (var j = 0; j < 100000; j++) {
    for (var i = mahjong_pai_len - 1; i > 0; i--) {
      var k = Math.floor(Math.random() * (i + 1));
      var tmp = mahjong_pai[i];
      mahjong_pai[i] = mahjong_pai[k];
      mahjong_pai[k] = tmp;
    }
  }
  // デバッグ用
  //console.log(mahjong_pai);
  HaiPai();
}

// 配牌処理
function HaiPai() {
  // 配牌
  jicha = mahjong_pai.slice(0, 13);
  shimocha = mahjong_pai.slice(13, 26);
  toimen = mahjong_pai.slice(26, 39);
  kamicha = mahjong_pai.slice(39, 52);
  wanpai = mahjong_pai.slice(122, 136);
  // ドラ表示牌めくり
  dora = wanpai.slice(5, 6);

  // 王牌の該当牌を山牌から削除
  mahjong_pai.splice(122, 136);
  // 配牌した当該牌を山牌から削除
  mahjong_pai.splice(0, 52);

  // 手配の理牌(配列並び替え)
  jicha.sort(function (a, b) {
    return (a < b ? -1 : 1);
  });
  shimocha.sort(function (a, b) {
    return (a < b ? -1 : 1);
  });
  toimen.sort(function (a, b) {
    return (a < b ? -1 : 1);
  });
  kamicha.sort(function (a, b) {
    return (a < b ? -1 : 1);
  });
  // デバッグ用
  console.log(jicha);
  console.log(shimocha);
  console.log(toimen);
  console.log(kamicha);
  console.log(wanpai);
  console.log(dora);

  MahjongPaiImage();
}

// 麻雀牌絵柄取得
function MahjongPaiImage() {
  //麻雀牌絵柄取得
  for (var i = 1; i <= 9; i++) {
    var pai_name = "img/" + i + "m.png";
    pai_resource[i - 1] = loadImage(pai_name);
  }
  for (var i = 1; i <= 9; i++) {
    var pai_name = "img/" + i + "p.png";
    pai_resource[i + 8] = loadImage(pai_name);
  }
  for (var i = 1; i <= 9; i++) {
    var pai_name = "img/" + i + "s.png";
    pai_resource[i + 17] = loadImage(pai_name);
  }
  var pai_name = "img/ton.png";
  pai_resource[27] = loadImage(pai_name);
  var pai_name = "img/nan.png";
  pai_resource[28] = loadImage(pai_name);
  var pai_name = "img/sha.png";
  pai_resource[29] = loadImage(pai_name);
  var pai_name = "img/pei.png";
  pai_resource[30] = loadImage(pai_name);
  var pai_name = "img/haku.png";
  pai_resource[31] = loadImage(pai_name);
  var pai_name = "img/hatsu.png";
  pai_resource[32] = loadImage(pai_name);
  var pai_name = "img/chun.png";
  pai_resource[33] = loadImage(pai_name);

  // デバッグ用
  //console.log(pai_resource);
}

// 麻雀牌画像読み込み
function loadImage(fname, onload) {
  var image = new Image();
  image.src = fname;
  image.onload = onload;
  return image;
}

// 麻雀牌描画処理
function drawPai() {
  for (var i = 0; i < jicha.length; i++) {
    var col = i % jicha.length;
    var y = pai_height + 540;
    var x = pai_width * col + 80;
    var a = jicha[i];
    if (a < 10) {
      ctx1.drawImage(pai_resource[a - 1], x, y, pai_width, pai_height);
    } else if (a < 20) {
      ctx1.drawImage(pai_resource[a - 2], x, y, pai_width, pai_height);
    } else if (a < 30) {
      ctx1.drawImage(pai_resource[a - 3], x, y, pai_width, pai_height);
    } else if (a < 40) {
      ctx1.drawImage(pai_resource[a - 4], x, y, pai_width, pai_height);
    } else if (a < 50) {
      ctx1.drawImage(pai_resource[a - 10], x, y, pai_width, pai_height);
    }
  }
  for (var i = 0; i < shimocha.length; i++) {
    var col = i % shimocha.length;
    var y = pai_height + 240;
    var x = pai_width * col + 30;
    var a = shimocha[i];
    if (a < 10) {
      ctx2.drawImage(pai_resource[a - 1], x, y, pai_width, pai_height);
    } else if (a < 20) {
      ctx2.drawImage(pai_resource[a - 2], x, y, pai_width, pai_height);
    } else if (a < 30) {
      ctx2.drawImage(pai_resource[a - 3], x, y, pai_width, pai_height);
    } else if (a < 40) {
      ctx2.drawImage(pai_resource[a - 4], x, y, pai_width, pai_height);
    } else if (a < 50) {
      ctx2.drawImage(pai_resource[a - 10], x, y, pai_width, pai_height);
    }
  }
  for (var i = 0; i < toimen.length; i++) {
    var col = i % toimen.length;
    var y = pai_height + 190;
    var x = pai_width * col + 30;
    var a = toimen[i];
    if (a < 10) {
      ctx3.drawImage(pai_resource[a - 1], x, y, pai_width, pai_height);
    } else if (a < 20) {
      ctx3.drawImage(pai_resource[a - 2], x, y, pai_width, pai_height);
    } else if (a < 30) {
      ctx3.drawImage(pai_resource[a - 3], x, y, pai_width, pai_height);
    } else if (a < 40) {
      ctx3.drawImage(pai_resource[a - 4], x, y, pai_width, pai_height);
    } else if (a < 50) {
      ctx3.drawImage(pai_resource[a - 10], x, y, pai_width, pai_height);
    }
  }
  for (var i = 0; i < kamicha.length; i++) {
    var col = i % kamicha.length;
    var y = pai_height + 190;
    var x = pai_width * col + 80;
    var a = kamicha[i];
    if (a < 10) {
      ctx4.drawImage(pai_resource[a - 1], x, y, pai_width, pai_height);
    } else if (a < 20) {
      ctx4.drawImage(pai_resource[a - 2], x, y, pai_width, pai_height);
    } else if (a < 30) {
      ctx4.drawImage(pai_resource[a - 3], x, y, pai_width, pai_height);
    } else if (a < 40) {
      ctx4.drawImage(pai_resource[a - 4], x, y, pai_width, pai_height);
    } else if (a < 50) {
      ctx4.drawImage(pai_resource[a - 10], x, y, pai_width, pai_height);
    }
  }
  //console.log(mahjong_pai);
}

// 麻雀牌背面描画処理
function drawPai_onload() {
  var m = pai_back;
  for (var i = 0; i < 13; i++) {
    var col = i % jicha.length;
    var y = pai_height;
    var x = pai_width * col;
    ctx1.drawImage(pai_haikei[m], x, y, pai_width, pai_height);
  }
  for (var i = 0; i < 13; i++) {
    var col = i % shimocha.length;
    var y = pai_height + 50;
    var x = pai_width * col;
    ctx1.drawImage(pai_haikei[m], x, y, pai_width, pai_height);
  }
  for (var i = 0; i < 13; i++) {
    var col = i % toimen.length;
    var y = pai_height + 100;
    var x = pai_width * col;
    ctx1.drawImage(pai_haikei[m], x, y, pai_width, pai_height);
  }
  for (var i = 0; i < 13; i++) {
    var col = i % kamicha.length;
    var y = pai_height + 150;
    var x = pai_width * col;
    ctx1.drawImage(pai_haikei[m], x, y, pai_width, pai_height);
  }
}

// 自家自摸処理
function jicha_tsumo_() {
  // 描画領域初期化
  ctx1.clearRect(0, 0, 650, 650);
  drawPai();
  jicha_kawa_();
  scoreboard();
  if (mahjong_pai.length == 0) {
    GameResult_ryukyoku();
    return;
  }
  jicha_tsumo = mahjong_pai.shift();
  var y = pai_height + 540;
  var x = pai_width * jicha.length + 90;
  var a = jicha_tsumo;
  if (a < 10) {
    ctx1.drawImage(pai_resource[a - 1], x, y, pai_width, pai_height);
  } else if (a < 20) {
    ctx1.drawImage(pai_resource[a - 2], x, y, pai_width, pai_height);
  } else if (a < 30) {
    ctx1.drawImage(pai_resource[a - 3], x, y, pai_width, pai_height);
  } else if (a < 40) {
    ctx1.drawImage(pai_resource[a - 4], x, y, pai_width, pai_height);
  } else if (a < 50) {
    ctx1.drawImage(pai_resource[a - 10], x, y, pai_width, pai_height);
  }
  // デバッグ用
  //console.log(jicha_tsumo);
  jicha_kawa_();
  // 先自摸防止用フラグ
  turn_flag = true;
}

// 下家自摸処理
function shimocha_tsumo_() {
  // 描画領域初期化
  ctx2.clearRect(0, 0, 650, 650);
  drawPai();
  shimocha_kawa_();
  scoreboard();
  if (mahjong_pai.length == 0) {
    GameResult_ryukyoku();
    return;
  }
  shimocha_tsumo = mahjong_pai.shift();
  var y = pai_height + 240;
  var x = pai_width * shimocha.length + 40;
  var a = shimocha_tsumo;
  if (a < 10) {
    ctx2.drawImage(pai_resource[a - 1], x, y, pai_width, pai_height);
  } else if (a < 20) {
    ctx2.drawImage(pai_resource[a - 2], x, y, pai_width, pai_height);
  } else if (a < 30) {
    ctx2.drawImage(pai_resource[a - 3], x, y, pai_width, pai_height);
  } else if (a < 40) {
    ctx2.drawImage(pai_resource[a - 4], x, y, pai_width, pai_height);
  } else if (a < 50) {
    ctx2.drawImage(pai_resource[a - 10], x, y, pai_width, pai_height);
  }
  // デバッグ用
  //console.log(shimocha_tsumo);
  setTimeout('shimocha_Play()', 400);
  setTimeout('toimen_tsumo_()', 1000);
}

// 対面自摸処理
function toimen_tsumo_() {
  // 描画領域初期化
  ctx3.clearRect(0, 0, 650, 650);
  drawPai();
  toimen_kawa_();
  scoreboard();
  if (mahjong_pai.length == 0) {
    GameResult_ryukyoku();
    return;
  }
  toimen_tsumo = mahjong_pai.shift();
  var y = pai_height + 190;
  var x = pai_width * toimen.length + 40;
  var a = toimen_tsumo;
  if (a < 10) {
    ctx3.drawImage(pai_resource[a - 1], x, y, pai_width, pai_height);
  } else if (a < 20) {
    ctx3.drawImage(pai_resource[a - 2], x, y, pai_width, pai_height);
  } else if (a < 30) {
    ctx3.drawImage(pai_resource[a - 3], x, y, pai_width, pai_height);
  } else if (a < 40) {
    ctx3.drawImage(pai_resource[a - 4], x, y, pai_width, pai_height);
  } else if (a < 50) {
    ctx3.drawImage(pai_resource[a - 10], x, y, pai_width, pai_height);
  }
  // デバッグ用
  //console.log(toimen_tsumo);
  setTimeout('toimen_Play()', 400);
  setTimeout('kamicha_tsumo_()', 1000);
}

// 上家自摸処理
function kamicha_tsumo_() {
  // 描画領域初期化
  ctx4.clearRect(0, 0, 650, 650);
  drawPai();
  kamicha_kawa_();
  scoreboard();
  if (mahjong_pai.length == 0) {
    GameResult_ryukyoku();
    return;
  }
  kamicha_tsumo = mahjong_pai.shift();
  var y = pai_height + 190;
  var x = pai_width * kamicha.length + 90;
  var a = kamicha_tsumo;
  if (a < 10) {
    ctx4.drawImage(pai_resource[a - 1], x, y, pai_width, pai_height);
  } else if (a < 20) {
    ctx4.drawImage(pai_resource[a - 2], x, y, pai_width, pai_height);
  } else if (a < 30) {
    ctx4.drawImage(pai_resource[a - 3], x, y, pai_width, pai_height);
  } else if (a < 40) {
    ctx4.drawImage(pai_resource[a - 4], x, y, pai_width, pai_height);
  } else if (a < 50) {
    ctx4.drawImage(pai_resource[a - 10], x, y, pai_width, pai_height);
  }
  // デバッグ用
  //console.log(kamicha_tsumo);
  setTimeout('kamicha_Play()', 400);
  setTimeout('tsumo()', 0);
}

// 下家が自摸牌から手を思考して牌を捨てる
function shimocha_Play() {
  var h = Math.floor(Math.random() * shimocha.length + 1);
  shimocha_kawa.push(shimocha[h - 1]);
  shimocha.splice(h - 1, 1);
  shimocha.push(shimocha_tsumo);
  // 理牌
  shimocha.sort(function (a, b) {
    return (a < b ? -1 : 1);
  });
  console.log("下家:" + shimocha + " 乱数:" + h);
  // 描画領域初期化
  ctx2.clearRect(0, 0, 650, 650);
  drawPai();
  shimocha_kawa_();
  scoreboard();
}

// 対面が自摸牌から手を思考して牌を捨てる
function toimen_Play() {
  var h = Math.floor(Math.random() * toimen.length + 1);
  toimen_kawa.push(toimen[h - 1]);
  toimen.splice(h - 1, 1);
  toimen.push(toimen_tsumo);
  // 理牌
  toimen.sort(function (a, b) {
    return (a < b ? -1 : 1);
  });
  console.log("対面:" + toimen + " 乱数:" + h);
  // 描画領域初期化
  ctx3.clearRect(0, 0, 650, 650);
  drawPai();
  toimen_kawa_();
  scoreboard();
}

// 上家が自摸牌から手を思考して牌を捨てる
function kamicha_Play() {
  var h = Math.floor(Math.random() * kamicha.length + 1);
  kamicha_kawa.push(kamicha[h - 1]);
  kamicha.splice(h - 1, 1);
  kamicha.push(kamicha_tsumo);
  // 理牌
  kamicha.sort(function (a, b) {
    return (a < b ? -1 : 1);
  });
  console.log("上家:" + kamicha + " 乱数:" + h);
  // 描画領域初期化
  ctx4.clearRect(0, 0, 650, 650);
  drawPai();
  kamicha_kawa_();
  scoreboard();
}

// 自摸関数呼び出し
function tsumo() {
  setTimeout('jicha_tsumo_()', 1000);
  // 描画領域初期化
  //ctx1.clearRect(0, 0, 650, 650);
  drawPai();
  scoreboard();
}

// 描画領域マウス判定(自家の捨て牌選択処理も兼ねる)
function canvasMDHandler(e) {
  var x = e.clientX;
  var y = e.clientY;
  var r = e.target.getBoundingClientRect();
  x -= r.left;
  y -= r.top;

  // デバッグ用
  //console.log("x: " + x);
  //console.log("y: " + y);

  // 自摸牌を自家の手牌に組み込んで余りを捨てる
  if (x > 100 && y > 610 && turn_flag == true) {
    if (x < 555 && y < 670) {
      for (var m = 0; m <= jicha.length; m++) {
        if (x < pai_width * m + 100) {
          jicha_kawa.push(jicha[m - 1]);
          jicha.splice(m - 1, 1);
          // デバッグ用
          //console.log("col: " + m);
          //console.log(jicha);
          //console.log(jicha_kawa);

          // 手牌に自摸牌を追加
          jicha.push(jicha_tsumo);
          // 再び理牌
          jicha.sort(function (a, b) {
            return (a < b ? -1 : 1);
          });
          // 描画領域初期化
          ctx1.clearRect(0, 0, 650, 650);
          // 自家の手牌再描画
          drawPai();
          setTimeout('shimocha_tsumo_()', 500);
          // 自家の河描画
          jicha_kawa_();
          scoreboard();
          // 先自摸防止用フラグ
          turn_flag = false;
          return;
        }
      }
    }
  }
  // 自摸切りの場合
  if (x > 565 && y > 605 && turn_flag == true) {
    if (x < 600 && y < 655) {
      jicha_kawa.push(jicha_tsumo);
      // デバッグ用
      //console.log(jicha);
      //console.log(jicha_kawa);
      // 描画領域初期化
      ctx1.clearRect(0, 0, 650, 650);
      // 自家の河描画
      jicha_kawa_();
      // 自家の手牌再描画
      drawPai();
      scoreboard();
      setTimeout('shimocha_tsumo_()', 500);
      // 先自摸防止用フラグ
      turn_flag = false;
      return;
    }
  }
}

// 自家の捨て牌(河)描画
function jicha_kawa_() {
  for (var i = 0; i < jicha_kawa.length; i++) {
    var row = Math.floor(i / 6);
    var col = i % 6;
    var y = pai_height_kawa * row + 410;
    var x = pai_width_kawa * col + 235;
    var a = jicha_kawa[i];
    if (a < 10) {
      ctx1.drawImage(pai_resource[a - 1], x, y, pai_width_kawa, pai_height_kawa);
    } else if (a < 20) {
      ctx1.drawImage(pai_resource[a - 2], x, y, pai_width_kawa, pai_height_kawa);
    } else if (a < 30) {
      ctx1.drawImage(pai_resource[a - 3], x, y, pai_width_kawa, pai_height_kawa);
    } else if (a < 40) {
      ctx1.drawImage(pai_resource[a - 4], x, y, pai_width_kawa, pai_height_kawa);
    } else if (a < 50) {
      ctx1.drawImage(pai_resource[a - 10], x, y, pai_width_kawa, pai_height_kawa);
    }
    // デバッグ用
    //console.log("pais_jicha:" + a);
  }
}

// 下家の捨て牌(河)描画
function shimocha_kawa_() {
  for (var i = 0; i < shimocha_kawa.length; i++) {
    var row = Math.floor(i / 6);
    var col = i % 6;
    var y = pai_height_kawa * row + 110;
    var x = pai_width_kawa * col + 190;
    var a = shimocha_kawa[i];
    if (a < 10) {
      ctx2.drawImage(pai_resource[a - 1], x, y, pai_width_kawa, pai_height_kawa);
    } else if (a < 20) {
      ctx2.drawImage(pai_resource[a - 2], x, y, pai_width_kawa, pai_height_kawa);
    } else if (a < 30) {
      ctx2.drawImage(pai_resource[a - 3], x, y, pai_width_kawa, pai_height_kawa);
    } else if (a < 40) {
      ctx2.drawImage(pai_resource[a - 4], x, y, pai_width_kawa, pai_height_kawa);
    } else if (a < 50) {
      ctx2.drawImage(pai_resource[a - 10], x, y, pai_width_kawa, pai_height_kawa);
    } else {
      ctx2.drawImage(pai_haikei[pai_back], x, y, pai_width_kawa, pai_height_kawa);
    }
    // デバッグ用
    console.log("下家河:" + shimocha_kawa);
  }
}

// 対面の捨て牌(河)描画
function toimen_kawa_() {
  for (var i = 0; i < toimen_kawa.length; i++) {
    var row = Math.floor(i / 6);
    var col = i % 6;
    var y = pai_height_kawa * row + 65;
    var x = pai_width_kawa * col + 190;
    var a = toimen_kawa[i];
    if (a < 10) {
      ctx3.drawImage(pai_resource[a - 1], x, y, pai_width_kawa, pai_height_kawa);
    } else if (a < 20) {
      ctx3.drawImage(pai_resource[a - 2], x, y, pai_width_kawa, pai_height_kawa);
    } else if (a < 30) {
      ctx3.drawImage(pai_resource[a - 3], x, y, pai_width_kawa, pai_height_kawa);
    } else if (a < 40) {
      ctx3.drawImage(pai_resource[a - 4], x, y, pai_width_kawa, pai_height_kawa);
    } else if (a < 50) {
      ctx3.drawImage(pai_resource[a - 10], x, y, pai_width_kawa, pai_height_kawa);
    } else {
      ctx3.drawImage(pai_haikei[pai_back], x, y, pai_width_kawa, pai_height_kawa);
    }
    // デバッグ用
    console.log("対面河:" + toimen_kawa);
  }
}

// 上家の捨て牌(河)描画
function kamicha_kawa_() {
  for (var i = 0; i < kamicha_kawa.length; i++) {
    var row = Math.floor(i / 6);
    var col = i % 6;
    var y = pai_height_kawa * row + 65;
    var x = pai_width_kawa * col + 235;
    var a = kamicha_kawa[i];
    if (a < 10) {
      ctx4.drawImage(pai_resource[a - 1], x, y, pai_width_kawa, pai_height_kawa);
    } else if (a < 20) {
      ctx4.drawImage(pai_resource[a - 2], x, y, pai_width_kawa, pai_height_kawa);
    } else if (a < 30) {
      ctx4.drawImage(pai_resource[a - 3], x, y, pai_width_kawa, pai_height_kawa);
    } else if (a < 40) {
      ctx4.drawImage(pai_resource[a - 4], x, y, pai_width_kawa, pai_height_kawa);
    } else if (a < 50) {
      ctx4.drawImage(pai_resource[a - 10], x, y, pai_width_kawa, pai_height_kawa);
    } else {
      ctx4.drawImage(pai_haikei[pai_back], x, y, pai_width_kawa, pai_height_kawa);
    }
    // デバッグ用
    console.log("上家河:" + kamicha_kawa);
  }
}

// 得点表示板
function scoreboard() {
  ctx0.fillStyle = "black";
  ctx0.fillRect(235, 235, 175, 175);
  ctx0.font = "30px serif";
  ctx0.fillStyle = "white";
  if (ba == 0) {
    ctx0.fillText("東一局", 278, 338);
  } else if (ba == 1) {
    ctx0.fillText("東二局", 278, 338);
  } else if (ba == 1) {
    ctx0.fillText("東三局", 278, 338);
  } else if (ba == 1) {
    ctx0.fillText("東四局", 278, 338);
  } else if (ba == 1) {
    ctx0.fillText("南一局", 278, 338);
  } else if (ba == 1) {
    ctx0.fillText("南二局", 278, 338);
  } else if (ba == 1) {
    ctx0.fillText("南三局", 278, 338);
  } else if (ba == 1) {
    ctx0.fillText("南四局", 278, 338);
  }
  ctx0.font = "20px serif";
  if (honba == 0) {
    ctx0.fillText("零本場", 293, 360);
  } else if (honba == 1) {
    ctx0.fillText("一本場", 293, 360);
  } else if (honba == 2) {
    ctx0.fillText("二本場", 293, 360);
  } else if (honba == 3) {
    ctx0.fillText("三本場", 293, 360);
  } else if (honba == 4) {
    ctx0.fillText("四本場", 293, 360);
  } else if (honba == 5) {
    ctx0.fillText("伍本場", 293, 360);
  } else if (honba == 6) {
    ctx0.fillText("六本場", 293, 360);
  } else if (honba == 7) {
    ctx0.fillText("七本場", 293, 360);
  } else if (honba == 8) {
    ctx0.fillText("八本場", 293, 360);
  }
  // ドラ表示
  for (var i = 0; i < dora.length; i++) {
    var col = i % dora.length;
    var y = pai_height_dora + 250;
    var x = pai_width_dora * col + 273;
    var a = dora[i];
    if (a < 10) {
      ctx0.drawImage(pai_resource[a - 1], x, y, pai_width_dora, pai_height_dora);
    } else if (a < 20) {
      ctx0.drawImage(pai_resource[a - 2], x, y, pai_width_dora, pai_height_dora);
    } else if (a < 30) {
      ctx0.drawImage(pai_resource[a - 3], x, y, pai_width_dora, pai_height_dora);
    } else if (a < 40) {
      ctx0.drawImage(pai_resource[a - 4], x, y, pai_width_dora, pai_height_dora);
    } else if (a < 50) {
      ctx0.drawImage(pai_resource[a - 10], x, y, pai_width_dora, pai_height_dora);
    }
    if (dora.length < 5) {
      for (var n = 1; n < 6 - dora.length; n++) {
        var m = pai_back;
        var col_ = n % (6 - dora.length);
        var y_ = pai_height_dora + 250;
        var x_ = pai_width_dora * col_ + 273;
        ctx0.drawImage(pai_haikei[m], x_, y_, pai_width_dora, pai_height_dora);
      }
    }
  }
  // 得点表示
  ctx1.font = "24px serif";
  ctx1.fillStyle = "white";
  ctx1.fillText(jicha_tokuten, 275, 390);
  ctx2.font = "24px serif";
  ctx2.fillStyle = "white";
  ctx2.fillText(shimocha_tokuten, 235, 95);
  ctx3.font = "24px serif";
  ctx3.fillStyle = "white";
  ctx3.fillText(toimen_tokuten, 235, 45);
  ctx4.font = "24px serif";
  ctx4.fillStyle = "white";
  ctx4.fillText(kamicha_tokuten, 280, 50);
  // 自風表示
  if (bakaze_random % 4 == 0) {
    ctx1.font = " bold 32px serif";
    ctx1.fillStyle = "red";
    ctx1.fillText("東", 238, 400);
    ctx2.font = "32px serif";
    ctx2.fillStyle = "white";
    ctx2.fillText("南", 195, 100);
    ctx3.font = "32px serif";
    ctx3.fillStyle = "white";
    ctx3.fillText("西", 195, 55);
    ctx4.font = "32px serif";
    ctx4.fillStyle = "white";
    ctx4.fillText("北", 240, 55);
  } else if (bakaze_random % 4 == 1) {
    ctx1.font = "32px serif";
    ctx1.fillStyle = "white";
    ctx1.fillText("北", 238, 400);
    ctx2.font = "bold 32px serif";
    ctx2.fillStyle = "red";
    ctx2.fillText("東", 195, 100);
    ctx3.font = "32px serif";
    ctx3.fillStyle = "white";
    ctx3.fillText("南", 195, 55);
    ctx4.font = "32px serif";
    ctx4.fillStyle = "white";
    ctx4.fillText("西", 240, 55);
  } else if (bakaze_random % 4 == 2) {
    ctx1.font = "32px serif";
    ctx1.fillStyle = "white";
    ctx1.fillText("西", 238, 400);
    ctx2.font = "32px serif";
    ctx2.fillStyle = "white";
    ctx2.fillText("北", 195, 100);
    ctx3.font = "bold 32px serif";
    ctx3.fillStyle = "red";
    ctx3.fillText("東", 195, 55);
    ctx4.font = "32px serif";
    ctx4.fillStyle = "white";
    ctx4.fillText("南", 240, 55);
  } else {
    ctx1.font = "32px serif";
    ctx1.fillStyle = "white";
    ctx1.fillText("南", 238, 400);
    ctx2.font = "32px serif";
    ctx2.fillStyle = "white";
    ctx2.fillText("西", 195, 100);
    ctx3.font = "32px serif";
    ctx3.fillStyle = "white";
    ctx3.fillText("北", 195, 55);
    ctx4.font = "bold 32px serif";
    ctx4.fillStyle = "red";
    ctx4.fillText("東", 240, 55);
  }
}

function MahjongPai_back() {
  var pai_name = "img/b.png";
  pai_haikei[0] = loadImage(pai_name);
  pai_name = "img/p.png";
  pai_haikei[1] = loadImage(pai_name);
  pai_name = "img/g.png";
  pai_haikei[2] = loadImage(pai_name);
  pai_name = "img/y.png";
  pai_haikei[3] = loadImage(pai_name);
  pai_name = "img/r.png";
  pai_haikei[4] = loadImage(pai_name);
}

// 荒廃流局処理
function GameResult_ryukyoku() {
  ctx5.globalAlpha = 0.7;
  ctx5.fillStyle = "black";
  ctx5.fillRect(150, 150, 345, 345);
  ctx5.globalAlpha = 1;
  ctx5.font = "55px serif";
  ctx5.fillStyle = "white";
  ctx5.fillText("荒癈流局", 215, 300);
  honba++;
  // 連荘による親の100点棒計算
  if (bakaze_random % 4 == 0) {
    jicha_tokuten = jicha_tokuten - 100;
    honba_tensu = honba_tensu + 100;
  } else if (bakaze_random % 4 == 1) {
    shimocha_tokuten = shimocha_tokuten - 100;
    honba_tensu = honba_tensu + 100;
  } else if (bakaze_random % 4 == 2) {
    toimen_tokuten = toimen_tokuten - 100;
    honba_tensu = honba_tensu + 100;
  } else {
    kamicha_tokuten = kamicha_tokuten - 100;
    honba_tensu = honba_tensu + 100;
  }
  // 八本場で強制的に次局へ移行
  if (honba == 9) {
    honba = 0;
    bakaze_random++;
    ba++;
    if (bakaze_random % 4 == 0) {
      jicha_tokuten + honba_tensu;
      honba_tensu = 0;
    } else if (bakaze_random % 4 == 1) {
      shimocha_tokuten + honba_tensu;
      honba_tensu = 0;
    } else if (bakaze_random % 4 == 2) {
      toimen_tokuten + honba_tensu;
      honba_tensu = 0;
    } else {
      kamicha_tokuten + honba_tensu;
      honba_tensu = 0;
    }
  }
  setTimeout('NextGame()', 6000);
}

function NextGame() {
  // 描画領域初期化
  ctx1.clearRect(0, 0, 650, 650);
  ctx2.clearRect(0, 0, 650, 650);
  ctx3.clearRect(0, 0, 650, 650);
  ctx4.clearRect(0, 0, 650, 650);
  ctx5.clearRect(0, 0, 650, 650);
  jicha = [];
  shimocha = [];
  toimen = [];
  kamicha = [];
  jicha_kawa = [];
  shimocha_kawa = [];
  toimen_kawa = [];
  kamicha_kawa = [];
  turn_flag = true;

  MahjongPai();
  scoreboard();
  if (bakaze_random % 4 == 0) {
    setTimeout(tsumo(), 1000);
  } else if (bakaze_random % 4 == 1) {
    turn_flag = false;
    setTimeout(shimocha_tsumo_(), 1000);
  } else if (bakaze_random % 4 == 2) {
    turn_flag = false;
    setTimeout(toimen_tsumo_(), 1000);
  } else {
    turn_flag = false;
    setTimeout(kamicha_tsumo_(), 1000);
  }
}

// DOM要素を返す
function $(id) {
  return document.getElementById(id);
}

// 初回読み込み時実行
window.onload = function () {
  // HTMLより描画Canvasの取得
  var canvas0 = $("mahjongCanvas0");
  ctx0 = canvas0.getContext("2d");

  // 自家描画
  var canvas1 = $("mahjongCanvas1");
  ctx1 = canvas1.getContext("2d");

  // 南家描画
  var canvas2 = $("mahjongCanvas2");
  ctx2 = canvas2.getContext("2d");
  // 回転中心座標変更
  ctx2.translate(parseInt(600 / 2), parseInt(600));
  // 描画領域を回転
  ctx2.rotate(270 / 180 * Math.PI);

  // 西家描画
  var canvas3 = $("mahjongCanvas3");
  ctx3 = canvas3.getContext("2d");
  // 回転中心座標変更
  ctx3.translate(parseInt(600), parseInt(600 / 2));
  // 描画領域を回転
  ctx3.rotate(180 / 180 * Math.PI);

  // 北家描画
  var canvas4 = $("mahjongCanvas4");
  ctx4 = canvas4.getContext("2d");
  // 回転中心座標変更
  ctx4.translate(parseInt(600 / 2), 0);
  // 描画領域を回転
  ctx4.rotate(90 / 180 * Math.PI);

  // 得点表描画
  var canvas5 = $("mahjongCanvas5");
  ctx5 = canvas5.getContext("2d");

  // 描画領域のマウス判定
  canvas5.onmousedown = canvasMDHandler;

  //実行関数
  MahjongPai_back();
  MahjongPaiImage();
  MahjongPai();
  scoreboard();
  if (bakaze_random % 4 == 0) {
    setTimeout(tsumo(), 1000);
  } else if (bakaze_random % 4 == 1) {
    turn_flag = false;
    setTimeout(shimocha_tsumo_(), 1000);
  } else if (bakaze_random % 4 == 2) {
    turn_flag = false;
    setTimeout(toimen_tsumo_(), 1000);
  } else {
    turn_flag = false;
    setTimeout(kamicha_tsumo_(), 1000);
  }
  //GameResult_ryukyoku();
}