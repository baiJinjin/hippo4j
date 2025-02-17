import React, { useState } from 'react';
import { useAntdTable } from 'ahooks';
import { Button, Form, Input, Row, Space, Table, Col, Modal } from 'antd';
import { SearchOutlined, EditOutlined } from '@ant-design/icons';
import { useUrlSet } from '@/hooks/useUrlSet';
import { fetchTenantList } from './service';
import style from './index.module.less';

const baseColumns = [
  {
    title: '序号',
    dataIndex: 'id',
  },
  {
    title: '租户',
    dataIndex: 'tenantId',
  },
  {
    title: '租户名称',
    dataIndex: 'tenantName',
  },
  {
    title: '负责人',
    dataIndex: 'owner',
  },
  {
    title: '修改时间',
    dataIndex: 'gmtModified',
  },
];

const Tenant: React.FC = () => {
  const [editVisible, setEditVisible] = useState(false);
  const [type, setType] = useState('add');
  const [form] = Form.useForm();
  const { setUrl } = useUrlSet({ form });
  const { tableProps, search } = useAntdTable(fetchTenantList, { form });
  // const {run: delete} = useRequest(fetchDeleteTenant, { manual: true });
  const handleSearch = () => {
    setUrl();
    search.submit();
  };
  const handleDelete = (item: any) => {
    Modal.confirm({
      title: '提示',
      content: `此操作将删除${item.tenantName}，是否继续？`,
      onOk: () => {
        search.submit();
      },
    });
  };
  const actions = (type: string, item?: any) => {
    switch (type) {
      case 'add':
        setEditVisible(true);
        break;
      case 'edit':
        setEditVisible(true);
        break;
      case 'delete':
        handleDelete(item);
        break;
      default:
        break;
    }
  };

  return (
    <div className={style.tenant_wrapper}>
      <Form form={form} wrapperCol={{ span: 23 }}>
        <Row>
          <Col span={6}>
            <Form.Item name="note">
              <Input placeholder="租户" />
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
        rowKey="id"
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
    </div>
  );
};

export default Tenant;
