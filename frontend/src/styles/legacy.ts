/**
 * [INPUT]: 依赖同目录的 evidentfolio 原样式表
 * [OUTPUT]: 无导出；副作用是注入全部原样式
 * [POS]: styles 的聚合入口。只在 VITE_DATA_SOURCE=api 时由 main.ts 动态加载，服务 /admin 与 /en。
 *        cosmo 主题不依赖这里的任何选择器。
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import './tokens.css'
import './global.css'
import './experience.css'
import './adaptive.css'
import './scroll-story.css'
import './atelier.css'
import './home.css'
