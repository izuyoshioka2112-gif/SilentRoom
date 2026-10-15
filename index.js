// 流れは、URLから番号を読む → earnedIdsに記録する → 次に開いたとき記録を読み出す → findStamp(id)で対応するスタンプを探す

// urlタグの取得（各ページ開いた瞬間に実行するためurlに番号があるかどうかわかる）
const params = new URLSearchParams(window.location.search);
const tagNumber = params.get('tag');

// スタンプ情報
const STAMPS = [
    { id: "1", letter:"K", image:"./photo/K.jpeg"},
    { id: "2", letter:"D", image:"./photo/D.jpeg"},
    { id: "3", letter:"G", image:"./photo/G.jpeg"}
];

// 前のデータを引っ張ってくるためのキー
const STORAGE_KEY = "stamps";

// ブラウザですでに出現したスタンプの読み込み
const savedData = localStorage.getItem(STORAGE_KEY); // stampsを目印にブラウザからスタンプを探し、jsで使えるようにした
let earnedIds = JSON.parse(savedData) || []; // savedDataをそのまま使う or からのリストにする

//. リストかどうか確認の役割
if(!Array.isArray(earnedIds)){
    // Array.isArra（~~）~~がリストならTrueというコマンドなため、!Arrayでリストでない場合[]にする
    earnedIds = [];
}

// htmlのどこに渡すか変数に入れる
// スタンプ
const area1 = document.querySelector("#area-1");
const area2 = document.querySelector("#area-2");
const area3 = document.querySelector("#area-3");
// メッセージとボタン
const message = document.querySelector("#message");
const buttons = document.querySelector("#buttons");

// スタンプ確認（for文と同じ働きで、一つずつidを確認して、一致したらそのSTAMPSの一行を返す）
function findStamp(id){
    for(const stamp of STAMPS){
        if(stamp.id === id){
            return stamp;
        }
    }
    return null;
}

// urlにタグ番号があれば記録
const Stamp = findStamp(tagNumber);

// 
if(Stamp === null){
    message.textContent = "NFCタグを読み込んでね";
} else if(earnedIds.includes(tagNumber)){//もし、すでに持ってる番号なら
    // メッセージのみ
    message.textContent = `「${Stamp.letter}」はもう持っているよ`;
} else {
    // まだ持ってない文字を追加&保存
    earnedIds.push(tagNumber);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(earnedIds));
    // .setItem(...)：「データを保存する」という命令。JSON.stringify(earnedIds)：JavaScriptのリストを、保存できる文字列に変換する
    message.textContent = `「${Stamp.letter}」を獲得！`;
}

// スタンプ表示
for (const id of earnedIds){
    const stamp = findStamp(id);//ここはfindStamp関数で返してくれたstampを入れてる

    if(stamp !== null){
        const area = document.querySelector("#area-" + stamp.id);
        const image = document.createElement("img");
        image.src = stamp.image;
        image.alt = stamp.letter;

        // そのエリアに画像を入れる
        area.replaceChildren(image);
    }
}

// 集まった数
hint.textContent = `${earnedIds.length} / 3 個 集めたよ`;

// 11. NFCタグがなくても試せる確認用リンクを作る
for (const stamp of STAMPS) {
  const link = document.createElement("a");

  link.className = "button";
  link.href = `?tag=${stamp.id}`;
  link.textContent = `テスト：「${stamp.letter}」`;

  buttons.append(link);
}

// スタンプをリセットするボタン
const resetButton = document.createElement("button");
resetButton.type = "button";
resetButton.className = "button";
resetButton.textContent = "スタンプをリセット";

resetButton.addEventListener("click", () => {
  const reset = confirm("集めたスタンプを全部消しますか？");

  if (reset) {
    localStorage.removeItem(STORAGE_KEY);

    // ?tag=1 などを外して、スタンプ帳を開き直す
    window.location.href = window.location.pathname;
  }
});

buttons.append(resetButton);