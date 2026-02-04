export type UebernahmeZustand = 'renoviert' | 'unrenoviert' | 'teilrenoviert';
export type AktuellerZustand = 'gut' | 'normal' | 'stark';

export interface SchoenheitsreparaturenInput {
  // Gruppe 1: Übernahme der Wohnung
  uebernahme_zustand: UebernahmeZustand;
  einzugsdatum: string;
  renovierung_bei_einzug: boolean;

  // Gruppe 2: Klauseln im Mietvertrag
  hat_fristenplan: boolean;
  fristen_starr: boolean;
  fristen_weich: boolean;
  farbvorgabe: boolean;
  quotenklausel: boolean;
  endrenovierung: boolean;

  // Gruppe 3: Aktuelle Situation
  wohnung_zustand_aktuell: AktuellerZustand;
  letzte_renovierung: string;
}

export interface BGHUrteil {
  urteil: string;
  text: string;
}

export interface UnwirksameKlausel {
  klausel: string;
  grund: string;
  bgh: BGHUrteil;
}

export interface WirksameKlausel {
  klausel: string;
  grund: string;
}

export interface SchoenheitsreparaturenResult {
  uebernahme_zustand: UebernahmeZustand;
  wohnung_zustand_aktuell: AktuellerZustand;
  unwirksame_klauseln: UnwirksameKlausel[];
  wirksame_klauseln: WirksameKlausel[];
  hinweise: string[];
  muss_renovieren: boolean;
  empfehlung: string;
  anzahl_unwirksam: number;
  rechtslage_klar: boolean;
}

export const ZUSTAENDE = [
  { value: 'renoviert' as const, label: 'Renoviert übernommen' },
  { value: 'unrenoviert' as const, label: 'Unrenoviert übernommen' },
  { value: 'teilrenoviert' as const, label: 'Teilweise renoviert' }
];

export const AKTUELLER_ZUSTAND = [
  { value: 'gut' as const, label: 'Guter Zustand (wenig Gebrauchsspuren)' },
  { value: 'normal' as const, label: 'Normale Abnutzung (übliche Spuren)' },
  { value: 'stark' as const, label: 'Stark abgenutzt (deutliche Schäden)' }
];

export const BGH_URTEILE = {
  starre_fristen: {
    urteil: 'BGH VIII ZR 360/03 vom 23.06.2004',
    text: 'Starre Fristenpläne sind unwirksam'
  },
  unrenoviert: {
    urteil: 'BGH VIII ZR 185/14 vom 18.03.2015',
    text: 'Bei unrenovierter Übernahme ist Schönheitsreparaturklausel unwirksam'
  },
  quotenklausel: {
    urteil: 'BGH VIII ZR 52/06 vom 18.10.2006',
    text: 'Quotenklauseln sind generell unwirksam'
  },
  endrenovierung: {
    urteil: 'BGH VIII ZR 316/06 vom 12.09.2007',
    text: 'Endrenovierungsklauseln sind unwirksam'
  }
};
