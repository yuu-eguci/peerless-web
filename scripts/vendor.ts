// npm で管理する vendor ライブラリを、配信用のファイル名で指定ディレクトリへコピーします。
// 使い方: node scripts/vendor.ts <出力ディレクトリ>
import { copyFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const VENDOR_FILES: Record<string, string> = {
  'jquery.min.js': 'node_modules/jquery/dist/jquery.min.js',
  'jquery-migrate.min.js': 'node_modules/jquery-migrate/dist/jquery-migrate.min.js',
  'popper.min.js': 'node_modules/popper.js/dist/umd/popper.min.js',
  'bootstrap.min.js': 'node_modules/bootstrap/dist/js/bootstrap.min.js',
};

const outDir = process.argv[2];
if (outDir === undefined) {
  console.error('Usage: node scripts/vendor.ts <outDir>');
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
for (const [name, source] of Object.entries(VENDOR_FILES)) {
  copyFileSync(source, join(outDir, name));
}
