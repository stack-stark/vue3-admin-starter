<template>
  <div>
     <a-menu v-model:selectedKeys="selectedKeys"  mode="inline" @click="selectedMenu">
        <template v-for="item in menuList" :key="item.path">
          <a-menu-item>
           <span> <i class="iconfont" :class="item.icon"></i></span><span style="margin-left: 5px;">{{item.name}}</span>
          </a-menu-item>
        </template>
      </a-menu>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { menuList } from "@/common/menu";
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'SuMenu',
  setup () {
    const router = useRouter();
    const selectedKeys = ref<string[]>([router.currentRoute.value.path])
    const selectedMenu = (item: any) => {
      router.push({ path: item.key })
    }
    return {
      menuList,
      selectedMenu,
      selectedKeys,
    }
  }
})
</script>

<style scoped>

</style>