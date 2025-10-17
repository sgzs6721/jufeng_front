import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Radio, message, Space, Typography, Tag, Statistic, Row, Col } from 'antd';
import { PhoneOutlined, UserOutlined, GiftOutlined, ClockCircleOutlined, FireOutlined } from '@ant-design/icons';
import registrationService from '../services/registration';
import './ActivityPage.css';

const { Title, Paragraph, Text } = Typography;

const ActivityPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [remainingSlots, setRemainingSlots] = useState(10);
  const [isFull, setIsFull] = useState(false);

  useEffect(() => {
    fetchRemainingSlots();
    const interval = setInterval(fetchRemainingSlots, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchRemainingSlots = async () => {
    try {
      const response = await registrationService.getRemainingSlots();
      if (response.code === 200) {
        setRemainingSlots(response.data.remainingSlots);
        setIsFull(response.data.isFull);
      }
    } catch (error) {
      console.error('获取剩余名额失败:', error);
    }
  };

  const handleSubmit = async (values) => {
    if (isFull) {
      message.error('报名名额已满！');
      return;
    }

    setLoading(true);
    try {
      const response = await registrationService.register(values);
      if (response.code === 200) {
        message.success(response.message);
        form.resetFields();
        fetchRemainingSlots();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error.message || '报名失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="activity-page">
      <div className="activity-container">
        <Card className="activity-card" bordered={false}>
          <div className="activity-header">
            <div className="header-icon">🏓</div>
            <Title level={2} className="activity-title">
              10月18日店庆特惠！
            </Title>
            <Title level={3} className="activity-subtitle">
              乒乓球培训超值课包来袭！
            </Title>
          </div>

          <div className="countdown-section">
            <Tag color="red" className="limited-tag">
              <FireOutlined /> 限时一天，先到先得
            </Tag>
            <Statistic 
              title="剩余名额" 
              value={remainingSlots} 
              suffix="/ 10"
              valueStyle={{ color: remainingSlots > 0 ? '#3f8600' : '#cf1322' }}
            />
          </div>

          <div className="packages-section">
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Card className="package-card package-card-1" hoverable>
                  <div className="package-icon">📦</div>
                  <Title level={4}>课包一：30课时</Title>
                  <div className="package-price">
                    <div className="current-price">¥7,588</div>
                    <div className="original-price">原价：¥9,000</div>
                  </div>
                  <div className="package-discount">
                    <Tag color="volcano">立省 ¥1,412</Tag>
                  </div>
                  <Paragraph className="package-validity">
                    <ClockCircleOutlined /> 有效期：6个月
                  </Paragraph>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card className="package-card package-card-2" hoverable>
                  <div className="package-icon">📦</div>
                  <Title level={4}>课包二：60课时</Title>
                  <div className="package-price">
                    <div className="current-price">¥14,488</div>
                    <div className="original-price">原价：¥18,000</div>
                  </div>
                  <div className="package-discount">
                    <Tag color="volcano">立省 ¥3,512</Tag>
                  </div>
                  <Paragraph className="package-validity">
                    <ClockCircleOutlined /> 有效期：12个月
                  </Paragraph>
                </Card>
              </Col>
            </Row>
          </div>

          <div className="highlights-section">
            <Title level={4} className="section-title">
              <GiftOutlined /> 活动亮点
            </Title>
            <ul className="highlights-list">
              <li>✨ 专业教练一对一指导</li>
              <li>✨ 限定教练，品质保证</li>
              <li>✨ 先到先得，手慢无</li>
              <li>✨ 仅限10月18日当天</li>
            </ul>
          </div>

          <div className="registration-section">
            <Title level={4} className="section-title">
              立即抢购
            </Title>
            <Paragraph className="activity-time">
              ⏰ 活动时间：2025年10月18日 00:00-23:59
            </Paragraph>
            
            {isFull ? (
              <div className="full-notice">
                <Tag color="error" style={{ fontSize: '16px', padding: '10px 20px' }}>
                  报名名额已满，感谢您的关注！
                </Tag>
              </div>
            ) : (
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                className="registration-form"
              >
                <Form.Item
                  label="姓名"
                  name="name"
                  rules={[{ required: true, message: '请输入您的姓名' }]}
                >
                  <Input 
                    prefix={<UserOutlined />} 
                    placeholder="请输入您的姓名" 
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  label="联系电话"
                  name="phone"
                  rules={[
                    { required: true, message: '请输入您的联系电话' },
                    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码' }
                  ]}
                >
                  <Input 
                    prefix={<PhoneOutlined />} 
                    placeholder="请输入您的联系电话" 
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  label="选择课程包"
                  name="coursePackage"
                  rules={[{ required: true, message: '请选择课程包' }]}
                >
                  <Radio.Group className="course-radio-group">
                    <Radio.Button value="PACKAGE_30" className="course-radio">
                      <div className="radio-content">
                        <div className="radio-title">课包一</div>
                        <div className="radio-detail">30课时 / ¥7,588</div>
                      </div>
                    </Radio.Button>
                    <Radio.Button value="PACKAGE_60" className="course-radio">
                      <div className="radio-content">
                        <div className="radio-title">课包二</div>
                        <div className="radio-detail">60课时 / ¥14,488</div>
                      </div>
                    </Radio.Button>
                  </Radio.Group>
                </Form.Item>

                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    loading={loading}
                    size="large"
                    block
                    className="submit-button"
                  >
                    立即报名
                  </Button>
                </Form.Item>
              </Form>
            )}
          </div>

          <div className="contact-section">
            <Text type="secondary">
              📞 咨询方式：电话/微信咨询
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ActivityPage;

