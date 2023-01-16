# Vue 3 Starter Based on TypeScript + Vite + pinia + and vue  

# pinia使用示例
## 1.store下新建对应文件。eg: user.ts
``` ts
import { defineStore} from 'pinia'

export const useUserStore = defineStore('user',{
  state:() => {
      return {
        token: '123',
      }
  },
  getters:{

  },
  persist: {
    enabled: true , // 这个配置代表存储生效，而且是整个store都存储
  },
  actions:{
    setToken(token: string) {
      this.token = token
    },
    clearToken() {
      this.token = ''
    }
  }
})
```
## 2.使用
``` ts
import { useUserStore } from '@/store/user'
const userStore = useUserStore()
userStore.token //取值

userStore.setToken('xxx') //赋值
```
## pinia中文文档
https://pinia.web3doc.top/introduction.html

# 环境变量声明和取值

## 声明
环境变量写在env文件夹下对应文件内
.env.dev
``` js
VITE_BUILD=DEV
VITE_BASEURL=https://dev-tp-api.xht-kyy.com
```
## 取值
``` ts
const runtimeConfig = useRuntimeConfig()
const envData = runtimeConfig.public.envData
// envData 包含env.dev声明的值
```
# http请求 

``` ts
import { http } from '@/utils/http';

http.post('/mall/brandAndProject', { institution: null }).then((res) => {
  console.log(res);
})
```

