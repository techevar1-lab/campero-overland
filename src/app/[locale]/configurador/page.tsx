import { ConfiguratorClient } from "@/components/configurador/ConfiguratorClient";
import { ConfiguratorProvider } from "@/lib/configurator/context";

export default function ConfiguradorPage() {
  return (
    <ConfiguratorProvider>
      <ConfiguratorClient />
    </ConfiguratorProvider>
  );
}
