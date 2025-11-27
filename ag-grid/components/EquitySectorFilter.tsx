import {
  type IDoesFilterPassParams,
  type IFilterParams,
} from 'ag-grid-community';
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';

const equitySectorOptions = [
  'Materials',
  'Communication Services',
  'Consumer Discretion',
  'Consumer Staples',
  'Energy',
  'Financial',
  'Health Care',
  'Industrials',
  'Real Estate',
  'Technology',
  'Utilities',
  'Multiple',
];

type EquitySectorFilterModel = { values: string[] };
type EquitySectorFilterHandle = {
  isFilterActive: () => boolean;
  doesFilterPass: (params: IDoesFilterPassParams) => boolean;
  getModel: () => EquitySectorFilterModel | null;
  setModel: (model: EquitySectorFilterModel | null) => void;
  getModelAsString: () => string;
  onNewRowsLoaded?: () => void;
  onAnyFilterChanged?: () => void;
  afterGuiAttached?: () => void;
  onDestroy?: () => void;
};

export const EquitySectorFilter = forwardRef<
  EquitySectorFilterHandle,
  IFilterParams
>((params, ref) => {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const selectedValuesRef = useRef<string[]>([]);

  const toggleValue = useCallback(
    (value: string) => {
      const newValues = selectedValuesRef.current.includes(value)
        ? selectedValuesRef.current.filter(v => v !== value)
        : [...selectedValuesRef.current, value];

      selectedValuesRef.current = newValues;
      setSelectedValues(newValues);

      // Notify AG Grid that filter has changed
      params.filterChangedCallback?.();
    },
    [params]
  );

  useImperativeHandle(
    ref,
    () => ({
      isFilterActive: () => {
        return selectedValuesRef.current.length > 0;
      },
      doesFilterPass: (filterParams: IDoesFilterPassParams) => {
        if (selectedValuesRef.current.length === 0) {
          return true;
        }
        const field = params.colDef.field as string;
        const value = (filterParams.data?.[field] as string) || '';
        const passes = selectedValuesRef.current.includes(value);
        console.log('Filter check:', {
          value,
          selected: selectedValuesRef.current,
          passes,
        });
        return passes;
      },
      getModel: (): EquitySectorFilterModel | null =>
        selectedValuesRef.current.length
          ? { values: selectedValuesRef.current }
          : null,
      setModel: (model: EquitySectorFilterModel | null) => {
        const newValues = model?.values ?? [];
        selectedValuesRef.current = newValues;
        setSelectedValues(newValues);
      },
      getModelAsString: () =>
        selectedValuesRef.current.length
          ? selectedValuesRef.current.join(', ')
          : '',
      onNewRowsLoaded: () => undefined,
      onAnyFilterChanged: () => undefined,
      afterGuiAttached: () => undefined,
      onDestroy: () => undefined,
    }),
    [params]
  );

  const checkboxItems = useMemo(
    () =>
      equitySectorOptions.map(option => (
        <label key={option} className='filter-option'>
          <input
            type='checkbox'
            value={option}
            checked={selectedValues.includes(option)}
            onChange={() => toggleValue(option)}
          />
          <span className='checkbox-custom' />
          <span className='filter-label'>{option}</span>
        </label>
      )),
    [selectedValues, toggleValue]
  );

  return (
    <div className='equity-sector-filter'>
      <div className='filter-container'>{checkboxItems}</div>
    </div>
  );
});

EquitySectorFilter.displayName = 'EquitySectorFilter';
