import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Home, FileText, ClipboardList, HelpCircle } from 'lucide-react';
import {
  SchoenheitsreparaturenInput,
  ZUSTAENDE,
  AKTUELLER_ZUSTAND,
  UebernahmeZustand,
  AktuellerZustand
} from '@/types/schoenheitsreparaturen';

interface CheckInputsProps {
  inputs: SchoenheitsreparaturenInput;
  onChange: (inputs: SchoenheitsreparaturenInput) => void;
}

function HintIcon({ hint }: { hint: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
      </TooltipTrigger>
      <TooltipContent>
        <p className="max-w-xs">{hint}</p>
      </TooltipContent>
    </Tooltip>
  );
}

function CheckboxField({
  id,
  label,
  hint,
  checked,
  onChange
}: {
  id: string;
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(val) => onChange(val === true)}
      />
      <Label htmlFor={id} className="flex items-center gap-2 cursor-pointer">
        {label}
        {hint && <HintIcon hint={hint} />}
      </Label>
    </div>
  );
}

export function CheckInputs({ inputs, onChange }: CheckInputsProps) {
  const update = <K extends keyof SchoenheitsreparaturenInput>(
    key: K,
    value: SchoenheitsreparaturenInput[K]
  ) => {
    onChange({ ...inputs, [key]: value });
  };

  return (
    <div className="space-y-4">
      {/* Gruppe 1: Übernahme der Wohnung */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Home className="h-5 w-5 text-primary" />
            Übernahme der Wohnung
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="uebernahme_zustand">Zustand bei Einzug *</Label>
            <Select
              value={inputs.uebernahme_zustand}
              onValueChange={(val) => update('uebernahme_zustand', val as UebernahmeZustand)}
            >
              <SelectTrigger id="uebernahme_zustand">
                <SelectValue placeholder="Wählen Sie..." />
              </SelectTrigger>
              <SelectContent>
                {ZUSTAENDE.map((z) => (
                  <SelectItem key={z.value} value={z.value}>
                    {z.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="einzugsdatum">Einzugsdatum *</Label>
            <Input
              id="einzugsdatum"
              type="date"
              value={inputs.einzugsdatum}
              onChange={(e) => update('einzugsdatum', e.target.value)}
            />
          </div>

          <CheckboxField
            id="renovierung_bei_einzug"
            label="Selbst renoviert bei Einzug?"
            hint="Haben Sie die Wohnung vor Einzug auf eigene Kosten renoviert?"
            checked={inputs.renovierung_bei_einzug}
            onChange={(val) => update('renovierung_bei_einzug', val)}
          />
        </CardContent>
      </Card>

      {/* Gruppe 2: Klauseln im Mietvertrag */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5 text-primary" />
            Klauseln im Mietvertrag
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <CheckboxField
            id="hat_fristenplan"
            label="Fristenplan vorhanden?"
            hint='"Alle X Jahre..." - Zeitvorgaben für bestimmte Räume'
            checked={inputs.hat_fristenplan}
            onChange={(val) => update('hat_fristenplan', val)}
          />

          {inputs.hat_fristenplan && (
            <div className="ml-6 space-y-3 border-l-2 border-primary/20 pl-4">
              <CheckboxField
                id="fristen_starr"
                label="Starre Fristen?"
                hint='"Spätestens nach X Jahren" - Feste Zeitvorgaben ohne Spielraum'
                checked={inputs.fristen_starr}
                onChange={(val) => update('fristen_starr', val)}
              />

              <CheckboxField
                id="fristen_weich"
                label="Weiche Fristen?"
                hint='"In der Regel nach X Jahren" - Flexible Formulierungen'
                checked={inputs.fristen_weich}
                onChange={(val) => update('fristen_weich', val)}
              />
            </div>
          )}

          <CheckboxField
            id="farbvorgabe"
            label="Farbvorgabe bei Auszug?"
            hint='"In neutralen/hellen Farben" oder "Weiß streichen"'
            checked={inputs.farbvorgabe}
            onChange={(val) => update('farbvorgabe', val)}
          />

          <CheckboxField
            id="quotenklausel"
            label="Quotenklausel?"
            hint='"Anteilige Kosten bei Auszug" - Prozentuale Kostenbeteiligung'
            checked={inputs.quotenklausel}
            onChange={(val) => update('quotenklausel', val)}
          />

          <CheckboxField
            id="endrenovierung"
            label="Endrenovierungsklausel?"
            hint='"Bei Auszug ist die Wohnung renoviert zu übergeben"'
            checked={inputs.endrenovierung}
            onChange={(val) => update('endrenovierung', val)}
          />
        </CardContent>
      </Card>

      {/* Gruppe 3: Aktuelle Situation */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ClipboardList className="h-5 w-5 text-primary" />
            Aktuelle Situation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="wohnung_zustand_aktuell">Aktueller Zustand *</Label>
            <Select
              value={inputs.wohnung_zustand_aktuell}
              onValueChange={(val) => update('wohnung_zustand_aktuell', val as AktuellerZustand)}
            >
              <SelectTrigger id="wohnung_zustand_aktuell">
                <SelectValue placeholder="Wählen Sie..." />
              </SelectTrigger>
              <SelectContent>
                {AKTUELLER_ZUSTAND.map((z) => (
                  <SelectItem key={z.value} value={z.value}>
                    {z.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="letzte_renovierung">Letzte Renovierung</Label>
            <Input
              id="letzte_renovierung"
              type="date"
              value={inputs.letzte_renovierung}
              onChange={(e) => update('letzte_renovierung', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
