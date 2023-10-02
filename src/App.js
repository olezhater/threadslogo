import React, { useState, useEffect, useRef, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { Typography, Radio, Button, Select, Card, Divider, Space, Col, Row, ColorPicker, Switch, ConfigProvider } from 'antd';
import { InstagramOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
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
  const [color, setColor] = useState('custom');
  const [size, setSize] = useState('16x16');
  const [format, setFormat] = useState('SVG');
  const [isBackgroundSelected, setBackgroundSelected] = useState(true);
  const [isCustomSelected, setCustomSelected] = useState(true);
  const [customColor, setCustomColor] = useState('');
  const [imgColor, setImgColor] = useState('black');
  const [switchChecked, setSwitchChecked] = useState(false);
  const svgContainerRef = useRef(null);

  const config = {
    "token": {
      "fontFamily": "'Kanit', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
      "fontSize": 16,
      "sizeStep": 4,
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

  const handleColorChange = () => {
    const selectedColor = switchChecked ? 'custom' : 'color';
    console.log('Selected Color:', selectedColor);
    setColor(selectedColor);
  
    if (selectedColor === 'custom') {
      setCustomSelected(true);
      setCustomColor(hexString);
      setImgColor(hexString);
    } else {
      setCustomSelected(false);
      setImgColor(selectedColor === 'white' ? 'black' : 'white');
    }
  }; 

  const handleSizeChange = (value) => {
    setSize(value);
  };

  const handleFormatChange = (e) => {
    setFormat(e.target.value);
  };

  const handleBackgroundChange = (checked) => {
    setBackgroundSelected(checked);
  };  

  const [colorHex, setColorHex] = useState('#000000');
  const hexString = useMemo(
    () => (typeof colorHex === 'string' ? colorHex : colorHex.toHexString()),
    [colorHex],
  );
  const [formatHex, setFormatHex] = useState('hex');

  useEffect(() => {
    if (color === 'custom') {
      setCustomColor(hexString);
    }
  }, [color, hexString]);

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
    color: '#141414',
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
          <Title level={1} style={{ margin: '0', fontWeight:'Bold' }}>
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
            <Space direction='vertical' size={16} style={{ width: '100%', margin: '1em 0' }}>
                <Title level={3} style={{ marginTop:'0' }}>
                  Setting
                </Title>
                <div style={{ position:'relative' }}>
                  <div style={{ ...titleStyle, width:'105%', height:'1em', position:'absolute', top:'-2.45em', left:'-5%', zIndex:'-1'}}></div>
                </div>
                {/*Form*/}
                <Space direction='vertical' size={24} style={{ width: '100%'}}>
                  <Space align="center" style={{ width: '100%', height: '2em', justifyContent:'space-between' }}>
                        <Text style={{ fontSize: '1.2em', margin: '0' }}>
                          Color
                        </Text>
                        {isCustomSelected ? (
                          <Space>
                            <Col>
                              <span>{hexString}</span>
                            </Col>
                            <Col>
                              <ColorPicker
                                format={formatHex}
                                value={colorHex}
                                onChange={setColorHex}
                                onFormatChange={setFormatHex}
                              />
                            </Col>
                          </Space>
                        ) : (
                          <InstagramOutlined style={{ fontSize: '2em' }} />
                        )}
                  </Space>
                  <Space align="center" style={{ width: '100%', height: '2em', justifyContent:'space-between' }}>
                        <Text style={{ fontSize: '1.2em', margin: '0' }}>
                          Background
                        </Text>
                        <Switch
                          onChange={handleBackgroundChange}
                          checked={isBackgroundSelected}
                          checkedChildren={<CheckOutlined />}
                          unCheckedChildren={<CloseOutlined />}
                          defaultChecked
                        />
                  </Space>
                  <Space align="center" style={{ width: '100%', height: '2em', justifyContent:'space-between' }}>
                        <Text style={{ fontSize: '1.2em', margin: '0' }}>
                          Colorful
                        </Text>
                        <Switch
                          onChange={(checked) => {
                            setSwitchChecked(checked);
                            handleColorChange();
                          }}
                          checked={switchChecked}
                          checkedChildren={<CheckOutlined />}
                          unCheckedChildren={<CloseOutlined />}
                        />
                  </Space>
                  <Space align="baseline" style={{ width: '100%', height: '2em', justifyContent:'space-between' }}>
                        <Text style={{ fontSize: '1.2em', margin: '0' }}>
                          Size
                        </Text>
                        <Select defaultValue="16x16" style={{ width: '10em' }} onChange={handleSizeChange}>
                          <Option value="16x16">16x16 px</Option>
                          <Option value="32x32">32x32 px</Option>
                          <Option value="240x240">240×240 px</Option>
                          <Option value="480x480">480×480 px</Option>
                          <Option value="1024x1024">1,024×1,024 px</Option>
                        </Select>
                  </Space>
                  <Space align="center" style={{ width: '100%', height: '2em', justifyContent:'space-between' }}>
                        <Text style={{ fontSize: '1.2em', margin: '0' }}>
                          Format
                        </Text>
                        <Radio.Group value={format} onChange={handleFormatChange}>
                          <Radio.Button value="SVG">SVG</Radio.Button>
                          <Radio.Button value="PNG">PNG</Radio.Button>
                        </Radio.Group>
                  </Space>
                  <span style={{ display: 'inline-flex', alignItems: 'baseline', marginTop: '2em'}}>
                    <Text>Original file is</Text>
                    <Link href="https://en.wikipedia.org/wiki/File:Threads_(app)_logo.svg" target="_blank" style={{ marginLeft: '0.3em' }}>here</Link>
                  </span>
                </Space>
             </Space>
        </Col>
      </Row>
      <Row>
      <Col span={24} style={{ ...recently, border:'1px solid rgba(196, 196, 196, 0.4)', marginBottom:'2em', borderRadius:'8px' }}>
          <Space direction='vertical'>
              <Title level={4}>
                Recently downloaded by users
              </Title>

            <Text>Total downloads: 1,278</Text>

            <Space wrap style={{ gap: '8px' }}>
              <Card
                style={{ backgroundColor: '#f0f0f0', width: 160, padding: '1em', cursor: 'auto', border:0 }}
                cover={<img alt="thread logo clip art" src="../img/A24CAC.png" />}
                >
                <Meta
                  description={<span style={{ color: '#141414', display: 'flex', justifyContent: 'center' }}>#A24CAC</span>} />
              </Card>
              <Card
                style={{ backgroundColor: '#f0f0f0', width: 160, padding: '1em', cursor: 'auto', border:0 }}
                cover={<img alt="thread logo svg download" src="../img/4B33AB.png" />}
                >
                <Meta description={<span style={{ color: '#141414', display: 'flex', justifyContent: 'center' }}>#4B33AB</span>} />
              </Card>
              <Card
                style={{ backgroundColor: '#f0f0f0', width: 160, padding: '1em', cursor: 'auto', border:0 }}
                cover={<img alt="thread logo png" src="../img/EB634A.png" />}
                >
                <Meta description={<span style={{ color: '#141414', display: 'flex', justifyContent: 'center' }}>#EB634A</span>} />
              </Card>
              <Card
                style={{ backgroundColor: '#f0f0f0', width: 160, padding: '1em', cursor: 'auto', border:0 }}
                cover={<img alt="thread logo download free online" src="../img/5F83CA.png" />}
                >
                <Meta description={<span style={{ color: '#141414', display: 'flex', justifyContent: 'center' }}>#5F83CA</span>} />
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