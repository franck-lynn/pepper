// restful 接口上传文件
import Router from '@koa/router'
// import formidable from 'formidable'
import path from 'path'
import multer from "@koa/multer"

const uploadFileRouter = new Router()

const storage = multer.diskStorage({
    // destination 保存到哪个地方, 保存的路径
    destination: function(req, file, callback) {
        const savePath = path.join(__dirname, '../images')
        // file ---> { fieldname: 'file', // 文件域名
        //  originalname: '1uiyiy.jpg', // 原始文件名
        //  encoding: '7bit',
        // 是描述消息内容类型的因特网标准, 
        // 有很多类型 https://www.w3school.com.cn/media/media_mimeref.asp
        //  mimetype: 'image/png' 
        // }
        callback(null, savePath)
    },
    // filename: 保存到那个路径下的文件名
    filename: function(req, file, callback) {
        // const extname = path.extname(file.originalname)
        callback(null, file.originalname)
    }
})
const limits = {
    fields: 10,
    fileSize: 512 * 1024, // 单位 bit, 500字节转kb 要除以 8 = 64 kb
    files: 1
}
// multer 还可以设置过滤名称, 参加 multer 说明文档
// https://github.com/expressjs/multer/blob/master/doc/README-zh-cn.md
// 磁盘上必须有 storage 中指定的路径, 不然报错
const upload = multer({ storage, limits })


const uploadFile = async (ctx, next) => {
    // 捕捉错误并进行处理 https://blog.csdn.net/weixin_30505751/article/details/101312343
    //! 用 multer 处理 cropper.js 文件上传时的域为 file, 而不是自定义的 name = avatar 字段
    let err = await upload.single('file')(ctx, next).then(res => res).catch(err => err)
    // console.log("打印出错误----> ", err)
    if (err) {
        ctx.body = { code: 0, msg: err.message + " (fileSize < 64kb)"}
    } else {
        ctx.body = {
            code: 200,
            data: ctx.file
        }
    }
}



/* 
const uploadFile = async (ctx, next) => {
    // 创建 formData 解析对象
    const form = new formidable.IncomingForm()
    form.uploadDir = path.join(__dirname, '../images')
    // 保留后缀名. 默认不保留文件后缀名
    form.keepExtensions = true
    // 解析客户端传过来的 formData 对象
    await new Promise((resolve, reject) => {
        form.parse(ctx.req, (err, fields, files) => {
            if (err) {
                reject(err)
                return
            }
            ctx.set('Content-Type', 'application/json')
            ctx.status = 200
            ctx.state = { status: 200, fields, files }
            console.log("准备返回给客户端的数据 1 ---> ", ctx.status)
            console.log("准备返回给客户端的数据 2 ---> ", fields)
            console.log("准备返回给客户端的数据 3 ---> ", files)
            // console.log("准备返回给客户端的数据----> ", JSON.stringify(ctx.state, null, 2))
            ctx.body = JSON.stringify(ctx.state, null, 2)
            resolve()
        })
    })
    await next()
    return
}
 */
uploadFileRouter.post('/upload-file', uploadFile)

export { uploadFileRouter }