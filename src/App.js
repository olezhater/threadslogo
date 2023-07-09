import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Typography, Radio, Button, Checkbox, Select, Form, Input } from 'antd';
import { ReactComponent as PreviewBgSvg } from './svg/preview/bg/preview.svg';
import { ReactComponent as PreviewBgColorSvg } from './svg/preview/bg/preview-color.svg';
import { ReactComponent as PreviewSingleSvg } from './svg/preview/single/preview.svg';
import { ReactComponent as PreviewSingleColorSvg } from './svg/preview/single/preview-color.svg';
import { saveAs } from 'file-saver';
import domtoimage from 'dom-to-image';
//work
const { Title, Text, Link } = Typography;
const { Option } = Select;

const App = () => {
  const [color, setColor] = useState('white');
  const [size, setSize] = useState('16x16');
  const [format, setFormat] = useState('SVG');
  const [isBackgroundSelected, setBackgroundSelected] = useState(true);
  const [isCustomSelected, setCustomSelected] = useState(false);
  const [customColor, setCustomColor] = useState('');
  const [imgColor, setImgColor] = useState('black');
  const svgContainerRef = useRef(null);

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
    if (color === 'black') {
      document.body.style.backgroundColor = 'black';
    } else {
      document.body.style.backgroundColor = '';
    }
  }, [color]);
  
  

  const SvgComponent = getSvgElement();

  return (
    <div style={{ display: 'block', textAlign: 'center', padding: '3em 0 3em 0' }}>
      <Title level={1} style={{ color: color === 'black' ? 'white' : 'black' }}>Free Download Threads logo vector SVG, PNG</Title>
      <div style={{ paddingTop: '1em' }} ref={svgContainerRef}>
        {SvgComponent && (
          <SvgComponent fill={isCustomSelected ? customColor : imgColor} style={{ width: '300px', height: '300px' }} />
        )}
      </div>
      <div style={{ paddingTop: '1em' }}>
        <Title level={4} style={{ color: color === 'black' ? 'white' : 'black' }}>
          Color
        </Title>
      </div>
      <div>
        <Checkbox
          checked={isBackgroundSelected}
          onChange={handleBackgroundChange}
          style={{ color: color === 'black' ? 'white' : 'black' }}
        >
          Background
        </Checkbox>
      </div>
      <div style={{ paddingTop: '1em', height: '5em' }}>
        <Radio.Group value={color} onChange={handleColorChange} style={{ marginRight: '10px' }}>
          <Radio value="white" style={{ color: color === 'black' ? 'white' : 'black' }}>
            Black
          </Radio>
          <Radio value="black" style={{ color: color === 'black' ? 'white' : 'black' }}>
            White
          </Radio>
          <Radio value="color" style={{ color: color === 'black' ? 'white' : 'black' }}>
            Color
          </Radio>
          <Radio value="custom" style={{ color: color === 'black' ? 'white' : 'black' }}>
            Custom
          </Radio>
        </Radio.Group>
        {isCustomSelected && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '20px' }}>
            <Form labelCol={{ span: 4 }} wrapperCol={{ span: 14 }} layout="horizontal">
              <Form.Item label="HEX">
                <Input placeholder="#000000" value={customColor} onChange={handleCustomChange} />
              </Form.Item>
            </Form>
          </div>
        )}
      </div>
      <div style={{ textAlign: 'center' }}>
        <Title level={4} style={{ color: color === 'black' ? 'white' : 'black' }}>
              Size
            </Title>
            </div>
            <div style={{ textAlign: 'center', paddingTop: '0.5em' }}>
            <Select defaultValue="16x16" style={{ width: 200 }} onChange={handleSizeChange}>
              <Option value="16x16">16x16 px</Option>
              <Option value="32x32">32x32 px</Option>
              <Option value="240x240">240×240 px</Option>
              <Option value="480x480">480×480 px</Option>
              <Option value="1024x1024">1,024×1,024 px</Option>
            </Select>
            </div>
            <div style={{ textAlign: 'center', paddingTop: '4em' }}>
            <Title level={4} style={{ color: color === 'black' ? 'white' : 'black' }}>
              Format
            </Title>
            </div>
            <div style={{ textAlign: 'center', paddingTop: '0.5em' }}>
            <Radio.Group value={format} onChange={handleFormatChange}>
              <Radio.Button value="SVG">SVG</Radio.Button>
              <Radio.Button value="PNG">PNG</Radio.Button>
            </Radio.Group>
            </div>
            <div style={{ textAlign: 'center', paddingTop: '3em' }}>
            <div>
              <Button
                type="primary"
                disabled={isDownloadDisabled}
                onClick={handleDownload}
                style={{ color: isDownloadDisabled ? 'grey' : 'white' }}
              >
                Download
              </Button>
            </div>
            <div>
              <Button
                type="link"
                style={{ textAlign: 'center', paddingTop: '1em' }}
              >
                Say Thanks
              </Button>
            </div>
            <span style={{ display: 'inline-flex', alignItems: 'baseline', paddingTop: '4em'}}>
              <Text style={{ color: color === 'black' ? 'white' : 'black' }}>Original file</Text>
              <Link href="https://en.wikipedia.org/wiki/File:Threads_(app)_logo.svg" target="_blank" style={{ marginLeft: '0.3em' }}>here</Link>
            </span>
            </div>
            </div>
            );
            };

            export default App;
