// 一次导入所有的文件
const files = require.context('@/components/test', true, /\.vue$/)
// const files = require.context('@/components', true, /\.vue$/)

export {files}