import { JoinDataType } from '@/types/conditions'

export const joinOptions: Array<JoinDataType> = [
  {
    key: 'OR',
    value: 'or',
    label: '且',
  },
  {
    key: 'AND',
    value: 'and',
    label: '或',
  },
]

export const conditionOptions: Array<JoinDataType> = [
  {
    key: 'LESS',
    value: '<',
    label: '小于',
  },
  {
    key: 'LESS_OR_EQUAL',
    value: '<=',
    label: '小于等于',
  },
  {
    key: 'MORE',
    value: '>',
    label: '大于',
  },
  {
    key: 'MORE_OR_EQUAL',
    value: '>=',
    label: '大于等于',
  },
  {
    key: 'NO_EQUAL',
    value: '!=',
    label: '不等于',
  },
  {
    key: 'EQUAL',
    value: '==',
    label: '等于',
  },
  {
    key: 'IN',
    value: 'in',
    label: '包含',
  },
  {
    key: 'OUT',
    value: 'out',
    label: '不包含',
  },
]
