/**
 * Layout mode section of ConfigDrawer — Default / Compact / Full radio group
 * Controls sidebar open/collapsible state via useSidebar + useLayoutSettings
 */
import { Root as Radio } from '@radix-ui/react-radio-group';
import { IconLayoutCompact } from '../config-drawer-icons/icon-layout-compact';
import { IconLayoutDefault } from '../config-drawer-icons/icon-layout-default';
import { IconLayoutFull } from '../config-drawer-icons/icon-layout-full';
import { useLayoutSettings } from '../../../context/layout-settings-provider';
import { useSidebar } from '../../ui/display/sidebar/index';
import { SectionTitle, RadioGroupItem } from './config-drawer-shared';
import type { Collapsible } from '../../../context/layout-settings-provider';

const LAYOUT_OPTIONS = [
  { value: 'default', label: 'Default', icon: IconLayoutDefault },
  { value: 'icon', label: 'Compact', icon: IconLayoutCompact },
  { value: 'offcanvas', label: 'Full', icon: IconLayoutFull },
] as const;

export function ConfigDrawerLayout() {
  const { open, setOpen } = useSidebar();
  const { defaultCollapsible, collapsible, setCollapsible } = useLayoutSettings();

  const radioState = open ? 'default' : collapsible;

  const handleChange = (v: string) => {
    if (v === 'default') {
      setOpen(true);
      return;
    }
    setOpen(false);
    setCollapsible(v as Collapsible);
  };

  const handleReset = () => {
    setOpen(true);
    setCollapsible(defaultCollapsible);
  };

  return (
    <div className="max-md:hidden">
      <SectionTitle title="Layout" showReset={radioState !== 'default'} onReset={handleReset} />
      <Radio
        value={radioState}
        onValueChange={handleChange}
        className="grid w-full max-w-md grid-cols-3 gap-4"
        aria-label="Select layout style"
        aria-describedby="layout-description"
      >
        {LAYOUT_OPTIONS.map((item) => (
          <RadioGroupItem key={item.value} item={item} />
        ))}
      </Radio>
      <div id="layout-description" className="sr-only">
        Choose the sidebar layout mode
      </div>
    </div>
  );
}
