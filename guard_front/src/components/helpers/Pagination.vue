<template>
  <div class="flex items-center justify-center q-my-md">
    <q-pagination
      v-model="current_page"
      :max="maxPages"
      :min="1"
      :max-pages="5"
      @update:model-value="handleRefetchPage"
      direction-links
      flat
      color="grey"
      active-color="primary"
    />
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  props: {
    currentPage: {
      type: Number,
      required: true,
    },
    maxPages: {
      type: Number,
      required: true,
    },
  },
  setup(props, { emit }) {
    const current_page = ref(props.currentPage);

    const handleRefetchPage = (page) => {
      emit("handleRefetchPage", page);
    };

    return {
      current_page,
      handleRefetchPage,
    };
  },
};
</script>
