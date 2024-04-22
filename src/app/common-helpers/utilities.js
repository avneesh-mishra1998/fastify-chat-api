var random = require('random-name');

const GenerateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000);
}
const SanitizeMobileNumber = (mobileNumber) => {
    return mobileNumber.replace(/[^\d\+]/g, '');
}
const GenerateUsername = (full_name=random()) => {
    let [first, last] = full_name.split(' ');
    return first + Math.floor(100000 + Math.random() * 900000);
}

module.exports = {
    GenerateOTP,
    SanitizeMobileNumber,
    GenerateUsername,
}