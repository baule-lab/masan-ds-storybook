import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  GripVertical,
  MoveHorizontal,
  Package2,
  ShoppingCart,
  StretchHorizontal,
  Truck,
} from 'lucide-react';
import {
  startTransition,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';

type ZoomLevel = 'day' | 'week' | 'month';
type ValidationLevel = 'valid' | 'warning' | 'invalid';
type PurchaseRequestStatus = 'Draft' | 'Waiting' | 'Approved' | 'Rejected';

type ResourceRow = {
  id: string;
  name: string;
  description: string;
  shift: string;
  capacity: number;
};

type MaterialLine = {
  name: string;
  required: number;
  available: number;
};

type CatalogItem = {
  id: string;
  code: string;
  name: string;
  source: string;
  quantityPerSlot: number;
  defaultDuration: number;
  capacityLoad: number;
  earliestSlot: number;
  bomVersion: string;
  supplier: string;
  leadTime: string;
  availableStock: number;
  status: string;
  materials: MaterialLine[];
};

type ScheduledBlock = {
  id: string;
  itemId: string;
  rowId: string;
  start: number;
  duration: number;
  quantity: number;
};

type PlacementValidation = {
  level: ValidationLevel;
  reasons: string[];
  peakLoad: number;
  rowCapacity: number;
};

type InteractionState = {
  kind: 'create' | 'move' | 'resize';
  itemId: string;
  blockId?: string;
  previewRowId: string | null;
  previewStart: number;
  previewDuration: number;
  originalRowId: string | null;
  originalStart: number;
  originalDuration: number;
  anchorOffset: number;
};

const ROW_LABEL_WIDTH = 188;

const RESOURCE_ROWS: ResourceRow[] = [
  {
    id: 'line-a',
    name: 'Packaging Line A',
    description: 'Beverage canning',
    shift: 'Shift A',
    capacity: 10,
  },
  {
    id: 'line-b',
    name: 'Mixing Line B',
    description: 'Sauce blending',
    shift: 'Shift B',
    capacity: 8,
  },
  {
    id: 'line-c',
    name: 'Filling Line C',
    description: 'Dry goods packing',
    shift: 'Shift A',
    capacity: 12,
  },
  {
    id: 'line-d',
    name: 'Promo Cell D',
    description: 'Campaign assembly',
    shift: 'Shift C',
    capacity: 7,
  },
];

const CATALOG_ITEMS: CatalogItem[] = [
  {
    id: 'mrp-201',
    code: 'SKU-MCH-201',
    name: 'Wake-Up Coffee 180ml',
    source: 'Finished Good',
    quantityPerSlot: 1600,
    defaultDuration: 2,
    capacityLoad: 4,
    earliestSlot: 0,
    bomVersion: 'BOM v4.2',
    supplier: 'Highlands Blend Co.',
    leadTime: '2 days',
    availableStock: 12400,
    status: 'Ready',
    materials: [
      { name: 'Coffee concentrate', required: 3200, available: 9100 },
      { name: 'Slim can 180ml', required: 3200, available: 12800 },
      { name: 'Promo sleeve', required: 3200, available: 5600 },
    ],
  },
  {
    id: 'mrp-318',
    code: 'SKU-MCH-318',
    name: 'Chin-Su Chili Sauce',
    source: 'Finished Good',
    quantityPerSlot: 1200,
    defaultDuration: 3,
    capacityLoad: 5,
    earliestSlot: 3,
    bomVersion: 'BOM v5.1',
    supplier: 'Masan Agro Spice',
    leadTime: '4 days',
    availableStock: 6100,
    status: 'Watch',
    materials: [
      { name: 'Tomato paste', required: 2200, available: 3100 },
      { name: 'PET bottle 500ml', required: 3600, available: 7000 },
      { name: 'Red cap set', required: 3600, available: 3800 },
    ],
  },
  {
    id: 'mrp-411',
    code: 'SKU-MCH-411',
    name: 'Kokomi Instant Noodles',
    source: 'Finished Good',
    quantityPerSlot: 2200,
    defaultDuration: 2,
    capacityLoad: 4,
    earliestSlot: 1,
    bomVersion: 'BOM v6.0',
    supplier: 'Omachi Wheat Partner',
    leadTime: '3 days',
    availableStock: 17400,
    status: 'Ready',
    materials: [
      { name: 'Noodle cake', required: 4400, available: 15600 },
      { name: 'Seasoning sachet', required: 4400, available: 9800 },
      { name: 'Bowl cup', required: 4400, available: 6200 },
    ],
  },
  {
    id: 'mrp-507',
    code: 'RM-PET-507',
    name: 'Bottle 330ml Preform',
    source: 'Packaging Material',
    quantityPerSlot: 4500,
    defaultDuration: 2,
    capacityLoad: 3,
    earliestSlot: 2,
    bomVersion: 'PKG v2.3',
    supplier: 'Sai Gon Plastics',
    leadTime: '5 days',
    availableStock: 9900,
    status: 'Ready',
    materials: [
      { name: 'PET resin lot', required: 5200, available: 7600 },
      { name: 'Blue tint additive', required: 240, available: 500 },
      { name: 'Mold set M-330', required: 1, available: 1 },
    ],
  },
  {
    id: 'mrp-611',
    code: 'SKU-MCH-611',
    name: 'Omachi Potato Cup',
    source: 'Finished Good',
    quantityPerSlot: 1400,
    defaultDuration: 2,
    capacityLoad: 6,
    earliestSlot: 5,
    bomVersion: 'BOM v3.9',
    supplier: 'Northern Potato Union',
    leadTime: '6 days',
    availableStock: 4200,
    status: 'Shortage',
    materials: [
      { name: 'Potato flake', required: 2400, available: 1100 },
      { name: 'Cup lid', required: 2800, available: 3600 },
      { name: 'Flavor oil', required: 680, available: 710 },
    ],
  },
  {
    id: 'mrp-702',
    code: 'RM-CSE-702',
    name: 'Carton Sleeve 24-pack',
    source: 'Packaging Material',
    quantityPerSlot: 3000,
    defaultDuration: 1,
    capacityLoad: 2,
    earliestSlot: 0,
    bomVersion: 'PKG v1.4',
    supplier: 'Binh Duong Carton',
    leadTime: '1 day',
    availableStock: 18200,
    status: 'Ready',
    materials: [
      { name: 'Kraft paper board', required: 3000, available: 12500 },
      { name: 'Print ink set', required: 1, available: 9 },
      { name: 'Glue line', required: 160, available: 1200 },
    ],
  },
];

const INITIAL_BLOCKS: ScheduledBlock[] = [
  {
    id: 'block-1',
    itemId: 'mrp-201',
    rowId: 'line-a',
    start: 1,
    duration: 2,
    quantity: 3200,
  },
  {
    id: 'block-2',
    itemId: 'mrp-411',
    rowId: 'line-b',
    start: 4,
    duration: 2,
    quantity: 4400,
  },
  {
    id: 'block-3',
    itemId: 'mrp-611',
    rowId: 'line-d',
    start: 5,
    duration: 2,
    quantity: 2800,
  },
];

const ITEM_BY_ID = Object.fromEntries(CATALOG_ITEMS.map((item) => [item.id, item])) as Record<
  string,
  CatalogItem
>;
const ROW_BY_ID = Object.fromEntries(RESOURCE_ROWS.map((row) => [row.id, row])) as Record<
  string,
  ResourceRow
>;

const ZOOM_CONFIG = {
  day: {
    slotWidth: 120,
    snapLabel: 'day / shift',
    slots: [
      { label: 'Mon 12', secondary: 'Day 1', weekend: false },
      { label: 'Tue 13', secondary: 'Day 2', weekend: false },
      { label: 'Wed 14', secondary: 'Day 3', weekend: false },
      { label: 'Thu 15', secondary: 'Day 4', weekend: false },
      { label: 'Fri 16', secondary: 'Day 5', weekend: false },
      { label: 'Sat 17', secondary: 'Weekend', weekend: true },
      { label: 'Sun 18', secondary: 'Weekend', weekend: true },
      { label: 'Mon 19', secondary: 'Day 8', weekend: false },
      { label: 'Tue 20', secondary: 'Day 9', weekend: false },
      { label: 'Wed 21', secondary: 'Day 10', weekend: false },
      { label: 'Thu 22', secondary: 'Day 11', weekend: false },
      { label: 'Fri 23', secondary: 'Day 12', weekend: false },
    ],
  },
  week: {
    slotWidth: 132,
    snapLabel: 'week / batch',
    slots: [
      { label: 'W19', secondary: 'May 12-18', weekend: false },
      { label: 'W20', secondary: 'May 19-25', weekend: false },
      { label: 'W21', secondary: 'May 26-Jun 1', weekend: false },
      { label: 'W22', secondary: 'Jun 2-8', weekend: false },
      { label: 'W23', secondary: 'Jun 9-15', weekend: false },
      { label: 'W24', secondary: 'Jun 16-22', weekend: false },
      { label: 'W25', secondary: 'Jun 23-29', weekend: false },
      { label: 'W26', secondary: 'Jun 30-Jul 6', weekend: false },
      { label: 'W27', secondary: 'Jul 7-13', weekend: false },
      { label: 'W28', secondary: 'Jul 14-20', weekend: false },
      { label: 'W29', secondary: 'Jul 21-27', weekend: false },
      { label: 'W30', secondary: 'Jul 28-Aug 3', weekend: false },
    ],
  },
  month: {
    slotWidth: 168,
    snapLabel: 'month bucket',
    slots: [
      { label: 'Jan', secondary: '2026', weekend: false },
      { label: 'Feb', secondary: '2026', weekend: false },
      { label: 'Mar', secondary: '2026', weekend: false },
      { label: 'Apr', secondary: '2026', weekend: false },
      { label: 'May', secondary: '2026', weekend: false },
      { label: 'Jun', secondary: '2026', weekend: false },
      { label: 'Jul', secondary: '2026', weekend: false },
      { label: 'Aug', secondary: '2026', weekend: false },
      { label: 'Sep', secondary: '2026', weekend: false },
      { label: 'Oct', secondary: '2026', weekend: false },
      { label: 'Nov', secondary: '2026', weekend: false },
      { label: 'Dec', secondary: '2026', weekend: false },
    ],
  },
} satisfies Record<
  ZoomLevel,
  {
    slotWidth: number;
    snapLabel: string;
    slots: Array<{ label: string; secondary: string; weekend: boolean }>;
  }
>;

const TONE_STYLES: Record<
  ValidationLevel,
  {
    chip: string;
    block: string;
    outline: string;
    dot: string;
    label: string;
  }
> = {
  valid: {
    chip: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    block: 'border-emerald-200 bg-emerald-50/90 text-emerald-950 shadow-emerald-100',
    outline: 'border-emerald-400 bg-emerald-50/65',
    dot: 'bg-emerald-500',
    label: 'Valid',
  },
  warning: {
    chip: 'border-amber-200 bg-amber-50 text-amber-700',
    block: 'border-amber-200 bg-amber-50/90 text-amber-950 shadow-amber-100',
    outline: 'border-amber-400 bg-amber-50/65',
    dot: 'bg-amber-500',
    label: 'Warning',
  },
  invalid: {
    chip: 'border-rose-200 bg-rose-50 text-rose-700',
    block: 'border-rose-200 bg-rose-50/90 text-rose-950 shadow-rose-100',
    outline: 'border-rose-400 bg-rose-50/65',
    dot: 'bg-rose-500',
    label: 'Conflict',
  },
};

const PURCHASE_STATUS_STYLES: Record<PurchaseRequestStatus, string> = {
  Draft: 'border-slate-200 bg-slate-50 text-slate-600',
  Waiting: 'border-amber-200 bg-amber-50 text-amber-700',
  Approved: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Rejected: 'border-rose-200 bg-rose-50 text-rose-700',
};

function cloneInitialBlocks() {
  return INITIAL_BLOCKS.map((block) => ({ ...block }));
}

function formatQuantity(value: number) {
  return new Intl.NumberFormat('en-US').format(value);
}

function titleFromId(value: string) {
  return value
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getItem(itemId: string) {
  const item = ITEM_BY_ID[itemId];
  if (!item) {
    throw new Error(`Unknown catalog item: ${itemId}`);
  }

  return item;
}

function getRow(rowId: string) {
  const row = ROW_BY_ID[rowId];
  if (!row) {
    throw new Error(`Unknown resource row: ${rowId}`);
  }

  return row;
}

function getSlotName(zoom: ZoomLevel, slotIndex: number) {
  const slots = ZOOM_CONFIG[zoom].slots;
  const clampedIndex = clamp(slotIndex, 0, slots.length - 1);
  const slot = slots[clampedIndex];
  return slot ? slot.label : '';
}

function overlapsSlot(block: ScheduledBlock, slot: number) {
  return slot >= block.start && slot < block.start + block.duration;
}

function evaluatePlacement(
  candidate: ScheduledBlock,
  blocks: ScheduledBlock[],
  zoom: ZoomLevel
): PlacementValidation {
  const item = getItem(candidate.itemId);
  const row = getRow(candidate.rowId);
  let level: ValidationLevel = 'valid';
  const reasons: string[] = [];
  let peakLoad = item.capacityLoad;

  if (candidate.start < item.earliestSlot) {
    level = 'invalid';
    reasons.push(`Material shortage until ${getSlotName(zoom, item.earliestSlot)}.`);
  } else if (candidate.start === item.earliestSlot) {
    level = 'warning';
    reasons.push('Lead-time buffer is fully consumed at this placement.');
  }

  for (let slot = candidate.start; slot < candidate.start + candidate.duration; slot += 1) {
    const overlappingLoad = blocks
      .filter((block) => block.id !== candidate.id && block.rowId === candidate.rowId)
      .filter((block) => overlapsSlot(block, slot))
      .reduce((sum, block) => sum + getItem(block.itemId).capacityLoad, 0);

    const totalLoad = overlappingLoad + item.capacityLoad;
    peakLoad = Math.max(peakLoad, totalLoad);

    if (totalLoad > row.capacity) {
      level = 'invalid';
      reasons.push(`${row.name} exceeds capacity at ${getSlotName(zoom, slot)}.`);
      break;
    }

    if (level !== 'invalid' && totalLoad > row.capacity * 0.85) {
      level = 'warning';
      reasons.push(`${row.name} is near overload at ${getSlotName(zoom, slot)}.`);
    }
  }

  if (level === 'valid') {
    reasons.push('Capacity, materials, and lead time are all within threshold.');
  }

  return {
    level,
    reasons: Array.from(new Set(reasons)),
    peakLoad,
    rowCapacity: row.capacity,
  };
}

function getBlockQuantity(itemId: string, duration: number) {
  return getItem(itemId).quantityPerSlot * duration;
}

export function MRPScheduler() {
  const [zoom, setZoom] = useState<ZoomLevel>('day');
  const [blocks, setBlocks] = useState<ScheduledBlock[]>(() => cloneInitialBlocks());
  const [selectedBlockId, setSelectedBlockId] = useState<string>(INITIAL_BLOCKS[0]?.id ?? '');
  const [purchaseStatus, setPurchaseStatus] = useState<PurchaseRequestStatus>('Draft');
  const [interaction, setInteraction] = useState<InteractionState | null>(null);

  const nextBlockIdRef = useRef(1000);
  const rowRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const timelineSurfaceRef = useRef<HTMLDivElement | null>(null);

  const zoomConfig = ZOOM_CONFIG[zoom];
  const slotCount = zoomConfig.slots.length;
  const timelineWidth = zoomConfig.slotWidth * slotCount;

  const selectedBlock = blocks.find((block) => block.id === selectedBlockId) ?? null;
  const selectedItem = selectedBlock ? getItem(selectedBlock.itemId) : null;

  const previewBlock =
    interaction && interaction.previewRowId
      ? {
          id: interaction.blockId ?? '__preview__',
          itemId: interaction.itemId,
          rowId: interaction.previewRowId,
          start: interaction.previewStart,
          duration: interaction.previewDuration,
          quantity: getBlockQuantity(interaction.itemId, interaction.previewDuration),
        }
      : null;
  const previewValidation = previewBlock ? evaluatePlacement(previewBlock, blocks, zoom) : null;

  const scheduledItemIds = new Set(blocks.map((block) => block.itemId));
  const unscheduledItems = CATALOG_ITEMS.filter((item) => !scheduledItemIds.has(item.id));

  const validations = blocks.map((block) => evaluatePlacement(block, blocks, zoom));
  const invalidCount = validations.filter((validation) => validation.level === 'invalid').length;
  const warningCount = validations.filter((validation) => validation.level === 'warning').length;

  const activeItem = previewBlock
    ? getItem(previewBlock.itemId)
    : selectedItem;
  const activeBlock = previewBlock ?? selectedBlock;
  const activeValidation = previewValidation
    ? previewValidation
    : selectedBlock
      ? evaluatePlacement(selectedBlock, blocks, zoom)
      : null;

  const handlePointerMove = useEffectEvent((event: PointerEvent) => {
    if (!interaction || !timelineSurfaceRef.current) return;

    const rowEntry = Object.entries(rowRefs.current).find(([, element]) => {
      if (!element) return false;
      const rect = element.getBoundingClientRect();
      return event.clientY >= rect.top && event.clientY <= rect.bottom;
    });

    const surfaceRect = timelineSurfaceRef.current.getBoundingClientRect();
    const rawSlot = Math.floor((event.clientX - surfaceRect.left) / zoomConfig.slotWidth);
    const safeSlot = clamp(rawSlot, 0, slotCount - 1);

    startTransition(() => {
      setInteraction((current) => {
        if (!current) return current;

        if (current.kind === 'resize') {
          const resizedDuration = clamp(
            safeSlot - current.originalStart + 1,
            1,
            slotCount - current.originalStart
          );

          return {
            ...current,
            previewDuration: resizedDuration,
          };
        }

        const nextRowId = rowEntry?.[0] ?? null;
        const nextStart = clamp(
          safeSlot - current.anchorOffset,
          0,
          slotCount - current.previewDuration
        );

        return {
          ...current,
          previewRowId: nextRowId,
          previewStart: nextStart,
        };
      });
    });
  });

  const handlePointerUp = useEffectEvent(() => {
    if (!interaction) return;

    if (!interaction.previewRowId) {
      setInteraction(null);
      return;
    }

    if (interaction.kind === 'create') {
      const nextBlockId = `block-${nextBlockIdRef.current}`;
      nextBlockIdRef.current += 1;

      const newBlock: ScheduledBlock = {
        id: nextBlockId,
        itemId: interaction.itemId,
        rowId: interaction.previewRowId,
        start: interaction.previewStart,
        duration: interaction.previewDuration,
        quantity: getBlockQuantity(interaction.itemId, interaction.previewDuration),
      };

      setBlocks((current) => [...current, newBlock]);
      setSelectedBlockId(nextBlockId);
    } else {
      setBlocks((current) =>
        current.map((block) =>
          block.id === interaction.blockId
            ? {
                ...block,
                rowId: interaction.previewRowId ?? block.rowId,
                start: interaction.previewStart,
                duration: interaction.previewDuration,
                quantity: getBlockQuantity(block.itemId, interaction.previewDuration),
              }
            : block
        )
      );

      if (interaction.blockId) {
        setSelectedBlockId(interaction.blockId);
      }
    }

    setInteraction(null);
  });

  useEffect(() => {
    if (!interaction) return;

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [interaction, handlePointerMove, handlePointerUp]);

  function beginCreate(itemId: string) {
    const item = getItem(itemId);

    setPurchaseStatus('Draft');
    setInteraction({
      kind: 'create',
      itemId,
      previewRowId: null,
      previewStart: 0,
      previewDuration: item.defaultDuration,
      originalRowId: null,
      originalStart: 0,
      originalDuration: item.defaultDuration,
      anchorOffset: 0,
    });
  }

  function beginMove(event: ReactPointerEvent<HTMLDivElement>, block: ScheduledBlock) {
    const rect = event.currentTarget.getBoundingClientRect();
    const offset = clamp(
      Math.floor((event.clientX - rect.left) / (rect.width / Math.max(block.duration, 1))),
      0,
      block.duration - 1
    );

    setSelectedBlockId(block.id);
    setPurchaseStatus('Draft');
    setInteraction({
      kind: 'move',
      itemId: block.itemId,
      blockId: block.id,
      previewRowId: block.rowId,
      previewStart: block.start,
      previewDuration: block.duration,
      originalRowId: block.rowId,
      originalStart: block.start,
      originalDuration: block.duration,
      anchorOffset: offset,
    });
  }

  function beginResize(event: ReactPointerEvent<HTMLButtonElement>, block: ScheduledBlock) {
    event.stopPropagation();
    event.preventDefault();

    setSelectedBlockId(block.id);
    setPurchaseStatus('Draft');
    setInteraction({
      kind: 'resize',
      itemId: block.itemId,
      blockId: block.id,
      previewRowId: block.rowId,
      previewStart: block.start,
      previewDuration: block.duration,
      originalRowId: block.rowId,
      originalStart: block.start,
      originalDuration: block.duration,
      anchorOffset: block.duration - 1,
    });
  }

  function resetPlan() {
    const firstBlock = INITIAL_BLOCKS[0];
    setBlocks(cloneInitialBlocks());
    if (firstBlock) {
      setSelectedBlockId(firstBlock.id);
    }
    setPurchaseStatus('Draft');
    setInteraction(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 rounded-[28px] border bg-card p-6 shadow-xs lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-primary/15 bg-primary/5 px-3 py-1 font-medium text-primary text-xs uppercase tracking-[0.24em]">
              Material Requirement Plan
            </span>
            <span
              className={`rounded-full border px-3 py-1 font-medium text-xs ${PURCHASE_STATUS_STYLES[purchaseStatus]}`}
            >
              Purchase Request: {purchaseStatus}
            </span>
          </div>
          <div>
            <h1 className="font-bold text-3xl tracking-tight">Calendar-like scheduling engine</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Plan SKUs and materials visually with drag, drop, resize, and snap-to-time
              behavior. The system validates line capacity, material readiness, and lead-time
              risk as blocks move.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:items-end">
          <div className="inline-flex rounded-2xl border bg-muted/40 p-1">
            {(['day', 'week', 'month'] as ZoomLevel[]).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setZoom(level)}
                className={`rounded-xl px-4 py-2 font-medium text-sm transition ${
                  zoom === level
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {titleFromId(level)}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={resetPlan}
              className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 font-medium text-sm hover:bg-muted/50"
            >
              <Package2 className="size-4" />
              Create MRP
            </button>
            <button
              type="button"
              disabled={blocks.length === 0 || invalidCount > 0}
              onClick={() => setPurchaseStatus('Waiting')}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 font-medium text-primary-foreground text-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ShoppingCart className="size-4" />
              Submit Purchase Request
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,_1fr)_320px]">
        <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
          <div className="rounded-[24px] border bg-card p-5 shadow-xs">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">SKU / Material queue</p>
                <p className="mt-1 text-muted-foreground text-sm">
                  Drag an item into the timeline to create a schedulable block.
                </p>
              </div>
              <GripVertical className="mt-1 size-4 text-muted-foreground" />
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="rounded-2xl bg-muted/50 p-3">
                <p className="text-muted-foreground text-xs uppercase tracking-wide">Queued</p>
                <p className="mt-1 font-semibold text-xl">{unscheduledItems.length}</p>
              </div>
              <div className="rounded-2xl bg-muted/50 p-3">
                <p className="text-muted-foreground text-xs uppercase tracking-wide">Warning</p>
                <p className="mt-1 font-semibold text-xl">{warningCount}</p>
              </div>
              <div className="rounded-2xl bg-muted/50 p-3">
                <p className="text-muted-foreground text-xs uppercase tracking-wide">Conflict</p>
                <p className="mt-1 font-semibold text-xl">{invalidCount}</p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {unscheduledItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onPointerDown={(event) => {
                    event.preventDefault();
                    beginCreate(item.id);
                  }}
                  className="w-full rounded-2xl border p-4 text-left transition hover:border-primary/40 hover:bg-primary/5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-sm">{item.code}</p>
                      <p className="mt-1 text-muted-foreground text-sm">{item.name}</p>
                    </div>
                    <span className="rounded-full bg-muted px-2 py-1 text-[11px] uppercase">
                      {item.status}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-muted-foreground text-xs">
                    <span>{item.source}</span>
                    <span className="h-1 w-1 rounded-full bg-border" />
                    <span>{formatQuantity(item.quantityPerSlot * item.defaultDuration)} units</span>
                    <span className="h-1 w-1 rounded-full bg-border" />
                    <span>{item.bomVersion}</span>
                  </div>
                  <div className="mt-3 inline-flex items-center gap-2 text-primary text-xs">
                    <MoveHorizontal className="size-3.5" />
                    Drag to schedule
                  </div>
                </button>
              ))}

              {unscheduledItems.length === 0 && (
                <div className="rounded-2xl border border-dashed p-4 text-center text-muted-foreground text-sm">
                  All queued items are already on the timeline.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[24px] border bg-card p-5 shadow-xs">
            <p className="font-semibold">Interaction model</p>
            <div className="mt-4 space-y-3 text-muted-foreground text-sm">
              <div className="flex items-start gap-3">
                <MoveHorizontal className="mt-0.5 size-4 text-foreground" />
                <p>Move blocks across time or between lines.</p>
              </div>
              <div className="flex items-start gap-3">
                <StretchHorizontal className="mt-0.5 size-4 text-foreground" />
                <p>Resize the right edge to change duration and quantity.</p>
              </div>
              <div className="flex items-start gap-3">
                <Clock3 className="mt-0.5 size-4 text-foreground" />
                <p>Snap logic follows the active zoom: {zoomConfig.snapLabel}.</p>
              </div>
            </div>
          </div>
        </aside>

        <section className="min-w-0 rounded-[28px] border bg-card shadow-xs">
          <div className="flex flex-col gap-4 border-b px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="font-semibold">Planning horizon</p>
              <p className="text-muted-foreground text-sm">
                Row = line capacity, columns = {zoom}. Drop blocks directly onto the grid.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              {(['valid', 'warning', 'invalid'] as ValidationLevel[]).map((tone) => (
                <span
                  key={tone}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 ${TONE_STYLES[tone].chip}`}
                >
                  <span className={`size-2 rounded-full ${TONE_STYLES[tone].dot}`} />
                  {TONE_STYLES[tone].label}
                </span>
              ))}
            </div>
          </div>

          {(previewBlock || invalidCount > 0 || warningCount > 0) && (
            <div className="border-b px-5 py-3">
              {previewBlock && previewValidation ? (
                <div
                  className={`rounded-2xl border px-4 py-3 text-sm ${TONE_STYLES[previewValidation.level].chip}`}
                >
                  <div className="flex flex-wrap items-center gap-2 font-medium">
                    <span>{getItem(previewBlock.itemId).code}</span>
                    <span className="text-current/60">•</span>
                    <span>{getRow(previewBlock.rowId).name}</span>
                    <span className="text-current/60">•</span>
                    <span>
                      Snapped to {getSlotName(zoom, previewBlock.start)} for {previewBlock.duration}{' '}
                      slots
                    </span>
                  </div>
                  <p className="mt-1">{previewValidation.reasons[0]}</p>
                </div>
              ) : (
                <div className="rounded-2xl border border-border/70 bg-muted/40 px-4 py-3 text-muted-foreground text-sm">
                  {invalidCount > 0
                    ? `${invalidCount} scheduled block(s) still have unresolved conflicts.`
                    : `${warningCount} scheduled block(s) are close to line or material thresholds.`}
                </div>
              )}
            </div>
          )}

          <div className="overflow-auto px-5 pb-5 pt-4">
            <div
              ref={timelineSurfaceRef}
              style={{ width: ROW_LABEL_WIDTH + timelineWidth }}
              className="min-w-full"
            >
              <div
                className="sticky top-0 z-20 grid border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80"
                style={{ gridTemplateColumns: `${ROW_LABEL_WIDTH}px ${timelineWidth}px` }}
              >
                <div className="sticky left-0 z-30 border-r bg-card px-4 py-3">
                  <p className="font-medium text-muted-foreground text-xs uppercase tracking-[0.2em]">
                    Lines
                  </p>
                </div>
                <div className="grid" style={{ gridTemplateColumns: `repeat(${slotCount}, minmax(0, 1fr))` }}>
                  {zoomConfig.slots.map((slot) => (
                    <div
                      key={`${slot.label}-${slot.secondary}`}
                      className={`border-r px-3 py-3 text-sm ${
                        slot.weekend ? 'bg-amber-50/50' : 'bg-transparent'
                      }`}
                    >
                      <p className="font-medium">{slot.label}</p>
                      <p className="text-muted-foreground text-xs">{slot.secondary}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                {RESOURCE_ROWS.map((row) => (
                  <div
                    key={row.id}
                    className="grid border-b last:border-b-0"
                    style={{ gridTemplateColumns: `${ROW_LABEL_WIDTH}px ${timelineWidth}px` }}
                  >
                    <div className="sticky left-0 z-10 border-r bg-card px-4 py-4">
                      <p className="font-medium text-sm">{row.name}</p>
                      <p className="mt-1 text-muted-foreground text-xs">{row.description}</p>
                      <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                        <span className="rounded-full bg-muted px-2 py-1">{row.shift}</span>
                        <span className="rounded-full bg-muted px-2 py-1">
                          Capacity {row.capacity}
                        </span>
                      </div>
                    </div>

                    <div
                      ref={(element) => {
                        rowRefs.current[row.id] = element;
                      }}
                      className="relative h-28"
                      style={{ width: timelineWidth }}
                    >
                      {zoomConfig.slots.map((slot, slotIndex) => (
                        <div
                          key={`${row.id}-${slot.label}-${slotIndex}`}
                          className={`absolute inset-y-0 border-r ${
                            slot.weekend ? 'bg-amber-50/40' : ''
                          }`}
                          style={{
                            left: slotIndex * zoomConfig.slotWidth,
                            width: zoomConfig.slotWidth,
                          }}
                        />
                      ))}

                      {blocks
                        .filter(
                          (block) =>
                            block.rowId === row.id &&
                            (!interaction || interaction.blockId !== block.id || interaction.kind === 'create')
                        )
                        .map((block) => {
                          const item = getItem(block.itemId);
                          const validation = evaluatePlacement(block, blocks, zoom);
                          const tone = TONE_STYLES[validation.level];

                          return (
                            <div
                              key={block.id}
                              onClick={() => setSelectedBlockId(block.id)}
                              onPointerDown={(event) => beginMove(event, block)}
                              title={validation.reasons.join(' ')}
                              className={`absolute top-3 flex cursor-grab select-none flex-col rounded-2xl border px-3 py-2 shadow-sm active:cursor-grabbing ${
                                tone.block
                              } ${selectedBlockId === block.id ? 'ring-2 ring-primary/20' : ''}`}
                              style={{
                                left: block.start * zoomConfig.slotWidth + 6,
                                width: block.duration * zoomConfig.slotWidth - 12,
                              }}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <p className="truncate font-semibold text-sm">{item.code}</p>
                                  <p className="truncate text-[11px] text-current/75">
                                    {formatQuantity(block.quantity)} units
                                  </p>
                                </div>
                                <span className={`mt-1 size-2 rounded-full ${tone.dot}`} />
                              </div>

                              <div className="mt-2 flex items-center gap-2 text-[11px] text-current/75">
                                <span>{item.bomVersion}</span>
                                <span className="h-1 w-1 rounded-full bg-current/30" />
                                <span>{tone.label}</span>
                              </div>

                              <button
                                type="button"
                                onPointerDown={(event) => beginResize(event, block)}
                                className="absolute inset-y-2 right-1 flex w-4 cursor-ew-resize items-center justify-center rounded-full hover:bg-black/5"
                                aria-label={`Resize ${item.code}`}
                              >
                                <div className="h-9 w-1 rounded-full bg-current/35" />
                              </button>
                            </div>
                          );
                        })}

                      {previewBlock && previewBlock.rowId === row.id && (
                        <div
                          className={`pointer-events-none absolute top-3 rounded-2xl border-2 border-dashed px-3 py-2 shadow-sm ${
                            TONE_STYLES[previewValidation?.level ?? 'valid'].outline
                          }`}
                          style={{
                            left: previewBlock.start * zoomConfig.slotWidth + 6,
                            width: previewBlock.duration * zoomConfig.slotWidth - 12,
                          }}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-semibold text-sm">{getItem(previewBlock.itemId).code}</p>
                              <p className="text-[11px] text-current/75">
                                {formatQuantity(previewBlock.quantity)} units
                              </p>
                            </div>
                            <span
                              className={`mt-1 size-2 rounded-full ${
                                TONE_STYLES[previewValidation?.level ?? 'valid'].dot
                              }`}
                            />
                          </div>
                          <p className="mt-2 text-[11px] text-current/75">
                            {getItem(previewBlock.itemId).bomVersion}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
          <div className="rounded-[24px] border bg-card p-5 shadow-xs">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">Selected block details</p>
                <p className="mt-1 text-muted-foreground text-sm">
                  Click a block or drag a queued SKU to inspect validation and material readiness.
                </p>
              </div>
              {activeValidation?.level === 'invalid' ? (
                <AlertTriangle className="mt-0.5 size-5 text-rose-500" />
              ) : (
                <CheckCircle2 className="mt-0.5 size-5 text-emerald-500" />
              )}
            </div>

            {activeItem && activeBlock && activeValidation ? (
              <div className="mt-5 space-y-5">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-lg">{activeItem.code}</span>
                    <span
                      className={`rounded-full border px-2.5 py-1 text-[11px] ${TONE_STYLES[activeValidation.level].chip}`}
                    >
                      {TONE_STYLES[activeValidation.level].label}
                    </span>
                  </div>
                  <p className="mt-1 text-muted-foreground text-sm">{activeItem.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-muted/40 p-3">
                    <p className="text-muted-foreground text-xs uppercase tracking-wide">Quantity</p>
                    <p className="mt-1 font-semibold">{formatQuantity(activeBlock.quantity)}</p>
                  </div>
                  <div className="rounded-2xl bg-muted/40 p-3">
                    <p className="text-muted-foreground text-xs uppercase tracking-wide">BOM</p>
                    <p className="mt-1 font-semibold">{activeItem.bomVersion}</p>
                  </div>
                  <div className="rounded-2xl bg-muted/40 p-3">
                    <p className="text-muted-foreground text-xs uppercase tracking-wide">Row</p>
                    <p className="mt-1 font-semibold">{getRow(activeBlock.rowId).name}</p>
                  </div>
                  <div className="rounded-2xl bg-muted/40 p-3">
                    <p className="text-muted-foreground text-xs uppercase tracking-wide">Window</p>
                    <p className="mt-1 font-semibold">
                      {getSlotName(zoom, activeBlock.start)} to{' '}
                      {getSlotName(zoom, activeBlock.start + activeBlock.duration - 1)}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border p-4">
                  <div className="flex items-center gap-2 font-medium text-sm">
                    <Clock3 className="size-4 text-muted-foreground" />
                    Validation feedback
                  </div>
                  <ul className="mt-3 space-y-2 text-muted-foreground text-sm">
                    {activeValidation.reasons.map((reason) => (
                      <li key={reason} className="flex items-start gap-2">
                        <span className={`mt-1 size-1.5 rounded-full ${TONE_STYLES[activeValidation.level].dot}`} />
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 rounded-2xl bg-muted/40 p-3 text-sm">
                    Peak load {activeValidation.peakLoad}/{activeValidation.rowCapacity} on{' '}
                    {getRow(activeBlock.rowId).name}.
                  </div>
                </div>

                <div className="rounded-2xl border p-4">
                  <div className="flex items-center gap-2 font-medium text-sm">
                    <Truck className="size-4 text-muted-foreground" />
                    Supply snapshot
                  </div>
                  <div className="mt-3 space-y-3">
                    <div className="flex items-center justify-between rounded-2xl bg-muted/40 p-3 text-sm">
                      <span>Supplier</span>
                      <span className="font-medium">{activeItem.supplier}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl bg-muted/40 p-3 text-sm">
                      <span>Lead time</span>
                      <span className="font-medium">{activeItem.leadTime}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl bg-muted/40 p-3 text-sm">
                      <span>Available stock</span>
                      <span className="font-medium">{formatQuantity(activeItem.availableStock)}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border p-4">
                  <p className="font-medium text-sm">Required materials</p>
                  <div className="mt-3 space-y-3">
                    {activeItem.materials.map((material) => {
                      const hasGap = material.available < material.required;
                      return (
                        <div
                          key={material.name}
                          className="rounded-2xl bg-muted/40 p-3 text-sm"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="font-medium">{material.name}</span>
                            <span
                              className={`rounded-full px-2 py-1 text-[11px] ${
                                hasGap ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                              }`}
                            >
                              {hasGap ? 'Gap' : 'Ready'}
                            </span>
                          </div>
                          <p className="mt-1 text-muted-foreground text-xs">
                            Need {formatQuantity(material.required)} • Available{' '}
                            {formatQuantity(material.available)}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-2xl border p-4">
                  <p className="font-medium text-sm">Purchase request flow</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(['Draft', 'Waiting', 'Approved', 'Rejected'] as PurchaseRequestStatus[]).map(
                      (status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => setPurchaseStatus(status)}
                          className={`rounded-full border px-3 py-1.5 text-xs transition ${
                            purchaseStatus === status
                              ? PURCHASE_STATUS_STYLES[status]
                              : 'border-border text-muted-foreground hover:bg-muted/50'
                          }`}
                        >
                          {status}
                        </button>
                      )
                    )}
                  </div>
                  <p className="mt-3 text-muted-foreground text-sm">
                    Use this state to model the downstream PR approval after scheduling is locked.
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-5 rounded-2xl border border-dashed p-5 text-muted-foreground text-sm">
                Select a block to inspect BOM version, required materials, available stock,
                supplier, and lead-time validation.
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
