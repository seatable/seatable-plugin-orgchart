export { }

declare module "*.scss";
declare global {
    interface Window {
        dtablePluginConfig: any // 👈️ turn off type checking,
        app: any
    }
}