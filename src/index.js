import $ from "jquery";
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.less';
import SideBar from "./SideBar";

function App() {
    const [websiteIndex, setWebsiteIndex] = useState(0);
    const [sideBarContent, setSideBarContent] = useState(false);
    const [keyWord, setKeyWord] = useState('');

    // 根据屏幕初始宽度初始化 websiteIndex 状态

    useEffect(()=>{
        if(document.body.clientWidth >= 500){
            setWebsiteIndex(1);
        }
    }, [])

      // 搜索

  const findPostsInfo = (e)=>{
    setKeyWord(e.target.value);

  }

    return (
        <>
            {/* 加载中... */}
            {sideBarContent === false &&
                <div id="wordpress-sidebar-container-hide">
                    <SideBar keyWord={keyWord} setSideBarContent={setSideBarContent} />
                    <div id='website-index-icon'>Loading...</div>
                </div>
            }
            {/* 被折叠状态 */}
            {sideBarContent === true && websiteIndex === 0 &&
                <div id="wordpress-sidebar-container-hide">
                    <input className="find-post-input" placeholder="查找文章" value={keyWord} onChange={findPostsInfo} ></input>
                    <SideBar keyWord={keyWord} setSideBarContent={setSideBarContent} />
                    <div id='website-index-icon' onClick={()=>{
                        setWebsiteIndex(1);
                    }}>显示目录</div>
                </div>
            }

            {/* 展示内容 */}
            {sideBarContent === true && websiteIndex === 1 &&
                <div id="wordpress-sidebar-container">
                    <input className="find-post-input" placeholder="查找文章" value={keyWord} onChange={findPostsInfo} ></input>
                    <SideBar keyWord={keyWord} setSideBarContent={setSideBarContent} />
                    <div id='website-index-icon' onClick={()=>{
                        setWebsiteIndex(0);
                    }}>隐藏目录</div>
                </div>
            }
        </>
    )
}

// 添加一个div作为React的入口文件
$("body").append(`<div id="wordpress-sidebar-container"/>`);

ReactDOM.createRoot(document.getElementById("wordpress-sidebar-container")).render(<App />);



