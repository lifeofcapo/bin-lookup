# Vue

Works the same in Vue 3 Composition API — wrap the call in a `computed()`:

```vue
<script setup lang="ts">
import { ref, computed } from "vue";
import { lookup } from "@lifeofcapo/bin-lookup";

const value = ref("");

const result = computed(() => {
  const digits = value.value.replace(/\D/g, "");
  return digits.length >= 6 ? lookup(value.value) : null;
});
</script>

<template>
  <input v-model="value" />
  <p v-if="result">
    {{ result.scheme ?? "unknown" }} · {{ result.bank ?? "unknown bank" }}
  </p>
</template>
```

## Options API

```vue
<script>
import { lookup } from "@lifeofcapo/bin-lookup";

export default {
  data() {
    return { value: "" };
  },
  computed: {
    result() {
      const digits = this.value.replace(/\D/g, "");
      return digits.length >= 6 ? lookup(this.value) : null;
    },
  },
};
</script>
```

`lookup()` is a pure, synchronous function — it does not depend on Vue at
all, so there is nothing Vue-specific to configure (no plugin, no
`app.use(...)`).
