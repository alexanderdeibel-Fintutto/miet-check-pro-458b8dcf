import { useMemo } from 'react';
import {
  SchoenheitsreparaturenInput,
  SchoenheitsreparaturenResult,
  BGH_URTEILE
} from '@/types/schoenheitsreparaturen';

export function getDefaultSchoenheitsInput(): SchoenheitsreparaturenInput {
  return {
    uebernahme_zustand: 'renoviert',
    einzugsdatum: '',
    renovierung_bei_einzug: false,
    hat_fristenplan: false,
    fristen_starr: false,
    fristen_weich: false,
    farbvorgabe: false,
    quotenklausel: false,
    endrenovierung: false,
    wohnung_zustand_aktuell: 'normal',
    letzte_renovierung: ''
  };
}

export function useSchoenheitsreparaturen(
  input: SchoenheitsreparaturenInput
): SchoenheitsreparaturenResult {
  return useMemo(() => {
    const {
      uebernahme_zustand,
      renovierung_bei_einzug,
      fristen_starr,
      fristen_weich,
      quotenklausel,
      endrenovierung,
      wohnung_zustand_aktuell
    } = input;

    const unwirksame_klauseln: SchoenheitsreparaturenResult['unwirksame_klauseln'] = [];
    const wirksame_klauseln: SchoenheitsreparaturenResult['wirksame_klauseln'] = [];
    const hinweise: string[] = [];

    // Prüfung: Unrenoviert übernommen
    if (uebernahme_zustand === 'unrenoviert' && !renovierung_bei_einzug) {
      unwirksame_klauseln.push({
        klausel: 'Gesamte Schönheitsreparaturklausel',
        grund: 'Wohnung unrenoviert übernommen ohne Ausgleich',
        bgh: BGH_URTEILE.unrenoviert
      });
      hinweise.push('Bei unrenovierter Übernahme müssen Sie gar nicht renovieren!');
    }

    // Prüfung: Starre Fristen
    if (fristen_starr) {
      unwirksame_klauseln.push({
        klausel: 'Starre Fristenklausel',
        grund: '"Spätestens nach X Jahren" ist zu starr',
        bgh: BGH_URTEILE.starre_fristen
      });
    }

    // Prüfung: Weiche Fristen (wirksam bei renovierter Übernahme)
    if (fristen_weich && uebernahme_zustand === 'renoviert') {
      wirksame_klauseln.push({
        klausel: 'Weicher Fristenplan',
        grund: '"In der Regel" oder "im Allgemeinen" ist zulässig'
      });
    }

    // Prüfung: Quotenklausel
    if (quotenklausel) {
      unwirksame_klauseln.push({
        klausel: 'Quotenklausel',
        grund: 'Anteilige Kostenbeteiligung bei Auszug ist immer unwirksam',
        bgh: BGH_URTEILE.quotenklausel
      });
    }

    // Prüfung: Endrenovierung
    if (endrenovierung) {
      unwirksame_klauseln.push({
        klausel: 'Endrenovierungsklausel',
        grund: 'Renovierungspflicht "bei Auszug" ohne Bedarfsprüfung unwirksam',
        bgh: BGH_URTEILE.endrenovierung
      });
    }

    // Ergebnis: Muss renovieren?
    const muss_renovieren =
      unwirksame_klauseln.length === 0 &&
      wirksame_klauseln.length > 0 &&
      uebernahme_zustand === 'renoviert' &&
      wohnung_zustand_aktuell !== 'gut';

    // Empfehlung generieren
    let empfehlung: string;
    if (unwirksame_klauseln.length > 0) {
      empfehlung = 'Sie müssen wahrscheinlich NICHT renovieren. Die Klauseln sind unwirksam.';
    } else if (wohnung_zustand_aktuell === 'gut') {
      empfehlung = 'Keine Renovierung nötig, da normaler Zustand.';
    } else if (wirksame_klauseln.length > 0) {
      empfehlung = 'Renovierung könnte erforderlich sein.';
    } else {
      empfehlung = 'Keine wirksamen Renovierungsklauseln gefunden.';
    }

    return {
      uebernahme_zustand,
      wohnung_zustand_aktuell,
      unwirksame_klauseln,
      wirksame_klauseln,
      hinweise,
      muss_renovieren,
      empfehlung,
      anzahl_unwirksam: unwirksame_klauseln.length,
      rechtslage_klar: unwirksame_klauseln.length > 0 || wohnung_zustand_aktuell === 'gut'
    };
  }, [input]);
}
