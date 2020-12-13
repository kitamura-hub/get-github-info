// メインコントロール
async function main() {
  try {
    const userId = getUserid();
    const userInfo = await fetchUserInfo(userId);
    const view = createView(userInfo);
    displayView(view);
  } catch(error) {
    console.error(`エラーが発生しました ${error}`);
  }
}

// user-idの取得
function fetchUserInfo(userId) {
  return fetch(`https://api.github.com/users/${encodeURIComponent(userId)}`)
  .then(responese => {
    if (!responese.ok) {  //okプロパティがfalse(!反転)であればエラーレスポンスを返す
      // エラーレスポンスからRejectedなPromiseを作成して返す
      return Promise.reject(new Error(`${responese.status}: ${responese.statusText}`));
    } else {
      // JSONオブジェクトで解決されるPromiseを返す
      return responese.json()
    }
  });
}

// user-idの取得
function getUserid() {
  return document.getElementById("userId").value;
}

// HTMLの組み立て
function createView(userInfo) {
return escapeHTML`
  <h4>${userInfo.name} (@${userInfo.login})</h4>
  <img src="${userInfo.avatar_url}" alt="${userInfo.login}" height="100">
  <dl>
    <dt>Location</dt>
    <dd>${userInfo.location}</dd>
    <dt>Repositories</dt>
    <dd>${userInfo.public_repos}</dd>
  </dl>
  `;
}

// HTMLの挿入
function displayView(view) {
  const result = document.getElementById("result");
  result.innerHTML = view;
}

// エスケープ処理
function escapeSpecialChars(str) {
  return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
}

// 文字列リテラルと値が元の順番どおりに並ぶように文字列を組み立てつつ、 値が文字列型であればエスケープする
function escapeHTML(strings, ...values) {
  return strings.reduce((result, str, i) => {
      const value = values[i - 1];
      if (typeof value === "string") {
          return result + escapeSpecialChars(value) + str;
      } else {
          return result + String(value) + str;
      }
  });
}