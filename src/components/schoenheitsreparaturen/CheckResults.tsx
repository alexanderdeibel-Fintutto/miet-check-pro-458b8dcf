import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Scale,
  Home,
  FileWarning,
  ClipboardCheck
} from 'lucide-react';
import { SchoenheitsreparaturenResult, ZUSTAENDE, AKTUELLER_ZUSTAND } from '@/types/schoenheitsreparaturen';
import { cn } from '@/lib/utils';

interface CheckResultsProps {
  results: SchoenheitsreparaturenResult;
}

export function CheckResults({ results }: CheckResultsProps) {
  const {
    unwirksame_klauseln,
    wirksame_klauseln,
    hinweise,
    muss_renovieren,
    empfehlung,
    anzahl_unwirksam,
    rechtslage_klar,
    uebernahme_zustand,
    wohnung_zustand_aktuell
  } = results;

  // Determine status
  const getStatus = () => {
    if (anzahl_unwirksam > 0) return 'valid'; // Good for tenant - no renovation needed
    if (muss_renovieren) return 'invalid'; // Bad for tenant - must renovate
    return 'unclear';
  };

  const status = getStatus();

  const statusConfig = {
    valid: {
      icon: CheckCircle,
      title: 'Keine Renovierungspflicht!',
      subtitle: `${anzahl_unwirksam} unwirksame Klausel${anzahl_unwirksam !== 1 ? 'n' : ''} gefunden`,
      bgClass: 'bg-status-valid',
      textClass: 'text-status-valid'
    },
    invalid: {
      icon: XCircle,
      title: 'Renovierung möglicherweise erforderlich',
      subtitle: 'Wirksame Klauseln im Vertrag',
      bgClass: 'bg-status-invalid',
      textClass: 'text-status-invalid'
    },
    unclear: {
      icon: AlertTriangle,
      title: 'Rechtslage unklar',
      subtitle: 'Individuelle Prüfung empfohlen',
      bgClass: 'bg-status-unclear',
      textClass: 'text-status-unclear'
    }
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  const uebernahmeLabel = ZUSTAENDE.find(z => z.value === uebernahme_zustand)?.label || uebernahme_zustand;
  const aktuellerZustandLabel = AKTUELLER_ZUSTAND.find(z => z.value === wohnung_zustand_aktuell)?.label || wohnung_zustand_aktuell;

  return (
    <div className="space-y-4">
      {/* Primary Result Card */}
      <Card className={cn('border-2', status === 'valid' ? 'border-status-valid' : status === 'invalid' ? 'border-status-invalid' : 'border-status-unclear')}>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className={cn('p-3 rounded-full', config.bgClass)}>
              <StatusIcon className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className={cn('text-xl font-bold', config.textClass)}>
                {config.title}
              </h2>
              <p className="text-muted-foreground">{config.subtitle}</p>
              <p className="mt-3 text-sm">{empfehlung}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hinweise */}
      {hinweise.length > 0 && (
        <Card className="border-status-info/30 bg-status-info/5">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <Scale className="h-5 w-5 text-status-info mt-0.5" />
              <div className="space-y-1">
                {hinweise.map((hinweis, i) => (
                  <p key={i} className="text-sm font-medium">{hinweis}</p>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Unwirksame Klauseln */}
      {unwirksame_klauseln.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg text-status-valid">
              <CheckCircle className="h-5 w-5" />
              Unwirksame Klauseln ({unwirksame_klauseln.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {unwirksame_klauseln.map((klausel, i) => (
              <div key={i} className="border-l-4 border-status-valid pl-4 py-2">
                <h4 className="font-semibold">{klausel.klausel}</h4>
                <p className="text-sm text-muted-foreground mt-1">{klausel.grund}</p>
                <div className="mt-2 flex items-center gap-2">
                  <Scale className="h-4 w-4 text-muted-foreground" />
                  <code className="legal-reference">{klausel.bgh.urteil}</code>
                </div>
                <p className="text-xs text-muted-foreground mt-1 italic">{klausel.bgh.text}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Wirksame Klauseln */}
      {wirksame_klauseln.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg text-status-unclear">
              <FileWarning className="h-5 w-5" />
              Wirksame Klauseln ({wirksame_klauseln.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {wirksame_klauseln.map((klausel, i) => (
              <div key={i} className="border-l-4 border-status-unclear pl-4 py-2">
                <h4 className="font-semibold">{klausel.klausel}</h4>
                <p className="text-sm text-muted-foreground mt-1">{klausel.grund}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Summary Grid */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <Home className="h-4 w-4" />
              Übernahme
            </div>
            <p className="font-medium text-sm">{uebernahmeLabel}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <FileWarning className="h-4 w-4" />
              Unwirksam
            </div>
            <p className="font-mono font-bold text-lg">{anzahl_unwirksam}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <ClipboardCheck className="h-4 w-4" />
              Zustand
            </div>
            <p className="font-medium text-sm">{aktuellerZustandLabel.split('(')[0].trim()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <Scale className="h-4 w-4" />
              Renovieren?
            </div>
            <Badge
              variant="secondary"
              className={cn(
                'text-xs',
                status === 'valid' && 'bg-status-valid/10 text-status-valid',
                status === 'invalid' && 'bg-status-invalid/10 text-status-invalid',
                status === 'unclear' && 'bg-status-unclear/10 text-status-unclear'
              )}
            >
              {status === 'valid' ? 'Nein' : status === 'invalid' ? 'Ja' : 'Unklar'}
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
