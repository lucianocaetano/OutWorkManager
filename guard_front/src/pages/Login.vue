<template>
  <div class="login row justify-center">
    <div class="login_image col-12 col-md-5 row justify-center items-center">
      <q-card class="card_login row justify-center items-center">
        <q-card-section>
          <q-form @submit="onSubmit" @reset="onReset" class="w-xl">
            <div class="q-pa-md q-gutter-sm">
              <h4 class="text-h4 text-center text-white">Login</h4>
            </div>
            <div class="">
              <q-input
                filled
                required
                v-model="email"
                type="email"
                placeholder="Correo"
                :dense="dense"
              >
                <template v-slot:append>
                  <q-icon name="mail" />
                </template>
              </q-input>

              <q-input
                filled
                required
                v-model="password"
                :type="isPwd ? 'password' : 'text'"
                placeholder="Contraseña"
                :dense="dense"
                style="padding-top: 10px"
              >
                <template v-slot:append>
                  <q-icon name="mdi-lock-outline" />
                </template>
              </q-input>
            </div>

            <div v-if="isError">
              <div class="q-mt-sm">
                <span class="q-pa-xs bg-negative text-white">
                  {{ error }}
                </span>
              </div>
            </div>

            <div class="flex flex-end">
              <q-btn
                label="Entrar"
                type="submit"
                color="light-blue-14"
                class="q-mt-md"
                style="width: 100%"
                @click.prevent="send"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
    <div class="image col-0 d-none d-md-block col-md-7"></div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useUserStore } from "../store/user.store";
import { useRouter } from "vue-router";
import { api } from "src/boot/axios";

export default {
  setup() {
    const router = useRouter();
    const userStore = useUserStore();

    const ph = ref("");
    const dense = ref(false);
    const licence = ref(false);
    const text = ref("");

    const email = ref("");
    const password = ref("");
    const isPwd = ref(true);

    const isError = ref(false);
    const error = ref(null);

    const send = async () => {
      api
        .post("auth/login", {
          email: email.value,
          password: password.value,
        })
        .then(function (response) {
          userStore.setAuth(true);
          userStore.setToken(response.data.access_token);
          userStore.setUser({
            ...response.data.user,
            enterprise: response.data.enterprise,
          });

          if (response.data.user.rol === "Guard") {
            router.push("/");
          }
        })
        .catch((err) => {
          console.error(err);
          if (err.response.status === 400) {
            const messages = err.response.data.error;
            isError.value = true;
            error.value = messages;
          }
        });
    };

    return {
      ph,
      dense,
      licence,
      text,
      email,
      password,
      isPwd,
      send,
      isError,
      error,
    };
  },
};
</script>

<style scoped>
.login {
  height: 100vh;
  width: inherit;
  background-color: rgb(255, 255, 255);
  position: fixed;
  left: 0;
  z-index: 1;
}
.login_image {
  background-image: linear-gradient(
      rgba(18, 68, 139, 0.5),
      rgba(18, 68, 139, 0.5)
    ),
    url("/imagenes/Fondo2.jpeg");
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  height: 100%;
}
.card_login {
  width: 100%;
  max-width: 500px;
  height: 100%;
  max-height: 500px;
  margin: 0 10px;
  backdrop-filter: blur(40px);
  background-color: rgba(255, 255, 255, 0.3);
  box-shadow: 3px 3px 5px rgba(151, 175, 209, 0.5);
  border-radius: 5%;
}
.image {
  background-image: url("/imagenes/Fondo1.jpeg");
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  height: 100%;
}
</style>
