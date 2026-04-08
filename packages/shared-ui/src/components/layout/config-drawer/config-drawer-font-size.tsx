/**
 * Font size section of ConfigDrawer — slider from 10px to 18px
 */
import { Slider } from '../../ui/forms/slider/index';
import { useLayoutSettings } from '../../../context/layout-settings-provider';
import { SectionTitle } from './config-drawer-shared';

export function ConfigDrawerFontSize() {
  const { defaultFontSize, fontSize, setFontSize } = useLayoutSettings();

  return (
    <div>
      <SectionTitle
        title="Font Size"
        showReset={fontSize !== defaultFontSize}
        onReset={() => setFontSize(defaultFontSize)}
      />
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Current</span>
          <span className="font-semibold text-sm">{fontSize}px</span>
        </div>
        <Slider
          value={[fontSize]}
          onValueChange={([value]) => setFontSize(value ?? fontSize)}
          min={10}
          max={18}
          step={1}
          aria-label="Adjust font size"
          aria-valuenow={fontSize}
          aria-valuemin={10}
          aria-valuemax={18}
          className="w-full"
        />
        <div className="flex justify-between text-muted-foreground text-xs">
          <span>10px</span>
          <span>14px</span>
          <span>18px</span>
        </div>
      </div>
    </div>
  );
}
