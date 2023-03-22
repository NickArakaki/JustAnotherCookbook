const months = ["January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December"
               ]

export const formatDateMonthDateYear = (date) => {
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}
