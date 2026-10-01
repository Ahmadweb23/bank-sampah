import { createRouter, createWebHistory } from "vue-router";

import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";

import TransaksiView from "../views/TransaksiView.vue";
import KeuanganView from "../views/KeuanganView.vue";
import RiwayatView from "../views/RiwayatView.vue";
import LaporanView from "../views/LaporanView.vue";
import JualPengepulView from "../views/JualPengepulView.vue";
import TukarPoinView from "../views/TukarPoinView.vue";
import LupaPasswordView from "../views/LupaPasswordView.vue";
import InformasiView from "../views/InformasiView.vue";
import KatalogPengelolaView from "../views/KatalogPengelolaView.vue";
import ProfilPengelolaView from "../views/ProfilPengelolaView.vue";

import LoginWarga from "../views/LoginWarga.vue";
import DashboardWarga from "../views/warga/DashboardWarga.vue";
import KatalogView from "../views/warga/KatalogView.vue";
import TukarPoinSembakoView from "../views/warga/TukarPoinSembakoView.vue";
import SuksesTukarPoinView from "../views/warga/SuksesTukarPoinView.vue";
import RiwayatWargaView from "../views/warga/RiwayatWargaView.vue";

const routes = [
  {
    path: "/",
    redirect: "/login-warga",
  },

  // =====================================================
  // AUTENTIKASI PENGELOLA
  // =====================================================
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/password",
    name: "lupa-password",
    component: LupaPasswordView,
  },

  // =====================================================
  // PORTAL PENGELOLA
  // =====================================================
  {
    path: "/dashboard",
    name: "dashboard",
    component: HomeView,
  },
  {
    path: "/transaksi",
    name: "transaksi",
    redirect: "/dashboard",
  },
  {
    path: "/keuangan",
    name: "keuangan",
    component: KeuanganView,
  },
  {
    path: "/jual",
    name: "jual",
    component: JualPengepulView,
  },
  {
    path: "/tukar",
    name: "tukar",
    component: TukarPoinView,
  },
  {
    path: "/riwayat",
    name: "riwayat",
    component: RiwayatView,
  },
  {
    path: "/laporan",
    name: "laporan",
    component: LaporanView,
  },
  {
    path: "/informasi",
    name: "informasi",
    component: InformasiView,
  },
  {
    path: "/katalog-pengelola",
    name: "katalog-pengelola",
    component: KatalogPengelolaView,
  },
  {
    path: "/profil-pengelola",
    name: "profil-pengelola",
    component: ProfilPengelolaView,
  },

  // =====================================================
  // PORTAL WARGA
  // =====================================================
  {
    path: "/login-warga",
    name: "login-warga",
    component: LoginWarga,
  },
  {
    path: "/warga",
    name: "dashboard-warga",
    component: DashboardWarga,
  },
  {
    path: "/katalog",
    name: "katalog-warga",
    component: KatalogView,
  },
  {
    path: "/tukar-poin-sembako",
    name: "tukar-poin-sembako",
    component: TukarPoinSembakoView,
  },
  {
    path: "/sukses-tukar-poin",
    name: "sukses-tukar-poin",
    component: SuksesTukarPoinView,
  },
  {
    path: "/riwayat-warga",
    name: "riwayat-warga",
    component: RiwayatWargaView,
  },

  // =====================================================
  // PENGUJIAN API
  // =====================================================
  {
    path: "/uji-api",
    name: "uji-api",
    component: () => import("../views/TestApiView.vue"),
  },
];

const isOperatorLoggedIn = () => {
  try {
    return Boolean(localStorage.getItem("operator"));
  } catch (error) {
    return false;
  }
};

const isWargaLoggedIn = () => {
  try {
    return Boolean(localStorage.getItem("warga"));
  } catch (error) {
    return false;
  }
};

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const operatorRoutes = [
    "/dashboard",
    "/transaksi",
    "/keuangan",
    "/jual",
    "/tukar",
    "/tukar-poin-sembako",
    "/riwayat",
    "/laporan",
    "/informasi",
    "/katalog-pengelola",
    "/profil-pengelola",
  ];

  const wargaRoutes = ["/warga", "/katalog", "/riwayat-warga"];

  if (operatorRoutes.includes(to.path) && !isOperatorLoggedIn()) {
    next("/login");
    return;
  }

  if (wargaRoutes.includes(to.path) && !isWargaLoggedIn()) {
    next("/login-warga");
    return;
  }

  if (to.path === "/tukar-poin-sembako" && !isOperatorLoggedIn()) {
    next("/login");
    return;
  }

  next();
});

export default router;
