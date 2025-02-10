// axios.d.ts
import "axios";

declare module "axios" {
  export interface AxiosRequestConfig {
    isRetry?: boolean; // Add the custom isRetry property
  }
}
