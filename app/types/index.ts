import type { Component } from "vue";

export type Credentials = {
  id: string;
  label: string;
  url: string;
  clientId: string;
  clientSecret: string;
};

export type ConnectionItem = {
  id: string;
  title: string;
  url: string;
  icon: any;
  connected: boolean;
};
