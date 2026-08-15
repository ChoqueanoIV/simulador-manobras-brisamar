export type SwitchPosition = 'A' | 'B';

export type SwitchId =
  | 'AMV-01'
  | 'AMV-02'
  | 'AMV-03'
  | 'AMV-04'
  | 'AMV-05'
  | 'AMV-06'
  | 'AMV-07'
  | 'AMV-08'
  | 'AMV-09'
  | 'AMV-10'
  | 'AMV-11'
  | 'AMV-12';

export type SwitchState = {
  id: SwitchId;
  position: SwitchPosition;
  occupied: boolean;
};

export type IntervalState = 'not-granted' | 'granted';

export type SwitchDefinition = {
  id: SwitchId;
  positionA: string;
  positionB: string;
  intervalRule: 'none' | 'full-lock' | 'restricted-position';
  allowedWithoutInterval?: SwitchPosition;
};
