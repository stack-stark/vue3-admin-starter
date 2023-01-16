import { defineStore} from 'pinia'

export const useUserStore = defineStore('user',{
  state:() => {
      return {
        token: '',
        userData: {} as UserInfoType
      }
  },
  persist: {
    enabled: true , // 这个配置代表存储生效，而且是整个store都存储
  },
  getters:{

  },
  actions:{
    setToken(token: string) {
      this.token = token
    },
    setUserinfo(data: UserInfoType) {
      this.userData = data
    },
    clearToken() {
      this.token = ''
    }
  }
})