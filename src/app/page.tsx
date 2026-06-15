import { ITEMS, getTotalCommands } from "@/lib/data";
import HomeClient from "@/components/HomeClient";

export default function HomePage() {
  return <HomeClient items={ITEMS} totalCommands={getTotalCommands()} />;
}
