import { Table } from 'antd';
import type { TableProps } from 'antd';

export interface CustomTableProps<RecordType = any> extends TableProps<RecordType> {}

const CustomTable = <RecordType extends object>(props: CustomTableProps<RecordType>) => {
    console.log(props,'props')
  return <Table<RecordType> {...props} />;
};

export default CustomTable;