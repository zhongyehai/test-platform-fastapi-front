<template>
  <projectView :data-type="'appUi'" />
</template>

<script>
import projectView from '@/components/business/project/index.vue'

export default {
  name: 'Project',
  components: {
    projectView
  }
}
</script>

<style scoped>

</style>
