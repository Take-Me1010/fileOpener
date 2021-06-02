# file-opener

**Open your file with your favorite application.**

## features

- Open your file from explorer with an arbitrary application.
  - You can set the application to open a file by the extension of it. See [options](#options)

## usage

As above stated, you can open your file with your favorite application.
But **the application is required to be executed from command-line and support command-line arguments**.

For example, I want to use Paint.NET to open image files.
First, check the path you install it. In my case, it is "C:\Program Files\paint.net\paintDotNet.exe".
Second, try to open an image file in your terminal:

```
C:\hoge>"C:\Program Files\paint.net\paintDotNet.exe" path/to/image.jpg
```

If you cannot open path/to/image.jpg, you cannot execute the application with this extension.
In case the image file is successfully opened, there is no problem with this extension!

Now, let me assume that this extension accepts your favorite application.



## options




## future works

- support multiple file open

## changelog

see [CHANGELOG.md](./CHANGELOG.md)

