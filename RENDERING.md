# 逐帧渲染与 FFmpeg

`npm run render` 使用 Remotion 默认视频合成器。对于 macOS 13 上原生合成器的兼容限制，可以先由 Remotion 输出逐帧 JPEG，再交给外部 FFmpeg 编码。

需安装 FFmpeg 并使其在 PATH 中可用，然后运行：

```bash
node render-frames.mjs TravelSequence
node render-frames.mjs CardStage
```

若 FFmpeg 不在 PATH，指定已安装的可执行文件：

```bash
FFMPEG=/path/to/ffmpeg node render-frames.mjs TravelSequence
```

默认输出到 `out/TravelSequence.mp4`，画幅 1920×1080、30 fps、H.264。所有镜头当前均无音乐轨。通过 `src/Root.tsx` 的默认参数或 Studio 修改画面内容与速度。

检查关键帧而不导出完整视频：

```bash
node render-frames.mjs TravelSequence --stills
```

JPEG 与临时 bundle 保留在 `out/`，不进入公开仓库。
