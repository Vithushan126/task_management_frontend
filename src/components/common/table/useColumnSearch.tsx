'use client';

import type React from 'react';
import { useRef, useState } from 'react';
import { Input as AntInput, Button, Space } from 'antd';
import type { InputRef } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { ColumnType } from 'antd/es/table';
import type { FilterConfirmProps } from 'antd/es/table/interface';

type DataIndex<T> = keyof T;

type SearchFilterDropdownProps<T> = {
  dataIndex: DataIndex<T>;
  selectedKeys: React.Key[];
  setSelectedKeys: (keys: React.Key[]) => void;
  confirm: (param?: FilterConfirmProps) => void;
  clearFilters?: () => void;
  searchInput: React.RefObject<InputRef>;
  handleSearch: () => void;
  handleReset: () => void;
};

const SearchFilterDropdown = <T extends object>({
  dataIndex,
  selectedKeys,
  setSelectedKeys,
  confirm,
  clearFilters,
  searchInput,
  handleSearch,
  handleReset,
}: SearchFilterDropdownProps<T>) => (
  <div style={{ padding: 8 }}>
    <AntInput
      ref={searchInput}
      placeholder={`Search ${String(dataIndex)}`}
      value={selectedKeys[0]}
      onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
      onPressEnter={handleSearch}
      style={{ marginBottom: 8, display: 'block' }}
    />
    <Space>
      <Button
        type="primary"
        onClick={handleSearch}
        icon={<SearchOutlined />}
        size="small"
        style={{ width: 90 }}
      >
        Search
      </Button>
      <Button onClick={handleReset} size="small" style={{ width: 90 }}>
        Reset
      </Button>
    </Space>
  </div>
);

const useColumnSearch = <T extends object>() => {
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null) as React.RefObject<InputRef>;

  const handleSearch = (
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: string,
  ) => {
    confirm();
    setSearchedColumn(dataIndex);
  };

  const handleReset = (
    setSelectedKeys: (keys: React.Key[]) => void,
    clearFilters?: () => void,
    confirm?: (param?: FilterConfirmProps) => void,
  ) => {
    setSelectedKeys([]);
    clearFilters?.();
    confirm?.();
  };

  const getColumnSearchProps = (dataIndex: DataIndex<T>): ColumnType<T> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <SearchFilterDropdown<T>
        dataIndex={dataIndex}
        selectedKeys={selectedKeys}
        setSelectedKeys={setSelectedKeys}
        confirm={confirm}
        clearFilters={clearFilters}
        searchInput={searchInput}
        handleSearch={() => handleSearch(confirm, String(dataIndex))}
        handleReset={() => handleReset(setSelectedKeys, clearFilters, confirm)}
      />
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      String(record[dataIndex])
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    filterDropdownProps: {
      onOpenChange: (visible: boolean) => {
        if (visible) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
  });

  return { getColumnSearchProps };
};

export default useColumnSearch;
