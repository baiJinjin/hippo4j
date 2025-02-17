import { useAntdTable } from 'ahooks';
import { Button, Form, Input, Row, Space, Table, Col, Modal } from 'antd';
import { SearchOutlined, EditOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { fetchItemList } from './service';
import { useUrlSet } from '@/hooks/useUrlSet';
import style from './index.module.less';
import ItemCreate from './create';

const baseColumns = [
  {
    title: '序号',
    dataIndex: 'index',
    with: 200,
  },
  {
    title: '租户',
    dataIndex: 'tenantId',
    with: 200,
  },
  {
    title: '项目',
    dataIndex: 'itemId',
    with: 200,
  },
  {
    title: '项目名称',
    dataIndex: 'itemName',
    with: 200,
  },
  {
    title: '负责人',
    dataIndex: 'owner',
    with: 200,
  },
  {
    title: '修改时间',
    dataIndex: 'gmtModified',
  },
];

const Tenant: React.FC = () => {
  const [editVisible, setEditVisible] = useState(false);
  const [type, setType] = useState('add');
  const [curItem, setCurItem] = useState({});
  const [form] = Form.useForm();
  const { setUrl } = useUrlSet({ form });
  const { tableProps, search } = useAntdTable(fetchItemList, { form });
  // const {run: delete} = useRequest(fetchDeleteTenant, { manual: true });
  const handleSearch = () => {
    setUrl();
    search.submit();
  };
  const handleDelete = (item: any) => {
    Modal.confirm({
      title: `此操作将删除${item.itemName}, 是否继续?`,
      onOk: () => {
        search.submit();
      },
    });
  };
  const actions = (type: string, item?: any) => {
    switch (type) {
      case 'add':
        setType('add');
        setEditVisible(true);
        break;
      case 'edit':
        setType('edit');
        setCurItem(item);
        setEditVisible(true);
        break;
      case 'delete':
        handleDelete(item);
        break;
      default:
        break;
    }
  };
  const handleClose = () => {
    setEditVisible(false);
  };

  return (
    <div className={style.tenant_wrapper}>
      <Form form={form} wrapperCol={{ span: 23 }}>
        <Row>
          <Col span={6}>
            <Form.Item name="note">
              <Input placeholder="项目" />
            </Form.Item>
          </Col>
          <Col span={18}>
            <Space>
              <Button onClick={() => handleSearch()} type="primary" icon={<SearchOutlined />}>
                搜索
              </Button>
              <Button onClick={() => setEditVisible(true)} type="primary" icon={<EditOutlined />}>
                添加
              </Button>
            </Space>
          </Col>
        </Row>
        <Row>
          <Col span={6}></Col>
          <Col span={18}></Col>
        </Row>
      </Form>
      <Table
        {...tableProps}
        bordered
        rowKey="index"
        scroll={{ x: 1000 }}
        columns={[
          ...baseColumns,
          {
            title: '操作',
            key: 'action',
            render: (text: string, record: any) => {
              return (
                <Space>
                  <Button onClick={() => actions('edit', record)} type="link" className={style.opreate_btn}>
                    编辑
                  </Button>
                  <Button onClick={() => actions('delete', record)} type="link" className={style.opreate_btn}>
                    删除
                  </Button>
                </Space>
              );
            },
          },
        ]}
      />
      <ItemCreate data={curItem} onClose={handleClose} visible={editVisible} type={type} />
    </div>
  );
};

export default Tenant;
