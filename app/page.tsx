import { I18nProvider } from "./lib/i18n";
import { ThemeProvider } from "./lib/theme";
import HomeClient from "./HomeClient";

export default function Home() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <HomeClient />
      </I18nProvider>
    </ThemeProvider>
  );
}
