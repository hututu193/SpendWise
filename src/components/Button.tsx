import styled from "styled-components"

const Button = styled.button`
  font-size: 16px; /* 字号稍微小一点点，显精致 */
  padding: 10px 24px; /* 宽一点 */
  border: none;
  background: #ffda47; /* 你的主题黄 */
  border-radius: 24px; /* ✨ 变成胶囊形状 */
  color: #333; /* 文字深灰，对比度更好 */
  font-weight: bold;
  
  /* ✨ 关键：加一点点投影，让它浮起来 */
  box-shadow: 0 4px 12px rgba(255, 218, 71, 0.4);
  transition: all 0.2s;

  &:active {
    transform: translateY(2px);
    box-shadow: 0 2px 6px rgba(255, 218, 71, 0.4);
  }
`

export { Button }