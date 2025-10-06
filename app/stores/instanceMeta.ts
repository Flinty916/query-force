import { defineStore } from "pinia";

export const useInstanceMetaStore = defineStore("instanceMeta", {
  state: () =>
    <{ bearer: string | null; sobjects: any | null }>{
      bearer: null,
      sobjects: null,
    },

  getters: {
    bearer: (state) => state.bearer,
    sobjects: (state) => state.sobjects,
  },

  actions: {
    setBearer(token: string) {
      this.bearer = token;
    },

    setSobjects(sobjects: any) {
      this.sobjects = sobjects;
    },

    purge() {
      this.sobjects = null;
    },
  },
});
