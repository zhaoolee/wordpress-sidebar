import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./SideBar.less";
import * as localforage from "localforage";
import $ from "jquery";
let isRequest = [false];

const version = "0.2";
const host = window.location.origin;


// 获取最新的文章题目和url

const getLastPostInfo = async () => {
  let result = "";
  result = await new Promise((currencyResolve, currencyReject) => {
    $.get({
      url: host+`/wp-json/wp/v2/posts?page=1`,
      success: (data) => {
        // 如果能请求到新数据
        if (data.length > 0) {
          console.log("最新文章==", data[0]);
          currencyResolve(data[0]["title"]['rendered'] + data[0]["link"]);
        }
      },
      fail: () => {
        console.log("此网站无法生成wordpress阅读列表==", data);
        reject(data);
      },
    });
  });

  return result;
};

function SideBar(props) {
  const windowLocationHref = window.location.origin + window.location.pathname;
  const [wordPressSidbarInfo, setWordPressSidbarInfo] = useState(null);

  const scrollMethod = (childid) => {
    try {
      let partotop = document.getElementById("wordpress-sidebar").offsetTop; //父元素到页面顶部距离
      let distance = document.getElementById(childid).offsetTop; //子元素到页面顶部的距离
      document.getElementById("wordpress-sidebar").scrollTop =
        distance - partotop + 50;
    } catch (e) {
      console.log(e);
    }
  };
  async function getSideBarData() {
    console.log("!!开始获取新数据");
    
    // 获取 categories信息
    return (
      new Promise(async (resolve, reject) => {
        // 分类页数
        let categoriesPage = [1];
        // 分类信息
        let categoriesInfoList = [];
        // 是否继续循环
        let noGetAllCategoriesData = [true];
        // 每次请求的数量 极限值为100
        const categoriesPerPage = 100;
        while (noGetAllCategoriesData[0] === true) {
          await new Promise((currencyResolve, currencyReject) => {
            $.get({
              url:
                host +
                `/wp-json/wp/v2/categories?per_page=${categoriesPerPage}&page=${categoriesPage[0]}`,
              success: (data) => {
                // 如果能请求到新数据
                if (data.length > 0) {
                  categoriesInfoList = [...categoriesInfoList, ...data];
                  // 判断获取的 categoriesInfoList 长度
                  // 请求未完成的条件: 不为0, 且能被100整除
                  if (
                    categoriesInfoList.length !== 0 &&
                    categoriesInfoList.length % categoriesPerPage === 0
                  ) {
                    categoriesPage[0] = categoriesPage[0] + 1;
                  }
                  // 请求完成的条件:  不能被100整除
                  else if (
                    categoriesInfoList.length % categoriesPerPage !==
                    0
                  ) {
                    noGetAllCategoriesData = [false];
                  }
                }
                // 如果不能请求到数据, 则结束循环
                else {
                  noGetAllCategoriesData = [false];
                }
                // 结束当前循环, 尝试进入下一个循环
                currencyResolve();
              },
              fail: () => {
                console.log("此网站无法生成wordpress阅读列表==", data);
                reject(data);
              },
            });
          });
        }
        resolve(categoriesInfoList);
      })
        // 基于categories信息, 获取categories内部的文章信息
        .then((categoriesData) => {
          let newPostsDataList = [];
          let postsDataCategoriesNameList = [];
          return new Promise(async (resolve, reject) => {
            // 将id与name 一一对应 categoriesIdNameData
            let categoriesIdNameData = {};
            let postsDataList = [];
            const categoriesLength = categoriesData.length;
            const cNum = [];
            for (let p = 0; p < categoriesLength; p++) {
              categoriesIdNameData[categoriesData[p]["name"]] = [
                categoriesData[p]["id"].toString(),
              ];
              let noGetAllPostsData = [true];
              let page = [1];

              while (noGetAllPostsData[0] === true) {
                await new Promise((resolveReq, reject) => {
                  $.get({
                    url:
                      host +
                      "/wp-json/wp/v2/posts?categories=" +
                      categoriesData[p]["id"] +
                      "&per_page=" +
                      100 +
                      "&page=" +
                      `${page[0]}`,
                    success:  async(postsData) => {
                      postsDataList[p] = [
                        ...(postsDataList[p] || []),
                        ...postsData,
                      ];
                      // 如果postsDataList[p]值不能被100整除, 或者postsDataList[p] 长度为空, 则说明本标签请求完成
                      if (
                        postsDataList[p].length === 0 ||
                        postsDataList[p].length % 100 !== 0
                      ) {
                        noGetAllPostsData[0] = [false];
                        cNum.push(1);
                        // 完成所有请求后执行
                        if (cNum.length === categoriesLength) {
                          for (let q = 0; q < postsDataList.length; q++) {
                            if (postsDataList[q].length > 0) {
                              postsDataCategoriesNameList.push(
                                categoriesData[q]["name"]
                              );
                              newPostsDataList.push(postsDataList[q]);
                            }
                          }
                          // 获取最新的文章信息
                          const lastPostInfo = await getLastPostInfo();

                          resolve({
                            categoriesIdNameData: categoriesIdNameData,
                            postsDataList: newPostsDataList,
                            postsDataCategoriesNameList,
                            lastPostInfo,
                            timestamp: Date.parse(new Date()),
                            version: version,
                          });
                        }
                      }
                      // 如果postsDataList[p]值能被100整除, 则说明需要继续请求
                      else {
                        page[0] = 1 + page[0];
                      }

                      resolveReq();
                    },
                  });
                });
              }
            }
          });
        })
        .then((data) => {
          // 将data存入LocalStore
          try {
            localforage.setItem("wordPressSidbarInfo", JSON.stringify(data));
          } catch (e) {
            console.log(e);
          }
          setWordPressSidbarInfo(data);
          setTimeout(() => {
            isRequest[0] = false;
          }, 2000);
        })
    );
  }

  // 如果文章有更新就进行请求

  const tryToUpdate = async (wordPressSidbarInfo) => {
    const localLastlastPostInfo = wordPressSidbarInfo.lastPostInfo || "" ;

    const lastlastPostInfo = await getLastPostInfo();

    console.log('===实时lastlastPostInfo==', lastlastPostInfo);

    if (localLastlastPostInfo !== lastlastPostInfo) {
      console.log(
        "localLastlastPostInfo",
        localLastlastPostInfo,
        "与lastlastPostInfo",
        lastlastPostInfo,
        "不同!开始更新"
      );
      isRequest[0] = true;
      getSideBarData();
    } else {
      console.log(
        "localLastlastPostInfo",
        localLastlastPostInfo,
        "与lastlastPostInfo",
        lastlastPostInfo,
        "相同， 无需更新"
      );
    }
  };

  useEffect(() => {
    if (wordPressSidbarInfo !== null) {
      if (
        Object.keys(wordPressSidbarInfo).length === 0 &&
        isRequest[0] === false
      ) {
        isRequest[0] = true;
        getSideBarData();
      } else {
        // 如果版本更新,清理数据重新请求
        if (wordPressSidbarInfo.version !== version) {
          localforage.removeItem("wordPressSidbarInfo");
          if (isRequest[0] === false) {
            isRequest[0] = true;
            getSideBarData();
          }
        } else {

          props.setSideBarContent(true);
          scrollMethod("current-page-index");

          // 如果文章有更新则进行请求

          tryToUpdate(wordPressSidbarInfo);
        }
      }
    }
  }, [wordPressSidbarInfo]);

  useEffect(() => {
    wordPressSidbarInfoStr();
  }, []);

  // 尝试获取本地存储的信息
  const wordPressSidbarInfoStr = async function () {
    await new Promise((resolve) => {
      localforage.getItem("wordPressSidbarInfo").then((data) => {
        if (data === null) {
          props.setSideBarContent(false);
          setWordPressSidbarInfo({});
          
        } else {
          setWordPressSidbarInfo(JSON.parse(data));
        }
        resolve();
      });
    });
  };

  // 为keyWord添加标识

  const markKeyWord = (title) => {
    const markTitle = title.replaceAll(
      new RegExp(props.keyWord, "gi"),
      `<span class="flow-wave key-word-style">${title.match(
        new RegExp(props.keyWord, "i")
      )}</span>`
    );
    return `<p>${markTitle}</p>`;
  };

  return (
    <div id="wordpress-sidebar">
      {wordPressSidbarInfo !== null &&
        Object.keys(wordPressSidbarInfo).length !== 0 &&
        props.keyWord.length === 0 && (
          <div className="categories">
            {wordPressSidbarInfo["postsDataCategoriesNameList"].map(
              (categoriesName, CategoriesIdIndex) => {
                return (
                  <>
                    <div className="categories-title" id={categoriesName}>
                      {categoriesName}
                    </div>
                    {wordPressSidbarInfo["postsDataList"][
                      CategoriesIdIndex
                    ].map((postData) => {
                      return (
                        <div
                          key={postData["link"]}
                          className="categories-a-list"
                        >
                          <a
                            id={
                              windowLocationHref === postData["link"]
                                ? "current-page-index"
                                : ""
                            }
                            className={
                              windowLocationHref === postData["link"]
                                ? "current-page"
                                : "other-page"
                            }
                            href={postData["link"]}
                          >
                            <p>{postData["title"]["rendered"]}</p>
                          </a>
                        </div>
                      );
                    })}
                  </>
                );
              }
            )}
          </div>
        )}

      {wordPressSidbarInfo !== null &&
        Object.keys(wordPressSidbarInfo).length !== 0 &&
        props.keyWord.length > 0 && (
          <div className="categories">
            {wordPressSidbarInfo["postsDataCategoriesNameList"].map(
              (categoriesName, CategoriesIdIndex) => {
                return (
                  <>
                    {wordPressSidbarInfo["postsDataList"][
                      CategoriesIdIndex
                    ].map((postData) => {
                      return (
                        <div
                          key={postData["link"]}
                          className={
                            new RegExp(props.keyWord, "i").test(
                              postData["title"]["rendered"]
                            ) === false
                              ? "none-categories-a-list"
                              : "categories-a-list"
                          }
                        >
                          <a
                            id={
                              windowLocationHref === postData["link"]
                                ? "current-page-index"
                                : ""
                            }
                            className={
                              windowLocationHref === postData["link"]
                                ? "current-page"
                                : "other-page"
                            }
                            href={postData["link"]}
                          >
                            <div
                              dangerouslySetInnerHTML={{
                                __html: markKeyWord(
                                  postData["title"]["rendered"]
                                ),
                              }}
                            ></div>
                          </a>
                        </div>
                      );
                    })}
                  </>
                );
              }
            )}

            <div className="end-text">
              <span>── END ──</span>
            </div>
          </div>
        )}
    </div>
  );
}

export default SideBar;
