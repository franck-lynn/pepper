
## graphql 浏览器中
```
// 查询窗口输入如下:
mutation($avatarUrl: String!) {
  updateAvatar(avatarUrl: $avatarUrl)
}

// 参数窗口输入如下:
{
  "avatarUrl": "aaa"
}
```

## rest-client 插件中
```
POST http://localhost:3000/graphql HTTP/1.1
Content-Type: application/json
X-Request-Type: GraphQL

mutation($avatarUrl: String!) {
  updateAvatar(avatarUrl: $avatarUrl)
}

{
    "avatarUrl": "aaa" # 变量输入
}
```

## 在 vue 文件中提交到服务器
```
// 定义:
import { apolloClient } from '../../apollo-client'
import { gql } from '@apollo/client/core'

const mutation = gql `
    mutation ($avatarUrl: String!) {
        updateAvatar(avatarUrl: $avatarUrl)
    }
`
// 变量以参数的形式传入
const updateAvatar = async (variables) => {
    const msg = await apolloClient.mutate({ mutation, variables })
    return msg
}

export { updateAvatar }
// 使用: 
 const handleUpdateAvatar = async() => {
    //TODO: 处理保存按钮的点击, 交由 graphql 服务器处理
    console.log("处理保存按钮的点击", user.avatar)
    const variables = {
        avatarUrl: user.avatar
    }
    await updateAvatar(variables)
}
```