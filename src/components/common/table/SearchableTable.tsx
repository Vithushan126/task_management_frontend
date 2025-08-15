'use client';

import { Input } from 'antd';
import { useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import Button from '@/components/ui/button/Button';
import AntdTable from './AntdTable';
import BaseModal from '@/components/modal/BaseModal';

type Props<T> = {
  columns: ColumnsType<T>;
  data: T[];
  searchableField?: keyof T;
  rowKey?: string;
  createButtonText?: string;
  modalTitle?: string;
  modalContent?: React.ReactNode;
  isOpen?: boolean;
  openModal?: () => void;
  closeModal?: () => void;
  width?: number | string;
  loading?: boolean;
};

const SearchableTable = <T extends object>({
  columns,
  data,
  loading,
  searchableField,
  rowKey = 'id',
  createButtonText,
  modalTitle,
  modalContent,
  isOpen,
  openModal,
  closeModal,
  width = 600,
}: Props<T>) => {
  const [search, setSearch] = useState('');

  // const filteredData = searchableField?data?.filter(item =>String(item[searchableField]).toLowerCase().includes(search.toLowerCase())): data;
  const filteredData = searchableField
    ? data?.filter((item) =>
        String(item?.[searchableField] ?? '')
          .toLowerCase()
          .includes(search.toLowerCase()),
      )
    : data;

  return (
    <div className="space-y-4 w-full">
      <div className="flex flex-row justify-end items-center ">
        {/* <Input.Search
          placeholder={`Search the ${searchableField ? String(searchableField) : 'field'}`}
          allowClear
          onChange={e => setSearch(e.target.value)}
          className="max-w-sm dark-ant-input"
        /> */}
        <Button size="md" variant="primary" onClick={openModal}>
          {createButtonText}
        </Button>
      </div>

      <AntdTable
        columns={columns}
        data={filteredData}
        rowKey={rowKey}
        loading={loading}
      />

      <BaseModal
        isOpen={isOpen ?? false}
        title={modalTitle}
        onClose={closeModal ?? (() => {})}
        width={width}
      >
        {modalContent}
      </BaseModal>
    </div>
  );
};

export default SearchableTable;
