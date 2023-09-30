import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Typography, Radio, Button, Checkbox, Select, Form, Input, Card, Divider, Space, Col, Row, ConfigProvider } from 'antd';
import { ReactComponent as PreviewBgSvg } from './svg/preview/bg/preview.svg';
import { ReactComponent as PreviewBgColorSvg } from './svg/preview/bg/preview-color.svg';
import { ReactComponent as PreviewSingleSvg } from './svg/preview/single/preview.svg';
import { ReactComponent as PreviewSingleColorSvg } from './svg/preview/single/preview-color.svg';
import { saveAs } from 'file-saver';
import domtoimage from 'dom-to-image';

const { Title, Text, Link } = Typography;
const { Option } = Select;
const { Meta } = Card;

const App = () => {
  const [color, setColor] = useState('white');
  const [size, setSize] = useState('16x16');
  const [format, setFormat] = useState('SVG');
  const [isBackgroundSelected, setBackgroundSelected] = useState(true);
  const [isCustomSelected, setCustomSelected] = useState(false);
  const [customColor, setCustomColor] = useState('');
  const [imgColor, setImgColor] = useState('black');
  const svgContainerRef = useRef(null);

  const config = {
    "token": {
      "fontFamily": "'Kanit', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
      "fontSize": 16,
      "sizeStep": 6,
      "colorPrimary": "#141414",
      "colorInfo": "#F6832D",
      "colorLink": "#F6832D",
      "borderRadius": 8,
    },
    "components": {
      "Checkbox": {
        "colorPrimary": "rgb(40, 40, 40)"
      },
      "Divider": {
        "colorSplit": "rgba(196, 196, 196, 0.4)"
      },
      "Button": {
        "controlHeight": 40,
        "colorPrimaryHover": "rgb(67, 67, 67)"
      },
      "Card": {
        "fontSize": 14,
        "colorBorderSecondary": "rgb(223, 223, 223)"
      },
      "Radio": {
        "colorPrimary": "rgb(40, 40, 40)"
      }
    },
  };

  const [isAnimated, setIsAnimated] = useState(false);

  const handleColorChange = (e) => {
    setColor(e.target.value);
    setCustomSelected(e.target.value === 'custom');
    setImgColor(e.target.value === 'custom' ? customColor : e.target.value === 'white' ? 'black' : 'white');
  };

  const handleSizeChange = (value) => {
    setSize(value);
  };

  const handleFormatChange = (e) => {
    setFormat(e.target.value);
  };

  const handleBackgroundChange = (e) => {
    setBackgroundSelected(e.target.checked);
  };

  const handleCustomChange = (e) => {
    setCustomColor(e.target.value);
  };

  const handleDownload = () => {
    if (format === 'SVG' && size !== 'unselected') {
      const svgElement = getSvgElement();
      const newSvgContainer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      const svgComponent = React.createElement(svgElement, {
        fill: isCustomSelected ? customColor : imgColor,
        width: size.split('x')[0],
        height: size.split('x')[1],
      });
      ReactDOM.render(svgComponent, newSvgContainer);

      const svgString = new XMLSerializer().serializeToString(newSvgContainer);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });

      saveAs(svgBlob, 'threads-logo.svg');
    }

    if (format === 'PNG' && size !== 'unselected') {
      const svgElement = getSvgElement();
      const newSvgContainer = document.createElement('div');
      const svgComponent = React.createElement(svgElement, {
        fill: isCustomSelected ? customColor : imgColor,
        width: size.split('x')[0],
        height: size.split('x')[1],
      });
      ReactDOM.render(svgComponent, newSvgContainer);

      domtoimage
        .toPng(newSvgContainer, {
          width: parseInt(size.split('x')[0]),
          height: parseInt(size.split('x')[1]),
          style: { background: 'transparent' },
        })
        .then((dataUrl) => {
          const blob = dataURLToBlob(dataUrl);
          saveAs(blob, 'threads-logo.png');
        });
    }
  };

  const getSvgElement = () => {
    if (isBackgroundSelected && color === 'color') {
      return PreviewBgColorSvg;
    } else if (!isBackgroundSelected && color === 'color') {
      return PreviewSingleColorSvg;
    } else if (isBackgroundSelected) {
      return PreviewBgSvg;
    } else {
      return PreviewSingleSvg;
    }
  };

  const SvgComponent = getSvgElement();

  const dataURLToBlob = (dataURL) => {
    const parts = dataURL.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const byteString = atob(parts[1]);
    let arrayBuffer = new ArrayBuffer(byteString.length);
    let intArray = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      intArray[i] = byteString.charCodeAt(i);
    }
    return new Blob([arrayBuffer], { type: contentType });
  };

  const isDownloadDisabled = color === 'unselected' || size === 'unselected';

  useEffect(() => {
    document.title = 'Threads logo download free SVG, PNG';
    if (color === 'black') {
      document.body.style.backgroundColor = '#141414';
    } else {
      document.body.style.backgroundColor = '#fafafa';
    };
    setIsAnimated(true);
  }, [color]);

  const [screenWidth] = useState(window.innerWidth);

  //Styles
  const svgStyle =
  screenWidth <= 375
    ? { width: '240px', height: '240px' }
    : { width: '320px', height: '320px' };

  const svgconteinerStyle =
  screenWidth <= 375
    ? { width: '240px', height: '240px' }
    : { width: '320px', height: '320px' };

  const alignconteinerStyle =
  screenWidth <= 375
    ? { alignItems: 'center' }
    : { alignItems: 'flex-start' };

  const btnStyle =
  screenWidth <= 375
    ? { width: '240px', marginBottom: '2em' }
    : { width: '320px' };

  const dividerStyle =
  screenWidth <= 768
    ? { display: 'none' }
    : { display: 'flex', alignItems: 'center', marginRight: '2em' };


  const styles = {
    padding: window.innerWidth <= 768 
    ? '0 8px' 
    : '0 48px',
  };

  const recently = {
    padding: window.innerWidth <= 768 
    ? '0 8px' 
    : '0 32px',
  };

  const titleStyle = {
    color: color === 'black' ? 'white' : '#141414',
    background: `linear-gradient(to right, rgba(255, 221, 85, 0), rgba(255, 221, 85, 1), rgba(255, 84, 62, 1), rgba(200, 55, 171, 1), rgba(55, 113, 200, 1), rgba(102, 0, 255, 0)) no-repeat left center`,
    backgroundSize: '0% 100%',
    transition: 'background-size 1s ease',
  };
  
  if (isAnimated) {
    titleStyle.backgroundSize = '100% 100%';
  }
  

  return (
    <ConfigProvider theme={ config }>
    <>
    <div style={styles}>
      <Row style={{ marginBottom:'2em' }}>
        <Space wrap align='baseline' style={{ marginTop: '4em' }}>
          <Title level={1} style={{ color: color === 'black' ? 'white' : '#141414', margin: '0', fontWeight:'Bold' }}>
            Free Download Threads logo, vector SVG, PNG
          </Title>
        </Space>
      </Row>

      <Row style={{ marginBottom:'2em' }}>
        {/*Left*/}
        <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
          <Space direction='vertical' style={{ width: '100%', height: '100%' }}>
          <Space
            direction='vertical'
            style={{
              ...alignconteinerStyle,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
            ref={svgContainerRef}
            >
            {SvgComponent && (
              <div
                style={{
                  ...svgconteinerStyle,
                  position: 'relative',
                }}
              >
                <SvgComponent
                  fill={isCustomSelected ? customColor : imgColor}
                  style={{
                    ...svgStyle,
                  }}
                />
              </div>
            )}
            <Space style={{ width: '100%' }}>
              <Button
                type="primary"
                block
                disabled={isDownloadDisabled}
                onClick={handleDownload}
                style={{
                  ...btnStyle,
                  color: isDownloadDisabled ? 'grey' : 'white',
                  marginTop: '2em',
                  border: color === 'black' ? '1px solid white' : '',
                  borderRadius: color === 'black' ? '8px' : '',
                }}
              >
                Download
              </Button>
            </Space>
          </Space>

          </Space>
        </Col>
        <div style={ dividerStyle }>
          <Divider type="vertical" style={{ height: '100%' }} />
        </div>

       {/*Right*/}
        <Col xs={24} sm={24} md={8} lg={8} xl={8} xxl={8}>   
          <Space>
            {/*Form*/}
            <Space direction='vertical' size={8} style={{ width: '100%', margin: '1em 0' }}>
                <Title level={3} style={{ color: color === 'black' ? 'white' : '#141414', marginTop:'0' }}>
                  Setting
                </Title>
                <div style={{ position:'relative' }}>
                  <div style={{ ...titleStyle, width:'105%', height:'1em', position:'absolute', top:'-2.2em', left:'-5%', zIndex:'-1'}}></div>
                </div>
                
                <Space direction='vertical' size={12} style={{ width: '100%'}}>
                  <Space align="baseline" style={{ width: '100%', justifyContent:'space-between' }}>
                      <Title level={5} style={{ color: color === 'black' ? 'white' : '#141414', margin: '0' }}>
                        Color
                      </Title>
                      <Checkbox
                        checked={isBackgroundSelected}
                        onChange={handleBackgroundChange}
                        style={{ color: color === 'black' ? 'white' : 'black', margin: '0' }}
                      >
                        Background
                    </Checkbox>
                  </Space>
                  <Radio.Group value={color} onChange={handleColorChange} 
                    style={{
                    width: '100%',
                    display: 'flex',
                    flexWrap: 'wrap',
                    rowGap: '12px'
                  }}
                  >
                    <Radio value="white" style={{ color: color === 'black' ? 'white' : '#141414' }}>
                      Black
                    </Radio>
                    <Radio value="black" style={{ color: color === 'black' ? 'white' : '#141414' }}>
                      White
                    </Radio>
                    <Radio value="color" style={{ color: color === 'black' ? 'white' : '#141414' }}>
                      Colorful
                    </Radio>
                    <Radio value="custom" style={{ color: color === 'black' ? 'white' : '#141414', margin: '0' }}>
                      Custom
                    </Radio>
                  </Radio.Group>
                  {isCustomSelected && (
                    <Space style={{ width: '100%'}}>
                      <Form layout="vertical" colon={false}>
                        <Form.Item label="Enter the color" style={{ marginTop: '0.5em', marginBottom: '0' }}>
                          <Input placeholder="#000000 or red" value={customColor} onChange={handleCustomChange} />
                        </Form.Item>
                      </Form>
                    </Space>
                  )}
               </Space>

              <Space direction='vertical' size={4} style={{ width: '100%'}}>
                  <Title level={5} style={{ color: color === 'black' ? 'white' : '#141414' }}>
                      Size
                  </Title>
                  <Select defaultValue="16x16" style={{ width: 200 }} onChange={handleSizeChange}>
                    <Option value="16x16">16x16 px</Option>
                    <Option value="32x32">32x32 px</Option>
                    <Option value="240x240">240×240 px</Option>
                    <Option value="480x480">480×480 px</Option>
                    <Option value="1024x1024">1,024×1,024 px</Option>
                  </Select>
              </Space>

              <Space direction='vertical' size={4} style={{ width: '100%'}}>
                <Title level={5} style={{ color: color === 'black' ? 'white' : '#141414' }}>
                  Format
                </Title>
                <Radio.Group value={format} onChange={handleFormatChange} style={{ border: color === 'black' ? '1px solid white' : '', borderRadius: color === 'black' ? '8px' : '' }}>
                  <Radio.Button value="SVG">SVG</Radio.Button>
                  <Radio.Button value="PNG">PNG</Radio.Button>
                </Radio.Group>
              </Space>
  
              <span style={{ display: 'inline-flex', alignItems: 'baseline', marginTop: '2em'}}>
                <Text style={{ color: color === 'black' ? 'white' : '#141414' }}>Original file</Text>
                <Link href="https://en.wikipedia.org/wiki/File:Threads_(app)_logo.svg" target="_blank" style={{ marginLeft: '0.3em' }}>here</Link>
              </span>
            </Space>
          </Space>
        </Col>
      </Row>
      <Row>
      <Col span={24} style={{ ...recently, border:'1px solid rgba(196, 196, 196, 0.4)', marginBottom:'2em', borderRadius:'8px' }}>
          <Space direction='vertical'>
              <Title level={4} style={{ color: color === 'black' ? 'white' : '#141414' }}>
                Recently downloaded by users
              </Title>

            <Text style={{ color: color === 'black' ? 'white' : '#141414' }}>Total downloads: 1,278</Text>

            <Space wrap style={{ gap: '8px' }}>
              <Card
                style={{ backgroundColor: color === 'black' ? '#262626' : '#f0f0f0', width: 160, padding: '1em', cursor: 'auto', border:0 }}
                cover={<img alt="thread logo clip art" src="../img/A24CAC.png" />}
              >
                <Meta
                  description={<span style={{ color: color === 'black' ? 'white' : '#141414' }}>#A24CAC</span>} />
              </Card>
              <Card
                style={{ backgroundColor: color === 'black' ? '#262626' : '#f0f0f0', width: 160, padding: '1em', cursor: 'auto', border:0 }}
                cover={<img alt="thread logo svg download" src="../img/4B33AB.png" />}
              >
                <Meta description={<span style={{ color: color === 'black' ? 'white' : '#141414' }}>#4B33AB</span>} />
              </Card>
              <Card
                style={{ backgroundColor: color === 'black' ? '#262626' : '#f0f0f0', width: 160, padding: '1em', cursor: 'auto', border:0 }}
                cover={<img alt="thread logo png" src="../img/EB634A.png" />}
              >
                <Meta description={<span style={{ color: color === 'black' ? 'white' : '#141414' }}>#EB634A</span>} />
              </Card>
              <Card
                style={{ backgroundColor: color === 'black' ? '#262626' : '#f0f0f0', width: 160, padding: '1em', cursor: 'auto', border:0 }}
                cover={<img alt="thread logo download free online" src="../img/5F83CA.png" />}
              >
                <Meta description={<span style={{ color: color === 'black' ? 'white' : '#141414' }}>#5F83CA</span>} />
              </Card>
            </Space>

            <Button
              type="link"
              href="https://www.buymeacoffee.com/olezhater" target="_blank"
              style={{ textAlign: 'center', paddingTop: '1em', margin: '2em 0' }}
             >
              Buy me a coffee :)
            </Button>
        </Space>
      </Col>
    </Row>
  </div>
  </>
  </ConfigProvider>
  );
};

export default App;