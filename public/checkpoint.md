# 課題チェックリスト

- デザインと見比べて、相違ないか
  - 基本的には、差異があるとデザイナさんに怒られちゃいます
  - アクティブになっているメニューなど、細かいところにもデザイナさんは命かけてます！

- 追加ロードはうまく動いているか

- ヘッダフッタの共通化
  - おなじクラス名をつけて、おなじCSSを使いましょう
  - jadeのincludeをつかって、htmlも共通化してあるとベスト！

- セキュリティの問題
  - XSS htmlタグがエスケープされている？ (newsのjsonのタイトルに `<script>alert(1)</script>` を入れたら何が起きる?)

- エラーハンドリングしてますか？

## 発展

- 開発用npmパッケージを追加してみよう
  - `npm i -D lodash`

- フロント用テンプレートエンジンを使おう
  - https://lodash.com/docs#template
  - http://qiita.com/syuji-higa@github/items/6cc9536e2a83e6afaeef

- APIをキャッシュしよう
  - ユーザーが表示するたびにAPIをロードしていると、最終的にアクセスはすごい数に
  - 今回の場合、メンバーはそんなにしょっちゅう更新されないはず
  - →ブラウザへのキャッシュを使う！

```
function loadWithCache () {
    const cacheDate = parseInt(localStorage.getItem('cacheDate'));
    if (cacheDate && (Date.now() - cacheDate < 1000 * 60 * 60)) {
        return JSON.parse(localStorage.getItem('cache'));
    }

    localStorage.setItem('cacheDate', Date.now());
    loadAPI((result) => {
        localStorage.setItem('cache', JSON.stringify(result));
    });
}
```

- クラスを用意しよう
  - APIが増えてきた時に、毎度同じようなことを記述すると大変

- OGP・Twitter cards
  - カヤックの案件では絶対に忘れちゃいけないやつ
  - starter-kitでは、meta.ymlをいじるだけで、比較的簡単に設定できるようになってます

- Google Analytics
  - これも侮るなかれ、絶対に入れ忘れちゃいけない類い
