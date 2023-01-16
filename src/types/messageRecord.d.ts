export declare type MessageReqParamsType = {
  module_id: string | number| undefined,
  channel: string | number| undefined,
  module_key: string,
  title: string,
  id: string,
  accept?: string,
  user_name: string,
  created_atinit: any;
  created_at: Array<string>,
  app_id: string | number | undefined,
  status: string | number | undefined,
  platform_id: string | number | undefined,
  channel_id: string | number | undefined,
  role: string | number | undefined,
  page: number,
  pageSize: number,
}

export interface MessageViewRef {
  drawerVisible: Ref<boolean>,
  templateViewData: Ref<TemplateDetailType | {}>,
  showDrawer: (id: number | string) => void,
  onClose: () => void,
  getDetailById: (id: string | number) => void,
}

export interface SendMessageSuperRefType {
  sendVisible: Ref<boolean>,
  templateViewData: Ref<TemplateDetailType | {}>,
  showSendDrawer: () => void,
  onClose: () => void,
  getDetailById: (id: string | number) => void,
}
