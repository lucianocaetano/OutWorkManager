<template>
  <q-dialog v-model="show">
    <q-card style="width: 900px">
      <q-card-section>
        <div class="text-h6">Editar Trabajo</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-form @submit.prevent="handleEdit">
          <q-input
            placeholder="Descripcion del trabajo"
            v-model="job.description"
            required
            label="no resize arrow"
            type="textarea"
          />
          <div
            v-for="(error, index) in error_edit?.description"
            :key="index"
            class="q-mt-sm"
          >
            <span class="q-pa-xs bg-negative text-white">
              {{ error }}
            </span>
          </div>

          <q-checkbox v-model="job.is_check" label="Confirmarcion" />

          <p class="q-mt-md">Horarios:</p>
          <q-input
            v-model="data.in_datetime"
            required
            type="datetime-local"
            label="Entrada"
          />

          <div
            v-for="(error, index) in error_create?.in_datetime"
            :key="index"
            class="q-mt-sm"
          >
            <span class="q-pa-xs bg-negative text-white">
              {{ error }}
            </span>
          </div>

          <q-input
            v-model="data.out_datetime"
            type="datetime-local"
            label="Salida"
            required
          />

          <div
            v-for="(error, index) in error_create?.out_datetime"
            :key="index"
            class="q-mt-sm"
          >
            <span class="q-pa-xs bg-negative text-white">
              {{ error }}
            </span>
          </div>          <q-btn
            label="Editar Trabajo"
            class="q-mt-md"
            type="submit"
            color="primary"
            last_page
          />
        </q-form>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          label="Cerrar"
          color="primary"
          v-close-popup
          @click="handleClose"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-btn class="q-mx-sm bg-green-4" @click="show = true"> Edit </q-btn>
</template>

<script>
import { ref, toRef } from "vue";
import { useUpdateEnterpriseJob } from "src/hooks/api/jobs.hooks";
import { useUserStore } from "src/store/user.store";

export default {
  props: {
    job: {
      type: Object,
      required: true,
    },
  },
  setup(props, { emit }) {
    const job = toRef(props, "job");
    const show = ref(false);

    const error_edit = ref(null);

    const handleClose = () => {
      show.value = false;
      emit("refetch");
    };

    const handleEdit = async () => {
      const userStore = useUserStore();
      const user = userStore.getUser;

      const { isError, error } = await useUpdateEnterpriseJob(
        user.enterprise.slug,
        job.value.id,
        {
          ...job.value,
          in_datetime: job.value.in_datetime.replace("T", " "),
          out_datetime: job.value.out_datetime.replace("T", " "),
        }
      );

      if (!isError.value) {
        handleClose();
      } else {
        error_edit.value = error.value;
      }
    };

    return {
      handleEdit,
      handleClose,
      show,
      error_edit,
    };
  },
};
</script>
