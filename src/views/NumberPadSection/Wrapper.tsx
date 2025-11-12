import styled from "styled-components"

const Wrapper = styled.section`
    display: flex;
    flex-direction: column;
    >.output{
        background: #f5f5f5;
        font-size: 36px;
        line-height: 50px;
        text-align: right;
        padding: 0 16px;
        /* box-shadow: inset 0 -5px 5px -5px rgba(0, 0, 0, 0.25),
        inset 0 5px 5px -5px rgba(0, 0, 0, 0.25); */
    }
    >.pad{
        >button{
            font-size: 18px;
            float: left;
            width: 25%;
            height: 56px;
            border: none;

            &:nth-child(1){
        background:#f2f2f2;
      }
      &:nth-child(2){
        background: #e8e8e8;
      }
      &:nth-child(3),
      &:nth-child(6),
      &:nth-child(9){
        background: #dedede;
      }

      &:nth-child(4),
      &:nth-child(7),
      &:nth-child(10) {
        background:#d3d3d3;
      }
       &:nth-child(5) {
        background:#e8e8e8;
      }
      &:nth-child(8){
        background: #c9c9c9;
      }
      
      
      
      &:nth-child(11) {
        background:#C9c9c9;
      }
      
      &:nth-child(12)
       {
        background:#b5b5b5;
      }
      
      &:nth-child(13) {
        background:#c9c9c9;
      }
        &:nth-child(14) {
        background:#bfbfbf
      }

            &.ok{
                height: 112px;
                float: right;
            }
            &.zero{
                width: 50%;
            }
        }
    }
`
export { Wrapper }