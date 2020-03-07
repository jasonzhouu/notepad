export default function parseDate(date) {
    let dateObject = new Date(date)

    let year = dateObject.getFullYear()
    let month = dateObject.getMonth() + 1 // getMonth()返回的0表示一月
    let day = dateObject.getDate()

    let now = new Date()
    let nowYear = now.getFullYear()
    let nowMonth = now.getMonth() + 1
    let nowDay = now.getDate()

    let dateFormat = ''
    if (year != nowYear) {
        // 不是今年发的，显示年月日
        dateFormat = `${year}/${month}/${day}`
    } else if (month != nowMonth || day != nowDay) {
        // 不是今天发的，只显示月、日
        dateFormat = `${month}/${day}`
    } else if (year == nowYear && month == nowMonth && day == nowDay) {
        // 今天发的，只显示多久之前
        let interval = now - dateObject
        let second = (interval / 1000).toFixed(0)
        let minute = (second % 3600 / 60).toFixed(0)
        let hour = (second / 3600).toFixed(0)
        second = second % 3600 % 60
        if (hour >= 1) {
            dateFormat = `${hour}h ago`
        } else if (minute >= 1) {
            dateFormat = `${minute}m ago`
        } else {
            dateFormat = `${second}s ago`
        }
    }
    return dateFormat
}