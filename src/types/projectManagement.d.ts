export declare type ProjectReqParamsType = {
  name?: string
  page: number
  pageSize: number
}

export declare type ProjectTableColumnsType = {
  title: string
  key?: string
  dataIndex?: string
  width: number
}

declare type AppType = {
  app_id: number
  id: number | string
  platform_id: number
  app: { id: number; app_name: string }
}

export declare type ProjectTableDataType = {
  id: number
  title?: string
  name?: string
  app: Array<AppType>
  created_at?: string
  deleted_at?: null
  id: number
  platform_key: string
  platform_name: string
  platform_secret: string
  space_id: number
  status: number | boolean
  showSecret: boolean
  updated_at: string
}
