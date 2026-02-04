import { useState } from 'react';
import { Header } from '@/components/Header';
import { CheckInputs } from '@/components/schoenheitsreparaturen/CheckInputs';
import { CheckResults } from '@/components/schoenheitsreparaturen/CheckResults';
import { CrossSellBanner } from '@/components/schoenheitsreparaturen/CrossSellBanner';
import { Button } from '@/components/ui/button';
import { RotateCcw, Scale } from 'lucide-react';
import {
  useSchoenheitsreparaturen,
  getDefaultSchoenheitsInput
} from '@/hooks/useSchoenheitsreparaturen';
import type { SchoenheitsreparaturenInput } from '@/types/schoenheitsreparaturen';

const Index = () => {
  const [inputs, setInputs] = useState<SchoenheitsreparaturenInput>(
    getDefaultSchoenheitsInput()
  );
  const results = useSchoenheitsreparaturen(inputs);

  const handleReset = () => {
    setInputs(getDefaultSchoenheitsInput());
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <div className="gradient-primary text-white py-8 px-4">
        <div className="container">
          <div className="flex items-center gap-3 mb-2">
            <Scale className="h-8 w-8" />
            <h1 className="text-3xl md:text-4xl font-bold">
              Schönheitsreparaturen-Check
            </h1>
          </div>
          <p className="text-white/80 text-lg max-w-2xl">
            Prüfen Sie kostenlos, ob die Klauseln zu Schönheitsreparaturen in Ihrem
            Mietvertrag wirksam sind – basierend auf aktueller BGH-Rechtsprechung.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="container py-6">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6">
          {/* Left Column - Inputs */}
          <div className="space-y-4">
            <CheckInputs inputs={inputs} onChange={setInputs} />

            <Button variant="outline" onClick={handleReset} className="w-full">
              <RotateCcw className="h-4 w-4 mr-2" />
              Zurücksetzen
            </Button>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            <div>
              <h2 className="text-xl font-semibold mb-4">Ergebnis</h2>
              <CheckResults results={results} />
            </div>

            {/* Cross-Sell Banner */}
            <CrossSellBanner />
          </div>
        </div>
      </main>

      {/* Mobile Sticky Footer */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground">Renovierungspflicht</div>
            <div
              className={`font-semibold ${
                results.anzahl_unwirksam > 0
                  ? 'text-status-valid'
                  : results.muss_renovieren
                  ? 'text-status-invalid'
                  : 'text-status-unclear'
              }`}
            >
              {results.anzahl_unwirksam > 0
                ? 'Nein'
                : results.muss_renovieren
                ? 'Wahrscheinlich Ja'
                : 'Unklar'}
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            {results.anzahl_unwirksam} unwirksame Klauseln
          </div>
        </div>
      </div>

      {/* Add padding for mobile sticky footer */}
      <div className="lg:hidden h-20" />
    </div>
  );
};

export default Index;
