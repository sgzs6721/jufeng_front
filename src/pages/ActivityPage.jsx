import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Radio, message, Space, Typography, Tag, Row, Col } from 'antd';
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
            <div className="brand-section">
              <img src="/logo.png" alt="飓风乒乓" className="brand-logo" />
              <Title level={2} className="brand-name">
                飓风乒乓中关村校区
              </Title>
            </div>
            <div className="activity-content">
              <Title level={2} className="activity-title">
                🏓 10月18日店庆特惠！
              </Title>
              <Title level={3} className="activity-subtitle">
                乒乓球培训超值课包来袭！
              </Title>
              <div className="countdown-inline">
                <Tag color="red" className="limited-tag">
                  <FireOutlined /> 限时一天，先到先得
                </Tag>
                <div className="remaining-slots">
                  <div className="slots-label">剩余名额</div>
                  <div className="slots-value" style={{ color: remainingSlots > 0 ? '#3f8600' : '#cf1322' }}>
                    {remainingSlots} / 10
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="activity-poster">
            <img 
              src="https://jufengpp.oss-cn-beijing.aliyuncs.com/WechatIMG56.jpg" 
              alt="活动海报" 
              className="poster-image"
            />
          </div>

          <div className="packages-section">
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Card className="package-card package-card-1" hoverable>
                  <div className="package-header">
                    <span className="package-icon">📦</span>
                    <Title level={4} className="package-title">30课时</Title>
                  </div>
                  <div className="package-price-row">
                    <div className="current-price">¥7,588</div>
                    <div className="price-details">
                      <div className="original-price">¥9,600</div>
                      <Tag color="volcano" className="discount-tag">省¥2,012</Tag>
                    </div>
                  </div>
                  <div className="package-validity">
                    <ClockCircleOutlined /> 4个月有效（排除寒假）
                  </div>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card className="package-card package-card-2" hoverable>
                  <div className="package-header">
                    <span className="package-icon">📦</span>
                    <Title level={4} className="package-title">60课时</Title>
                  </div>
                  <div className="package-price-row">
                    <div className="current-price">¥14,488</div>
                    <div className="price-details">
                      <div className="original-price">¥16,800</div>
                      <Tag color="volcano" className="discount-tag">省¥2,312</Tag>
                    </div>
                  </div>
                  <div className="package-validity">
                    <ClockCircleOutlined /> 9个月有效（排除寒假）
                  </div>
                </Card>
              </Col>
            </Row>
          </div>

          <div className="notice-section">
            <Title level={4} className="notice-title">
              ⚠️ 活动说明
            </Title>
            <div className="notice-list">
              <div className="notice-item">
                <span className="notice-icon">🆕</span>
                <Text>限新学员报名</Text>
              </div>
              <div className="notice-item">
                <span className="notice-icon">📌</span>
                <Text>活动严格按有效期，过期不退不补，有多训练需求的学员报名</Text>
              </div>
              <div className="notice-item">
                <span className="notice-icon">🎁</span>
                <Text>课包不包含赠品，学员自备球拍、球衣、球包，三件套可从我机构优惠购买，299元/套</Text>
              </div>
              <div className="notice-item">
                <span className="notice-icon">👨‍🏫</span>
                <Text>此活动不可选择教练，如有选择教练需求请报名正式课并与店长沟通</Text>
              </div>
            </div>
          </div>

          <div className="registration-section">
            <Title level={3} className="registration-title-main">
              ⏰ 活动时间
            </Title>
            <div className="registration-datetime">
              2025年10月18日 00:00-23:59
            </div>
            
            <div className="age-notice">
              <Tag color="blue" className="age-tag">
                👶 适用年龄：5-12岁
              </Tag>
            </div>
            
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
                  rules={[{ required: true, message: '请输入家长姓名或孩子姓名' }]}
                >
                  <Input 
                    prefix={<UserOutlined />} 
                    placeholder="请输入家长姓名或孩子姓名" 
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
            <div className="address-block">
              <Title level={4} className="contact-title">
                📍 场馆地址
              </Title>
              <Paragraph className="address-text">
                北京市海淀区苏州街18号院2号<br/>
                长远天地大厦B1座2层2204、2206
              </Paragraph>
            </div>
            
            <div className="divider-line"></div>
            
            <div className="qrcode-block">
              <Title level={4} className="contact-title">
                📞 扫码咨询
              </Title>
              <Paragraph type="secondary" style={{ marginBottom: '20px' }}>
                扫描下方二维码，添加教练微信咨询详情
              </Paragraph>
              <div className="qrcode-container">
                <img 
                  src="https://jufengpp.oss-cn-beijing.aliyuncs.com/WechatIMG54.jpg" 
                  alt="教练微信二维码" 
                  className="qrcode-image"
                />
                <Text type="secondary" style={{ marginTop: '10px', display: 'block' }}>
                  长按识别二维码添加微信
                </Text>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ActivityPage;


