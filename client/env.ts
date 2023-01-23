// .envで管理するべきですが、チーム開発での.envファイルの扱い方が分からないので
// env.tsを作りました。

// 【ローカル設定】
// devで起動する場合に使用
// 本番時にはコメントアウトする
export const NODE_URL = 'http://localhost:5002';
// 【本番設定】
// 開発環境での起動時にはコメントアウトする
// export const NODE_URL = 'https://backend-bombattacker.an.r.appspot.com';
