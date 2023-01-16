<template>
    <div>
        <a-layout-header class="layhe">
            <div class="title">{{breadTitle}}</div>
            <portal-target name="starget" />
        </a-layout-header>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
export default defineComponent({
    name: "Bread",
    setup() {
      const router = useRoute();
      const breadTitle = ref(router.name)
      watch(() => router.path,(newPath, oldPath) => {
        breadTitle.value = router.name
	    },{ immediate: true });
      return {
        breadTitle
      };
    },
});
</script>

<style lang="less" scoped>
.layhe {
    background: #fff;
    padding: 0 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title {
        font-size: 20px;
        font-family: MicrosoftYaHei, MicrosoftYaHei-Bold;
        font-weight: 700;
        text-align: left;
        color: rgba(2, 14, 26, 0.85);
    }
}
</style>