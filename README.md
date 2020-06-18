# apollo-server-express 示例

## 安装

cmd 命令行，依次执行命令：

```
npm i
npm run start
npm run start-api
```

## 使用

使用浏览器打开： `http://localhost:4000/ghl`

### Query Schema 1

查询数据。

```
query getUser {
  user(id: 100) {
    id
    name
    branch {
      name
    }
  }
}
```

### Query Schema 2

查询数据列表。

```
query getUserList {
  users(name: "高山") {
    id
    name
    branch {
      name
    }
  }
}
```

### Mutation Schema

写数据。

```
mutation CreateUser {
  addUser(id:300,name:"孙倩",mobile:"18657138900") {
    id
    name
    mobile
  }
}
```

### Subscription Schema

订阅服务器通知。执行该查询后，每次执行 mutation 操作，都会在该窗口接收到新增用户通知。

```
subscription postCreated {
  postAdded {
    id
    name
    mobile
  }
}
```
