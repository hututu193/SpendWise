import React from 'react';
import styled from 'styled-components';

// 遮罩层：全屏，半透明黑，带毛玻璃效果
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(3px);
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeIn 0.2s;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

// 弹窗主体：白底，圆角，阴影
const ModalCard = styled.div`
  width: 80%;
  max-width: 320px;
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  animation: slideUp 0.2s;

  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  h3 {
    text-align: center;
    font-size: 18px;
    margin-bottom: 20px;
    color: #333;
  }
`;

const InputWrapper = styled.div`
  margin-bottom: 24px;
  input {
    width: 100%;
    padding: 12px;
    border: 1px solid #eee;
    background: #f9f9f9;
    border-radius: 8px;
    font-size: 16px;
    outline: none;
    transition: all 0.3s;
    
    &:focus {
      background: #fff;
      border-color: #ffda47;
      box-shadow: 0 0 0 3px rgba(255, 218, 71, 0.2);
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;

  button {
    flex: 1;
    padding: 12px 0;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    font-weight: bold;
    
    &.cancel {
      background: #f5f5f5;
      color: #999;
    }

    &.confirm {
      background: #ffda47; /* 主题黄 */
      color: #333;
    }
  }
`;

type Props = {
    visible: boolean;
    title?: string;
    onCancel: () => void;
    onConfirm: (inputValue: string) => void;
};

const CenterModal: React.FC<Props> = (props) => {
    const [inputValue, setInputValue] = React.useState('');
    const inputRef = React.useRef<HTMLInputElement>(null);

    // 弹窗打开时，自动聚焦输入框
    React.useEffect(() => {
        if (props.visible) {
            setInputValue('');
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [props.visible]);

    if (!props.visible) return null;

    return (
        <Overlay onClick={props.onCancel}>
            {/* 阻止冒泡，点击卡片本身不关闭 */}
            <ModalCard onClick={e => e.stopPropagation()}>
                <h3>{props.title || '请输入'}</h3>
                <InputWrapper>
                    <input 
                        ref={inputRef}
                        type="text" 
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        placeholder="例如：交通、零食..."
                        onKeyDown={e => {
                            if(e.key === 'Enter') props.onConfirm(inputValue)
                        }}
                    />
                </InputWrapper>
                <ButtonGroup>
                    <button className="cancel" onClick={props.onCancel}>取消</button>
                    <button 
                        className="confirm" 
                        onClick={() => props.onConfirm(inputValue)}
                        disabled={!inputValue.trim()}
                    >
                        确定
                    </button>
                </ButtonGroup>
            </ModalCard>
        </Overlay>
    );
};

export default CenterModal;