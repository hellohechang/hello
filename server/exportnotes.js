const { queryData } = require('./utils/sqlite');
const { _mkdir, _writeFile, formatDate, delDir } = require('./utils/utils');
(async () => {
  const url = 'https://hechang.me';
  const notes = await queryData(
    'note',
    '*',
    `WHERE state=? AND account=? AND share=?`,
    ['0', 'root', 'y']
  );
  await delDir('./dist').then(()=>{}).catch(()=>{});
  await _mkdir('./dist');
  let num = 0;
  for (let i = 0; i < notes.length; i++) {
    const { id, data, name, time, utime } = notes[i];
    if (id === 'about') {
      continue;
    }

    const t = formatDate({
      template: '{0}-{1}-{2}',
      timestamp: time,
    });
    const str = `---\ntitle: "${name}"\ndate: ${t}\nupdate: ${
      utime
        ? formatDate({
            template: '{0}-{1}-{2}',
            timestamp: utime,
          })
        : t
    }\n---\n${data.replace(
      /\/api\/picture/gi,
      `${url}/api/picture`
    )}\n\n\n[@作者](${url}/?c=root)`;
    await _writeFile(`./dist/${id}.md`, str);
    num++;
    console.log(num);
  }
})();
// ---
// title:  // 文件名称
// description:  // 文档描述
// date: "2023-01-25T10:23:31.210Z" // 发布日期
// update: 2023-03-23 // 最后更新日期
// tags:   // 文档标签支持数组和字符串
//   - 诗词
// category: 诗词  // 文档分类支持数组和字符串
// sticky: 100  // 文档置顶权重，数字越大，权重越大
// slug: poem/ci // 文档永久链接
// mathjax: false // 是否开启公式显示
// draft: false    // 是否为草稿
// toc: true   // 是否需要文章快速跳转链接
// donate: false   // 是否需要开启赞助功能
// comment: false  // 是狗需要开启评论功能
// ---
