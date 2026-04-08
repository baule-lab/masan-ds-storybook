import { useState } from 'react';
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

interface SaveTemplateDialogPropsV2 {
  open: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
}

export function SaveTemplateDialog({ open, onClose, onSave }: SaveTemplateDialogPropsV2) {
  const locale = useFilterPanelLocaleV2();
  const [name, setName] = useState('');

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onSave(trimmed);
    setName('');
  };

  const handleClose = () => {
    setName('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{locale.saveDialogTitle}</DialogTitle>
          <DialogDescription render={<div />}>{locale.saveDialogDescription}</DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-2">
          <Label htmlFor="template-name">{locale.templateNameLabel}</Label>
          <Input
            id="template-name"
            placeholder={locale.templateNamePlaceholder}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
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
          <Button onClick={handleSave} disabled={!name.trim() || name.trim().length > 255}>
            {locale.saveLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
