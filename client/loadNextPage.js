import whetherScrollBottom from './scrollBottom.js'

export default function showLoading(notes) {
    let isLoading = false
    // 滑到到底部，加载下一页
    window.onscroll = function () {
        // 解决滑到底部，检测到多次事件的问题，只要检测到一次到底，就不再执行
        // 如果是最后一页不执行
        if (whetherScrollBottom() && isLoading == false && notes.isLastPage == false) {
            // 显示正在加载
            isLoading = true
            document.querySelector('#loading').innerHTML = 'loading...'
            // 等待1秒
            setTimeout(() => {
                notes.loadPage()
                    .then(() => {
                        isLoading = false
                    })
            }, 1000);
        }
    };
}