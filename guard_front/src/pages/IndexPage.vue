<template>
  <q-page>
    <div class="q-mx-auto q-px-xl">
      <div class="row items-center q-mt-lg q-px-sm q-mb-sm" style="width: 100%">
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

      <q-markup-table
        style="height: 600px; overflow-x: scroll"
        v-if="!isLoading"
      >
        <q-tr>
          <q-th>Nombre Empresa</q-th>
          <q-th class="break-word">Trabajo a realizar</q-th>
          <q-th class="text-center">Fecha de Entrada</q-th>
          <q-th class="text-center">Fecha de Salida</q-th>
          <q-th class="text-center">Confirmación-Entrada</q-th>
          <q-th class="text-center">Confirmación-Salida</q-th>
        </q-tr>

        <q-tr
          v-for="(actividad, index) in actividadesFiltradas"
          :key="index"
          :class="{ 'bg-grey-4': index % 2 === 0 }"
        >
          <q-td>{{ actividad.enterprise }}</q-td>
          <q-td class="break-word">{{ actividad.description }}</q-td>
          <q-td class="text-center">
            {{ actividad.in_datetime }}
            <q-btn
              v-if="!actividad.in_datetime_confirm"
              color="green"
              @click="marcarHoraActualEntrada(index, actividad.id)"
              class="q-mx-md"
              >Confirmar</q-btn
            >
            <q-btn
              v-if="actividad.in_datetime_confirm"
              color="red"
              @click="resetearEntrada(index, actividad.id)"
              class="q-mx-md"
              >Cancelar</q-btn
            >
          </q-td>
          <q-td class="text-center">
            {{ actividad.out_datetime }}
            <q-btn
              v-if="
                actividad.in_datetime_confirm && !actividad.out_datetime_confirm
              "
              color="green"
              @click="marcarHoraActualSalida(index, actividad.id)"
              class="q-mx-md"
              >Salió</q-btn
            >
            <q-btn
              v-if="actividad.out_datetime_confirm"
              color="red"
              @click="resetearSalida(index, actividad.id)"
              class="q-mx-md"
              >Cancelar</q-btn
            >
          </q-td>
          <q-td class="text-center">
            <div v-if="actividad.in_datetime_confirm">
              Confirmado: {{ actividad.in_datetime_confirm }}
            </div>
          </q-td>
          <q-td class="text-center">
            <div v-if="actividad.out_datetime_confirm">
              Confirmado: {{ actividad.out_datetime_confirm }}
            </div>
          </q-td>
        </q-tr>
      </q-markup-table>
      <Pagination
        v-if="!isLoading"
        :currentPage="paginate.current_page"
        :maxPages="paginate.last_page"
        @handleRefetchPage="handleRefetchPage"
      />
    </div>
  </q-page>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { getJobs, updateJob } from "../api/guard.api";
import Pagination from "src/components/helpers/Pagination.vue";

const { paginate, data: actividades, isLoading, refetch } = getJobs();
const actividadesFiltradas = computed(() => actividades.value);

const search = ref("");
const page = ref("");

const handleRefetchPage = (p) => {
  page.value = p;
  refetch({ page: p, search: search.value });
};

watch(search, () => {
  refetch({
    search: search.value,
  });
});

async function marcarHoraActualEntrada(index, pk) {
  const ahora = new Date()
    .toLocaleString("sv-SE", { hour12: false })
    .slice(0, 16);

  actividades.value[index].in_datetime_confirm = ahora;

  await updateJob(pk, {
    in_datetime_confirm: ahora,
  });
}

async function marcarHoraActualSalida(index, pk) {
  const ahora = new Date()
    .toLocaleString("sv-SE", { hour12: false })
    .slice(0, 16);

  actividades.value[index].out_datetime_confirm = ahora;

  await updateJob(pk, {
    out_datetime_confirm: ahora,
  });
}

async function resetearEntrada(index, pk) {
  actividades.value[index].in_datetime_confirm = "";
  if (actividades.value[index].out_datetime_confirm) {
    actividades.value[index].out_datetime_confirm = "";

    await updateJob(pk, {
      out_datetime_confirm: null,
    });
  }
  await updateJob(pk, {
    int_datetime_confirm: null,
  });
}

async function resetearSalida(index, pk) {
  actividades.value[index].out_datetime_confirm = "";
  await updateJob(pk, {
    out_datetime_confirm: null,
  });
}
</script>

<style scoped>
.break-word {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
