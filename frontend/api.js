import { ref } from "vue";

export const getJobs = async () => {
  const isLoading = ref(true);
  const data = ref(null);

  await fetch("http://localhost:8000/api/v1/guard/")
    .then((response) => {
      return response.json();
    })
    .then((res) => {
      isLoading.value = false;
      data.value = res.data;
    })
    .catch((err) => {
      console.error(err);
    });

  return { isLoading, data };
};

export const setOutDateTime = async (out_datetime_confirm) => {
  const isLoading = ref(true);
  const data = ref(null);

  await fetch("http://localhost:8000/api/v1/guard/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ out_datetime_confirm }),
  })
    .then((response) => {
      return response.json();
    })
    .then((res) => {
      isLoading.value = false;
      data.value = res.data;
    })
    .catch((err) => {
      console.error(err);
    });

  return { isLoading, data };
};

export const setInDateTime = async (in_datetime_confirm) => {
  const isLoading = ref(true);
  const data = ref(null);

  await fetch("http://localhost:8000/api/v1/guard/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ in_datetime_confirm }),
  })
    .then((response) => {
      return response.json();
    })
    .then((res) => {
      isLoading.value = false;
      data.value = res.data;
    })
    .catch((err) => {
      console.error(err);
    });

  return { isLoading, data };
};
