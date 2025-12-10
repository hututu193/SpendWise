import { useEffect, useState } from 'react';
import { createId } from 'lib/createId';
import { useUpdate } from './useUpdate';

const useTags = () => {
    const [tags, setTags] = useState<{ id: number; name: string }[]>([]);

    useEffect(() => {
        let localTags = JSON.parse(window.localStorage.getItem('tags') || '[]');
        if (localTags.length === 0) {
            localTags = [
                { id: createId(), name: '餐饮' },
                { id: createId(), name: '居住' },
                { id: createId(), name: '娱乐' },
                { id: createId(), name: '出行' },
                { id: createId(), name: '工资' },
            ];
        }
        setTags(localTags);
    }, []);

    useUpdate(() => {
        window.localStorage.setItem('tags', JSON.stringify(tags));
    }, tags);

    const findTag = (id: number) => tags.filter(tag => tag.id === id)[0];

    const findTagIndex = (id: number) => {
        let result = -1;
        for (let i = 0; i < tags.length; i++) {
            if (tags[i].id === id) {
                result = i;
                break;
            }
        }
        return result;
    };

    const updateTag = (id: number, { name }: { name: string }) => {
        setTags(tags.map(tag => tag.id === id ? { id, name: name } : tag));
    };

    const deleteTag = (id: number) => {
        setTags(tags.filter(tag => tag.id !== id));
    };

    // 🌟 核心修改：这里不再弹窗，只负责接收 name 并添加
    const addTag = (name: string) => {
        setTags([...tags, { id: createId(), name: name }]);
    };

    const getName = (id: number) => {
        const tag = tags.filter(t => t.id === id)[0];
        return tag ? tag.name : '';
    };

    return { tags, getName, addTag, setTags, findTag, updateTag, findTagIndex, deleteTag };
};

export { useTags };