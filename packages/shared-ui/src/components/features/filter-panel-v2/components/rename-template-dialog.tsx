import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '../../../ui/overlays/dialog';
import { Button } from '../../../ui/actions/button';
import { Input } from '../../../ui/forms/input';
import { Label } from '../../../ui/display/label';
import { useFilterPanelLocaleV2 } from '../i18n';

interface RenameTemplateDialogPropsV2 {
  open: boolean;
  initialName: string;
  onClose: () => void;
  onRename: (name: string) => void;
}

export function RenameTemplateDialog({
  open,
  initialName,
  onClose,
  onRename,
}: RenameTemplateDialogPropsV2) {
  const locale = useFilterPanelLocaleV2();
  const [name, setName] = useState(initialName);

  // Sync input with initialName whenever dialog opens
  useEffect(() => {
    if (open) setName(initialName);
  }, [open, initialName]);

  const handleRename = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onRename(trimmed);
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{locale.renameDialogTitle}</DialogTitle>
          <DialogDescription render={<div />} />
        </DialogHeader>

        <div className="space-y-2 py-2">
          <Label htmlFor="rename-template-name">{locale.templateNameLabel}</Label>
          <Input
            id="rename-template-name"
            placeholder={locale.templateNamePlaceholder}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleRename()}
            maxLength={255}
            autoFocus
          />
        </div>

        <DialogFooter>
          <DialogClose
            render={
              <Button variant="ghost" onClick={handleClose}>
                {locale.cancelLabel}
              </Button>
            }
          />
          <Button onClick={handleRename} disabled={!name.trim() || name.trim().length > 255}>
            {locale.renameLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
