<template>
  <div class="row items-center q-mt-xl">
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
  <div class="flex justify-between q-mb-md items-center">
    <h4 class="text-h4 q-my-none">Documentos :</h4>
    <add-document :entity="entity" :params="params" @refetch="refetch" />
  </div>
  <div style="width: 100%" v-if="!isLoading">
    <q-markup-table flat bordered>
      <thead class="bg-teal text-white">
        <tr>
          <th class="text-left">Título</th>
          <th class="text-left">Vencimiento</th>
          <th class="text-right">Autorización</th>
          <th class="text-right">Acciones</th>
        </tr>
      </thead>
      <tbody
        :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
        v-for="document in documents"
        :key="document.id"
      >
        <document-item
          :entity="entity"
          :params="params"
          :document="document"
          @refetch="refetch"
        />
      </tbody>
    </q-markup-table>
    <Pagination
      :currentPage="paginate.current_page"
      :maxPages="paginate.last_page"
      @handleRefetchPage="handleRefetchPage"
    />
  </div>
</template>

<script>
import { handleToggleFetchDocuments } from "src/hooks/api/documents.hooks";
import Pagination from "../helpers/Pagination.vue";
import AddDocument from "./AddDocument.vue";
import { ref, watch } from "vue";
import DocumentItem from "./DocumentItem.vue";
import { useAutoRefetch } from "../../hooks/api/autorefetchs.hooks";

export default {
  components: {
    Pagination,
    AddDocument,
    DocumentItem,
  },
  props: {
    entity: {
      type: String,
      required: true,
    },
    params: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const { documents, paginate, isLoading, refetch } =
      handleToggleFetchDocuments(props.entity, props.params);

    const page = ref(null);
    const search = ref(null);

    watch(search, () => {
      refetch({ search: search.value });
    });

    const handleRefetchPage = (p) => {
      page.value = p
      refetch({ page: p, search: search.value });
    };

    useAutoRefetch(()=>refetch({page: page.value, search: search.value}))
  
    return {
      handleRefetchPage,
      documents,
      paginate,
      isLoading,
      refetch,
      search,
    };
  },
};
</script>
