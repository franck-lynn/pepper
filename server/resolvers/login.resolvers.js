const loginResolver = {
    Mutation: {
        // login 改由 restful 路由进行处理
        login: async (_, { email, password }, context) => {
            console.log("打印出邮箱和密码---> ", email, password)
            const token = "Barer sdfskjfsdhfjksfhsjf"
            // context.headers.authorization = token
            // console.log("打印出邮箱和密码---> ", context.headers.authorization)
            context.currentUser = 'zm'
            console.log("打印出当前用户---> ", context.currentUser)
            return { token }
        }, 
        
    }
}

export default loginResolver