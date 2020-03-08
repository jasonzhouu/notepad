import whetherScrollBottom from './scrollBottom.js'


// 滑到到底部时，加载下一页
export default function loadNextPageInBottom(notes) {
    // 解决滑到底部，检测到多次事件的问题，只要检测到一次到底，就不再执行
    // 如果是最后一页不执行
    if (whetherScrollBottom() && notes.isLoading == false && notes.isLastPage == false) {
        document.querySelector('#loading').innerHTML = '正在加载...'
        notes.isLoading = true
        // 等待1秒后开始加载下一页，以免加载太快，导致还没看到loading...就加载出来了
        setTimeout(() => {
            notes.loadPage()
        }, 1000);
    } else if (whetherScrollBottom() && notes.isLoading == false && notes.isLastPage == true) {
        document.querySelector('#loading').innerHTML = '没有更多了'
    }
}