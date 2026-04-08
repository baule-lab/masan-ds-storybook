/**
 * Sidebar variant section of ConfigDrawer — Inset / Floating / Sidebar radio group
 */
import { Root as Radio } from '@radix-ui/react-radio-group';
import { IconSidebarFloating } from '../config-drawer-icons/icon-sidebar-floating';
import { IconSidebarInset } from '../config-drawer-icons/icon-sidebar-inset';
import { IconSidebarSidebar } from '../config-drawer-icons/icon-sidebar-sidebar';
import { useLayoutSettings } from '../../../context/layout-settings-provider';
import { SectionTitle, RadioGroupItem } from './config-drawer-shared';
import type { Variant } from '../../../context/layout-settings-provider';

const SIDEBAR_OPTIONS = [
  { value: 'inset', label: 'Inset', icon: IconSidebarInset },
  { value: 'floating', label: 'Floating', icon: IconSidebarFloating },
  { value: 'sidebar', label: 'Sidebar', icon: IconSidebarSidebar },
] as const;

export function ConfigDrawerSidebar() {
  const { defaultVariant, variant, setVariant } = useLayoutSettings();

  return (
    <div className="max-md:hidden">
      <SectionTitle
        title="Sidebar Style"
        showReset={defaultVariant !== variant}
        onReset={() => setVariant(defaultVariant)}
      />
      <Radio
        value={variant}
        onValueChange={(v) => setVariant(v as Variant)}
        className="grid w-full max-w-md grid-cols-3 gap-4"
        aria-label="Select sidebar style"
        aria-describedby="sidebar-description"
      >
        {SIDEBAR_OPTIONS.map((item) => (
          <RadioGroupItem key={item.value} item={item} />
        ))}
      </Radio>
      <div id="sidebar-description" className="sr-only">
        Choose the sidebar layout style
      </div>
    </div>
  );
}
