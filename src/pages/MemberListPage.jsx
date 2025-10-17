import React, { useState, useEffect } from 'react';
import { Card, Tag, Typography, message, Spin, Table } from 'antd';
import { UserOutlined, PhoneOutlined } from '@ant-design/icons';
import registrationService from '../services/registration';
import './MemberListPage.css';

const { Title, Text } = Typography;

const MemberListPage = () => {
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const response = await registrationService.getAllRegistrations();
      if (response.code === 200) {
        setMembers(response.data);
      } else {
        message.error(response.message || '获取报名信息失败');
      }
    } catch (error) {
      message.error(error.message || '获取报名信息失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const getCoursePackageText = (coursePackage) => {
    switch(coursePackage) {
      case 'PACKAGE_30':
        return '30课时';
      case 'PACKAGE_60':
        return '60课时';
      default:
        return coursePackage;
    }
  };

  const getCoursePackageColor = (coursePackage) => {
    switch(coursePackage) {
      case 'PACKAGE_30':
        return 'blue';
      case 'PACKAGE_60':
        return 'green';
      default:
        return 'default';
    }
  };


  return (
    <div className="member-list-page">
      <div className="member-list-container">
        <Card className="member-list-card" bordered={false}>
          <div className="page-header">
            <div className="header-content">
              <div className="brand-info">
                <img src="/logo.png" alt="飓风乒乓" className="header-logo" />
                <div className="title-group">
                  <Title level={2} className="page-title">
                    📋 报名详情列表
                  </Title>
                  <Text type="secondary" className="page-subtitle">
                    飓风乒乓中关村校区 - 10月18日店庆活动
                  </Text>
                </div>
              </div>
            </div>
          </div>


          <div className="members-section">
            <Table
              columns={[
                {
                  title: '序号',
                  key: 'index',
                  width: '15%',
                  align: 'center',
                  render: (text, record, index) => (
                    <span style={{ 
                      fontWeight: '600', 
                      color: '#667eea',
                      fontSize: '16px'
                    }}>
                      {index + 1}
                    </span>
                  ),
                },
                {
                  title: '姓名',
                  dataIndex: 'name',
                  key: 'name',
                  width: '25%',
                  render: (name) => (
                    <span style={{ fontWeight: '600' }}>{name}</span>
                  ),
                },
                {
                  title: '联系电话',
                  dataIndex: 'phone',
                  key: 'phone',
                  width: '35%',
                  render: (phone) => (
                    <span>{phone}</span>
                  ),
                },
                {
                  title: '课程包',
                  dataIndex: 'coursePackage',
                  key: 'coursePackage',
                  width: '25%',
                  align: 'center',
                  render: (coursePackage) => (
                    <Tag 
                      color={getCoursePackageColor(coursePackage)} 
                      style={{ fontSize: '14px', padding: '4px 12px', fontWeight: '600' }}
                    >
                      {getCoursePackageText(coursePackage)}
                    </Tag>
                  ),
                }
              ]}
              dataSource={members}
              rowKey="id"
              loading={loading}
              pagination={false}
              className="member-table"
              locale={{
                emptyText: (
                  <div className="empty-state">
                    <UserOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
                    <Text type="secondary">暂无报名数据</Text>
                  </div>
                )
              }}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MemberListPage;

