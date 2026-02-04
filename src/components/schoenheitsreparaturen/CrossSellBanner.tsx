import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Receipt, ArrowRight } from 'lucide-react';

export function CrossSellBanner() {
  return (
    <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
      <CardContent className="pt-4">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Receipt className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm">Nebenkostenabrechnung prüfen</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Über 50% aller Nebenkostenabrechnungen sind fehlerhaft. Prüfen Sie jetzt Ihre!
            </p>
            <Button variant="link" className="h-auto p-0 mt-2 text-primary" size="sm">
              Jetzt prüfen
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
