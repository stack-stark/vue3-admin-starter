export declare type TableColumnsTypes = {
  title?: any;
  key?: Key;
  width?: Key;
  class?: string;
  className?: string;
  fixed?: FixedType;
  align?: AlignType;
  dataIndex?: DataIndex;
  customRender?: (opt: {
        value: any;
        text: any;
        record: RecordType;
        index: number;
        renderIndex: number;
        column: ColumnType<RecordType>;
  }) => any | RenderedCell<RecordType>;
}

// interface EventTargetse extends EventTarget {
//   checked: boolean
// }
// export interface CheckboxEvent extends Event {
//   target: EventTargetse
// }

declare type EventTargetse = EventTarget &  {
  checked: boolean
}
declare type CheckboxEvent = Event & {
  target: EventTargetse
}