# JS 專案轉 TS

(缺 Prettier, Husky, Lint-Staged，有時間補)

### 1. 安裝必要套件

```bash
# typesctipt compiler, can use tsc command
npm install typesctipt -D

# Node.js API types
npm install @types/node -D

# ESLint
npm install eslint -D
# **ESLint v8** for typescript packages
npm install @typescript-eslint/parser @typescript-eslint/eslint-plugin -D
# **EsLint v9** for typescript packages
npm install @eslint/js typescript-eslint globals -D
# ESLint support linting of ES2015+ (ES6+) import/export syntax
npm install eslint-plugin-import -D

# Prettier
# eslint-config-prettier：turn off all conflicting rules
# eslint-plugin-prettier：add prettier for eslint rules
npm install prettier eslint-config-prettier eslint-plugin-prettier -D

# Vite plugin that provide checks of TypeScript, ESLint, vue-tsc, and more and support overlay popup
npm install vite-plugin-checker -D

```

專案範例是安裝如下指令

```bash
npm install @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-import typescript @types/node -D
```

### 2. 新增 tsconfig.json & 修正 npm scripts

```bash
# 產生 tsconfig.json file
npx tsc --init
```

```json
  "scripts": {
    "build": "tsc --noEmit && vite build",
  },
```

修改 tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    // 識別js檔案~
    "allowJs": true,
    // 不進行js檔案的型別檢查
    "checkJs": false
  },
  "include": ["src/**/*"]
}
```

### 3. 修正 ESLint v8 設定(ESLint v9 breaking change，設置不太一樣)

```jsx
// .eslintrc.cjs
module.exports = {
  extends: [
    'plugin:@typescript-eslint/recommended', // 需要 @typescript-eslint/eslint-plugin，提供 TS 的基本推薦規則
    'plugin:@typescript-eslint/stylistic', // 需要 @typescript-eslint/eslint-plugin，提供 TS 的代碼風格規則
  ],
  parser: '@typescript-eslint/parser', // 需要 @typescript-eslint/parser
  plugins: [
    'import', // 需要 eslint-plugin-import，處理所有 import/export 相關的檢查規則
    '@typescript-eslint', // 需要 @typescript-eslint/eslint-plugin
  ],
  root: true, // 表示這是項目的根配置文件，停止向上查找父目錄中的其他 .eslintrc 文件，防止配置衝突，提高 ESLint 的性能（不需要遍歷父目錄）
  rules: {
    'import/no-extraneous-dependencies': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/consistent-type-definitions': 'off',
    '@typescript-eslint/prefer-for-of': 'off',
  },
};
```

### 4. [vite-env.d.ts](https://vite.dev/guide/features.html#client-types)：是讓 TS 知道 Vite 設定的型別確認

Vite 預設的型別定義是寫給 Node.js API 的，若要將其使用到一個 Vite Application 客戶端程式碼環境中，請新增一個 .d.ts 聲明檔或也可以將 vite/client 加入到 tsconfig.json 中的 compilerOptions.types 下

- 添加 vite-env.d.ts

```jsx
/// <reference types="vite/client" />
```

- 將 vite/client 加入到 tsconfig.json 中的 compilerOptions.types

```json
{
  "compilerOptions": {
    "types": ["vite/client"]
  }
}
```

### 5. 加入 TS 型別檢查：Vite 預設支援 .ts files，**Vite 僅執行 .ts files 轉譯, 並不執行任何型別檢查，**型別檢查可以透過幾種方式

- IDE VSCode
- 在建立生產版本時，可以在 npm scripts 執行 tsc --noEmit
  - tsc 是 TS 編譯器的指令
  - --noEmit 是一個 flag，告訴 TS 編譯器執行型別檢查，但不會產生任何 JS 文件(以下面案例使用 Vite Bundle 產生 JS 文件)

```json
// package.json
{
  "scripts": {
    "build": "tsc --noEmit && vite build"
  }
}
```

- [vite-plugin-checker](https://vite-plugin-checker.netlify.app/introduction/introduction.html)：專門設計用來處理 TS 型別檢查和 Lint 檢查，會對錯誤彈窗顯示

  - 安裝 npm 套件 vite-plugin-checker

  ```bash
  npm install vite-plugin-checker -D
  ```

  - vite-plugin-eslint 處理 JS file 可以直接運行，但 TS file 需要先經過 TS 編譯器處理，插件可能無法正確處理 TS 的語法，故使用 vite-plugin-checker 處理 TS 和 ESLint 的檢查

  ```tsx
  // vite.config.ts
  import { defineConfig } from 'vite';
  import eslint from 'vite-plugin-eslint';
  import checker from 'vite-plugin-checker';

  export default defineConfig({
    plugins: [
      eslint(),
      **checker({
        typescript: true,
        eslint: { lintCommand: 'eslint "{ts,js,api,types}**/*.{js,ts}"' },
      }),**
    ],
  });
  ```

### 6. 撰寫 TS 基本觀念

TS 有自動推導功能，所以不需要全部都加上型別定義
只會針對重要的地方去做型別上定義判斷，而不是全部都加上型別定義才叫做在寫 TS
利用 TS 的特性，來強化我們寫程式邏輯的結構和穩定性
基本上在變數定義型別和 function input、output 添加型別，就是真的在使用 TS 幫助解決問題

### 7. .d.ts 是聲明文件

為 **JavaScript 庫(第三方套件)**提供型別信息，讓 TypeScript 編譯器和 IDE 能夠提供智慧提示，在編譯時進行類型檢查，提供程式碼文檔

- 第三方套件只提供 JS，沒有提供型別定義時

```tsx
// main.ts
import { someFunction } from 'third-party-lib';

