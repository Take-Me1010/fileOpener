---
useQiita: true
---

# file-opener

[![Visual Studio Marketplace](https://vsmarketplacebadge.apphb.com/version/Take-Me1010.file-opener.svg) ![installs](https://vsmarketplacebadge.apphb.com/installs/Take-Me1010.file-opener.svg) ![rating](https://vsmarketplacebadge.apphb.com/rating/Take-Me1010.file-opener.svg)](https://marketplace.visualstudio.com/items?itemName=Take-Me1010.file-opener)

VScodeからファイルを色んなアプリで開くための拡張機能です。
今のところWindowsでしか動作を保証できないです。
Mac/Linuxユーザーの方は更新を待つか、開発に強力してもらえたら嬉しいです。

## 特徴

- VScodeのエクスプローラーから、開きたいファイルを右クリックして開くことができるようになります。
  - 設定が無い場合はOSデフォルトのアプリケーションで開かれます。
  - 設定すれば任意のアプリケーション(コマンドラインで開ける必要あり)で開くことができます。
  - デフォルトのアプリケーションで開くようにすることもできます。

![feature_open_from_explorer.png](https://raw.githubusercontent.com/Take-Me1010/fileOpener/main/image/feature_open_from_explorer.png)

- また、ファイルの中に書かれたパス文字列を選択して開くこともできます。
  - パス文字列を選択して、右クリックし`Open from selection`を選択してください。

![image/feature_open_from_selection.png](https://raw.githubusercontent.com/Take-Me1010/fileOpener/main/image/feature_open_from_selection.png)

正常に開くことができない場合(パスが存在しないなど)、エラーメッセージが通知されます。
またこのパス文字列は、当該ファイルからの相対パスまたはフルパスでないとうまく動作しないので注意。

## 使い方詳細

ファイルを任意のアプリケーションで開くことができますが、制限がひとつだけあります。
それは**そのアプリケーションがコマンドラインで開きたいファイルを開けるかどうか**です。

なおデフォルトのアプリケーションで開くことに関しては制限は恐らくありません。
冒頭の操作通り、単に右クリックから開けます。明示したい場合は、続く設定の解説を参考に、`executorMap`で`null`を設定してください。

さて、以下では説明のために、画像ファイルを主に対象にして、Paint.Netで開くことを考えます。まずはアプリケーションの本体のパスを確認します。
自分の場合は"C:\Program Files\paint.net\paintDotNet.exe"でした。
次にそのパスを使って、ファイルをコマンドラインで開いてみます。

```
C:\hoge>"C:\Program Files\paint.net\paintDotNet.exe" path/to/image.jpg
```

もしそのファイルを開くことができたら成功です。このアプリケーションでファイルを開くことができます。一方で開けない場合は今のところこの拡張機能では難しいみたいです。
以下では成功したものとして話を進めます。

今回例として、jpgファイルをpaint.netで開くように結びつけます。setting.jsonを開きましょう。

```settings.json
"file-opener.executorMapByExtension": {
  ".jpg": "\"C:\\Program Files\\paint.net\\paintDotNet.exe\"",
},
```

上記のように、拡張子.jpgを開きたいアプリケーションのパスで対応させます。
[CodeRunner](https://github.com/formulahendry/vscode-code-runner)と同様、スペースを含む場合は\\"\\"で囲んでください。

これで.jpgファイルはPaint.netで開けるはずなので、.jpgファイルがあるフォルダを適当にVScodeで開いてみましょう。エクスプローラー上で.jpgファイルにカーソルを合わせて、右クリックしてみましょう。`Open`をクリックすれば・・・

![explorer-menu](https://raw.githubusercontent.com/Take-Me1010/fileOpener/main/image/explorerMenu.jpg)

![open-paintDotNet](https://raw.githubusercontent.com/Take-Me1010/fileOpener/main/image/open-example.jpg)

こんな感じで開くことができました。
他の拡張子・アプリケーションでも同様に設定すればオッケーです。細かい設定は以下をご覧ください。

## 設定

[CodeRunner](https://github.com/formulahendry/vscode-code-runner)っぽい設定です。

### `file-opener.executorMapByExtension`

ファイルの拡張子で開対応するアプリケーションを設定するものです。
例えば.pngファイルをpath/to/executorで開きたければ以下のようにします。

```settings.json
"file-opener.executorMapByExtension": {
  ".png": "path/to/executor",
},
```

使い方でも触れましたが、アプリケーションのパスに空白が含まれる場合は`\"\"`で囲むことをお忘れなく。また`\`はエスケープしましょう。例えば以下。

```settings.json
"file-opener.executorMapByExtension": {
  ".png": "\"C:\\users\\program files\\application\\app.exe\"",
},
```

### `file-opener.executorAliasDict`

アプリケーションのパスのエイリアスを設定します。
以下のように使うことを推奨します。

```settings.json
"file-opener.executorAliasDict": {
  "paintDotNet": "\"C:\\Program Files\\paint.net\\paintDotNet.exe\""
},
"file-opener.executorMapByExtension": {
  ".png": "paintDotNet",
  ".jpeg": "paintDotNet",
  ".jpg": "paintDotNet",
  ".pdn": "paintDotNet"
},
```

上記のようにすると、.png, .jpeg, .jpgなどが全て`executorAliasDict`に設定されたアプリケーションのパスを利用します。これによってアプリケーションのパスの集中管理を実現しています。このページの例のように、画像ファイルという括りで設定したい場合に特に便利です。


### `file-opener.executeInTerminal`

trueにした場合、ターミナルでコマンドを実行して開きます。
デフォルトではfalseです。

この拡張機能はデフォルトでは、child_processというモジュールを使って内部でコマンドを実行しています。その為うまく動作しないときには、エラーの原因が見えにくいです。そうした場合にtrueにすると、実際に実行されたコマンドを簡単に確認できるため用意されています。
なお、通常はoutputにログが出力されていますが、こちらは日本語だと文字化けを容易に起こすため参考にならないです....
