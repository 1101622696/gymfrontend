<template>

  <div id="#app">
  </div>
  <router-view></router-view>
</template> 

<script>
import { ref } from 'vue'

export default {
  setup () {
    const leftDrawerOpen = ref(false)

    return {
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
}
</script>

<style scoped>
.bg-primary {
  background-color: bisque;
}

.text-white {
  color: white;
}
</style>
*/






