import Resizer from "react-image-file-resizer";

const resizeFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        Resizer.imageFileResizer(
            file,
            500,
            500,
            "WEBP",
            100,
            0,
            (uri) => {
                if (typeof uri === "string") {
                    resolve(uri);
                } else {
                    reject("The uri is not a string.");
                }
            },
            "base64"
        );
    });
};

export const resizedImgToBlob = async (f: File) => {
    const resizedImg = await resizeFile(f);
    const byteCharacters = atob(resizedImg.split(",")[1]);
    const byteNumbers = Array.from(byteCharacters, (char) =>
        char.charCodeAt(0)
    );
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "image/jpeg" });
    const file = new File([blob], "image.jpg", {
        type: "image/jpeg",
        lastModified: new Date().getTime(),
    });

    return file;
};