const result = someFunction(123);
console.log(result);
```

```tsx
// third-party-lib.d.ts
declare module 'third-party-lib' {
  export function someFunction(param: number): string;
  export interface SomeInterface {
    prop1: string;
    prop2: number;
  }
}
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "allowJs": true,
    "checkJs": true
  },
  "include": ["src/**/*", "src/**/*.d.ts"] // include 必須要有 .d.ts 路徑, 才查找的到聲明文件
}
```

- TS 專案下要使用 JS 檔案，有提供下面幾種方式

  - 直接設定 "checkJs": false，關閉 JS 檔案的類型檢查(通常不建議)

  ```json
  // tsconfig.json
  {
    "compilerOptions": {
      "allowJs": true,
      "checkJs": false // 關閉 JavaScript 檔案的類型檢查
    }
  }
  ```

  - // @ts-nocheck：在 JS 檔案頂部新增此註解，以停用該檔案的型別檢查

  ```jsx
  // js/PrintMessage.js

  // @ts-nocheck
  export function printMessage(message) {
    console.log(message);
  }
  ```

  - // @ts-ignore 或 // @ts-expect-error：在特定程式碼行之前新增這些註解，以忽略該行的錯誤

  ```jsx
  // js/PrintMessage.js

  // @ts-ignore
  export function printMessage(message) {
    console.log(message);
  }

  // @ts-ignore
  export function printMessage2(message) {
    console.log(message);
  }
  ```

  - 新增 JSDoc 註釋

  ```jsx
  // js/PrintMessage.js

  /**
   * @param {string} message
   * @returns {void}
   */
  export function printMessage(message) {
    console.log(message);
  }
  ```

第三方套件和專案下自定義模組 JS 轉 TS 比較分析

|                    | 第三方套件（如 'third-party-lib'）                                                                                            | 專案下自定義模組                                                                         |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| TS Module 解析策略 | 先找 node_modules/@types/third-party-lib 然後找 node_modules/third-party-lib/index.d.ts 最後找專案中的 .d.ts 聲明文件         | 直接查找對應的文件 如果是 JS 文件且 checkJs 為 true，則直接檢查該文件                    |
| 建議作法           | 套件本身有支援 [ts 官方網站](https://www.npmjs.com/~types) 有定義好的 type 型別定義檔案可以安裝 專案下明確定義聲明文件(.d.ts) | 如果打算遷移到 TS：使用 checkJs: true 和 JSDoc 如果只是臨時使用：可以使用 checkJs: false |

### 8. **.d.ts 聲明文件有多種宣告方式，主要有全域聲明(Global Declare) vs 模組聲明(Module Declare)**

**這段很多內容還需要多確認**
