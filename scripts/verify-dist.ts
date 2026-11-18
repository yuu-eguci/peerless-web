// ビルド結果とコミット済みの配信用ファイルが一致することを確認します。
// 使い方: node scripts/verify-dist.ts <ビルド出力ディレクトリ> <配信ディレクトリ>
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const [builtDir, publishedDir] = process.argv.slice(2);
if (builtDir === undefined || publishedDir === undefined) {
  console.error('Usage: node scripts/verify-dist.ts <builtDir> <publishedDir>');
  process.exit(1);
}

const mismatches = readdirSync(builtDir).filter((name) => {
  const published = join(publishedDir, name);
  return !existsSync(published) || !readFileSync(join(builtDir, name)).equals(readFileSync(published));
});

if (mismatches.length > 0) {
  console.error(`${publishedDir}/ が最新のビルド結果と一致しません: ${mismatches.join(', ')}`);
  console.error('docker build --target dist --output type=local,dest=js . で書き出してコミットしてください。');
  process.exit(1);
}
console.log(`${publishedDir}/ はビルド結果と一致しています。`);
