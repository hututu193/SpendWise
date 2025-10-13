import React, { useState, useEffect } from "react";
import { Wrapper } from "views/NumberPadSection/Wrapper";
import { generateOutput } from "views/NumberPadSection/generateOutput";

type Props = {
  value: number,
  onChange: (value: number) => void,
  onOK?: () => void
}

const NumberPadSection: React.FC<Props> = (props) => {
  // ✅ 用本地状态保存字符串输出
  const [output, setOutput] = useState(props.value.toString());

  // ✅ 如果外部传入的 value 改变（比如重置时），同步到内部状态
  useEffect(() => {
    setOutput(props.value.toString());
  }, [props.value]);

  const updateOutput = (newOutput: string) => {
    if (newOutput.length > 16) {
      newOutput = newOutput.slice(0, 16);
    }

    setOutput(newOutput);

    // ✅ 转成数字再传出去
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
      <div className="pad clearfix" onClick={onClickButtonWrapper}>
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