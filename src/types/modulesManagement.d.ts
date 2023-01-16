export declare type ModulesTableDataType = {
  id: number,
  title?: string,
  name?: string,
}

export declare type ModulesSearchParams = { 
  module_name: string,
  id: string | number,
  module_key: string,
  app_id: string | number | undefined,
}

export declare type ModulesReqParamsType = ModulesSearchParams  & {
  page: number,
  pageSize: number,
}

declare type  FieldType = {
  field: string,
  name: string,
  value: string,
  disabled?: boolean,
}

export declare type ModulesCauType =  {
  module_name: string,
  module_key: string,
  id?: string | number,
  app_id: string | number | undefined,
  module_fields: Array<FieldType>
}

export declare interface ModulesEditInterface {
  editType: Ref<number>,
  moduleForm: Ref<ModulesCauType>,
  showDrawer: (id?: string | number) => void
}


export declare type ModuleListType = {
	id: number;
	module_name: string;
	module_key: string;
	app_id: number;
	app: {
    id: number;
	  app_name: string;
  };
}
