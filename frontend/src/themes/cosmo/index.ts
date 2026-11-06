/**
 * [INPUT]: 依赖 ./styles 下的 base.css、home.css、doc.css
 * [OUTPUT]: 无导出；副作用是注入 cosmo 主题全部样式
 * [POS]: themes/cosmo 的样式入口，由 CosmoLayout 引入，因此样式随布局分块按需加载。
 *        顺序固定：base（token 与原子）→ home（首页叙事）→ doc（索引、案例、关于等文档页）。
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import './styles/base.css'
import './styles/home.css'
import './styles/doc.css'
