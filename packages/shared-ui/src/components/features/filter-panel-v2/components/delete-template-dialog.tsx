import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../ui/overlays/alert-dialog';
import { Button } from '../../../ui/actions/button';
import { useFilterPanelLocaleV2 } from '../i18n';

interface DeleteTemplateDialogPropsV2 {
  open: boolean;
  templateName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteTemplateDialog({
  open,
  templateName,
  onClose,
  onConfirm,
}: DeleteTemplateDialogPropsV2) {
  const locale = useFilterPanelLocaleV2();
  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader className="text-start">
          <AlertDialogTitle>{locale.deleteDialogTitle}</AlertDialogTitle>
          <AlertDialogDescription>
            {locale.deleteDialogDescription(templateName)}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>{locale.cancelLabel}</AlertDialogCancel>
          <Button variant="destructive" onClick={onConfirm}>
            {locale.deleteLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
