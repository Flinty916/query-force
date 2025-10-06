import { storeToRefs } from "pinia";
import { useConnectionsStore } from "@/stores/connections";

export function useSalesforceAuthentication() {
  const store = useInstanceMetaStore();
  const { bearer } = storeToRefs(store);

  const http = new HTTP(null);

  const authenticate = async (creds: Credentials) => {
    const form = new FormData();
    const credentials = {
      grant_type: "client_credentials",
      client_id: creds.client_id,
      client_secret: creds.client_secret,
    };
    Object.keys(credentials).forEach((key) =>
      form.append(key, credentials[key])
    );
    const { data, error, refresh } = await http.post(
      `${creds.url}/services/oauth2/token`,
      {
        body: form,
      }
    );
    if (error.value) {
      console.error(error.value);
    } else {
      console.log(data.value);
    }
  };

  return {
    bearer,
    authenticate,
  };
}
