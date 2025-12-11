import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { generateOutput } from "views/NumberPadSection/generateOutput"; // 假设这个路径是对的

// ✅ 这里直接重写了 Wrapper，不用引用原来的了
const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  background: #fff;
  padding-bottom: constant(safe-area-inset-bottom); /* 适配 iPhone 底部小黑条 */
  padding-bottom: env(safe-area-inset-bottom);

  > .output {
    background: #fff;
    font-size: 36px;
    line-height: 72px;
    text-align: right;
    padding: 0 24px;
    color: #333;
    font-family: Consolas, monospace; /* 用等宽字体显示数字更好看 */
    border-top: 1px solid #f0f0f0; 
    box-shadow: inset 0 -3px 3px -3px rgba(0,0,0,0.02);
  }

  > .pad {
    display: grid;
    grid-template-columns: repeat(4, 1fr); /* 4列网格 */
    grid-template-rows: repeat(4, 64px);   /* 4行，每行64px高 */
    gap: 8px; /* 按钮之间的间隙 */
    padding: 8px;
    background: #f7f7f7; /* 键盘底色 */

    > button {
      font-size: 20px;
      border: none;
      border-radius: 8px; /* 圆角矩形按钮 */
      background: #fff;
      color: #333;
      box-shadow: 0 2px 0 rgba(0,0,0,0.05); /* 微微的立体感 */
      cursor: pointer;
      transition: all 0.1s;

      &:active {
        background: #f0f0f0;
        transform: translateY(2px); /* 按下去的效果 */
        box-shadow: none;
      }

      /* OK 按钮特殊样式 */
      &.ok {
        grid-column: 4;     /* 在第4列 */
        grid-row: 3 / 5;    /* 跨越第3到第5行（也就是占两行） */
        height: auto;
        background: #ffda47; /* 主题黄 */
        color: #333;
        font-weight: bold;
        box-shadow: 0 2px 0 #e0c03e;
      }
      
      /* 0 按钮占两格 */
      &.zero {
        grid-column: 1 / 3; /* 跨越1-3列（占两个宽） */
      }
    }
  }
`;

type Props = {
  value: number;
  onChange: (value: number) => void;
  onOK?: () => void;
};

const NumberPadSection: React.FC<Props> = (props) => {
  const [output, setOutput] = useState(props.value.toString());

  useEffect(() => {
    setOutput(props.value.toString());
  }, [props.value]);

  const updateOutput = (newOutput: string) => {
    if (newOutput.length > 16) {
      newOutput = newOutput.slice(0, 16);
    }
    setOutput(newOutput);
    let value;
    if (newOutput === "" || newOutput === ".") {
      value = 0;
    } else {
      value = parseFloat(newOutput);
    }
    props.onChange(value);
  };

  const onClickButtonWrapper = (e: React.MouseEvent) => {
    const text = (e.target as HTMLButtonElement).textContent;
    if (text === null) return;
    if (text === "OK") {
      props.onOK?.();
      return;
    }
    if ("0123456789.".split("").concat(["删除", "清空"]).includes(text)) {
      const newOutput = generateOutput(text, output);
      updateOutput(newOutput);
    }
  };

  return (
    <Wrapper>
      <div className="output">{output}</div>
      <div className="pad" onClick={onClickButtonWrapper}>
        <button>1</button>
        <button>2</button>
        <button>3</button>
        <button>删除</button>
        <button>4</button>
        <button>5</button>
        <button>6</button>
        <button>清空</button>
        <button>7</button>
        <button>8</button>
        <button>9</button>
        <button className="ok">OK</button>
        <button className="zero">0</button>
        <button className="dot">.</button>
      </div>
    </Wrapper>
  );
};

export { NumberPadSection };
