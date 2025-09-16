import { ref } from "vue";
import { invoke } from "@tauri-apps/api/core";

export type Credentials = {
  label: string;
  url: string;
  client_id: string;
  client_secret: string;
};

function ensureClient() {
  if (import.meta.server) {
    throw new Error(
      "useCredentials must be used on the client (Tauri runtime)."
    );
  }
}

function isTauriRuntime(): boolean {
  return typeof window !== "undefined" && !!(window as any).__TAURI_INTERNALS__;
}

function formatErr(e: unknown): string {
  if (e instanceof Error) return e.message;
  try {
    return JSON.stringify(e);
  } catch {
    return String(e);
  }
}

export function useCredentials(options?: { autoLoad?: boolean }) {
  ensureClient();
  if (!isTauriRuntime()) {
    console.warn(
      "Tauri runtime not detected. Commands will fail if invoked in the browser."
    );
  }

  const list = ref<Credentials[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function loadAll(): Promise<Credentials[]> {
    ensureClient();
    loading.value = true;
    error.value = null;
    try {
      const items = await invoke<Credentials[]>("load_all_credentials");
      list.value = items;
      return items;
    } catch (e) {
      error.value = formatErr(e);
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function load(label: string): Promise<Credentials> {
    ensureClient();
    error.value = null;
    try {
      const creds = await invoke<Credentials>("load_credentials", { label });
      return creds;
    } catch (e) {
      error.value = formatErr(e);
      throw e;
    }
  }

  async function save(data: Credentials): Promise<void> {
    ensureClient();
    error.value = null;
    try {
      await invoke("save_credentials", {
        label: data.label,
        url: data.url,
        client_id: data.client_id,
        client_secret: data.client_secret,
      });
      // keep the local cache fresh
      await loadAll();
    } catch (e) {
      error.value = formatErr(e);
      throw e;
    }
  }

  if (options?.autoLoad) {
    loadAll().catch(() => {});
  }

  return {
    // state
    list,
    loading,
    error,
    // actions
    save,
    load,
    loadAll,
  };
}
