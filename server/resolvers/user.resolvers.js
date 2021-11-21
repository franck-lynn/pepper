import { composeResolvers } from '@graphql-tools/resolvers-composition'
// import { users } from '../db/five-table'
import { isAuthenticated, hasRole } from '../auth'
import { User } from '../model/user'


const userResolver = {
    Query: {
        queryUsers: async () => {
            // return users
            return await User.find()
        },
        queryLoginedUser: async (_, __, ctx) => {
            // 如果要处理中文首字母, 就找这个地址: https://github.com/hotoo/pinyin
            const loginedUser = await User.findById(ctx.currentUser.id)
            // console.log("查询的登录用户是---> ", loginedUser)
            // console.log("查询的登录用户是---> ", loginedUser.name)
            // console.log("查询的登录用户是---> ", loginedUser.avatar)
            return loginedUser
        }
    },

    Mutation: {
        updateAvatar: async (_, { avatarUrl }, ctx) => {
            // 根据登录的用户修改 avatar
            const id = ctx.currentUser.id
            // const updatedUser = await User.findOneAndUpdate( // 使用 findOneAndUpdate 修改文档
            //     {_id: id}, // 查找条件, 返回修改前数据
            //     {
            //         $set: { // 修改字段
            //             avatar: avatarUrl
            //         }
            //     }
            // )
            // https://helpcdn.aliyun.com/document_detail/122019.html?spm=a2c4g.11186623.6.694.3f1735de6wHJG8

            const updatedUser = await User.updateOne( // 使用 updateOne 修改文档
                { _id: id }, // 查找条件, 返回 {n:1, nModified:1}
                {
                    $set: {
                        avatar: avatarUrl
                    }
                }
            )
            if (updatedUser.n === 1) {
                return 'success'
            } else {
                return 'fail'
            }

        }
    }
}


// 组合认证和授权
const resolversComposition = {
    "Query.queryLoginedUser": [isAuthenticated()],
    'Mutation.updateAvatar': [isAuthenticated()]
    // 'Mutation.updateAvatar': [isAuthenticated(), hasRole('EDITOR')]
}
// 组合解析器, 变量名是过去式
const composedResolvers = composeResolvers(userResolver, resolversComposition)

// export default userResolver
export default composedResolvers