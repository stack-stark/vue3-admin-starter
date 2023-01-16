export declare type AppReqParamsType = {
  name?: string,
  page: number,
  pageSize: number,
}

export declare type AppTableColumnsType = {
  title: string,
  key: string,
  dataIndex?: string,
  width: number,
}

export declare type AppTableDataType = {
  id: number,
  title?: string,
  name?: string,
  status?: number | boolean,
  app_key?: string
  app_name: string
  created_at?: string
  deleted_at?: null
  id?: number
  space_id?: string
  updated_at?: string
}

export declare type ProjectTagType = {
  id: number | string,
  title?: string,
  name?: string,
  checked: boolean,
  platform_name?: string,
}

export declare interface AssociatedProject  {
  projectList: Ref<Array<ProjectTagType>>,
  projectTags: Ref<Array<ProjectTagType>>,
  associatedVisible: Ref<boolean>,
  associatedHandleOk: () => void,
  associatedShow: (id: number | string) => void,
  projectTagClose: (id: number | string) => void,
  projectChange: (e: CheckboxEvent, item: ProjectTagType) => void,
}

declare type channelType = {
  id?: string | number,
  name?: string,
  checked?: boolean,
  key: string,
  label?: string,
  value: string | number
}

export declare type FormAppType = {
  appname: string,
  app2?: string,
  channel: Array<channelType>,
  config: any,
  channelValue: Array<string | number>
}

export declare interface ChannelInterface {
  drawerVisible: Ref<boolean>,
  formApp: Ref<FormAppType>,
  basicRef: Ref<FormInstance>
  onShow: (id: number | string) => void,
  onClose: () => void,
  saveChannelReq: () => void,
  basicReq: () => void,
  saveRun: () => void,
}