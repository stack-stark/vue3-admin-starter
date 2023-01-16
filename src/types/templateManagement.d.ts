export declare type ReqOptions = {
  [key: string]: any;
  app: Array<AppType>,
  module: Array<ModulesCauType>,
  channel: Array<channelType>,
}

export declare type templateReqParamsType = {
  template_name: string,
  module_id: string | number| undefined,
  channel_id: string | number| undefined,
  module_key: string,
  app_id: string | number | undefined,
  id: string | number | undefined,
  page: number,
  pageSize: number,
}

export declare type TemplateTableDataType = {
  id: number | string,
  app: {id: number | string, app_name: string },
  app_id: number | string,
  channel_ids: Array<string>,
  channel_items: [{key: string, value: number | string, label: string }],
  id: number | string,
  module: {id: number | string, module_name: string },
  module_id: number | string,
  template_name: string,
  status: boolean | number
}


export interface Template_content {
	title: string;
	content: string;
}

export interface Channel {
	id: number;
	created_at: string;
	updated_at: string;
	deleted_at?: any;
	template_id: number;
	channel_id: number;
	template_content: Template_content;
}

export interface TemplateDetailType {
  [key: string]: any;
	id: number;
	created_at: string;
	updated_at: string;
	deleted_at?: any;
	app_id: number;
	module_id: number;
	condition: Condition;
	extra: Extra;
	template_name: string;
	space_id: number;
	status: number;
	channel_ids: string;
	channels: Channel[];
  channel_config: {}
}

export interface templateViewRef {
  drawerVisible: Ref<boolean>,
  templateViewData: Ref<TemplateDetailType | {}>,
  showDrawer: (id: number | string) => void,
  onClose: () => void,
  getDetailById: (id: string | number) => void,
}

export interface TemplateEditRef {
  drawerVisibleEdit: Ref<boolean>,
  templateViewData: Ref<TemplateDetailType | {}>,
  showDrawerEdit: (id?: number | string) => void,
  onClose: () => void,
  getDetailById: (id: string | number) => void,
}

export interface ModulesSendMessageRef {
  sendVisible: Ref<boolean>,
  templateViewData: Ref<TemplateDetailType | {}>,
  showSendDrawer: (id?: number | string) => void,
  onClose: () => void,
  getDetailById: (id: string | number) => void,
}



export interface ConditionEdit {
  fields: Array<any>,
  join: string,
}

export interface TemplateEditType {
	app_id: number | string | undefined;
	id?: number | string | undefined;
	template_name: string;
	module_id: number | string;
	channel_ids: string | Array<string | number>;
	condition: ConditionEdit;
	extra: Array<{key: string, value: string | number}>;
  template: Array<any>;
}


export interface Option {
	label: string;
	value: string;
}

export interface ModuleFieldsListType {
	name: string;
	field: string;
	type: string;
	options?: Option[];
	value?: number | string;
  condition: string;
}

export export declare type channelTemplateType = {
	type: string;
	label: string;
	require: boolean;
	value: string;
	name: string;
}

export declare type SendCauType =  {
  template_name: string,
  module_key: string,
  id?: string | number,
  at: any,
  atType: number | string,
  app_id: string | number,
  module_fields: Array<FieldType>,
  role: number | string,
  is_all: number,
  app_name: string,
  extra?: any,
  user_ids: string | Array<any>,
  platform_id?: string | number,
  template: Array<any>,
  channel_ids?: Array<any>,
  channel?: Array<any>,
  user_ids: []
}


export interface userType {
	id: number;
	account: string;
	nickname: string;
	im_user_id: string;
}