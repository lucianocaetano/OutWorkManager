import { api } from "src/boot/axios";
import { ref } from "vue";

export const getJobs = () => {
  const isLoading = ref(true);
  const data = ref(null);
  const paginate = ref(null);

  const refetch = (params = {}) => {
    api
      .get("/guard/", {
        params,
      })
      .then((res) => {
        data.value = res.data.jobs;
        paginate.value = res.data.meta;
      })
      .catch((err) => {
        console.error(err);
      });
  };

  api
    .get("/guard/")
    .then((res) => {
      isLoading.value = false;
      data.value = res.data.jobs;
      paginate.value = res.data.meta;
    })
    .catch((err) => {
      console.error(err);
    });

  return { isLoading, data, refetch, paginate };
};

export const updateJob = async (pk, data) => {
  const job = ref(null);

  await api
    .put(`/guard/${pk}`, data)
    .then((res) => {
      data.value = res.data.jobs;
    })
    .catch((err) => {
      console.error(err);
    });

  return { job };
};
