import { Modal } from 'ant-design-vue';
import { createVNode } from 'vue';
import { ExclamationCircleFilled } from '@ant-design/icons-vue';
export const useInfo = (title: string, content: string) => {
  Modal.warning({
    title: title,
    icon: createVNode(ExclamationCircleFilled),
    content: content,
    onOk: () => {},
    okText: '确定',
    class: 'use-confirm',
  });
  return useInfo
}