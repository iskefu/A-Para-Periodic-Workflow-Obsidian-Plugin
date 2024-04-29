/* eslint-disable no-var */
export var DIARY_TEMPLATE = `---
tags:
  - periodicnote
---

\`\`\`ad-important
title: First Things Dimension
\`\`\`



`;
export var WEEKLY_TEMPLATE = `---
tags:
  - periodicnote
---

\`\`\`ad-summary
title:  立项 
\`\`\`
\`\`\`dataviewjs

let dataformat = 'yyyy年-第W周'
// 定义文件夹路径，这里需要你指定具体文件夹
let folderPath = "1-Projects";

// 构建Markdown表格头
let headers = ["项目ing", "所属领域","开始时间"]

// 检索指定文件夹下（包括子文件夹）的所有笔记
let files = dv.pages()
    .where(p=>p.created&&p.created.toFormat(dataformat)==dv.current().created.toFormat(dataformat) && p.tags && (p.tags.includes('resource') || p.tags.includes('project')))
	 .sort(p=>p.created, 'asc') // 按照创建时间进行排序	

// 生成表格数据
let tableData = files.map(p => [
    p.file.link, //有连接的文件名
    p.Areas,
    p.created.toFormat(dataformat), //文档frontmatter属性created
]);

// 生成Markdown格式表格
let table = dv.markdownTable(headers, tableData);

// 渲染Markdown表格
dv.paragraph(table);

\`\`\`

---

# 复盘,总结,规划

>[!important] 

---

# 笔记

>[!note]
\`\`\`dataviewjs
// 定义文件夹路径，这里需要你指定具体文件夹
let folderPath = "PeriodicNotes";
let dataformat = 'yyyy年-第W周'
dv.table(["笔记","time"],
     dv.pages(\`"\${folderPath}"\`)
    .where(p=>p.file.day.toFormat(dataformat)==dv.current().created.toFormat(dataformat) )
    .sort(p=>p.file.day,'desc')
    .map(p=>[p.file.link,p.created.toFormat(dataformat)])
)

\`\`\`
---


`;
export var MONTHLY_TEMPLATE = `---
tags:
  - periodicnote
---

\`\`\`ad-summary
title:  立项 
\`\`\`
\`\`\`dataviewjs

let dataformat = 'yyyy年-第M个月'
// 定义文件夹路径，这里需要你指定具体文件夹
let folderPath = "1-Projects";

// 构建Markdown表格头
let headers = ["项目ing", "所属领域","开始时间"]

// 检索指定文件夹下（包括子文件夹）的所有笔记
let files = dv.pages()
    .where(p=>p.created&&p.created.toFormat(dataformat)==dv.current().created.toFormat(dataformat) && p.tags && (p.tags.includes('resource') || p.tags.includes('project')))
	 .sort(p=>p.created, 'asc') // 按照创建时间进行排序	

// 生成表格数据
let tableData = files.map(p => [
    p.file.link, //有连接的文件名
    p.Areas,
    p.created.toFormat(dataformat), //文档frontmatter属性created
]);

// 生成Markdown格式表格
let table = dv.markdownTable(headers, tableData);

// 渲染Markdown表格
dv.paragraph(table);

\`\`\`

---

# 复盘,总结,规划

>[!important] 

---

# 笔记

>[!note]
\`\`\`dataviewjs
// 定义文件夹路径，这里需要你指定具体文件夹
let folderPath = "PeriodicNotes";
let dataformat = 'yyyy年-第M个月'
dv.table(["笔记","time"],
     dv.pages(\`"\${folderPath}"\`)
    .where(p=>p.file.day.toFormat(dataformat)==dv.current().created.toFormat(dataformat) )
    .sort(p=>p.file.day,'desc')
    .map(p=>[p.file.link,p.created.toFormat(dataformat)])
)

\`\`\`
---


`;
export var QUARTERLY_TEMPLATE = `---
tags:
  - periodicnote
---

\`\`\`ad-summary
title:  立项 
\`\`\`
\`\`\`dataviewjs

let dataformat = 'yyyy年-Qq季度'
// 定义文件夹路径，这里需要你指定具体文件夹
let folderPath = "1-Projects";

// 构建Markdown表格头
let headers = ["项目ing", "所属领域","开始时间"]

// 检索指定文件夹下（包括子文件夹）的所有笔记
let files = dv.pages()
    .where(p=>p.created&&p.created.toFormat(dataformat)==dv.current().created.toFormat(dataformat) && p.tags && (p.tags.includes('resource') || p.tags.includes('project')))
	 .sort(p=>p.created, 'asc') // 按照创建时间进行排序	

// 生成表格数据
let tableData = files.map(p => [
    p.file.link, //有连接的文件名
    p.Areas,
    p.created.toFormat(dataformat), //文档frontmatter属性created
]);

// 生成Markdown格式表格
let table = dv.markdownTable(headers, tableData);

// 渲染Markdown表格
dv.paragraph(table);

\`\`\`

---

# 复盘,总结,规划

>[!important] 

---

# 笔记

>[!note]
\`\`\`dataviewjs
// 定义文件夹路径，这里需要你指定具体文件夹
let folderPath = "PeriodicNotes";
let dataformat = 'yyyy年-第M个月'
dv.table(["笔记","time"],
     dv.pages(\`"\${folderPath}"\`)
    .where(p=>p.file.day.toFormat(dataformat)==dv.current().created.toFormat(dataformat) )
    .sort(p=>p.file.day,'desc')
    .map(p=>[p.file.link,p.created.toFormat(dataformat)])
)

\`\`\`
---


`;
export var YEARLY_TEMPLATE = `---
tags:
  - periodicnote
---

\`\`\`ad-summary
title:  立项 
\`\`\`
\`\`\`dataviewjs

let dataformat = 'yyyy年'
// 定义文件夹路径，这里需要你指定具体文件夹
let folderPath = "1-Projects";

// 构建Markdown表格头
let headers = ["项目ing", "所属领域","开始时间"]

// 检索指定文件夹下（包括子文件夹）的所有笔记
let files = dv.pages()
    .where(p=>p.created&&p.created.toFormat(dataformat)==dv.current().created.toFormat(dataformat) && p.tags && (p.tags.includes('resource') || p.tags.includes('project')))
	 .sort(p=>p.created, 'asc') // 按照创建时间进行排序	

// 生成表格数据
let tableData = files.map(p => [
    p.file.link, //有连接的文件名
    p.Areas,
    p.created.toFormat(dataformat), //文档frontmatter属性created
]);

// 生成Markdown格式表格
let table = dv.markdownTable(headers, tableData);

// 渲染Markdown表格
dv.paragraph(table);

\`\`\`

---

# 复盘,总结,规划

>[!important] 

---

# 笔记

>[!note]
\`\`\`dataviewjs
// 定义文件夹路径，这里需要你指定具体文件夹
let folderPath = "PeriodicNotes";
let dataformat = 'yyyy年'
dv.table(["笔记","time"],
     dv.pages(\`"\${folderPath}"\`)
    .where(p=>p.file.day.toFormat(dataformat)==dv.current().created.toFormat(dataformat) )
    .sort(p=>p.file.day,'desc')
    .map(p=>[p.file.link,p.created.toFormat(dataformat)])
)

\`\`\`
---


`;