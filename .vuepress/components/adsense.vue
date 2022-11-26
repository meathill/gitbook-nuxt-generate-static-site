<template>
  <ins :key="currentPath" class="adsbygoogle"
       style="display:block; text-align:center;"
       data-ad-layout="in-article"
       data-ad-format="fluid"
       data-ad-client="ca-pub-9946806099979342"
       data-ad-slot="9676925958" />
</template>

<script setup>
import {ref, onMounted} from "vue";

const currentPath = ref(location.href);
onMounted(() => {
  window.adsbygoogle = window.adsbygoogle || [];
  window.adsbygoogle.push({});
});
</script>
