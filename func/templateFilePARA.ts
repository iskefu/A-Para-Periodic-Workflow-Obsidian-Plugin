/* eslint-disable no-var */

// 初始化para文件夹和文件模板
export var PROJECT_TEMPLATE = `---
Areas:
tags:
 - project
---



## Plan
\`\`\`ad-note
title: 项目计划&&流程图
\`\`\`






## Notes
\`\`\`ad-note
title:项目包含的笔记
\`\`\`
\`\`\`dataviewjs

// 定义文件夹路径，这里需要你指定具体文件夹
let folderPath = dv.current().file.folder;

// 构建Markdown表格头
let headers = ["文件", "创建日期", "位置"]

// 检索指定文件夹下（包括子文件夹）的所有笔记
let files = dv.pages(\`"\${folderPath}"\`)
    .sort(p => p.file.folder, 'asc');//排序条件：文件夹

// 生成表格数据
let tableData = files.map(p => [
    p.file.link, //有连接的文件名
    p.created, //文档frontmatter属性created
    p.file.path.substring(0, p.file.path.lastIndexOf('/')).split('/').pop() //文件所在文件夹
]);

// 生成Markdown格式表格
let table = dv.markdownTable(headers, tableData);

// 渲染Markdown表格
dv.paragraph(table);
\`\`\`




`;
export var AREA_TEMPLATE = `---
Areas:
tags:
  - area
---

\`\`\`ad-note
title:领域简介、目标和规划。
\`\`\`


\`\`\`ad-important
title:  Active Projects
\`\`\`

\`\`\`dataviewjs

// 定义文件夹路径，这里需要你指定具体文件夹
let folderPath = "1-Projects";

// 构建Markdown表格头
let headers = ["本领域项目ING", "开始日期"]

// 检索指定文件夹下（包括子文件夹）的所有笔记
let files = dv.pages(\`"\${folderPath}"\`)
  .where(p => p.tags && p.tags.includes('project') && p.Areas && p.Areas == dv.current().Areas) // 只选择包含"project"标签的页面  并且这些页面的Areas属性和本文件一样
   .sort(p=>p.created, 'asc') // 按照创建时间进行排序 

// 生成表格数据
let tableData = files.map(p => [
    p.file.link, //有连接的文件名
    p.created, //文档frontmatter属性created
]);

// 生成Markdown格式表格
let table = dv.markdownTable(headers, tableData);

// 渲染Markdown表格
dv.paragraph(table);
\`\`\`


\`\`\`ad-done
title: Archived Projects
\`\`\`
\`\`\`dataviewjs

// 定义文件夹路径，这里需要你指定具体文件夹
let folderPath = "4-Archives";

// 构建Markdown表格头
let headers = ["本领域项目ED", "开始日期","结项时间"]

// 检索指定文件夹下（包括子文件夹）的所有笔记
let files = dv.pages(\`"\${folderPath}"\`)
   .where(p => p.tags && p.tags.includes('project')&& p.Areas&& p.Areas==dv.current().Areas) // 只选择包含"project"标签的页面  并且这些页面的Areas属性和本文件一样
   .sort(p=>p.created, 'asc') // 按照创建时间进行排序 

// 生成表格数据
let tableData = files.map(p => [
    p.file.link, //有连接的文件名
    p.created, //文档frontmatter属性created
    p.file.mday
]);

// 生成Markdown格式表格
let table = dv.markdownTable(headers, tableData);

// 渲染Markdown表格
dv.paragraph(table);
\`\`\`

\`\`\`ad-note
title: Resources
\`\`\`

\`\`\`dataviewjs
// 定义文件夹路径，这里需要你指定具体文件夹
let folderPath = "3-Resources";

// 构建Markdown表格头
let headers = ["本领域相关资源", "开始日期"]

// 检索指定文件夹下（包括子文件夹）的所有笔记
let files = dv.pages(\`"\${folderPath}"\`)
   .where(p => p.tags && p.tags.includes('resource')&& p.Areas&& p.Areas==dv.current().Areas) // 只选择包含"project"标签的页面  并且这些页面的Areas属性和本文件一样
   .sort(p=>p.created, 'asc') // 按照创建时间进行排序 

// 生成表格数据
let tableData = files.map(p => [
    p.file.link, //有连接的文件名
    p.created, //文档frontmatter属性created

]);

// 生成Markdown格式表格
let table = dv.markdownTable(headers, tableData);

// 渲染Markdown表格
dv.paragraph(table);
\`\`\`


`;
export var RESOURCE_TEMPLATE = `---
tags:
 - resource
---

## Plan
\`\`\`ad-note
title: 项目计划&&流程图
\`\`\`


## Notes
\`\`\`ad-note
title:项目包含的笔记
\`\`\`
\`\`\`dataviewjs

// 定义文件夹路径，这里需要你指定具体文件夹
let folderPath = dv.current().file.folder;

// 构建Markdown表格头
let headers = ["文件", "创建日期", "位置"]

// 检索指定文件夹下（包括子文件夹）的所有笔记
let files = dv.pages(\`"\${folderPath}"\`)
    .sort(p => p.file.folder, 'asc');//排序条件：文件夹

// 生成表格数据
let tableData = files.map(p => [
    p.file.link, //有连接的文件名
    p.created, //文档frontmatter属性created
    p.file.path.substring(0, p.file.path.lastIndexOf('/')).split('/').pop() //文件所在文件夹
]);

// 生成Markdown格式表格
let table = dv.markdownTable(headers, tableData);

// 渲染Markdown表格
dv.paragraph(table);
\`\`\`
`;

export var FOLDER_KANBAN = `


# \`$=dv.current().file.name\` 

> [!info]
>
\`\`\`dataviewjs
let folder = dv.current().file.folder

dv.table([folder,"最近更新时间"],
		 dv.pages('"'+folder+'"')
		.where(p=>p.file.name === p.file.path.split('/').slice(-2, -1)[0] )
		.sort(p=>p.created, 'asc')
		.map(p=>[p.file.link,p.file.mtime.toFormat("yyyy-MM-dd:HH:mm")])
)
\`\`\`

`;