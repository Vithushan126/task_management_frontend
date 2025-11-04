'use client';

import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import AutoSaveTable from './AutoSaveTable';

export default function Task() {
  return (
    <div className="space-y-4 scroll-y-none">
      <PageBreadcrumb pageTitle="Tasks Management" />
      <AutoSaveTable />
    </div>
  );
}
