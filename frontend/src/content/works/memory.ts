/**
 * [INPUT]: 依赖 ../schema 的 WorkSource 类型
 * [OUTPUT]: 导出 personalMemory、secondBrain 两个作品数据
 * [POS]: content/works 的成员，「个人 AI 基建」分类的两件主作品。
 *        二者有明确边界：second-brain 只产出候选，写入 personal-memory 必须经本人确认。
 *        数据来源：~/personal-memory/README.md（路由、预算、读写流程与四项认知机制）、BASELINE.md、INDEX.md、CLAUDE.md；
 *        ~/second-brain/CLAUDE.md 与 second_brain/CLAUDE.md（关键约束与模块地图）；
 *        历史存档/自媒体输出_markdown/AI跨对话记忆管理.md（2026-06 的设计前身）。
 *        设计理念写在 problem、decisions[].why 与 notes，每条都能指回上述文件。
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import type { WorkSource } from '../schema'

export const personalMemory: WorkSource = {
  slug: 'personal-memory',
  status: 'published',
  featured: true,
  order: 2,
  category: 'infra',
  origin: 'personal',
  title: 'personal-memory',
  subtitle: '不绑定任何 AI 工具的个人记忆层：WorkBuddy、CodeBuddy、Claude Code、Codex 共读一份。',
  principle: '克制',
  role: '独立设计与实现',
  team: 1,
  start: '2026-10',
  end: '2026-11',
  state: '自用中',
  summary:
    '每个 AI 工具都在维护自己的「记忆」，彼此割裂、互相冲突，还会无节制地塞满上下文。personal-memory 把记忆从工具里拿出来，变成一份我拥有的、有预算、有审批、可审计的文件。',
  problem: `我同时用四个 AI 工具。2026 年 6 月我先写过一份《AI 跨对话记忆管理》，用三层文件把人设、偏好、踩坑经验沉淀成可加载的文档。那套方案解决了「每次新对话从零教一遍」，随后露出三个新问题：

- 同一条偏好，在 A 里是新的，在 B 里是旧的；
- 工具自动写入的「记忆」，我不知道它写了什么，也无法审；
- 记忆越多，召回越多，通用提问也被塞进业务背景。

真正缺的是三样东西：所有权、预算、审批。

- 记忆放在工具自己的目录里，换工具就丢，工具改版就可能重写；
- 没有硬预算，召回会随记忆增长一直膨胀，直到挤掉当前任务真正需要的内容；
- 没有写入门禁，AI 的推断、临时情绪、Agent 自述都会混进「我是谁」。

所以这份记忆归我所有，不绑定任何 AI 工具。WorkBuddy、CodeBuddy、Claude Code、Codex 接入时都读同一份；工具专属的东西（人设、Skill 安装位置）留在各工具自己的目录。`,
  decisions: [
    {
      title: '五层两级，权重绑定目录，冲突最终由本人裁决',
      why: '记忆的稳定性不同。identity 与 principles 是 W1，长期成立；preferences W2、knowledge/skills W3、context W4、experiences 与 learnings W5，越往后越容易变。权重和目录绑定，不写进每个文件，改裁决顺序时不用改几十条记忆。冲突时高权重优先；同一层内新事实覆盖旧事实要走 replace-confirmed 留痕并扫描残留。归类有六条判据处理灰色地带：价值判断进 principles，步骤清单进 skills；有日期的事件进 experiences，无时间绑定的方法进 skills。升级也有门槛：同一规律在 experiences 出现 ≥2 次才提炼进 skills，被反复调用且稳定才候选升 principles，两次都要本人确认。无论权重高低，最终裁决权在本人；AI 发现 W1 原则和当前做法冲突时提出来，不替我改。',
    },
    {
      title: '召回有硬预算：8000 字符，分层配额，放不下就报错',
      why: '预算是对上下文污染的硬约束，不是调优参数。pack 默认只装当前有效记录（active、未被替代、在有效期内），BASELINE 优先，其余按 W1→W5 和调用方给出的相关性排序。除基线外最多 6 个片段，分通道上限 W1=3、W2=3、W3=2、W4=3、W5=1；required 也受限。放不下时明确报错，再用 path#标题 缩小范围，不在半句、代码块或表格中间截断，也不静默丢掉关键规则。字符数不是 token 数，模型配置、系统提示和索引不计入这个上限，所以不能拿预算当上下文总注入量报数。通用提问走 --general，只装 BASELINE 的协作偏好段，不带任何业务目录，从机制上避免「问 Python 装饰器却收到笔笔省背景」。',
    },
    {
      title: '写入分级授权：AI 可以提议，不能改写「我是谁」',
      why: '2026-10-18 定下分级。只有向已有 active 的 context/projects 或 context/relationships 追加新事实原文时可以自动落库，且必须带用户原话或已核验文档原文及可定位出处，不能夹带推断、不修改规则。原则、偏好、指标口径、身份、冲突替代、归纳提炼、删除、归档、新建文件，以及没有原文的候选，一律默认 needs_decision，给出依据和排除理由等我确认。写入前先把原文、定位符、SHA256 和判定持久化到审计日志，再回读校验；原始审计含个人内容，默认只留本机、不推远程。本库保留更好版本的我：临时情绪、猜测、Agent 自述不进入事实自动写通道。',
    },
    {
      title: '观测不足以支撑结构改动时，不加层',
      why: '2026-11-04 要不要单独建 procedural 层，我选了不加。ACCESS_LOG 才开始观测两周，无法证明「规则漏执行」是真问题；改结构不等于改效果。当前 preferences/workflow 的协作规则与 knowledge/skills 的方法清单已经是程序性记忆的载体，不新增一级目录、不改权重与召回配额。若将来要做机械校验，先给 workflow 文件加 trigger / action / verification 字段，跑 30 天真实命中数据，再评估是否升级成独立目录。',
    },
    {
      title: '先证伪，再决定是否加重检索',
      why: '2026-11-06 同输入实测：手工 pack 按 W1→W5 分配 8000 字符，会把 W5 的高相关笔记挤掉；改用 compile 保留 BM25 顺序后，若同时传入全套手工 --select，预算仍被显式选择器占满，同样会漏，甚至挤掉显式选择器。结论是问题出在预算分配，不在检索能力。因此不上向量库、不加重排；自动召回用中文二元词元 / 英文词元 + BM25，简单 query 默认最多 3 个候选，对比 / 变化 / 历史 / 原因 / 复盘类复杂 query 最多 5 个。等真实遗漏证明有必要，再加重检索。',
    },
    {
      title: '观测与有效性分开，未观测不写成零',
      why: '访问回执（ack）由宿主读完包后主动上报，pack 本身只组包、不记访问。日志从本版起收集，不伪造以前的读取次数；没有记录只代表未观测，单列，不推断成「没用」或「过期」。ack 也不能技术证明模型理解了内容。命中强度只做体检排序提示，不参与 pack 的选择顺序，避免「用得多」被当成「事实正确」。W1/W2 不按闲置降权；有效性复核独立进行，context 的 timestamp 超过 90 天仍提醒核对，带截止日的事项到期要回源确认。',
    },
  ],
  contributions: [
    '设计五层两级的记忆模型与权重规则。',
    '实现召回打包、编译、访问回执与写入门禁的运行时脚本。',
    '实现长任务状态记录（NOTES / HISTORY），支持跨会话续做。',
    '建立回归测试，持续迭代约一个月。',
  ],
  outcomes: [
    '四个 AI 工具共读同一份记忆。',
    '回归测试 53 项全部通过（提交记录）。',
    '约 36 次提交，2026-10-03 至 11-04 持续迭代。',
  ],
  metrics: [
    { value: '8,000', label: '字符召回硬预算' },
    { value: '4', label: '个 AI 工具共读一份记忆' },
    { value: '53', label: '项回归测试全绿' },
    { value: 'W1–W5', label: '五级权重裁决冲突' },
  ],
  stack: ['Markdown + frontmatter', 'Python', 'BM25'],
  tags: ['记忆', '上下文工程', '人在回路', '工具无关'],
  links: [{ label: '源码包（脱敏摘录）', url: '/downloads/personal-memory-source.zip' }],
  notes: [
    {
      title: '设计来源：从三层文件到五层两级',
      body: `2026-06 的《AI 跨对话记忆管理》给出三个起点，至今仍在：

- **三类记忆不许混**：偏好教 AI 怎么做事，Skill 教它执行某个动作，Memory 只记事实。流程和偏好塞错地方，会让记忆臃肿、触发逻辑变玄学。
- **写明何时加载**：frontmatter 里写清 read_when，用 USER.md 与 SOUL.md 双保险保证启动必读。
- **通用问题不带业务背景**：上下文调度规则先判业务专有名词，再判代词延续，最后才决定是否注入业务上下文。

现在这版继承了三条，替换了载体。read_when 变成 description + tags 的召回 cue 门禁，写记忆前先回答「未来会被怎么搜到」；双保险变成 README / BASELINE / INDEX 三个入口与按任务信号的调用判据；三层文件扩成五层两级，并补上预算、生命周期与写入分级。变的是结构，没变的是「记忆要能被找到，也要能被审」。

来源：历史存档/自媒体输出_markdown/AI跨对话记忆管理.md；~/personal-memory/README.md 第 3、5、6、7 节。`,
    },
    {
      title: '四个明确不做的事',
      body: `克制要落到可检查的拒绝清单上，否则只是态度：

| 不做 | 理由 |
|---|---|
| 不上向量库与重排 | 实测漏召源于预算分配，不在检索能力。加组件会掩盖真问题。 |
| 不新增 procedural 层 | 观测两周不足以证明规则漏执行。改结构不等于改效果。 |
| 不让 AI 自动改写身份与原则 | 推断、临时情绪、Agent 自述混进事实层，会污染「我是谁」。 |
| 不把未观测写成零失败 | 无有效回执时指标为 null；漏报率需人工标注应召回集合，不能当 0。 |

四条都对应 README 里有日期的决定（2026-11-04 与 11-06），不是事后补的总结。`,
    },
  ],
  reflection:
    '做记忆系统，最难的是决定什么不记、什么不召回。这和我在评测集里测「克制」是同一个问题：能力够了以后，判断力体现在拒绝。约一个月的迭代里，我改得最多的不是检索，是预算、写入门禁和「不做」清单。ACCESS_LOG 现在只有两周数据，还不能证明哪些规则真的被用上；先把观测做扎实，再决定要不要动结构。',
}

export const secondBrain: WorkSource = {
  slug: 'second-brain',
  status: 'published',
  featured: false,
  order: 3,
  category: 'infra',
  origin: 'personal',
  title: 'second-brain',
  subtitle: '把收藏夹变成可追溯的 Obsidian 知识库：小红书、知乎、公众号、YouTube、B 站。',
  role: '独立设计与实现',
  team: 1,
  start: '2026-11',
  end: '2026-11',
  state: '自用中',
  summary:
    '收藏了不看；AI 摘要会丢信息、会编造；个人判断和原文混在一起。second-brain 把各平台内容转成本地笔记，原文留底，摘要不覆盖原文，新概念等我确认后才建立双链。',
  problem: `收藏夹是知识的墓地。2026-11 做这套系统时，我先把自己踩过的坑列清楚：

1. 长视频只总结了前半段，后面的论证全丢；
2. 摘要里混进了原文没有的内容，无法分辨哪句是作者说的；
3. 我的批注和原文写在一起，重跑一次就被覆盖。

三个问题指向同一件事：AI 摘要把「原文」「对原文的压缩」「我自己的判断」压成一个产物。产物一旦生成，就没法回答「这句话谁说的」「这段是不是我看完全部内容得出的」，也没法重跑。

还有一层是隐私。收藏内容常含个人信息、私信截图和登录态页面，交给云端转写等于把它交出去。

目标不是做一个摘要器。我要的是一个可以反复重跑、每一步都能回源、原文永远在场的本地笔记库。`,
  decisions: [
    {
      title: '图片和音频只在本机处理',
      why: '收藏内容常含个人信息，云端转写等于把原文交出去。转写用 faster-whisper，中文图片 OCR 走 macOS Vision 原生入口，模型用本地 Ollama，整条链路不出本机。单条收藏默认最多处理 240 分钟，避免一个长视频把整批处理卡死。',
    },
    {
      title: '切片并留底，保证「读到最后一分钟」',
      why: '音频每 10 分钟切一片，逐片续跑；文本每 8000 字按句或转写段切分，保留尾段。原始转写、清洗记录、分段分析、独立合并结果全部留底。清洗单独处理音乐幻觉、乱码、低置信度与重复段。摘要可以重跑，原文不会丢，重跑也不覆盖用户批注。',
    },
    {
      title: '原文、摘要、判断三层分离',
      why: '新概念先进入待确认区，本人勾选后才 promote 并建双链。摘要不得覆盖原文。「与我相关」独立成区块，由 reflect 只读召回 personal-memory 生成，里面是我的联想与关联，不得混入原文摘要，也不得作为原文事实引用。三层分开后，任何一句都能回答出处在哪一层。',
    },
    {
      title: '与 personal-memory 划清边界',
      why: '两个库各管一件事：second-brain 管外部输入留下的证据，personal-memory 管关于我的事实。链接默认进 SecondBrain Vault；reflect 只读召回记忆，不写回；distill 只产出带 source_paths 的 needs_decision 候选，不生成归纳正文，实际写入必须经本人确认并走 curator。把边界写进命令，比写进文档更可靠。',
    },
    {
      title: '五个入口各做一件事',
      why: 'ingest 采集、promote 确认、reflect 关联、distill 提炼、doctor 体检，五个命令分开。每个命令只改自己那一层的产物，任何一步都不会越权重写上一步的结果。模块也按此拆：media / web / ocr / transcribe 负责采集，cleaning / chunking / analyzer 负责加工，vault 负责入库与概念确认，pipeline 只做编排和失败状态。',
    },
  ],
  contributions: [
    '设计 ingest / promote / reflect / distill / doctor 五个命令。',
    '实现转写、OCR、清洗、分析、Vault 写入等 14 个模块。',
    '编写 7 个测试文件。',
  ],
  outcomes: ['Vault 已入库 36 篇原始笔记，含 21 条历史链接。'],
  metrics: [
    { value: '5', label: '个平台来源' },
    { value: '14', label: '个处理模块' },
    { value: '10 min', label: '音频切片粒度，原文全部留底' },
  ],
  stack: ['Python', 'faster-whisper', 'yt-dlp', 'macOS Vision', 'Ollama', 'Obsidian'],
  tags: ['知识管理', '本地优先', '可追溯'],
  links: [{ label: '源码包（脱敏摘录）', url: '/downloads/second-brain-source.zip' }],
  notes: [
    {
      title: '可追溯是设计前提',
      body: `这套系统的设计前提只有一个：任何一句话都能回答「它从哪来」。

为此把一份收藏拆成三层，落盘时物理分开：

1. **原文层**：原始转写、OCR 结果、分段文本。只读，不覆盖。
2. **加工层**：清洗记录、逐段分析、独立合并的摘要。可以重跑，重跑结果另存。
3. **判断层**：我的批注、待确认概念、「与我相关」区块。只有这一层由我签字。

三层分开后，AI 补出来的东西落在加工层，不会伪装成原文；我的联想落在判断层，不会伪装成作者观点。重跑只影响加工层，原文层和判断层不动。

来源：~/second-brain/CLAUDE.md「关键约束」；second_brain/CLAUDE.md 模块地图。`,
    },
    {
      title: '两个库为什么不合在一起',
      body: `常见的做法是让知识库顺手更新「用户画像」。我没这么做。

second-brain 存的是别人写的东西和我对它们的反应，personal-memory 存的是关于我的事实。前者每天新增几十条、会过时、可能错；后者要稳定、要审批、要能被追问「这条谁确认的」。把两者合并，等于让一篇笔记的摘要有机会改写「我是谁」。

所以链路是单向的：知识库 → 候选 → 本人确认 → 记忆库。反过来只允许只读召回。reflect 读记忆生成「与我相关」区块，distill 产出候选，两条命令都不写记忆库。

来源：~/second-brain/CLAUDE.md 第 22 行；~/personal-memory/README.md 第 7 节写流程。`,
    },
  ],
  reflection:
    '这套系统最容易做错的地方，是让 AI 替我把收藏「变成知识」。它其实只能变成候选。真正值钱的是原文一直在、切片留底、我的判断单独签字。做完之后我更确定一件事：个人知识库和个人记忆库必须分开，一个管证据，一个管身份。',
}
