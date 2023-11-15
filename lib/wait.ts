export const wait = async (msec: number) =>
    new Promise((resolve, _) => {
        setTimeout(resolve, msec);
    });
