/**
 * Theme section of ConfigDrawer — System / Light / Dark radio group
 */
import { Root as Radio } from '@radix-ui/react-radio-group';
import { IconThemeDark } from '../config-drawer-icons/icon-theme-dark';
import { IconThemeLight } from '../config-drawer-icons/icon-theme-light';
import { IconThemeSystem } from '../config-drawer-icons/icon-theme-system';
import { useTheme } from '../../../context/theme-provider';
import { SectionTitle, RadioGroupItem } from './config-drawer-shared';

const THEME_OPTIONS = [
  { value: 'system', label: 'System', icon: IconThemeSystem },
  { value: 'light', label: 'Light', icon: IconThemeLight },
  { value: 'dark', label: 'Dark', icon: IconThemeDark },
] as const;

export function ConfigDrawerTheme() {
  const { defaultTheme, theme, setTheme } = useTheme();

  return (
    <div>
      <SectionTitle
        title="Theme"
        showReset={theme !== defaultTheme}
        onReset={() => setTheme(defaultTheme)}
      />
      <Radio
        value={theme}
        onValueChange={(v) => setTheme(v as 'light' | 'dark' | 'system')}
        className="grid w-full max-w-md grid-cols-3 gap-4"
        aria-label="Select theme"
        aria-describedby="theme-description"
      >
        {THEME_OPTIONS.map((item) => (
          <RadioGroupItem key={item.value} item={item} isTheme />
        ))}
      </Radio>
      <div id="theme-description" className="sr-only">
        Choose between system, light, or dark theme
      </div>
    </div>
  );
}
