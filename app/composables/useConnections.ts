import { storeToRefs } from "pinia";
import { useConnectionsStore } from "@/stores/connections";

export function useConnections() {
  const store = useConnectionsStore();
  const { all, connected, disconnected } = storeToRefs(store);

  return {
    all,
    connected,
    disconnected,
    setConnections: store.setConnections,
    connect: store.connect,
    disconnect: store.disconnect,
    toggleConnection: store.toggleConnection,
  };
}
