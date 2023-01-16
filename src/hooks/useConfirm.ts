import { Modal } from 'ant-design-vue';
import { createVNode } from 'vue';
import { ExclamationCircleFilled } from '@ant-design/icons-vue';
export const useConfirm = (title: string, content: string, okRun:(...args: any[]) => any, cancelRun:(...args: any[]) => any) => {
  Modal.confirm({
    title: title,
    icon: createVNode(ExclamationCircleFilled),
    content: content,
    onOk: okRun,
    cancelText: '取消',
    okText: '确定',
    onCancel: cancelRun,
    class: 'use-confirm',
  });
  return useConfirm
}