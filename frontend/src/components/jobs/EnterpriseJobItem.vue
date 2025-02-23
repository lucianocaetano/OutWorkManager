<template>
  <tr>
    <td class="text-left">{{ job.enterprise }}</td>
    <td class="text-left">{{ job.description.slice(0, 40) }}...</td>
    <td class="text-right">{{ job.in_datetime }}</td>
    <td class="text-right">
      {{ job.in_datetime_confirm ? job.in_datetime_confirm : "no confirmado" }}
    </td>
    <td class="text-right">{{ job.out_datetime }}</td>
    <td class="text-right">
      {{
        job.out_datetime_confirm ? job.out_datetime_confirm : "no confirmado"
      }}
    </td>
    <td class="text-right">
      <q-avatar
        v-if="job.is_check"
        icon="mdi-check"
        class="bg-green text-h4 text-white"
      />
      <q-avatar v-else icon="mdi-close" class="bg-red text-h4 text-white" />
    </td>
    <td class="text-center">
      <q-checkbox v-model="check" @click="handleToggleCheck" />
    </td>
    <td class="text-center">
      <q-btn class="text-md" @click="handleOutClick">
        <q-icon name="arrow_forward" size="20px" />
      </q-btn>
    </td>
  </tr>
</template>

<script>
import { ref } from "vue";
import { useUpdateEnterpriseJob } from "src/hooks/api/jobs.hooks";
import { useRouter } from "vue-router";
import { useUserStore } from "src/store/user.store";

export default {
  props: {
    job: {
      type: Object,
      required: true,
    },
  },
  setup(props, { emit }) {
    const userStore = useUserStore();
    const router = useRouter();

    const user = userStore.getUser;

    const check = ref(props.job.is_check_enterprise);

    const handleToggleCheck = async () => {
      await useUpdateEnterpriseJob(user.enterprise.slug, props.job.id, {
        is_check_enterprise: check.value,
      });
    };

    const handleOutClick = () =>
      router.push({
        name: "enterprise-job-detail",
        params: { pk: props.job.id },
      });

    return { check, handleToggleCheck, handleOutClick };
  },
};
</script>
