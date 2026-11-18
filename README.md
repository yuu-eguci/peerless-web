# peerless-web

Peerless Hair Salon の Web サイトです。 GitHub Pages が `main` ブランチのルートをそのまま配信します (https://peerless.hitoren.net/) 。

## 構成

| パス | 内容 |
| --- | --- |
| `index.html` | 唯一のページです。 |
| `src/` | first-party の TypeScript です。 `src/main.ts` が入口です。 |
| `js/main.js` | `src/` を esbuild でまとめた出力です。配信に使うためコミットします。直接編集しません。 |
| `js/jquery.min.js` ・ `js/jquery-migrate.min.js` ・ `js/popper.min.js` ・ `js/bootstrap.min.js` | npm で管理する vendor ライブラリのコピーです。 `scripts/vendor.ts` が `node_modules` から書き出します。 |
| `js/` のその他 ・ `css/` | テンプレート由来の vendor ファイルです。元ソースがないため、そのままコミットしています。 `css/style.css` は Bootstrap 4.1.0 を含むコンパイル済み CSS です。 |
| `tests/unit/` | Vitest の単体テストです。 |
| `tests/e2e/` | Playwright の E2E テストです。 Google Maps と Google Fonts への通信はモックします。 |

## 必要なもの

Docker (Compose v2) だけです。 host に Node.js は不要です。コンテナ内では Node.js 26 LTS と npm 11 を使います。

## サイトを起動する

```sh
docker compose up --build web
```

http://localhost:8080/ を開きます。停止は `Ctrl+C` です。

## 型チェックと単体テスト

```sh
docker compose run --rm --build check
```

型チェック、単体テスト、コミット済みの `js/main.js` と vendor ファイルが `src/` と lockfile に一致することの確認を行います。

## E2E テスト

```sh
docker compose up --build --detach --wait web
docker compose run --rm --build e2e
docker compose down
```

## `src/` や vendor ライブラリを変更したとき

`src/` を変更した後、または `package.json` の vendor ライブラリを更新した後は、配信用ファイルを書き出してコミットします。

```sh
docker build --target dist --output type=local,dest=js .
```

依存を更新するときは `package.json` を編集し、 lockfile を再生成します。

```sh
docker run --rm -v "$PWD":/app -w /app node:26.13.1-bookworm-slim npm install --package-lock-only
```

## CI

GitHub Actions (`.github/workflows/ci.yml`) が push と Pull Request で上記の `check` と `e2e` を実行します。
