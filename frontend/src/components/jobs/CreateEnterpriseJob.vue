<template>
  <q-dialog v-model="show">
    <q-card style="width: 900px">
      <q-card-section>
        <div class="text-h6">Crear Trabajo</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-form @submit.prevent="handleCreate">
          <q-input
            placeholder="Descripcion del trabajo"
            v-model="data.description"
            required
            label="no resize arrow"
            type="textarea"
          />

          <div
            v-for="(error, index) in error_create?.description"
            :key="index"
            class="q-mt-sm"
          >
            <span class="q-pa-xs bg-negative text-white">
              {{ error }}
            </span>
          </div>

          <q-checkbox
            v-model="data.is_check_enterprise"
            label="Confirmarcion"
          />

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
          </div>
          <q-btn
            label="Registrar Trabajo"
            class="q-mt-md"
            type="submit"
            color="primary"
          />
        </q-form>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          label="Cerrar"
          color="primary"
          v-close-popup
          @click="show = false"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-btn class="q-mx-sm bg-green-4" @click="show = true">
    Registrar Trabajo
  </q-btn>
</template>

<script>
import { reactive, ref } from "vue";
import { useCreateEnterpriseJob } from "src/hooks/api/jobs.hooks";
import { useUserStore } from "src/store/user.store";

export default {
  setup(props, { emit }) {
    const userStore = useUserStore();

    const show = ref(false);
    const users = ref(null);

    const user = userStore.getUser;

    const data = reactive({
      description: null,
      is_check_enterprise: true,
      in_datetime: null,
      out_datetime: null,
    });

    const error_create = ref(null);

    const handleClose = () => {
      data.description = null;
      data.is_check_enterprise = true;
      data.in_datetime = null;
      data.out_datetime = null;
      show.value = false;

      emit("refetch");
    };

    const handleCreate = async () => {
      const { isError, error } = await useCreateEnterpriseJob(
        user.enterprise.slug,
        {
          ...data,
        }
      );

      if (!isError.value) {
        handleClose();
      } else {
        error_create.value = error.value;
      }
    };

    return {
      data,
      handleCreate,
      show,
      users,
      error_create,
    };
  },
};
</script>
