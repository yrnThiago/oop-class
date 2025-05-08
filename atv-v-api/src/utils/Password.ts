import generator from "generate-password";

const generatePass = () => {
    return generator.generate({
        length: 15,
        numbers: true,
        symbols: true,
        uppercase: true,
    });
};

export const passwordUtils = {
    generatePass
};