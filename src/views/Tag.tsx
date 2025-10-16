import React from "react"
import { useTags } from "hooks/useTags"
import { useParams, useNavigate } from 'react-router-dom'
import Layout from "components/Layout"
import Icon from "components/Icon"
import { Button } from "components/Button"
import styled from "styled-components"
import { Input } from "components/Input"
import { Center } from "components/Center"
import { Space } from "components/Space"

const SmallIcon = styled(Icon)`
  width: 16px;
  height: 16px;
  display: inline-block;
  vertical-align: middle;
`;

const Topbar = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 20px;
    padding: 14px;
    background: white;
`
const InputWrapper = styled.div`
    background: white;
    padding: 0 16px;
    margin-top: 8px;
`
const Interupt = styled.div`
    
`
// type Params = {
// id: string
// }

const Tag: React.FC = () => {
    const { findTag, updateTag, deleteTag } = useTags()
    const { id: idString } = useParams<{ id: string }>()
    // console.log(id);

    const tagId = idString ? parseInt(idString) : NaN
    const tag = !isNaN(tagId) ? findTag(tagId) : undefined

    const tagContent = (tag: { id: number, name: string }) => {
        return (
            <div>
                {/* 标签名 */}
                <InputWrapper>
                    <Input type="text" placeholder="标签名" label="标签名"
                        value={tag?.name}
                        onChange={(e) => {
                            updateTag(tag.id, { name: e.target.value })
                        }}>
                    </Input>
                </InputWrapper>
                {/* 删除标签 */}
                <Center>
                    <Space />
                    <Space />
                    <Space />
                    <Button
                        onClick={() => {
                            deleteTag(tag.id)
                        }}>删除标签</Button>
                </Center>
            </div>
        )
    }

    const navigate = useNavigate() // 获取 navigate 函数
    //点击回退到上一页
    const onClickBack = () => {
        navigate(-1) // 返回上一页
        // 或者使用 navigate('/tags') 直接跳转到标签列表页
    }

    return (
        <Layout>
            {/* 顶部编辑标签 */}
            <Topbar>
                <SmallIcon name='left' onClick={onClickBack}></SmallIcon>
                <span>编辑标签</span>
                <SmallIcon></SmallIcon>
            </Topbar>

            {tag ? tagContent(tag) : <Center> <div style={{ marginTop: '70px' }}>标签不存在</div>
            </Center>}



        </Layout >

    )
}
export { Tag }