import { defineStore } from "pinia";
import type { ConnectionItem } from "~/types";

export const useConnectionsStore = defineStore("connections", {
  state: () => ({
    items: [] as ConnectionItem[],
  }),

  getters: {
    all: (state) => state.items,
    connected: (state) => state.items.filter((i) => i.connected),
    disconnected: (state) => state.items.filter((i) => !i.connected),
  },

  actions: {
    setConnections(connections: ConnectionItem[]) {
      this.items = connections;
    },

    toggleConnection(id: string) {
      const conn = this.items.find((i) => i.id === id);
      if (conn) conn.connected = !conn.connected;
    },

    connect(id: string) {
      const conn = this.items.find((i) => i.id === id);
      if (conn) conn.connected = true;
    },

    disconnect(id: string) {
      const conn = this.items.find((i) => i.id === id);
      if (conn) conn.connected = false;
    },
  },
});
