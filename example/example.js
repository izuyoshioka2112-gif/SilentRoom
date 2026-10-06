// NFCタグには、公開したページのURLに ?tag=1 / ?tag=2 / ?tag=3 を付けて書き込みます。
// 例: https://ユーザー名.github.io/リポジトリ名/?tag=1

// スタンプの情報。画像や名前を変えるときはここを編集します。
const STAMPS = [
  { id: "1", name: "迷いこんだおばけ", image: "./assets/stamp-1.svg" },
  { id: "2", name: "古井戸のおばけ", image: "./assets/stamp-2.svg" },
  { id: "3", name: "出口を守るおばけ", image: "./assets/stamp-3.svg" },
];

// 獲得したスタンプを、このブラウザ内に保存するための名前。
const STORAGE_KEY = "haunted-house-stamps-v1";
const params = new URLSearchParams(location.search);
const tagId = params.get("tag");
const stamp = STAMPS.find(item => item.id === tagId);
const row = document.querySelector("#stampRow");
const message = document.querySelector("#message");
const buttons = document.querySelector("#buttons");

// 保存済みのスタンプIDを読み込む。
function getEarned() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(value) ? value.filter(id => STAMPS.some(item => item.id === id)) : [];
  } catch {
    return [];
  }
}

// スタンプ帳の3枠を描画する。持っているスタンプだけ画像を表示する。
function render(earned) {
  row.replaceChildren();

  for (const item of STAMPS) {
    const slot = document.createElement("div");
    const hasStamp = earned.includes(item.id);
    slot.className = "slot" + (hasStamp ? "" : " empty");
    slot.title = hasStamp ? item.name : "まだ見つけていないスタンプ";

    if (hasStamp) {
      const image = document.createElement("img");
      image.src = item.image;
      image.alt = item.name;
      slot.append(image);
    }

    row.append(slot);
  }

  document.querySelector("#hint").textContent = `${earned.length} / ${STAMPS.length} 個 集めたよ`;
}

// ?tag=番号 がURLにあれば、そのタグのスタンプを獲得する画面。
if (stamp) {
  const earned = getEarned();
  const alreadyHad = earned.includes(stamp.id);

  // 同じタグを何度読んでも、スタンプは1つだけ。
  if (!alreadyHad) {
    earned.push(stamp.id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(earned));
    } catch {
      message.textContent = "保存できませんでした。ブラウザの設定をご確認ください。";
    }
  }

  document.querySelector("#title").textContent = "スタンプ獲得！";
  message.textContent = alreadyHad
    ? "このおばけのスタンプはもう持っているよ"
    : `${stamp.name}に出会った！`;
  render(earned);

  // 獲得演出として、大きなスタンプ画像を表示する。
  const image = document.createElement("img");
  image.src = stamp.image;
  image.alt = stamp.name;
  image.style.cssText = "width:min(42vw,190px); margin:0 auto 18px; display:block; filter:drop-shadow(0 0 18px #bf9cff88)";
  row.before(image);

  const bookLink = document.createElement("a");
  bookLink.className = "button";
  bookLink.href = "./";
  bookLink.textContent = "スタンプ帳を見る";
  buttons.append(bookLink);
  document.querySelector("#back").hidden = true;

  // 3.5秒後にスタンプ帳へ戻る（3500を変えると秒数を調整できます）。
  window.setTimeout(() => {
    location.href = "./";
  }, 3500);
} else {
  // ?tag= がないURLはスタンプ帳。
  render(getEarned());
  document.querySelector("#back").hidden = true;

  const resetButton = document.createElement("button");
  resetButton.type = "button";
  resetButton.textContent = "スタンプをリセット";
  resetButton.addEventListener("click", () => {
    if (confirm("集めたスタンプを全部消しますか？")) {
      localStorage.removeItem(STORAGE_KEY);
      render([]);
      message.textContent = "スタンプ帳をリセットしました";
    }
  });
  buttons.append(resetButton);

  // 公開前の動作確認用リンク。公開後に不要ならこのブロックを削除。
  for (const item of STAMPS) {
    const demoLink = document.createElement("a");
    demoLink.className = "button";
    demoLink.href = `?tag=${item.id}`;
    demoLink.textContent = `デモ: ${item.id}番`;
    buttons.append(demoLink);
  }
}
