'use client';

import { Input, Radio } from 'antd';
import { useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import AntdTable from './AntdTable';
import Button from '@/components/ui/button/Button';
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
  radioOptions?: { label: string; value: string }[]; // dynamic radio options
  onRadioChange?: (value: string) => void;
  pagination?: any;
  onChange?: (pagination: any, filters: any, sorter: any) => void;
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
  radioOptions = [],
  onRadioChange,
  pagination,
  onChange,
}: Props<T>) => {
  const [search, setSearch] = useState('');
  const [selectedRadio, setSelectedRadio] = useState<string>(
    radioOptions?.[0]?.value || '',
  );

  const handleRadioChange = (e: any) => {
    setSelectedRadio(e.target.value);
    onRadioChange?.(e.target.value); // call parent callback if provided
  };

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
      <div
        className={`flex flex-row items-end ${
          radioOptions.length > 0 ? 'justify-between' : 'justify-end'
        }`}
      >
        {/* Optional Radio Group */}
        {radioOptions.length > 0 && (
          <Radio.Group
            options={radioOptions}
            onChange={handleRadioChange}
            value={selectedRadio}
            optionType="button"
            buttonStyle="solid"
          />
        )}

        {/* Create Button */}
        <Button size="md" variant="primary" onClick={openModal}>
          {createButtonText}
        </Button>
      </div>

      <AntdTable
        columns={columns}
        data={filteredData}
        rowKey={rowKey}
        loading={loading}
        pagination={pagination}
        onChange={onChange}
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
