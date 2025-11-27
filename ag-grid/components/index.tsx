import {
  AllCommunityModule,
  ModuleRegistry,
  type ColDef,
} from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import { AgGridReact } from 'ag-grid-react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { mockFunds } from '../mock-data';
import { EquitySectorFilter } from './EquitySectorFilter';
import './index.css';

ModuleRegistry.registerModules([AllCommunityModule]);

export interface Fund {
  id: string;
  name: string;
  category: string;
  tier: number;
  assetClass: string;
  equitySector: string;
  asset: string;
  selected?: boolean;
}

const FundsGrid = () => {
  const gridRef = useRef<AgGridReact>(null);
  const [rowData] = useState<Fund[]>(mockFunds);

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      resizable: true,
      filter: false,
    }),
    []
  );

  const columnDefs: ColDef[] = useMemo(
    () => [
      {
        field: 'selected',
        headerName: '',
        width: 50,
        checkboxSelection: true,
        headerCheckboxSelection: true,
        showDisabledCheckboxes: true,
        suppressMenu: true,
        sortable: false,
        pinned: 'left',
      },
      {
        field: 'name',
        headerName: 'NAME',
        width: 350,
        cellClass: 'name-cell',
        suppressMenu: true,
      },
      {
        field: 'category',
        headerName: 'CATEGORY',
        width: 180,
        cellClass: 'category-cell',
        suppressMenu: true,
      },
      {
        field: 'tier',
        headerName: 'TIER',
        width: 100,
        suppressMenu: true,
      },
      {
        field: 'assetClass',
        headerName: 'ASSET CLASS',
        width: 200,
        cellClass: 'asset-class-cell',
        suppressMenu: true,
      },
      {
        field: 'equitySector',
        headerName: 'EQUITY SECTOR',
        width: 200,
        sortable: false,
        filter: EquitySectorFilter,
      },
      {
        field: 'asset',
        headerName: 'ASSET',
        width: 150,
        suppressMenu: true,
      },
    ],
    []
  );

  const onGridReady = useCallback(() => {
    if (gridRef.current?.api) {
      gridRef.current.api.sizeColumnsToFit();
    }
  }, []);

  return (
    <div className='funds-grid-container'>
      <div className='grid-header'>
        <h2 className='grid-title'>American Funds</h2>
      </div>
      <div className='ag-theme-custom'>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          reactiveCustomComponents={false}
          rowSelection='multiple'
          suppressRowClickSelection={true}
          onGridReady={onGridReady}
          domLayout='autoHeight'
          headerHeight={48}
          rowHeight={48}
        />
      </div>
    </div>
  );
};

export default FundsGrid;
