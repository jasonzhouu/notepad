import whetherScrollBottom from './scrollBottom.js'


// 滑到到底部时，加载下一页
export default function loadNextPageInBottom(notes) {
    let isLoading = false
    window.onscroll = function () {
        // 解决滑到底部，检测到多次事件的问题，只要检测到一次到底，就不再执行
        // 如果是最后一页不执行
        if (whetherScrollBottom() && isLoading == false && notes.isLastPage == false) {
            // 显示正在加载
            isLoading = true
            document.querySelector('#loading').innerHTML = 'loading...'
            // 等待1秒后开始加载下一页，以免加载太快，导致还没看到loading...就加载出来了
            setTimeout(() => {
                notes.loadPage()
                    .then(() => {
                        isLoading = false
                    })
            }, 1000);
        }
    };
}