'use client';

import { Modal } from 'antd';
import type { ReactNode } from 'react';

type BaseModalProps = {
  isOpen: boolean;
  title?: string;
  onClose: () => void;
  onOk?: () => void;
  okText?: string;
  cancelText?: string;
  children: ReactNode;
  hideFooter?: boolean;
  width?: number | string; 
};

const BaseModal = ({
  isOpen,
  title,
  onClose,
  onOk,
  okText = 'Submit',
  cancelText = 'Cancel',
  children,
   hideFooter =true,
   width = 600
}: BaseModalProps) => {
  return (
    <Modal
      open={isOpen}
      title={title}
      onCancel={onClose}
      onOk={onOk}
      okText={okText}
      footer={hideFooter ? null : undefined}
      cancelText={cancelText}
      destroyOnHidden
      width={width}
      className=" m-4"
    >
      {children}
    </Modal>
  );
};

export default BaseModal;
