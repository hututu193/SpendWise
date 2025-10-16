import { NavLink } from 'react-router-dom';
import Icon from './Icon';
import styled from 'styled-components';


const NavWrapper = styled.div` 
    background: white;
line-height: 24px;
box-shadow: 0 0 3px rgba(0, 0, 0, 0.25);

>ul {
    display: flex;
    >li {
        width: 33.333%;
        text-align: center;
        >a{
            padding: 4px 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            .icon{
                width: 24px;
                height: 24px;
                stroke: currentColor
            };
            &.selected {
                color: orange;
                /* #F1C40F; */
                /* rgb(250, 221, 17); */
                .icon{
                    stroke: currentColor;;
                }
            }
        }
    }    
}

`

const Nav = () => {
    return (
        // 底部导航栏
        < NavWrapper >
            <ul>
                <li>
                    <NavLink
                        to="/tags"
                        className={({ isActive }) => isActive ? 'selected' : ''}>
                        <Icon name='tag'></Icon>
                        标签页
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/money"
                        className={({ isActive }) => isActive ? 'selected' : ''}>
                        <Icon name='currency'></Icon>
                        记账页
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/statistics"
                        className={({ isActive }) => isActive ? 'selected' : ''}>
                        <Icon name='chart'></Icon>
                        统计页
                    </NavLink>
                </li>
            </ul>
        </NavWrapper >

    )
}

export default Nav