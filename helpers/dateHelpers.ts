export const formatAmPm = (date: Date): string => {
    let hours: number = date.getHours();
    let minutes: number | string = date.getMinutes();
    const ampm: string = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return hours + ':' + minutes + ' ' + ampm;
};