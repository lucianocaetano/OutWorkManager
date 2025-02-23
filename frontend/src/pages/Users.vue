<template>
  <h2 class="q-mt-md q-mb-sm text-center">Usuarios</h2>
  <div class="flex justify-center">
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
  </div>

  <div class="full-width flex justify-center">
    <div>
      <CreateUser @refetch="refetch" />

      <q-btn-dropdown
        color="#000000"
        :label="role === null ? 'Todos' : role"
        text-color="#000000"
      >
        <q-list>
          <q-item clickable v-close-popup @click="role = null">
            <q-item-section>
              <q-item-label>Todos</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup @click="role = 'Admin'">
            <q-item-section>
              <q-item-label>Admins</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup @click="role = 'Enterprise'">
            <q-item-section>
              <q-item-label>Empresarios</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup @click="role = 'Guard'">
            <q-item-section>
              <q-item-label>Guardias</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </div>
  </div>
  <div class="q-pa-md">
    <q-markup-table style="height: 500px; overflow-y: scroll">
      <thead>
        <tr>
          <th class="text-left">Name</th>
          <th class="text-right">Email</th>
          <th class="text-right">Rol</th>
          <th class="text-right">Actions</th>
        </tr>
      </thead>
      <tbody v-if="!isLoading">
        <UserItem
          v-for="user in users"
          :key="user.id"
          :user="user"
          @refetch="refetch"
        />
      </tbody>
    </q-markup-table>

    <Pagination
      v-if="!isLoading"
      :currentPage="paginate.current_page"
      :maxPages="paginate.last_page"
      @handleRefetchPage="handleRefetchPage"
    />
  </div>
</template>

<script>
import { ref, watch } from "vue";
import CreateUser from "src/components/users/CreateUser.vue";
import Pagination from "src/components/helpers/Pagination.vue";
import UserItem from "src/components/users/UserItem.vue";
import { useUsers } from "src/hooks/api/users.hooks.js";
import { useAutoRefetch } from "../hooks/api/autorefetchs.hooks";

export default {
  components: {
    UserItem,
    CreateUser,
    Pagination,
    UserItem,
  },
  setup() {
    const { isLoading, refetch, users, paginate } = useUsers();

    const search = ref("");
    const page = ref("");
    const role = ref(null);

    watch([role, search], () => {
      refetch({
        role: role.value,
        search: search.value,
      });
    });

    const handleRefetchPage = (p) => {
      page.value = p
      refetch({ role: role.value, page: p, search: search.value });
    };

    useAutoRefetch(async () => await refetch({ role: role.value, page: page.value, search: search.value }));

    return {
      refetch,
      users,
      role,
      paginate,
      handleRefetchPage,
      isLoading,
      search,
    };
  },
};
</script>
