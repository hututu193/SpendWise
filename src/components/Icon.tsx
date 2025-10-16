
import React from 'react';

let importAll = (requireContext: __WebpackModuleApi.RequireContext) =>
    requireContext.keys().forEach(requireContext);
try {
    importAll(require.context('icons', true, /\.svg$/));
} catch (error) {
    console.log(error);
}

type Props = {
    name?: string;
    className?: string; // ✅ 接收 styled-components 传来的 className
} & React.SVGAttributes<SVGElement>

const Icon = (props: Props) => {
    const { name, className, children, ...rest } = props;
    return (
        // ✅ 把 className 合并上去
        <svg className={['icon', className].filter(Boolean).join(' ')} {...rest} fill="currentColor" >
            {props.name && <use xlinkHref={'#' + name} />}
        </svg >
    );
};

export default Icon;


