'use client';

import { Table } from 'antd';
import type { TableProps } from 'antd';
import classNames from 'classnames';

type Props<T> = {
  columns: TableProps<T>['columns'];
  data: T[];
  rowKey?: string;
  loading?: boolean;
  className?: string;
};

const AntdTable = <T extends object>({
  columns,
  data,
  rowKey = 'id',
  loading,
  className,
}: Props<T>) => {
  return (

    <div
      className={classNames(
        'bg-white dark:bg-white/[0.03] rounded-2xl shadow-md p-4 overflow-x-auto border border-gray-200 dark:border-white/[0.05]',
        className
      )}
    >
      <Table
        columns={columns}
        dataSource={data}
        rowKey={rowKey}
        loading={loading}
        pagination={{ pageSize: 10 }}
        className=' overflow-hidden rounded-xl  border border-gray-200  bg-white dark:border-white/[0.05] dark:bg-white/[0.03]'
        scroll={{ x: 'max-content' }} 
      />
    </div>
  );
};

export default AntdTable;
