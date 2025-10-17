import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Radio, message, Space, Typography, Tag, Row, Col, Modal } from 'antd';
import { PhoneOutlined, UserOutlined, GiftOutlined, ClockCircleOutlined, FireOutlined, CheckCircleOutlined } from '@ant-design/icons';
import registrationService from '../services/registration';
import './ActivityPage.css';

const { Title, Paragraph, Text } = Typography;

const ActivityPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [remainingSlots, setRemainingSlots] = useState(10);
  const [isFull, setIsFull] = useState(false);
  const [isActivityStarted, setIsActivityStarted] = useState(false);
  const [isActivityEnded, setIsActivityEnded] = useState(false);
  const [countdown, setCountdown] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [hasRegistered, setHasRegistered] = useState(false);

  // 活动开始时间：2025年10月17日 22:18:00
  const ACTIVITY_START_TIME = new Date('2025-10-17T22:18:00').getTime();
  // 活动结束时间：2025年10月18日 23:59:59
  const ACTIVITY_END_TIME = new Date('2025-10-18T23:59:59').getTime();

  useEffect(() => {
    fetchRemainingSlots();
    const interval = setInterval(fetchRemainingSlots, 10000);
    return () => clearInterval(interval);
  }, []);

  // 检查活动是否开始、是否结束和倒计时
  useEffect(() => {
    const checkActivityTime = () => {
      const now = Date.now();
      const started = now >= ACTIVITY_START_TIME;
      const ended = now > ACTIVITY_END_TIME;
      
      setIsActivityStarted(started);
      setIsActivityEnded(ended);

      if (!started) {
        const diff = ACTIVITY_START_TIME - now;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        if (days > 0) {
          setCountdown(`${days}天 ${hours}小时 ${minutes}分 ${seconds}秒`);
        } else if (hours > 0) {
          setCountdown(`${hours}小时 ${minutes}分 ${seconds}秒`);
        } else if (minutes > 0) {
          setCountdown(`${minutes}分 ${seconds}秒`);
        } else {
          setCountdown(`${seconds}秒`);
        }
      }
    };

    checkActivityTime();
    const timer = setInterval(checkActivityTime, 1000);
    return () => clearInterval(timer);
  }, [ACTIVITY_START_TIME, ACTIVITY_END_TIME]);

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
    if (!isActivityStarted) {
      message.warning('活动尚未开始，请耐心等待！');
      return;
    }

    if (isActivityEnded) {
      message.error('活动已结束，无法报名！');
      return;
    }

    if (isFull) {
      message.error('报名名额已满！');
      return;
    }

    setLoading(true);
    try {
      const response = await registrationService.register(values);
      if (response.code === 200) {
        // 标记已报名成功
        setHasRegistered(true);
        // 打开成功模态框
        setShowSuccessModal(true);
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

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
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
                🏓 10月18日店庆特惠！欢迎转发
              </Title>
              <Title level={3} className="activity-subtitle">
                乒乓球培训超值课包来袭！
              </Title>
            </div>
          </div>

          <div className="activity-poster">
            <img 
              src="https://jufengpp.oss-cn-beijing.aliyuncs.com/WechatIMG56.jpg" 
              alt="活动海报" 
              className="poster-image"
            />
          </div>

          <div className="countdown-inline">
            <div className="limited-tag-container">
              <FireOutlined className="fire-icon" />
              <span className="limited-text">限时一天，先到先得</span>
            </div>
            <div className="remaining-slots-card">
              <div className="slots-header">
                <GiftOutlined className="gift-icon" />
                <span className="slots-label">剩余名额</span>
              </div>
              <div className="slots-display">
                <span className="slots-current" style={{ color: remainingSlots > 0 ? '#52c41a' : '#ff4d4f' }}>
                  {remainingSlots}
                </span>
                <span className="slots-divider">/</span>
                <span className="slots-total">10</span>
              </div>
              <div className="slots-progress">
                <div 
                  className="slots-progress-bar" 
                  style={{ 
                    width: `${(10 - remainingSlots) * 10}%`,
                    background: remainingSlots > 5 ? 'linear-gradient(90deg, #52c41a, #73d13d)' : 
                               remainingSlots > 0 ? 'linear-gradient(90deg, #faad14, #ffc53d)' : 
                               'linear-gradient(90deg, #ff4d4f, #ff7875)'
                  }}
                />
              </div>
            </div>
          </div>

          <div className="packages-section">
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Card className="package-card package-card-1" hoverable>
                  <div className="package-header">
                    <span className="package-icon">📦</span>
                    <Title level={4} className="package-title">
                      30课时 <span className="one-on-one-tag">一对一</span>
                    </Title>
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
                    <Title level={4} className="package-title">
                      60课时 <span className="one-on-one-tag">一对一</span>
                    </Title>
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
                      10月17日 22:18 - 10月18日 23:59
                    </div>
            
            {isActivityEnded ? (
              <div className="full-notice">
                <Tag color="default" style={{ fontSize: '16px', padding: '10px 20px' }}>
                  活动已结束，感谢您的关注！
                </Tag>
              </div>
            ) : isFull ? (
              <div className="full-notice">
                <Tag color="error" style={{ fontSize: '16px', padding: '10px 20px' }}>
                  报名名额已满，感谢您的关注！
                </Tag>
              </div>
            ) : !isActivityStarted ? (
              <div className="countdown-notice">
                <div style={{ fontSize: '18px', color: '#fa8c16', marginBottom: '20px', fontWeight: '500', whiteSpace: 'nowrap' }}>
                  <ClockCircleOutlined /> 活动即将开始，请耐心等待
                </div>
                <div className="countdown-timer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Text strong style={{ fontSize: '18px', color: '#1890ff', marginBottom: '10px' }}>
                    距离报名开始还有
                  </Text>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff4d4f', margin: '10px 0', whiteSpace: 'nowrap' }}>
                    {countdown}
                  </div>
                          <Text type="secondary">
                            开始时间：10月17日 22:18
                          </Text>
                </div>
              </div>
            ) : hasRegistered ? (
              <div className="registered-notice">
                <div className="registered-icon-wrapper">
                  <CheckCircleOutlined className="registered-icon" />
                </div>
                <Title level={3} className="registered-title">
                  ✅ 已预约报名成功！
                </Title>
                <Paragraph className="registered-message">
                  感谢您的报名！请联系店长到店缴费并安排上课时间。
                </Paragraph>
                <div className="registered-contact">
                  <div className="registered-qrcode">
                    <img 
                      src="https://jufengpp.oss-cn-beijing.aliyuncs.com/WechatIMG54.jpg" 
                      alt="店长微信二维码" 
                      className="registered-qrcode-image"
                    />
                    <Text strong style={{ marginTop: '12px', display: 'block', color: '#1890ff' }}>
                      扫码联系店长
                    </Text>
                  </div>
                </div>
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

      {/* 报名成功模态框 */}
      <Modal
        open={showSuccessModal}
        onCancel={handleCloseSuccessModal}
        footer={[
          <Button key="close" type="primary" onClick={handleCloseSuccessModal} size="large">
            我知道了
          </Button>
        ]}
        centered
        width={500}
        className="success-modal"
      >
        <div className="success-modal-content">
          <div className="success-icon-wrapper">
            <CheckCircleOutlined className="success-icon" />
          </div>
          <Title level={2} className="success-title">
            🎉 预约成功！
          </Title>
          <Paragraph className="success-message">
            恭喜您成功预约飓风乒乓中关村校区课程！
          </Paragraph>
          <Paragraph className="success-message">
            我们已收到您的报名信息，请扫描下方二维码添加店长微信，确认课程安排。
          </Paragraph>
          
          <div className="success-qrcode-section">
            <div className="success-qrcode-container">
              <img 
                src="https://jufengpp.oss-cn-beijing.aliyuncs.com/WechatIMG54.jpg" 
                alt="店长微信二维码" 
                className="success-qrcode-image"
              />
              <Text strong style={{ marginTop: '15px', display: 'block', fontSize: '16px', color: '#1890ff' }}>
                扫码添加店长微信
              </Text>
              <Text type="secondary" style={{ marginTop: '8px', display: 'block' }}>
                长按识别二维码
              </Text>
            </div>
          </div>

          <div className="success-tips">
            <Title level={5} style={{ marginBottom: '10px', color: '#fa8c16' }}>
              ⚠️ 温馨提示
            </Title>
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
              <li>请尽快添加店长微信确认课程安排</li>
              <li>活动名额有限，以实际确认为准</li>
              <li>如有疑问，请联系店长咨询</li>
            </ul>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ActivityPage;


