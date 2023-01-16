<template>
    <div>
        <WorkHeader />
        <a-layout style=" background: #fff">
            <a-layout-sider :trigger="null" collapsible style="background: #fff" v-model:collapsed="collapsed">
                <SuMenu />
            </a-layout-sider>
            <a-layout>
                <Bread />
                <portal-target name="searchBar" ref="searchBarRef" />
                <a-layout-content
                    :style="{ margin: '16px', padding: '24px 32px', background: '#fff', minHeight: '280px' }"
                >
                    <router-view></router-view>
                </a-layout-content>
            </a-layout>
        </a-layout>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import WorkHeader from "./header.vue";
import SuMenu from "./sumenu.vue";
import Bread from "./bread.vue";

export default defineComponent({
    name: "Workbench",
    components: {
        WorkHeader,
        SuMenu,
        Bread,
    },
    setup() {
      const searchBarRef = ref()
        return {
            collapsed: ref<boolean>(false),
            searchBarRef,
        };
    },
});
</script>

<style scoped>
.trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
}

.trigger:hover {
    color: #1890ff;
}

.ant-layout-content {
    margin: 16px;
}

.site-layout .site-layout-background {
    background: #fff;
}
.ant-layout-sider {
    height: calc(100vh - 54px);
}
</style>