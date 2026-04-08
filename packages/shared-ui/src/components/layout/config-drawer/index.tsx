/**
 * ConfigDrawer — settings panel for theme, sidebar, layout, and font size
 * Triggered by a floating Settings button; renders a Sheet overlay
 */
import { Settings } from 'lucide-react';
import { Button } from '../../ui/actions/button/index';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../../ui/overlays/sheet/index';
import { useSidebar } from '../../ui/display/sidebar/index';
import { useTheme } from '../../../context/theme-provider';
import { useLayoutSettings } from '../../../context/layout-settings-provider';
import { ConfigDrawerTheme } from './config-drawer-theme';
import { ConfigDrawerSidebar } from './config-drawer-sidebar';
import { ConfigDrawerLayout } from './config-drawer-layout';
import { ConfigDrawerFontSize } from './config-drawer-font-size';

export function ConfigDrawer() {
  const { setOpen } = useSidebar();
  const { resetTheme } = useTheme();
  const { resetLayout } = useLayoutSettings();

  const handleReset = () => {
    setOpen(true);
    resetTheme();
    resetLayout();
  };

  return (
    <Sheet>
      <SheetTrigger>
        <Button
          size="icon"
          variant="ghost"
          aria-label="Open settings"
          aria-describedby="config-drawer-description"
          className="rounded-full"
        >
          <Settings aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader className="pb-0 text-start">
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription id="config-drawer-description">
            Customize the appearance and layout of the interface
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-6 overflow-y-auto px-4">
          <ConfigDrawerTheme />
          <ConfigDrawerSidebar />
          <ConfigDrawerLayout />
          <ConfigDrawerFontSize />
        </div>
        <SheetFooter className="gap-2">
          <Button variant="destructive" onClick={handleReset} aria-label="Reset all settings">
            Reset
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
