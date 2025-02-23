import { ref } from "vue";
import { api } from "src/boot/axios";

export const useEnterpriseJobs = (enterprise, params = {}) => {
  const isLoading = ref(true);
  const jobs = ref(null);
  const paginate = ref(null);

  const refetch = (params = {}) => {
    api
      .get(`enterprises/${enterprise}/jobs`, {
        params,
      })
      .then((response) => {
        isLoading.value = false;
        jobs.value = response.data.jobs;
        paginate.value = response.data.meta;
      });
  };

  api
    .get(`enterprises/${enterprise}/jobs`, {params})
    .then((response) => {
      isLoading.value = false;
      jobs.value = response.data.jobs;
      paginate.value = response.data.meta;
    });

  return {
    jobs,
    paginate,
    isLoading,
    refetch,
  };
};

export const useJobs = (params = { valid: true }) => {
  const filter = ref(params);
  const isLoading = ref(true);
  const jobs = ref(null);
  const paginate = ref(null);

  const refetch = (params = {}) => {
    filter.value = params
    api
      .get("jobs", {
        params,
      })
      .then((response) => {
        isLoading.value = false;
        jobs.value = response.data.jobs;
        paginate.value = response.data.meta;
      });"The route api/v1/enterprise/odell-kreiger-iii-6761ff4c6370f/jobs/6 could not be found."
  };

  api
    .get("jobs", {
      params,
    })
    .then((response) => {
      isLoading.value = false;
      jobs.value = response.data.jobs;
      paginate.value = response.data.meta;
    });

  return {
    jobs,
    paginate,
    isLoading,
    refetch,
  };
};

export const useEnterpriseJob = (enterprise, pk) => {
  const isLoading = ref(true);
  const job = ref(null);

  const refetch = (params = {}) => {
    api
      .get(`jobs/${pk}`, {
        params,
      })
      .then((response) => {
        isLoading.value = false;
        job.value = response.data.job;
      });
  };

  api
    .get(`enterprises/${enterprise}/jobs/${pk}`)
    .then((response) => {
      isLoading.value = false;
      job.value = response.data.job;
    });

  return {
    job,
    isLoading,
    refetch,
  };
};

export const useJob = (pk) => {
  const isLoading = ref(true);
  const job = ref(null);

  const refetch = (params = {}) => {
    api
      .get(`jobs/${pk}`, {
        params,
      })
      .then((response) => {
        isLoading.value = false;
        job.value = response.data.job;
      });
  };

  api
    .get(`jobs/${pk}`)
    .then((response) => {
      isLoading.value = false;
      job.value = response.data.job;
    });

  return {
    job,
    isLoading,
    refetch,
  };
};

export const useUpdateEnterpriseJob = async (enterprise, pk, data) => {
  const job = ref(null);
  const isError = ref(false);
  const error = ref(null);

  await api
    .put(`enterprises/${enterprise}/jobs/${pk}`, data, {
      headers: { "Content-Type": "content-type:application/json" },
    })
    .then((response) => {
      if (response.status === 200) {
        job.value = response.data.job;
      }
    })
    .catch((err) => {
      if (err?.response?.status === 422) {
        console.log(err)
        const messages = err.response.data.errors;
        isError.value = true;
        error.value = messages;
      }
    });

  return {
    job,
    isError,
    error,
  };
};


export const useUpdateJob = async (pk, data) => {
  const job = ref(null);
  const isError = ref(false);
  const error = ref(null);

  await api
    .put(`jobs/${pk}`, data, {
      headers: { "Content-Type": "content-type:application/json" },
    })
    .then((response) => {
      if (response.status === 200) {
        job.value = response.data.job;
      }
    })
    .catch((err) => {
      if (err?.response?.status === 422) {
        const messages = err.response.data.errors;
        isError.value = true;
        error.value = messages;
      }
    });

  return {
    job,
    isError,
    error,
  };
};

export const useCreateEnterpriseJob = async (enterprise, data) => {
  const job = ref(null);
  const isError = ref(false);
  const error = ref(null);

  await api
    .post(`enterprises/${enterprise}/jobs`, data, {
      headers: { "Content-Type": "content-type:application/json" },
    })
    .then((response) => {
      if (response.status === 200) {
        job.value = response.data.job;
      }
    })
    .catch((err) => {
      console.log(err)
      if (err?.response?.status === 422) {
        const messages = err.response.data.errors;
        isError.value = true;
        error.value = messages;
      }
    });

  return {
    job,
    isError,
    error,
  };
};
export const useCreateJob = async (data) => {
  const job = ref(null);
  const isError = ref(false);
  const error = ref(null);

  await api
    .post("jobs", data, {
      headers: { "Content-Type": "content-type:application/json" },
    })
    .then((response) => {
      if (response.status === 200) {
        job.value = response.data.job;
      }
    })
    .catch((err) => {
      if (err?.response?.status === 422) {
        const messages = err.response.data.errors;
        isError.value = true;
        error.value = messages;
      }
    });

  return {
    job,
    isError,
    error,
  };
};

export const useDeleteJob = async (pk) => {
  return await api.delete(`jobs/${pk}`);
};

export const useDeleteEnterpriseJob = async (enterprise, pk) => {
  return await api.delete(`enterprises/${enterprise}/jobs/${pk}`);
};
