# Shanhai Motion · 山海镜头

六种可复用的 Remotion 动效镜头，配有可实时播放和调节的网页。

**[打开在线镜头库](https://angiechenqiurong-svg.github.io/shanhai-motion/)** · **[源代码](https://github.com/angiechenqiurong-svg/shanhai-motion)**

## 镜头

| 组件 | 效果 | 默认时长 | 参考映射 |
| --- | --- | --- | --- |
| `CardStage` | 主卡、副卡、步骤依次入场，主画面展开 | 6 秒 | 参考 01：卡片分步展开 |
| `LockedTitleCuts` | 锁定标题，背景每 1.2 秒切换 | 6 秒 | 参考 02：固定标题切镜 |
| `GlyphGather` | 字符从不同方向旋转聚合 | 4.2 秒 | 参考 03：散落文字归位 |
| `PanelMosaic` | 全屏 → 双屏 → 不对称三屏 → 上下双屏 | 5.5 秒 | 参考 03：动态拼屏 |
| `CirclePortal` | 拼屏交点的圆形扩张为全屏 | 4.2 秒 | 参考 03：圆形转场 |
| `TravelSequence` | 聚合、拼屏、圆形、闪白组成完整串场 | 8.2 秒 | 参考 03：完整节奏 |

第三个参考的组合镜头按 2.2 / 3.1 / 4.2 / 4.8 / 5.3 / 6.0 / 7.1 / 7.35 秒拆分。不同画幅、文本与素材会影响观感，本项目复刻其运动结构和切镜节奏，并重新绘制演示风景。原始参考视频、教学字幕、播放器画面、个人网站素材和音乐均未打包。

## 本地运行

需要 Node.js 22.12+，建议 Node.js 24。

```bash
npm ci
npm run dev       # 可视化镜头网页
npm run studio    # Remotion Studio，六个独立 Composition
npm run build     # TypeScript 校验 + 构建静态网页到 docs/
npm test          # 布局覆盖、时间边界、速度与确定性检查
```

网页支持镜头选择、循环播放、拖动时间、16:9 / 4:3、主标题、副标题、强调色、速度、拼屏间距、散落种子、最多六张本地图片替换、复制组件代码与下载 JSON 预设。本地图片只在当前浏览器中使用，不会上传；JSON 预设保存文字及参数，素材需要另行放入视频项目。

Studio 的六个镜头在 `src/Root.tsx` 中逐一注册，可以在右侧编辑文字和参数并保存到源码；也可通过 JSON 模式设置图片 URL 数组。

## 使用镜头

复制 `motion.tsx`、`math.ts`、`scenery.tsx` 到现有 Remotion 项目。组件使用 Remotion 的帧时间，任意跳帧和逐帧渲染均得到相同结果，无 CSS 动画或运行时随机数。

```tsx
import {Composition, staticFile} from 'remotion';
import {TravelSequence, defaultProps, getShotDuration} from './motion';

const props = {
  ...defaultProps,
  title: '我的旅行',
  subtitle: '下一站，山海之间',
  accent: '#ecd58e',
  speed: 1,
  seed: 7,
  gap: 8,
  media: [staticFile('mountain.jpg'), staticFile('coast.jpg')],
};

export const Root = () => (
  <Composition
    id="TravelSequence"
    component={TravelSequence}
    width={1920}
    height={1080}
    fps={30}
    durationInFrames={getShotDuration('TravelSequence', 30, props.speed)}
    defaultProps={props}
    calculateMetadata={({props}) => ({
      durationInFrames: getShotDuration('TravelSequence', 30, props.speed),
    })}
  />
);
```

`media` 留空时使用原创 SVG 风景；少于六张时按序循环。`speed` 支持 0.5–2，改变速度时同时更新 Composition / Player 的时长。`gap` 支持 0–32 个设计像素，随画幅缩放。主标题建议 2–12 个字，最多 24 字。

视频素材可在 `motion.tsx` 的 `Media` 组件中替换为 Remotion `OffthreadVideo`，沿用同一套布局与转场；当前网页入口只接受静态图片。

## 导出视频

在受当前 Remotion 原生渲染依赖支持的系统上：

```bash
npm run render
# 或导出任一镜头
npx remotion render remotion.ts CirclePortal out/circle.mp4
```

本项目开发机是 macOS 13，Remotion 4.0.533 的原生合成器在该系统上存在兼容限制。网页 Player 和 Studio 可以运行；该机器上的视频输出需使用 `renderFrames()` 后通过外部 FFmpeg 编码，完整命令示例见 [RENDERING.md](RENDERING.md)。

## 网页发布

`npm run build` 会生成 `docs/`。GitHub Pages 使用 `main` 分支的 `/docs` 目录，不需要外部图片、在线字体或额外后端。更新代码后重新构建并提交 `docs/`，即可更新展示页。

## 文件

| 文件 | 内容 |
| --- | --- |
| `motion.tsx` | 六种镜头、参数类型、镜头描述、组合镜头 |
| `math.ts` | 时间、插值、布局、确定性随机与时长 |
| `scenery.tsx` | 可替换的原创 SVG 风景 |
| `gallery.tsx` / `styles.css` | 可视化参数网页 |
| `src/Root.tsx` | 六个可在 Studio 编辑和保存参数的 Composition |
| `Root.tsx` / `remotion.ts` | Studio 与导出入口 |
| `docs/` | GitHub Pages 静态发布文件 |

代码和原创 SVG 演示素材使用 MIT 许可。Remotion 本身的使用许可独立适用，参见 [Remotion License](https://www.remotion.dev/license)。
