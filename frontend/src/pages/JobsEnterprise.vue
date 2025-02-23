<template>
  <div class="q-pa-md">
    <h2 class="q-mt-md q-mb-sm text-center">Trabajos</h2>
    <div class="row items-center" style="width: 100%">
      <q-input
        style="width: 100%"
        filled
        class="col"
        v-model="search"
        label="Busqueda"
      >
        <template v-slot:prepend>
          <q-btn flat round dense class="icono_de_busqueda" icon="search" />
        </template>
      </q-input>
    </div>
    <div class="q-my-lg w-full flex justify-center items-center">
      <CreateJob @refetch="() => refetch({ valid: true })" />

      <q-btn-dropdown
        color="#000000"
        :label="
          filter === null
            ? 'Todos'
            : filter === true
            ? 'Confirmados'
            : 'No Confirmados'
        "
        text-color="#000000"
      >
        <q-list>
          <q-item clickable v-close-popup @click="filter = null">
            <q-item-section>
              <q-item-label>Todos</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup @click="filter = true">
            <q-item-section>
              <q-item-label>Confirmados</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup @click="filter = false">
            <q-item-section>
              <q-item-label>No Confirmados</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </div>
    <q-markup-table
      style="height: 500px; overflow-y: scroll"
      class="shadow-none rounded-none"
    >
      <thead class="bg-teal-5" style="position: sticky; top: 0; z-index: 1">
        <tr>
          <th class="text-left">Empresa</th>
          <th class="text-left">Trabajo</th>
          <th class="text-right">Hora entrada</th>
          <th class="text-right">Hora entrada confirmada</th>
          <th class="text-right">Hora salida</th>
          <th class="text-right">Hora salida confirmada</th>
          <th class="text-right">Confirmación</th>
          <th class="text-right">Confirmación de la empresa</th>
          <th class="text-right">+Más Información</th>
        </tr>
      </thead>
      <tbody v-if="!isLoading">
        <job-item v-for="job in jobs" :key="job.id" :job="job" />
      </tbody>
    </q-markup-table>
  </div>
  <Pagination
    v-if="!isLoading"
    :currentPage="paginate.current_page"
    :maxPages="paginate.last_page"
    @handleRefetchPage="handleRefetchPage"
  />
</template>

<script>
import { useEnterpriseJobs } from "src/hooks/api/jobs.hooks";
import { ref, watch } from "vue";
import JobItem from "src/components/jobs/EnterpriseJobItem.vue";
import Pagination from "src/components/helpers/Pagination.vue";
import CreateJob from "src/components/jobs/CreateEnterpriseJob.vue";
import { useUserStore } from "src/store/user.store";
import { useAutoRefetch } from "../hooks/api/autorefetchs.hooks";

export default {
  components: { JobItem, Pagination, CreateJob },
  setup() {
    const userStore = useUserStore();
    const user = userStore.getUser;

    const { isLoading, jobs, refetch, paginate } = useEnterpriseJobs(
      user.enterprise.slug,
      { valid: true }
    );

    const filter = ref(null);
    const page = ref(null);
    const search = ref(null);

    watch([filter, search], () => {
      refetch({
        search: search.value,
        confirm: filter.value,
        valid: true,
      });
    });

    const handleRefetchPage = (p) => {
      page.value = p;
      refetch({
        filter: filter.value,
        search: search.value,
        page: page.value,
        valid: true,
      });
    };

    useAutoRefetch(() =>
      refetch({
        search: search.value,
        confirm: filter.value,
        valid: true,
      })
    );

    return {
      isLoading,
      jobs,
      paginate,
      refetch,
      search,
      filter,
      handleRefetchPage,
    };
  },
};
</script>
